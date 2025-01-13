import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../types/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { useQuiz } from '../../hooks/useQuiz';

type QuizRouteProp = RouteProp<MainStackParamList, 'Quiz'>;

export const QuizScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<QuizRouteProp>();
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    loading,
    error,
    isSubmitting,
    isLastQuestion,
    handleAnswer,
    goToNextQuestion,
  } = useQuiz(route.params?.moduleId || '');

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error.message}
        </Text>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Tidak ada pertanyaan tersedia
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <Text style={[styles.progress, { color: theme.colors.textSecondary }]}>
          Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
        </Text>

        <Text style={[styles.question, { color: theme.colors.text }]}>
          {currentQuestion.question}
        </Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: answers[currentQuestion.id] === index ? 
                    theme.colors.primary : theme.colors.surface 
                }
              ]}
              onPress={() => handleAnswer(currentQuestion.id, index)}
              disabled={isSubmitting}
            >
              <Text style={[
                styles.optionText, 
                { 
                  color: answers[currentQuestion.id] === index ? 
                    theme.colors.white : theme.colors.text 
                }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {answers[currentQuestion.id] !== undefined && (
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={goToNextQuestion}
            disabled={isSubmitting}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Selesai' : 'Selanjutnya'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
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
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
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
  progress: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nextButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
