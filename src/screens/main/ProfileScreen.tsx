import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';

export const ProfileScreen = ({ 
  navigation 
}: { 
  navigation: NativeStackNavigationProp<MainStackParamList> 
}) => {
  const { user, logout } = useAuth(); // Removed updateProfile
  const { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      Alert.alert('Error', 'Logout gagal. Silakan coba lagi.');
    }
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const handleEditProfile = () => {
    // Implementasi edit profile
    Alert.alert('Info', 'Fitur edit profile akan segera hadir');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              user?.avatar_url
                ? { uri: user.avatar_url }
                : require('../../assets/images/default-avatar.png')
            }
            style={styles.avatar}
          />
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={handleEditProfile}
          >
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.username, { color: theme.colors.text }]}>
          {user?.username}
        </Text>
        <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
          {user?.email}
        </Text>
        <Text style={[styles.role, { color: theme.colors.primary }]}>
          {user?.role === 'student' ? 'Pelajar' : 'Pengajar'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {user?.progress?.completed_courses?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Materi Selesai
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {Object.keys(user?.progress?.quiz_scores || {}).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Quiz Selesai
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {calculateAverageScore(user?.progress?.quiz_scores)}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Rata-rata Skor
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Progress')}
        >
          <Icon name="trending-up" size={24} color={theme.colors.primary} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            Progress Pembelajaran
          </Text>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={navigateToSettings}
        >
          <Icon name="settings" size={24} color={theme.colors.primary} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            Pengaturan
          </Text>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Help')}
        >
          <Icon name="help" size={24} color={theme.colors.primary} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            Bantuan
          </Text>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Button 
        title="Logout"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
        icon={<Icon name="logout" size={24} color="#fff" />}
      />
    </ScrollView>
  );
};

const calculateAverageScore = (scores: Record<string, number> = {}) => {
  const scoreValues = Object.values(scores);
  if (scoreValues.length === 0) return 0;
  return Math.round(
    scoreValues.reduce((acc, curr) => acc + curr, 0) / scoreValues.length
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#02a9f7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  role: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    margin: 20,
  },
});
