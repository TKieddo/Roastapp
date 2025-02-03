import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  MessageCircle,
  Heart,
  Award,
  Gift,
  AtSign,
  UserPlus,
  Check,
  X,
  Filter,
  Search,
  ChevronDown,
  MoreVertical,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  type: 'mention' | 'like' | 'comment' | 'award' | 'friend_request' | 'gift' | 'system';
  content: string;
  created_at: string;
  read: boolean;
  from_user_name: string;
  from_user_avatar: string;
  reference_id: string;
  reference_type: string;
}

const Inbox = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_notifications');

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const { error } = await supabase
        .rpc('mark_notifications_read', {
          p_notification_ids: notificationIds
        });

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notificationIds.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleMarkSelectedAsRead = async () => {
    await markAsRead(Array.from(selectedNotifications));
    setSelectedNotifications(new Set());
    setIsSelectMode(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'mention':
        return <AtSign className="w-5 h-5 text-blue-500" />;
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'award':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'friend_request':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'gift':
        return <Gift className="w-5 h-5 text-pink-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'all') return true;
      return notification.type === filter;
    })
    .filter(notification =>
      notification.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.from_user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-dark">Inbox</h1>
              <p className="text-text-dark opacity-60">
                Stay updated with your notifications
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSelectMode(!isSelectMode)}
                className="p-2 hover:bg-card-dark rounded-lg transition-colors"
              >
                {isSelectMode ? (
                  <X className="w-5 h-5 text-primary" />
                ) : (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
              <Link
                to="/settings/notifications"
                className="p-2 hover:bg-card-dark rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-text-dark">Filter</span>
                <ChevronDown className="w-4 h-4 text-text-dark opacity-60" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-text-dark opacity-60">Show:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-card-dark border border-border-dark rounded-lg px-3 py-1.5 text-text-dark focus:outline-none focus:border-primary"
                >
                  <option value="all">All</option>
                  <option value="mention">Mentions</option>
                  <option value="like">Likes</option>
                  <option value="comment">Comments</option>
                  <option value="award">Awards</option>
                  <option value="friend_request">Friend Requests</option>
                  <option value="gift">Gifts</option>
                </select>
              </div>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-dark opacity-60" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card-dark border border-border-dark rounded-lg pl-10 pr-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Selected Actions */}
          {isSelectMode && selectedNotifications.size > 0 && (
            <div className="bg-card-dark border border-border-dark rounded-lg p-4 mb-6 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-text-dark hover:text-primary transition-colors"
                >
                  {selectedNotifications.size === filteredNotifications.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-text-dark opacity-60">
                  {selectedNotifications.size} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMarkSelectedAsRead}
                  className="px-4 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Mark as Read
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(null).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-card-dark border border-border-dark rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-background-dark rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-background-dark rounded w-1/4" />
                        <div className="h-4 bg-background-dark rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    group bg-card-dark border border-border-dark rounded-lg p-4 transition-colors
                    ${!notification.read ? 'bg-opacity-80' : ''}
                    ${isSelectMode ? 'cursor-pointer hover:border-primary' : ''}
                    ${selectedNotifications.has(notification.id) ? 'border-primary' : ''}
                  `}
                  onClick={() => {
                    if (isSelectMode) {
                      setSelectedNotifications(prev => {
                        const next = new Set(prev);
                        if (next.has(notification.id)) {
                          next.delete(notification.id);
                        } else {
                          next.add(notification.id);
                        }
                        return next;
                      });
                    }
                  }}
                >
                  <div className="flex items-start space-x-4">
                    {isSelectMode ? (
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${selectedNotifications.has(notification.id)
                          ? 'border-primary bg-primary text-background-dark'
                          : 'border-border-dark'
                        }
                      `}>
                        {selectedNotifications.has(notification.id) && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={notification.from_user_avatar}
                          alt={notification.from_user_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-text-dark">
                            {notification.from_user_name}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-text-dark opacity-60">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                          {!isSelectMode && (
                            <button className="p-1 hover:bg-background-dark rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4 text-text-dark opacity-60" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getNotificationIcon(notification.type)}
                        <p className="text-text-dark">
                          {notification.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-text-dark mb-2">
                  No notifications
                </h3>
                <p className="text-text-dark opacity-60">
                  You're all caught up! Check back later for new notifications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;