import { supabase } from '../config/supabase';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseResponse, SupabaseModule, SupabaseQuiz, SupabaseProfile } from '../types/supabase';

type Endpoint = 'modules' | 'quizzes' | 'profiles';

interface EndpointTypes {
  modules: SupabaseModule;
  quizzes: SupabaseQuiz;
  profiles: SupabaseProfile;
}

interface CacheConfig {
  key: string;
  expiry?: number; // in minutes
}

export const ApiService = {
  async get<T extends Endpoint>(
    endpoint: T,
    params?: Record<string, any>,
    cache?: CacheConfig
  ): Promise<BaseResponse<EndpointTypes[T]>> {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        if (cache) {
          const cachedData = await ApiCache.get<EndpointTypes[T]>(cache.key);
          if (cachedData) {
            return { data: cachedData, error: null };
          }
        }
        throw new Error('No internet connection');
      }

      const { data, error } = await supabase
        .from(endpoint)
        .select('*')
        .match(params || {});

      if (error) throw error;

      if (cache && data) {
        await ApiCache.set(cache.key, data[0], cache.expiry);
      }

      return { data: data[0] as EndpointTypes[T], error: null };
    } catch (error) {
      console.error(`API GET error (${endpoint}):`, error);
      return { data: null, error: error as Error };
    }
  },

  async post<T extends Endpoint>(
    endpoint: T,
    body: Partial<EndpointTypes[T]>
  ): Promise<BaseResponse<EndpointTypes[T]>> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .insert([body])
        .select()
        .single();

      if (error) throw error;

      return { data: data as EndpointTypes[T], error: null };
    } catch (error) {
      console.error(`API POST error (${endpoint}):`, error);
      return { data: null, error: error as Error };
    }
  },

  async update<T extends Endpoint>(
    endpoint: T,
    id: string,
    updates: Partial<EndpointTypes[T]>
  ): Promise<BaseResponse<EndpointTypes[T]>> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data: data as EndpointTypes[T], error: null };
    } catch (error) {
      console.error(`API UPDATE error (${endpoint}):`, error);
      return { data: null, error: error as Error };
    }
  }
};

// Cache helper
const ApiCache = {
  async set<T>(key: string, data: T, expiry: number = 60): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
        expiry: expiry * 60 * 1000,
      }));
    } catch (error) {
      console.error('Cache save error:', error);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp, expiry } = JSON.parse(cached);
      if (Date.now() - timestamp > expiry) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }
};