import { supabase } from '../config/supabase';
import { BiometricService } from './biometric';
import { BaseResponse, SupabaseProfile } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export const AuthService = {
  async login({ email, password }: LoginCredentials): Promise<BaseResponse<SupabaseProfile>> {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      return { data: profile, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error: error as Error };
    }
  },

  async register({ email, password, username }: RegisterCredentials): Promise<BaseResponse<SupabaseProfile>> {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const profile = {
        id: user?.id,
        username,
        email,
        created_at: new Date().toISOString(),
      };

      const { data, error: profileError } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();

      if (profileError) throw profileError;

      return { data, error: null };
    } catch (error) {
      console.error('Register error:', error);
      return { data: null, error: error as Error };
    }
  },

  async loginWithBiometric(): Promise<BaseResponse<SupabaseProfile>> {
    try {
      const credentials = await BiometricService.getBiometricCredentials();
      if (!credentials) {
        throw new Error('No biometric credentials found');
      }

      return this.login(credentials);
    } catch (error) {
      console.error('Biometric login error:', error);
      return { data: null, error: error as Error };
    }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },
};