import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../types/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { AlgorithmVisualizer } from '../../components/algorithm/AlgorithmVisualizer';
import { bubbleSort, quickSort, mergeSort } from '../../services/algorithm';
import { SortingAlgorithm } from '../../types/algorithm';

type SimulationDetailRouteProp = RouteProp<MainStackParamList, 'SimulationDetail'>;

const algorithms: Record<string, SortingAlgorithm> = {
  bubble: bubbleSort,
  quick: quickSort,
  merge: mergeSort,
};

export const SimulationDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<SimulationDetailRouteProp>();
  const [completed, setCompleted] = useState(false);

  const algorithm = algorithms[route.params.algorithmId];
  const initialArray = route.params.initialArray || 
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);

  const handleComplete = () => {
    setCompleted(true);
  };

  if (!algorithm) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Algorithm not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {algorithm.name}
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {algorithm.description}
        </Text>

        <View style={styles.complexityInfo}>
          <Text style={[styles.complexityTitle, { color: theme.colors.text }]}>
            Time Complexity:
          </Text>
          <Text style={[styles.complexityText, { color: theme.colors.textSecondary }]}>
            Best: {algorithm.complexity.time.best}
          </Text>
          <Text style={[styles.complexityText, { color: theme.colors.textSecondary }]}>
            Average: {algorithm.complexity.time.average}
          </Text>
          <Text style={[styles.complexityText, { color: theme.colors.textSecondary }]}>
            Worst: {algorithm.complexity.time.worst}
          </Text>
        </View>

        <View style={styles.visualizerContainer}>
          <AlgorithmVisualizer
            algorithm={algorithm}
            initialArray={initialArray}
            onComplete={handleComplete}
          />
        </View>

        {completed && (
          <Text style={[styles.completedText, { color: theme.colors.success }]}>
            Simulasi selesai! 🎉
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    lineHeight: 24,
  },
  complexityInfo: {
    marginBottom: 20,
  },
  complexityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  complexityText: {
    fontSize: 14,
    marginBottom: 4,
  },
  visualizerContainer: {
    height: 400,
    marginVertical: 20,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
}); 