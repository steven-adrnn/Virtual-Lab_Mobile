import { supabase } from '../config/supabase';
import { OfflineService } from './offline';
import { BaseResponse, SupabaseQuiz, QuizResult, QuizQuestion } from '../types';
import { ProgressService } from './progress';
import { NotificationService } from './notification';

export const QuizService = {
  async getQuizByModuleId(moduleId: string): Promise<BaseResponse<SupabaseQuiz>> {
    if (!moduleId) {
      return { data: null, error: new Error('Module ID is required') };
    }

    try {
      // Cek koneksi terlebih dahulu
      const isOnline = await OfflineService.isOnline();
      
      if (isOnline) {
        const { data, error } = await supabase
          .from('quizzes')
          .select(`
            *,
            questions:quiz_questions(*)
          `)
          .eq('module_id', moduleId)
          .single();

        if (error) throw error;

        if (data) {
          // Cache quiz data untuk offline mode
          await OfflineService.cacheData(`quiz_${moduleId}`, data, 24);
          return { data, error: null };
        }
      }

      // Coba ambil dari cache jika offline atau fetch gagal
      const cachedData = await OfflineService.getCachedData<SupabaseQuiz>(`quiz_${moduleId}`);
      if (cachedData) {
        return { data: cachedData, error: null };
      }

      return { 
        data: null, 
        error: new Error('Quiz tidak ditemukan dan tidak tersedia dalam cache') 
      };
    } catch (error) {
      console.error('Get quiz error:', error);
      return { data: null, error: error as Error };
    }
  },

  async submitQuizAnswer(
    quizId: string,
    userId: string,
    answers: Record<string, number>
  ): Promise<BaseResponse<QuizResult>> {
    if (!quizId || !userId || !answers) {
      return { 
        data: null, 
        error: new Error('Quiz ID, User ID, dan jawaban diperlukan') 
      };
    }

    try {
      // Ambil data quiz
      const { data: quiz, error: quizError } = await this.getQuizByModuleId(quizId);
      if (quizError) throw quizError;
      if (!quiz) throw new Error('Quiz tidak ditemukan');

      // Validasi jawaban
      const questions = quiz.questions as QuizQuestion[];
      if (!questions || questions.length === 0) {
        throw new Error('Pertanyaan quiz tidak valid');
      }

      // Hitung skor
      let correctAnswers = 0;
      let totalQuestions = questions.length;

      questions.forEach((q) => {
        if (answers[q.id] === q.correct_answer) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      const submission: QuizResult = {
        id: `${userId}_${quizId}_${Date.now()}`,
        user_id: userId,
        quiz_id: quizId,
        score,
        answers,
        completed_at: new Date().toISOString(),
        total_questions: totalQuestions,
        correct_answers: correctAnswers
      };

      // Cek koneksi
      const isOnline = await OfflineService.isOnline();
      if (!isOnline) {
        // Simpan ke antrian offline
        await OfflineService.queueAction({
          type: 'SUBMIT_QUIZ',
          data: submission,
          timestamp: Date.now()
        });
        
        // Update progress lokal
        await ProgressService.updateProgress(userId, {
          quizScores: { [quizId]: score },
          lastActivity: 'quiz_completion'
        });

        // Kirim notifikasi lokal
        if (score >= 80) {
          await NotificationService.notifyAchievement(
            `nilai Quiz ${score}% pada modul ${quiz.title}`
          );
        }

        return { data: submission, error: null };
      }

      // Submit ke server jika online
      const { data, error } = await supabase
        .from('quiz_submissions')
        .insert(submission)
        .select()
        .single();

      if (error) throw error;

      // Update progress user
      await ProgressService.updateProgress(userId, {
        quizScores: { [quizId]: score },
        lastActivity: 'quiz_completion'
      });

      // Kirim notifikasi jika score bagus
      if (score >= 80) {
        await NotificationService.notifyAchievement(
          `nilai Quiz ${score}% pada modul ${quiz.title}`
        );
      }

      return { data, error: null };
    } catch (error) {
      console.error('Submit quiz error:', error);
      return { data: null, error: error as Error };
    }
  },

  async getQuizHistory(userId: string): Promise<BaseResponse<QuizResult[]>> {
    if (!userId) {
      return { data: null, error: new Error('User ID is required') };
    }

    try {
      const isOnline = await OfflineService.isOnline();
      
      if (isOnline) {
        const { data, error } = await supabase
          .from('quiz_submissions')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });

        if (error) throw error;

        if (data) {
          await OfflineService.cacheData(`quiz_history_${userId}`, data, 12);
          return { data, error: null };
        }
      }

      // Coba ambil dari cache
      const cachedData = await OfflineService.getCachedData<QuizResult[]>(
        `quiz_history_${userId}`
      );
      if (cachedData) {
        return { data: cachedData, error: null };
      }

      return { 
        data: [], 
        error: new Error('Riwayat quiz tidak tersedia dalam mode offline') 
      };
    } catch (error) {
      console.error('Get quiz history error:', error);
      return { data: null, error: error as Error };
    }
  },

  async getQuizStatistics(userId: string): Promise<BaseResponse<{
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    completedModules: string[];
  }>> {
    try {
      const { data: submissions } = await this.getQuizHistory(userId);
      if (!submissions) {
        return {
          data: {
            totalQuizzes: 0,
            averageScore: 0,
            bestScore: 0,
            completedModules: [],
          },
          error: null,
        };
      }

      const scores = submissions.map(s => s.score);
      const stats = {
        totalQuizzes: submissions.length,
        averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        bestScore: Math.max(...scores),
        completedModules: [...new Set(submissions.map(s => s.quiz_id))],
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Get quiz statistics error:', error);
      return { data: null, error: error as Error };
    }
  },
}; 