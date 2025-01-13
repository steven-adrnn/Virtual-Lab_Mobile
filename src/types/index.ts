export * from './supabase';
export * from './algorithm';
export * from './navigation';

export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    white: string;
    // Warna untuk algoritma
    comparing: string;
    swapping: string;
    sorted: string;
  };
}

export interface UserProgress {
  completedModules: string[];
  quizScores: Record<string, number>;
  lastActivity: string;
}

export interface User {
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
  progress: UserProgress;
  created_at: string;
  updated_at?: string;
}
