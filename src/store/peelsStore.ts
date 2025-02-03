import { create } from 'zustand';
import { supabase, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend } from '../lib/supabase';

interface Friend {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string;
  verified: boolean;
  mutual_friends: number;
  reputation: number;
}

interface FriendRequest {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string;
  verified: boolean;
  mutual_friends: number;
  created_at: string;
}

interface Suggestion {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string;
  verified: boolean;
  mutual_friends: number;
  reason?: string;
}

interface PeelsState {
  friends: Friend[];
  requests: FriendRequest[];
  suggestions: Suggestion[];
  isLoading: boolean;
  error: string | null;
  fetchFriends: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  fetchSuggestions: () => Promise<void>;
  addFriend: (friendId: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
}

export const usePeelsStore = create<PeelsState>((set, get) => ({
  friends: [],
  requests: [],
  suggestions: [],
  isLoading: false,
  error: null,

  fetchFriends: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          friend:friend_id(
            id,
            display_name,
            username,
            avatar_url,
            verified
          )
        `)
        .eq('user_id', user.user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      // Transform the data
      const friends = await Promise.all((data || []).map(async (friend) => ({
        id: friend.friend.id,
        display_name: friend.friend.display_name,
        username: friend.friend.username,
        avatar_url: friend.friend.avatar_url,
        verified: friend.friend.verified,
        mutual_friends: await getMutualFriendsCount(user.user!.id, friend.friend.id),
        reputation: await getReputation(friend.friend.id)
      })));

      set({ friends, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          created_at,
          user:user_id(
            id,
            display_name,
            username,
            avatar_url,
            verified
          )
        `)
        .eq('friend_id', user.user.id)
        .eq('status', 'pending');

      if (error) throw error;

      // Transform the data
      const requests = await Promise.all((data || []).map(async (request) => ({
        id: request.id,
        display_name: request.user.display_name,
        username: request.user.username,
        avatar_url: request.user.avatar_url,
        verified: request.user.verified,
        mutual_friends: await getMutualFriendsCount(user.user!.id, request.user.id),
        created_at: request.created_at
      })));

      set({ requests, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSuggestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get users who are not friends and have not been requested
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .not('id', 'in', (
          supabase
            .from('friends')
            .select('friend_id')
            .or(`user_id.eq.${user.user.id},friend_id.eq.${user.user.id}`)
        ))
        .neq('id', user.user.id)
        .limit(10);

      if (error) throw error;

      // Transform the data
      const suggestions = await Promise.all((data || []).map(async (suggestion) => ({
        id: suggestion.id,
        display_name: suggestion.display_name,
        username: suggestion.username,
        avatar_url: suggestion.avatar_url,
        verified: suggestion.verified,
        mutual_friends: await getMutualFriendsCount(user.user!.id, suggestion.id),
        reason: await getSuggestionReason(user.user!.id, suggestion.id)
      })));

      set({ suggestions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addFriend: async (friendId: string) => {
    try {
      await sendFriendRequest(friendId);
      set(state => ({
        suggestions: state.suggestions.filter(s => s.id !== friendId)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  acceptRequest: async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      const request = get().requests.find(r => r.id === requestId);
      if (request) {
        set(state => ({
          requests: state.requests.filter(r => r.id !== requestId),
          friends: [...state.friends, {
            id: request.id,
            display_name: request.display_name,
            username: request.username,
            avatar_url: request.avatar_url,
            verified: request.verified,
            mutual_friends: request.mutual_friends,
            reputation: 0 // Will be updated on next fetch
          }]
        }));
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  declineRequest: async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      set(state => ({
        requests: state.requests.filter(r => r.id !== requestId)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  removeFriend: async (friendId: string) => {
    try {
      await removeFriend(friendId);
      set(state => ({
        friends: state.friends.filter(f => f.id !== friendId)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));

// Helper functions
async function getMutualFriendsCount(userId: string, otherUserId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_mutual_friends_count', {
      user_a: userId,
      user_b: otherUserId
    });

  if (error) throw error;
  return data || 0;
}

async function getReputation(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('users')
    .select('reputation')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data?.reputation || 0;
}

async function getSuggestionReason(userId: string, suggestionId: string): Promise<string> {
  // This could be more sophisticated, checking common communities, interests, etc.
  const mutualCount = await getMutualFriendsCount(userId, suggestionId);
  if (mutualCount > 0) {
    return `${mutualCount} mutual friends`;
  }
  return 'Based on your interests';
}