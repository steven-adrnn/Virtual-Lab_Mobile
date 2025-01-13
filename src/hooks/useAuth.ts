import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { BiometricService } from '../services/biometric';

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
  role: 'student' | 'teacher' | 'admin';
  progress?: {
    completed_courses: string[];
    quiz_scores: Record<string, number>;
    simulation_progress: Record<string, any>;
  };
}

interface AuthError {
  message: string;
  code?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  username: string;
  role?: 'student' | 'teacher';
}

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: AuthError | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // Inisialisasi auth state
  useEffect(() => {
    checkUser();
    
    // Subscribe ke perubahan auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        await handleAuthChange(session);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Cek user saat ini
  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session) {
        const { user } = session;
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setState({
          user: {
            id: user.id,
            email: user.email!,
            username: profile.username,
            avatar_url: profile.avatar_url,
            created_at: profile.created_at,
            last_login: profile.last_login,
            role: profile.role,
            progress: profile.progress,
          },
          session,
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          session: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Error checking authentication status',
          code: 'AUTH_CHECK_ERROR',
        },
      }));
    }
  };

  // Handle perubahan auth state
  const handleAuthChange = async (session: any) => {
    await AsyncStorage.setItem('session', JSON.stringify(session));
    setState(prev => ({
      ...prev,
      session,
      user: session?.user ?? null,
    }));
  };

  // Login
  const login = async ({ email, password }: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user!.id);

      // Save credentials for biometric login if enabled
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      if (biometricEnabled === 'true') {
        await AsyncStorage.setItem(
          'biometric_credentials',
          JSON.stringify({ email, password })
        );
      }

      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      setState(prev => ({
        ...prev,
        error: {
          message: 'Invalid login credentials',
          code: 'AUTH_LOGIN_ERROR',
        },
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Register
  const register = async ({ email, password, username, role = 'student' }: RegisterData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
          },
        },
      });

      if (error) throw error;

      // Create profile
      await supabase.from('profiles').insert([
        {
          id: data.user!.id,
          username,
          email,
          role,
          created_at: new Date().toISOString(),
          progress: {
            completed_courses: [],
            quiz_scores: {},
            simulation_progress: {},
          },
        },
      ]);

      return data;
    } catch (error) {
      console.error('Error registering:', error);
      setState(prev => ({
        ...prev,
        error: {
          message: 'Error creating account',
          code: 'AUTH_REGISTER_ERROR',
        },
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Logout
  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear stored credentials and session
      await AsyncStorage.multiRemove([
        'session',
        'biometric_credentials',
        'biometric_enabled',
      ]);

      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error logging out:', error);
      setState(prev => ({
        ...prev,
        error: {
          message: 'Error logging out',
          code: 'AUTH_LOGOUT_ERROR',
        },
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      setState(prev => ({
        ...prev,
        error: {
          message: 'Error resetting password',
          code: 'AUTH_RESET_ERROR',
        },
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user?.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setState(prev => ({
        ...prev,
        error: {
          message: 'Error updating profile',
          code: 'AUTH_UPDATE_ERROR',
        },
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Login dengan biometric
  const loginWithBiometric = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const isAuthenticated = await BiometricService.authenticate(
        'Login ke Virtual Lab'
      );

      if (!isAuthenticated) {
        throw new Error('Biometric authentication failed');
      }

      const credentials = await AsyncStorage.getItem('biometric_credentials');
      if (!credentials) {
        throw new Error('No stored credentials found');
      }

      const { email, password } = JSON.parse(credentials);
      return await login({ email, password });
    } catch (error) {
      console.error('Error with biometric login:', error);
      setState(prev => ({
        ...prev,
        error: {
          message: 'Biometric authentication failed',
          code: 'AUTH_BIOMETRIC_ERROR',
        },
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    loginWithBiometric,
  };
};