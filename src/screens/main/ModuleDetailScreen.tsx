import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../types/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { ApiService } from '../../services/api';
import { SupabaseModule } from '../../types';
import { ProgressService } from '../../services/progress';
import { useAuth } from '../../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';

type ModuleDetailRouteProp = RouteProp<MainStackParamList, 'ModuleDetail'>;
type ModuleDetailNavigationProp = StackNavigationProp<MainStackParamList, 'ModuleDetail'>;

export const ModuleDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ModuleDetailRouteProp>();
  const navigation = useNavigation<ModuleDetailNavigationProp>();
  const { user } = useAuth();
  const [module, setModule] = React.useState<SupabaseModule | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadModule();
  }, []);

  const loadModule = async () => {
    try {
      const { data } = await ApiService.get('modules', { id: route.params?.moduleId });
      if (data) {
        setModule(Array.isArray(data) ? data[0] : data);
      }
    } catch (error) {
      console.error('Load module error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    const moduleId = route.params?.moduleId;
    if (moduleId) {
      navigation.navigate('Quiz', { moduleId });
    } else {
      console.error('Module ID is undefined');
    }
  };

  const handleCompleteModule = async () => {
    if (!user) return;
    await ProgressService.markModuleComplete(user.id, route.params?.moduleId || '');
    navigation.goBack();
  };

  const handleStartSimulation = () => {
    if (module) {
      navigation.navigate('SimulationDetail', { 
        algorithmId: module.algorithmId || 'bubble',
        initialArray: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
      });
    } else {
      console.error('Module is undefined');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (!module) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Module not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{module.title}</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {module.description}
        </Text>
        
        <View style={styles.contentSection}>
          <Text style={[styles.contentText, { color: theme.colors.text }]}>
            {module.content}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {module?.hasSimulation && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleStartSimulation}
            >
              <Text style={styles.buttonText}>Mulai Simulasi</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.secondary }]}
            onPress={handleStartQuiz}
          >
            <Text style={styles.buttonText}>Mulai Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.success }]}
            onPress={handleCompleteModule}
          >
            <Text style={styles.buttonText}>Selesaikan Modul</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  contentSection: {
    marginVertical: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
