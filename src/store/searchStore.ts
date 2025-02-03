import { create } from 'zustand';

interface SearchState {
  query: string;
  results: {
    posts: any[];
    users: any[];
    communities: any[];
  };
  isLoading: boolean;
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: {
    posts: [],
    users: [],
    communities: [],
  },
  isLoading: false,
  setQuery: (query) => set({ query }),
  search: async (query) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual Supabase queries
      const results = {
        posts: [], // Fetch from posts table
        users: [], // Fetch from users table
        communities: [], // Fetch from communities table
      };
      set({ results, isLoading: false });
    } catch (error) {
      console.error('Search error:', error);
      set({ isLoading: false });
    }
  },
  clearResults: () => set({
    results: {
      posts: [],
      users: [],
      communities: [],
    }
  }),
}));