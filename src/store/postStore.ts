import { create } from 'zustand';
import { supabase, createPost, togglePostLike, createComment } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  community_id?: string;
  image_url?: string;
  code_snippet?: string;
  created_at: string;
  stats: {
    likes_count: number;
    comments_count: number;
    awards_count: number;
  };
  is_liked: boolean;
  author: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  createPost: (data: {
    title: string;
    content: string;
    community_id?: string;
    image_url?: string;
    code_snippet?: string;
  }) => Promise<string>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string, parentId?: string) => Promise<string>;
  fetchPosts: () => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  createPost: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const postId = await createPost(data);
      await get().fetchPosts(); // Refresh posts
      return postId;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleLike: async (postId: string) => {
    try {
      set({ error: null });
      const isLiked = await togglePostLike(postId);
      
      // Update local state
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                stats: {
                  ...post.stats,
                  likes_count: isLiked ? post.stats.likes_count + 1 : post.stats.likes_count - 1
                },
                is_liked: isLiked
              }
            : post
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  addComment: async (postId: string, content: string, parentId?: string) => {
    try {
      set({ error: null });
      const commentId = await createComment(postId, content, parentId);
      
      // Refresh posts to get updated comment count
      await get().fetchPosts();
      
      return commentId;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchPosts: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:user_id(username, display_name, avatar_url),
          stats:post_stats(
            likes_count,
            comments_count,
            awards_count
          ),
          is_liked:likes!inner(id).filter(user_id.eq.${user.user?.id})
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set({ posts: data || [] });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));