import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../config/supabase';

// Definisi tipe yang lebih spesifik
interface OfflineData<T> {
  timestamp: number;
  data: T;
  expirationHours: number;
}

interface QueuedAction {
  id: string;
  type: 'SUBMIT_QUIZ' | 'UPDATE_PROGRESS' | 'SAVE_SIMULATION';
  data: any;
  timestamp: number;
  retryCount: number;
}

interface QuizData {
  quizId: string;
  answers: Record<string, number>;
  score: number;
  completedAt: string;
}

interface ProgressData {
  moduleId: string;
  progress: number;
  lastActivity: string;
}

interface SimulationData {
  algorithmType: string;
  steps: any[];
  result: any;
}

// Tipe untuk hasil sinkronisasi
interface SyncResult {
  success: boolean;
  syncedItems: number;
  error?: Error;
}

export const OfflineService = {
  // Menyimpan data untuk offline mode
  async cacheData<T>(key: string, data: T, expirationHours: number = 24) {
    try {
      const offlineData: OfflineData<T> = {
        timestamp: Date.now(),
        data,
        expirationHours
      };
      await AsyncStorage.setItem(key, JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error caching data:', error);
      throw error;
    }
  },

  // Mengambil data cached
  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const offlineData: OfflineData<T> = JSON.parse(cached);
      
      // Cek expired
      const now = Date.now();
      const expirationTime = offlineData.timestamp + (offlineData.expirationHours * 60 * 60 * 1000);
      
      if (now > expirationTime) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return offlineData.data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  },

  // Menyimpan aksi untuk dieksekusi saat online
  async queueAction(action: Omit<QueuedAction, 'id' | 'retryCount'>) {
    try {
      const queue = await this.getActionQueue();
      const newAction: QueuedAction = {
        ...action,
        id: Date.now().toString(),
        retryCount: 0
      };
      queue.push(newAction);
      await AsyncStorage.setItem('actionQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Error queuing action:', error);
      throw error;
    }
  },

  // Mengambil antrian aksi
  async getActionQueue(): Promise<QueuedAction[]> {
    try {
      const queue = await AsyncStorage.getItem('actionQueue');
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error getting action queue:', error);
      return [];
    }
  },

  // Mengeksekusi antrian aksi saat online
  async processActionQueue() {
    const queue = await this.getActionQueue();
    if (queue.length === 0) return;

    const isConnected = (await NetInfo.fetch()).isConnected;
    if (!isConnected) return;

    const failedActions: QueuedAction[] = [];

    for (const action of queue) {
      try {
        switch (action.type) {
          case 'SUBMIT_QUIZ':
            await this.syncQuizData(action.data as QuizData);
            break;
          case 'UPDATE_PROGRESS':
            await this.syncProgressData(action.data as ProgressData);
            break;
          case 'SAVE_SIMULATION':
            await this.syncSimulationData(action.data as SimulationData);
            break;
        }
      } catch (error) {
        console.error(`Failed to process action ${action.id}:`, error);
        if (action.retryCount < 3) {
          failedActions.push({
            ...action,
            retryCount: action.retryCount + 1
          });
        }
      }
    }

    // Update queue dengan aksi yang gagal
    if (failedActions.length > 0) {
      await AsyncStorage.setItem('actionQueue', JSON.stringify(failedActions));
    } else {
      await AsyncStorage.removeItem('actionQueue');
    }
  },

  // Sync methods
  async syncQuizData(data: QuizData) {
    const { data: result, error } = await supabase
      .from('quiz_results')
      .insert(data);
      
    if (error) throw error;
    return result;
  },

  async syncProgressData(data: ProgressData) {
    const { data: result, error } = await supabase
      .from('user_progress')
      .upsert(data);
      
    if (error) throw error;
    return result;
  },

  async syncSimulationData(data: SimulationData) {
    const { data: result, error } = await supabase
      .from('simulation_history')
      .insert(data);
      
    if (error) throw error;
    return result;
  },

  async syncOfflineData(userId?: string): Promise<SyncResult> {
    if (!userId) {
      return { success: false, syncedItems: 0, error: new Error('User ID required') };
    }

    try {
      // Ambil antrian aksi offline
      const queueStr = await AsyncStorage.getItem('actionQueue');
      const queue: QueuedAction[] = queueStr ? JSON.parse(queueStr) : [];

      if (queue.length === 0) {
        return { success: true, syncedItems: 0 };
      }

      let syncedCount = 0;
      const failedActions: QueuedAction[] = [];

      // Proses setiap aksi dalam antrian
      for (const action of queue) {
        try {
          switch (action.type) {
            case 'SUBMIT_QUIZ':
              await this.syncQuizData(action.data);
              syncedCount++;
              break;
            case 'UPDATE_PROGRESS':
              await this.syncProgressData(action.data);
              syncedCount++;
              break;
            case 'SAVE_SIMULATION':
              await this.syncSimulationData(action.data);
              syncedCount++;
              break;
          }
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          if (action.retryCount < 3) {
            failedActions.push({
              ...action,
              retryCount: (action.retryCount || 0) + 1
            });
          }
        }
      }

      // Update antrian dengan aksi yang gagal
      if (failedActions.length > 0) {
        await AsyncStorage.setItem('actionQueue', JSON.stringify(failedActions));
      } else {
        await AsyncStorage.removeItem('actionQueue');
      }

      return {
        success: true,
        syncedItems: syncedCount,
        error: failedActions.length > 0 ? new Error(`${failedActions.length} actions failed`) : undefined
      };
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        syncedItems: 0,
        error: error as Error
      };
    }
  },

  async enableOfflineMode() {
    await AsyncStorage.setItem('offlineMode', 'true');
  },

  async disableOfflineMode() {
    await AsyncStorage.setItem('offlineMode', 'false');
    // Sinkronkan data saat mode offline dimatikan
    await this.syncOfflineData();
  },

  async isOfflineModeEnabled(): Promise<boolean> {
    const mode = await AsyncStorage.getItem('offlineMode');
    return mode === 'true';
  },

  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return !!state.isConnected && !!state.isInternetReachable;
  }
};