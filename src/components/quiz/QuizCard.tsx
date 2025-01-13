import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface QuizCardProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  isCorrect?: boolean | null;
  showResult: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  isCorrect,
  showResult,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedAnswer === index && styles.selectedOption,
              showResult && selectedAnswer === index && isCorrect && styles.correctOption,
              showResult && selectedAnswer === index && !isCorrect && styles.wrongOption,
            ]}
            onPress={() => onSelectAnswer(index)}
            disabled={showResult}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === index && styles.selectedOptionText,
              showResult && selectedAnswer === index && styles.resultOptionText,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {showResult && (
        <Text style={[
          styles.resultText,
          isCorrect ? styles.correctText : styles.wrongText
        ]}>
          {isCorrect ? 'Benar!' : 'Salah!'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#02a9f7',
  },
  correctOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  wrongOption: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
  selectedOptionText: {
    color: '#02a9f7',
    fontWeight: 'bold',
  },
  resultOptionText: {
    fontWeight: 'bold',
  },
  resultText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  correctText: {
    color: '#4caf50',
  },
  wrongText: {
    color: '#f44336',
  },
});