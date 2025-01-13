import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { SortingAlgorithm } from '../../types/algorithm';

interface ComplexityInfoProps {
  algorithm: SortingAlgorithm;
}

export const ComplexityInfo: React.FC<ComplexityInfoProps> = ({ algorithm }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Kompleksitas Waktu
      </Text>
      <View style={styles.complexityRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Best Case:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {algorithm.complexity.time.best}
        </Text>
      </View>
      <View style={styles.complexityRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Average Case:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {algorithm.complexity.time.average}
        </Text>
      </View>
      <View style={styles.complexityRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Worst Case:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {algorithm.complexity.time.worst}
        </Text>
      </View>
      <View style={styles.complexityRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Space Complexity:
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {algorithm.complexity.space}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  complexityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 