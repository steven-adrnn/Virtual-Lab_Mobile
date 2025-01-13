import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { BiometricService } from '../../services/biometric';
import { NotificationService } from '../../services/notification';
import { OfflineService } from '../../services/offline';
import { supabase } from '../../config/supabase';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, setThemeMode } = useTheme();
  const { user, logout } = useAuth(); // Updated to use logout
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    biometricEnabled: false,
    offlineMode: false,
    notificationEnabled: false,
    theme: 'system' as 'light' | 'dark' | 'system'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();

      if (profile?.settings) {
        setSettings(profile.settings);
      }
    } catch (error) {
      console.error('Load settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<typeof settings>) => {
    try {
      setLoading(true);
      if (!user) return;

      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('profiles')
        .update({ settings: updatedSettings })
        .eq('id', user.id);

      if (error) throw error;
      
      setSettings(updatedSettings);

      // Apply settings
      if ('theme' in newSettings) {
        setThemeMode(newSettings.theme!);
      }
      
      if ('biometricEnabled' in newSettings) {
        if (newSettings.biometricEnabled) {
          const isAvailable = await BiometricService.isBiometricAvailable();
          if (!isAvailable.available) {
            Alert.alert('Error', 'Biometrik tidak tersedia di perangkat ini');
            return;
          }
        } else {
          await BiometricService.clearBiometricCredentials();
        }
      }

      if ('notificationEnabled' in newSettings) {
        if (newSettings.notificationEnabled) {
          await NotificationService.requestPermission();
        } else {
          await NotificationService.cancelAllNotifications();
        }
      }

      if ('offlineMode' in newSettings) {
        if (newSettings.offlineMode) {
          await OfflineService.enableOfflineMode();
        } else {
          await OfflineService.disableOfflineMode();
        }
      }

    } catch (error) {
      console.error('Update settings error:', error);
      Alert.alert('Error', 'Gagal memperbarui pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar',
          style: 'destructive',
          onPress: logout // Updated to use logout
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Tampilan
        </Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            Mode Gelap
          </Text>
          <Switch
            value={isDark}
            onValueChange={() => updateSettings({ 
              theme: isDark ? 'light' : 'dark' 
            })}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Keamanan
        </Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            Login Biometrik
          </Text>
          <Switch
            value={settings.biometricEnabled}
            onValueChange={(value) => updateSettings({ biometricEnabled: value })}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Aplikasi
        </Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            Mode Offline
          </Text>
          <Switch
            value={settings.offlineMode}
            onValueChange={(value) => updateSettings({ offlineMode: value })}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            Notifikasi
          </Text>
          <Switch
            value={settings.notificationEnabled}
            onValueChange={(value) => updateSettings({ notificationEnabled: value })}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.colors.error }]}
        onPress={handleSignOut}
      >
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.signOutText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
