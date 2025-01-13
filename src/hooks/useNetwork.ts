import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { OfflineService } from '../services/offline';

export const useNetwork = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const { user } = useAuth();

  const handleConnectivityChange = useCallback(async (state: NetInfoState) => {
    setIsConnected(!!state.isConnected);
    setIsInternetReachable(!!state.isInternetReachable);
    setConnectionType(state.type);

    // Sinkronisasi saat kembali online
    if (state.isConnected && state.isInternetReachable && user?.id) {
      const isOfflineMode = await OfflineService.isOfflineModeEnabled();
      if (!isOfflineMode) {
        try {
          const syncResult = await OfflineService.syncOfflineData(user.id);
          if (syncResult.syncedItems > 0) {
            Alert.alert(
              'Sinkronisasi Berhasil',
              `${syncResult.syncedItems} data telah disinkronkan ke server`
            );
          }
        } catch (error) {
          console.error('Network sync error:', error);
        }
      }
    }
  }, [user?.id]);

  useEffect(() => {
    // Cek koneksi saat komponen dimount
    NetInfo.fetch().then(handleConnectivityChange);

    // Subscribe ke perubahan koneksi
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, [handleConnectivityChange]);

  const checkConnectivity = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      return {
        isConnected: !!state.isConnected,
        isInternetReachable: !!state.isInternetReachable,
        connectionType: state.type
      };
    } catch (error) {
      console.error('Check connectivity error:', error);
      return {
        isConnected: false,
        isInternetReachable: false,
        connectionType: null
      };
    }
  }, []);

  return {
    isConnected,
    isInternetReachable,
    connectionType,
    checkConnectivity
  };
};