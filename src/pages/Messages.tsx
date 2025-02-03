import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  MessageCircle
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../lib/auth';

const Messages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    conversations,
    messages,
    activeConversation,
    isLoading,
    fetchConversations,
    fetchMessages,
    sendMessage
  } = useChatStore();
  
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    await sendMessage(activeConversation, newMessage);
    setNewMessage('');
    messageInputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const activeConversationData = conversations.find(c => c.id === activeConversation);

  return (
    <div className="min-h-screen bg-background-dark flex">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-border-dark flex-shrink-0 ${
        conversationId ? 'hidden md:flex' : 'flex'
      } flex-col`}>
        <div className="p-4 border-b border-border-dark">
          <h1 className="text-xl font-bold text-text-dark mb-4">Messages</h1>
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

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const participant = conversation.participants[0];
            return (
              <button
                key={conversation.id}
                onClick={() => navigate(`/messages/${conversation.id}`)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-card-dark transition-colors ${
                  conversation.id === activeConversation ? 'bg-card-dark' : ''
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
          })}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
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
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={activeConversationData?.participants[0].avatar_url}
                    alt={activeConversationData?.participants[0].display_name}
                    className="w-10 h-10 rounded-full"
                  />
                  {activeConversationData?.participants[0].online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background-dark" />
                  )}
                </div>
                <div>
                  <h2 className="font-medium text-text-dark">
                    {activeConversationData?.participants[0].display_name}
                  </h2>
                  <p className="text-sm text-text-dark opacity-60">
                    {activeConversationData?.participants[0].online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
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
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-primary text-background-dark rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
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

export default Messages;