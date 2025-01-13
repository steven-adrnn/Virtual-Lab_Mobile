import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QuizService } from '../services/quiz';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseQuiz, QuizQuestion } from '../types';

export const useQuiz = (moduleId: string) => {
  const [quiz, setQuiz] = useState<SupabaseQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    loadQuiz();
  }, [moduleId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const { data, error } = await QuizService.getQuizByModuleId(moduleId);
      
      if (error) throw error;
      if (!data) throw new Error('Quiz tidak ditemukan');
      
      setQuiz(data);
      setAnswers({});
      setScore(0);
      setCurrentQuestionIndex(0);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, selectedAnswer: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  const submitQuiz = async () => {
    if (!quiz || !user) return;

    try {
      setIsSubmitting(true);
      const { data, error } = await QuizService.submitQuizAnswer(
        quiz.id,
        user.id,
        answers
      );

      if (error) throw error;
      if (!data) throw new Error('Gagal menyimpan hasil quiz');

      setScore(data.score);
      
      Alert.alert(
        'Quiz Selesai!',
        `Skor Anda: ${data.score}%\nJawaban benar: ${data.correct_answers} dari ${data.total_questions}`,
        [
          {
            text: 'Ulangi Quiz',
            onPress: loadQuiz,
          },
          {
            text: 'Kembali',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentQuestion = (): QuizQuestion | null => {
    if (!quiz?.questions || quiz.questions.length === 0) return null;
    return quiz.questions[currentQuestionIndex];
  };

  const goToNextQuestion = () => {
    if (!quiz?.questions) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  return {
    quiz,
    currentQuestion: getCurrentQuestion(),
    currentQuestionIndex,
    totalQuestions: quiz?.questions?.length || 0,
    answers,
    score,
    loading,
    error,
    isSubmitting,
    isLastQuestion: quiz?.questions ? 
      currentQuestionIndex === quiz.questions.length - 1 : false,
    handleAnswer,
    goToNextQuestion,
    submitQuiz,
    resetQuiz: loadQuiz,
  };
};
