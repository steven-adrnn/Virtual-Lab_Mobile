import { supabase } from '../config/supabase';
import { BaseResponse, UserProgress } from '../types';

export const ProgressService = {
  async getUserProgress(userId: string): Promise<BaseResponse<UserProgress>> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('progress')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (!profile?.progress) {
        const defaultProgress: UserProgress = {
          completedModules: [],
          quizScores: {},
          lastActivity: new Date().toISOString()
        };

        await this.updateProgress(userId, defaultProgress);
        return { data: defaultProgress, error: null };
      }

      return { data: profile.progress as UserProgress, error: null };
    } catch (error) {
      console.error('Get progress error:', error);
      return { data: null, error: error as Error };
    }
  },

  async updateProgress(
    userId: string,
    updates: Partial<UserProgress>
  ): Promise<BaseResponse<UserProgress>> {
    try {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('progress')
        .eq('id', userId)
        .single();

      const updatedProgress: UserProgress = {
        completedModules: currentProfile?.progress?.completedModules || [],
        quizScores: currentProfile?.progress?.quizScores || {},
        lastActivity: new Date().toISOString(),
        ...updates
      };

      const { data, error } = await supabase
        .from('profiles')
        .update({ progress: updatedProgress })
        .eq('id', userId)
        .select('progress')
        .single();

      if (error) throw error;

      return { data: data.progress as UserProgress, error: null };
    } catch (error) {
      console.error('Update progress error:', error);
      return { data: null, error: error as Error };
    }
  },

  async markModuleComplete(
    userId: string,
    moduleId: string
  ): Promise<BaseResponse<UserProgress>> {
    try {
      const { data: currentProgress } = await this.getUserProgress(userId);
      if (!currentProgress) {
        return this.updateProgress(userId, {
          completedModules: [moduleId]
        });
      }

      const completedModules = new Set(currentProgress.completedModules);
      completedModules.add(moduleId);

      return this.updateProgress(userId, {
        completedModules: Array.from(completedModules)
      });
    } catch (error) {
      console.error('Mark module complete error:', error);
      return { data: null, error: error as Error };
    }
  }
}; 