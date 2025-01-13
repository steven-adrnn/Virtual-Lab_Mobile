import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface OfflineContextType {
  isOffline: boolean;
  lastSyncTime: Date | null;
  syncData: () => Promise<void>;
  pendingChanges: number;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    checkConnectivity();
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    loadLastSyncTime();

    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnectivity = async () => {
    const state = await NetInfo.fetch();
    setIsOffline(!state.isConnected);
  };

  const handleConnectivityChange = (state: NetInfoState) => {
    setIsOffline(!state.isConnected);
    if (state.isConnected) {
      syncData();
    }
  };

  const loadLastSyncTime = async () => {
    try {
      const time = await AsyncStorage.getItem('lastSyncTime');
      if (time) {
        setLastSyncTime(new Date(time));
      }
    } catch (error) {
      console.error('Error loading last sync time:', error);
    }
  };

  const syncData = async () => {
    if (isOffline) {
      Alert.alert('Error', 'Tidak dapat sinkronisasi dalam mode offline');
      return;
    }

    try {
      // Implementasi sinkronisasi data
      const now = new Date();
      await AsyncStorage.setItem('lastSyncTime', now.toISOString());
      setLastSyncTime(now);
      setPendingChanges(0);
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Gagal melakukan sinkronisasi');
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        lastSyncTime,
        syncData,
        pendingChanges,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};