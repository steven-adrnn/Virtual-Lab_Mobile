import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { SortingAlgorithm } from '../../types/algorithm';

interface AlgorithmSelectorProps {
  algorithms: SortingAlgorithm[];
  selectedAlgorithm: SortingAlgorithm;
  onSelect: (algorithm: SortingAlgorithm) => void;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithms,
  selectedAlgorithm,
  onSelect,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {algorithms.map((algorithm) => (
        <TouchableOpacity
          key={algorithm.name}
          style={[
            styles.algorithmButton,
            {
              backgroundColor:
                algorithm.name === selectedAlgorithm.name
                  ? theme.colors.primary
                  : theme.colors.surface,
            },
          ]}
          onPress={() => onSelect(algorithm)}
        >
          <Text
            style={[
              styles.algorithmText,
              {
                color:
                  algorithm.name === selectedAlgorithm.name
                    ? '#fff'
                    : theme.colors.text,
              },
            ]}
          >
            {algorithm.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  algorithmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
  },
  algorithmText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 