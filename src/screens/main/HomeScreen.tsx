import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ModuleList } from '../../components/module/ModuleList';
import { ProgressSummary } from '../../components/progress/ProgressSummary';
import { WelcomeHeader } from '../../components/common/WelcomeHeader';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WelcomeHeader username={user?.username || 'Pengguna'} />
      <View style={styles.content}>
        <ProgressSummary />
        <ModuleList />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});