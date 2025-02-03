import { create } from 'zustand';
import { getUserProfile, getUserContent, updateUserProfile } from '../lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  reputation: number;
  social_links: Record<string, string>;
  preferences: Record<string, any>;
  created_at: string;
  total_posts: number;
  total_comments: number;
  total_upvotes: number;
  total_awards: number;
  is_following: boolean;
}

interface UserContent {
  id: string;
  content_type: string;
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  awards_count: number;
  is_liked: boolean;
}

interface ProfileState {
  profile: UserProfile | null;
  content: UserContent[];
  isLoading: boolean;
  error: string | null;
  fetchProfile: (username: string) => Promise<void>;
  fetchContent: (userId: string, contentType: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  content: [],
  isLoading: false,
  error: null,

  fetchProfile: async (username: string) => {
    try {
      set({ isLoading: true, error: null });
      const profile = await getUserProfile(username);
      set({ profile });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchContent: async (userId: string, contentType: string) => {
    try {
      set({ isLoading: true, error: null });
      const content = await getUserContent(userId, contentType as any);
      set({ content });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    try {
      set({ isLoading: true, error: null });
      await updateUserProfile(data);
      
      // Update local state
      const profile = get().profile;
      if (profile) {
        set({ profile: { ...profile, ...data } });
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));