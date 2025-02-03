import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  MessageCircle,
  Image,
  Paperclip,
  Smile,
  Mic,
  Plus,
  Filter,
  Star,
  Archive,
  Trash2,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../lib/auth';
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

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
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
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
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
      setMessages(data || []);

      // Mark messages as read
      await supabase.rpc('mark_messages_as_read', {
        p_conversation_id: conversationId,
        p_user_id: user?.id
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          content: newMessage
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

      setMessages(prev => [...prev, data]);
      setNewMessage('');
      messageInputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const activeConversation = conversations.find(c => c.id === conversationId);

  const filteredConversations = conversations
    .filter(conv => {
      if (filter === 'all') return true;
      if (filter === 'unread') return conv.unread_count > 0;
      if (filter === 'starred') return false; // Implement star feature
      return true;
    })
    .filter(conv =>
      conv.participants.some(p =>
        p.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <div className="min-h-screen bg-background-dark flex">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-border-dark flex-shrink-0 ${
        conversationId ? 'hidden md:flex' : 'flex'
      } flex-col`}>
        <div className="p-4 border-b border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text-dark">Messages</h1>
            <button
              onClick={() => {}} // TODO: New conversation
              className="p-2 hover:bg-card-dark rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-dark opacity-60" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card-dark border border-border-dark rounded-lg pl-10 pr-4 py-2 text-sm text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="p-4 border-b border-border-dark">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-background-dark'
                  : 'text-text-dark hover:bg-card-dark'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-background-dark'
                  : 'text-text-dark hover:bg-card-dark'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('starred')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'starred'
                  ? 'bg-primary text-background-dark'
                  : 'text-text-dark hover:bg-card-dark'
              }`}
            >
              Starred
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(null).map((_, i) => (
              <div key={i} className="animate-pulse p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-card-dark rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-card-dark rounded w-1/4" />
                    <div className="h-4 bg-card-dark rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const participant = conversation.participants[0];
              return (
                <button
                  key={conversation.id}
                  onClick={() => navigate(`/messages/${conversation.id}`)}
                  className={`w-full p-4 flex items-center space-x-3 hover:bg-card-dark transition-colors ${
                    conversation.id === conversationId ? 'bg-card-dark' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={participant.avatar_url}
                      alt={participant.display_name}
                      className="w-12 h-12 rounded-full"
                    />
                    {participant.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background-dark" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-text-dark truncate">
                        {participant.display_name}
                      </h3>
                      <span className="text-xs text-text-dark opacity-60">
                        {new Date(conversation.last_message_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-text-dark opacity-60 truncate">
                        {conversation.last_message}
                      </p>
                      {conversation.unread_count > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-primary text-background-dark text-xs rounded-full">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-dark mb-2">
                No conversations
              </h3>
              <p className="text-text-dark opacity-60">
                Start a new conversation to connect with others
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {conversationId ? (
        <div className={`flex-1 flex flex-col ${
          conversationId ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-border-dark flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/messages')}
                className="md:hidden p-2 hover:bg-card-dark rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-text-dark" />
              </button>
              {activeConversation && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={activeConversation.participants[0].avatar_url}
                      alt={activeConversation.participants[0].display_name}
                      className="w-10 h-10 rounded-full"
                    />
                    {activeConversation.participants[0].online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background-dark" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-text-dark">
                      {activeConversation.participants[0].display_name}
                    </h2>
                    <p className="text-sm text-text-dark opacity-60">
                      {activeConversation.participants[0].online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-card-dark rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </button>
              <button className="p-2 hover:bg-card-dark rounded-lg transition-colors">
                <Video className="w-5 h-5 text-primary" />
              </button>
              <button className="p-2 hover:bg-card-dark rounded-lg transition-colors">
                <Info className="w-5 h-5 text-primary" />
              </button>
              <button className="p-2 hover:bg-card-dark rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isOwn && (
                      <img
                        src={message.sender.avatar_url}
                        alt={message.sender.display_name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                    )}
                    <div className={`group relative ${
                      isOwn ? 'bg-primary text-background-dark' : 'bg-card-dark text-text-dark'
                    } rounded-2xl px-4 py-2`}>
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <div className={`absolute bottom-0 ${isOwn ? '-left-12' : '-right-12'} flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <span className="text-xs text-text-dark opacity-60">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {isOwn && (
                          message.is_read ? (
                            <CheckCheck className="w-4 h-4 text-primary" />
                          ) : (
                            <Check className="w-4 h-4 text-text-dark opacity-60" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border-dark">
            <form onSubmit={handleSend} className="flex items-end space-x-2">
              <div className="flex-1 bg-card-dark border border-border-dark rounded-lg">
                <div className="flex items-center px-3 py-2 border-b border-border-dark">
                  <button
                    type="button"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="p-1 hover:bg-background-dark rounded-lg transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-primary" />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-background-dark rounded-lg transition-colors ml-1"
                  >
                    <Image className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <div className="relative"> ```tsx
                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full bg-transparent px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none resize-none"
                    rows={1}
                    style={{
                      minHeight: '40px',
                      maxHeight: '120px'
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-card-dark rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5 text-primary" />
                </button>
                {!newMessage.trim() ? (
                  <button
                    type="button"
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording
                        ? 'bg-primary text-background-dark'
                        : 'hover:bg-card-dark text-primary'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="p-2 bg-primary text-background-dark rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-dark mb-2">
              Select a conversation
            </h2>
            <p className="text-text-dark opacity-60">
              Choose a conversation from the list to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;