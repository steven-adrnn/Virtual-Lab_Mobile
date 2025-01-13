import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface QuizProgressProps {
  current: number;
  total: number;
  score: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  current,
  total,
  score,
}) => {
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={styles.questionCount}>
          Pertanyaan {current} dari {total}
        </Text>
        <Text style={styles.score}>Skor: {score}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  questionCount: {
    fontSize: 14,
    color: '#666',
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#02a9f7',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#02a9f7',
  },
});