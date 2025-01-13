export interface SupabaseProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: 'student' | 'teacher';
  settings: {
    biometric_enabled: boolean;
    offline_mode: boolean;
    notification_enabled: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  progress: {
    completedModules: string[];
    quizScores: Record<string, number>;
    lastActivity: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface SupabaseModule {
  id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  hasSimulation: boolean;
  algorithmId?: string;
  prerequisites?: string[];
  created_at: string;
  updated_at?: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  answers: Record<string, number>;
  completed_at: string;
  total_questions: number;
  correct_answers: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface SupabaseQuiz {
  id: string;
  module_id: string;
  title: string;
  description: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
  }>;
  time_limit?: number;
  passing_score: number;
  created_at: string;
  updated_at?: string;
}

export interface BaseResponse<T> {
  data: T | null;
  error: Error | null;
} 