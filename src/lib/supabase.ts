import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Profile functions
export const getUserProfile = async (username: string) => {
  const { data, error } = await supabase
    .rpc('get_user_profile', { p_username: username });

  if (error) throw error;
  return data;
};

export const getUserContent = async (
  userId: string,
  contentType: 'posts' | 'comments' | 'upvoted' | 'shared',
  limit = 20,
  offset = 0
) => {
  const { data, error } = await supabase
    .rpc('get_user_content', {
      p_user_id: userId,
      p_content_type: contentType,
      p_limit: limit,
      p_offset: offset
    });

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (data: {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
  preferences?: Record<string, any>;
}) => {
  const { error } = await supabase
    .rpc('update_user_profile', {
      p_display_name: data.display_name,
      p_bio: data.bio,
      p_avatar_url: data.avatar_url,
      p_social_links: data.social_links,
      p_preferences: data.preferences
    });

  if (error) throw error;
  return true;
};

// Post functions
export const createPost = async (data: {
  title: string;
  content: string;
  community_id?: string;
  image_url?: string;
  code_snippet?: string;
}) => {
  const { data: result, error } = await supabase
    .rpc('create_post', {
      title: data.title,
      content: data.content,
      community_id: data.community_id || null,
      image_url: data.image_url || null,
      code_snippet: data.code_snippet || null
    });

  if (error) throw error;
  return result;
};

// Like functions
export const togglePostLike = async (postId: string) => {
  const { data: result, error } = await supabase
    .rpc('toggle_post_like', {
      target_post_id: postId
    });

  if (error) throw error;
  return result;
};

// Comment functions
export const createComment = async (
  postId: string,
  content: string,
  parentId?: string
) => {
  const { data: result, error } = await supabase
    .rpc('create_comment', {
      target_post_id: postId,
      comment_content: content,
      target_parent_id: parentId
    });

  if (error) throw error;
  return result;
};

// Get post with stats
export const getPostWithStats = async (postId: string) => {
  const { data, error } = await supabase
    .rpc('get_post_with_stats', {
      target_post_id: postId
    });

  if (error) throw error;
  return data;
};

// Friend functions
export const sendFriendRequest = async (friendId: string) => {
  const { data, error } = await supabase
    .from('friends')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      friend_id: friendId,
      status: 'pending'
    });

  if (error) throw error;
  return data;
};

export const acceptFriendRequest = async (requestId: string) => {
  const { data, error } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const declineFriendRequest = async (requestId: string) => {
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', requestId);

  if (error) throw error;
};

export const removeFriend = async (friendId: string) => {
  const { error } = await supabase
    .from('friends')
    .delete()
    .or(`user_id.eq.${(await supabase.auth.getUser()).data.user?.id},friend_id.eq.${(await supabase.auth.getUser()).data.user?.id}`)
    .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);

  if (error) throw error;
};

export const getFriendStatus = async (friendId: string) => {
  const { data, error } = await supabase
    .rpc('get_friend_status', {
      user_a: (await supabase.auth.getUser()).data.user?.id,
      user_b: friendId
    });

  if (error) throw error;
  return data;
};

export const getMutualFriendsCount = async (friendId: string) => {
  const { data, error } = await supabase
    .rpc('get_mutual_friends_count', {
      user_a: (await supabase.auth.getUser()).data.user?.id,
      user_b: friendId
    });

  if (error) throw error;
  return data;
};