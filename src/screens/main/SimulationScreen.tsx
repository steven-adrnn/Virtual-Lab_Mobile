import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { AlgorithmVisualizer } from '../../components/algorithm/AlgorithmVisualizer';
import { AlgorithmSelector } from '../../components/sorting/AlgorithmSelector';
import { ComplexityInfo } from '../../components/sorting/ComplexityInfo';
import { bubbleSort, quickSort, mergeSort } from '../../services/algorithm';
import { SortingAlgorithm } from '../../types/algorithm';

const algorithms = [bubbleSort, quickSort, mergeSort];

export const SimulationScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>(algorithms[0]);
  const [initialArray, setInitialArray] = useState<number[]>([]);

  useEffect(() => {
    generateNewArray();
  }, []);

  const generateNewArray = () => {
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1);
    setInitialArray(newArray);
  };

  const handleAlgorithmComplete = () => {
    // Handle completion - maybe show a success message or enable controls
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AlgorithmSelector
        algorithms={algorithms}
        selectedAlgorithm={selectedAlgorithm}
        onSelect={setSelectedAlgorithm}
      />
      
      <ComplexityInfo algorithm={selectedAlgorithm} />
      
      <AlgorithmVisualizer
        algorithm={selectedAlgorithm}
        initialArray={initialArray}
        speed={1000}
        onComplete={handleAlgorithmComplete}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});