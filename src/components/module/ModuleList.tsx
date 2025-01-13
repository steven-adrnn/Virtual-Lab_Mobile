import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SupabaseModule } from '../../types';
import { MainStackParamList } from '../../types/navigation';
import { ApiService } from '../../services/api'; // Added import for ApiService

type ModuleNavigationProp = StackNavigationProp<MainStackParamList, 'ModuleDetail'>;

export const ModuleList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ModuleNavigationProp>();
  const [modules, setModules] = React.useState<SupabaseModule[]>([]);

  React.useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const { data } = await ApiService.get('modules', {}, {
      key: 'modules_list',
      expiry: 60 // Cache for 1 hour
    });
    if (data) {
      setModules(Array.isArray(data) ? data : [data]);
    }
  };

  const renderItem = ({ item }: { item: SupabaseModule }) => (
    <TouchableOpacity
      style={[styles.moduleCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('ModuleDetail', { moduleId: item.id })}
    >
      <Text style={[styles.moduleTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.moduleDescription, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Modul Pembelajaran
      </Text>
      <FlatList
        data={modules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  moduleCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
