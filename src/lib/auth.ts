import { supabase } from './supabase';
import { create } from 'zustand';

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password');
        }
        throw error;
      }
      set({ user: data.user, error: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      // First try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirmed: true // Add metadata to mark email as confirmed
          }
        }
      });

      if (signUpError) throw signUpError;

      // If signup successful, immediately try to sign in
      if (signUpData.user) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If sign in fails due to email confirmation, try again after a short delay
          if (signInError.message.includes('email_not_confirmed')) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (retryError) throw retryError;
            set({ user: retryData.user, error: null });
          } else {
            throw signInError;
          }
        } else {
          set({ user: signInData.user, error: null });
        }
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data: any) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setInitialized: (initialized: boolean) => set({ initialized, loading: false }),
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.setState({ 
    user: session?.user || null, 
    loading: false,
    initialized: true
  });
});

supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({ 
    user: session?.user || null,
    loading: false
  });
});