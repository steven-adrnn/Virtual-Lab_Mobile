import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseService } from '../services/supabase';
import { BiometricService } from '../services/biometric';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mapping function to convert Supabase User to custom User type
const mapSupabaseUserToUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    username: supabaseUser.email?.split('@')[0] || 'user',
    email: supabaseUser.email || '',
    avatar_url: supabaseUser.user_metadata?.avatar_url || undefined,
    role: 'student',
    settings: {
      biometric_enabled: false,
      offline_mode: false,
      notification_enabled: false,
      theme: 'system',
    },
    progress: {
      completedModules: [],
      quizScores: {},
      lastActivity: new Date().toISOString(),
    },
    created_at: supabaseUser.created_at || new Date().toISOString(),
    updated_at: supabaseUser.updated_at || undefined,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializeAuth = async () => {
    try {
      const { data: { user } } = await SupabaseService.auth.getUser();
      if (user) {
        setUser(mapSupabaseUserToUser(user));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await SupabaseService.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(mapSupabaseUserToUser(data.user));
        setIsAuthenticated(true);
        await BiometricService.saveBiometricCredentials({ email, password });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      const { data, error } = await SupabaseService.auth.signInWithPassword(credentials);
      if (error) throw error;
      if (data.user) {
        setUser(mapSupabaseUserToUser(data.user));
        setIsAuthenticated(true);
        await BiometricService.saveBiometricCredentials(credentials);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const loginWithBiometric = async () => {
    try {
      const credentials = await BiometricService.getBiometricCredentials();
      if (credentials) {
        await signIn(credentials);
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SupabaseService.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      await BiometricService.clearBiometricCredentials();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await SupabaseService.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(mapSupabaseUserToUser(data.user));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register, initializeAuth, signIn, loginWithBiometric }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
