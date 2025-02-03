import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  sender: {
    display_name: string;
    avatar_url: string;
  };
}

interface Conversation {
  id: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  participants: {
    user_id: string;
    display_name: string;
    avatar_url: string;
    online?: boolean;
  }[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  startConversation: (userId: string) => Promise<string>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants(
            user_id,
            unread_count,
            user:users(
              display_name,
              avatar_url
            )
          )
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const conversations = data?.map(conv => ({
        ...conv,
        participants: conv.participants
          .filter((p: any) => p.user_id !== user.user!.id)
          .map((p: any) => ({
            user_id: p.user_id,
            display_name: p.user.display_name,
            avatar_url: p.user.avatar_url,
            unread_count: p.unread_count
          }))
      }));

      set({ conversations: conversations || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(
            display_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: data || [], activeConversation: conversationId, isLoading: false });

      // Mark messages as read
      await get().markAsRead(conversationId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.user.id,
          content
        })
        .select(`
          *,
          sender:sender_id(
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      set(state => ({
        messages: [...state.messages, data]
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  markAsRead: async (conversationId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .rpc('mark_messages_as_read', {
          p_conversation_id: conversationId,
          p_user_id: user.user.id
        });

      if (error) throw error;

      // Update local state
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  startConversation: async (userId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.user.id)
        .filter('conversation_id', 'in', (
          supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', userId)
        ));

      if (existing && existing.length > 0) {
        return existing[0].conversation_id;
      }

      // Create new conversation
      const { data, error } = await supabase
        .rpc('create_conversation', {
          participant_ids: [user.user.id, userId]
        });

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  }
}));