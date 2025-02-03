import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  UserMinus,
  Search,
  Check,
  X,
  MessageCircle,
  Bell,
  Filter,
  UserCheck,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';
import { usePeelsStore } from '../store/peelsStore';
import { useAuthStore } from '../lib/auth';

const Peels = () => {
  const [activeTab, setActiveTab] = useState<'friends'|'requests'|'suggestions'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const {
    friends,
    requests,
    suggestions,
    addFriend,
    removeFriend,
    acceptRequest,
    declineRequest,
    cancelRequest
  } = usePeelsStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-card-dark rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-card-dark rounded w-1/4" />
            <div className="h-3 bg-card-dark rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const FriendCard = ({ friend }: { friend: any }) => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-card-dark rounded-xl border border-border-dark hover:border-primary transition-colors">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <img
          src={friend.avatar}
          alt={friend.displayName}
          className="w-12 h-12 rounded-full border-2 border-primary flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-text-dark truncate">{friend.displayName}</h3>
            {friend.verified && (
              <Award className="w-4 h-4 text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-text-dark opacity-60 truncate">{friend.username}</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1 text-sm text-text-dark opacity-60">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{friend.mutualFriends} mutual</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-text-dark opacity-60">
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <span>{friend.reputation} rep</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <button 
          onClick={() => removeFriend(friend.id)}
          className="p-2 hover:bg-background-dark rounded-lg transition-colors"
        >
          <UserMinus className="w-5 h-5 text-primary" />
        </button>
        <Link
          to={`/messages/${friend.id}`}
          className="p-2 hover:bg-background-dark rounded-lg transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-primary" />
        </Link>
      </div>
    </div>
  );

  const RequestCard = ({ request }: { request: any }) => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-card-dark rounded-xl border border-border-dark hover:border-primary transition-colors">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <img
          src={request.avatar}
          alt={request.displayName}
          className="w-12 h-12 rounded-full border-2 border-border-dark flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-text-dark truncate">{request.displayName}</h3>
            {request.verified && (
              <Award className="w-4 h-4 text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-text-dark opacity-60 truncate">{request.username}</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1 text-sm text-text-dark opacity-60">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{request.mutualFriends} mutual</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-text-dark opacity-60">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{request.timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <button 
          onClick={() => acceptRequest(request.id)}
          className="p-2 hover:bg-background-dark rounded-lg transition-colors text-green-500"
        >
          <Check className="w-5 h-5" />
        </button>
        <button 
          onClick={() => declineRequest(request.id)}
          className="p-2 hover:bg-background-dark rounded-lg transition-colors text-red-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const SuggestionCard = ({ suggestion }: { suggestion: any }) => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-card-dark rounded-xl border border-border-dark hover:border-primary transition-colors">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <img
          src={suggestion.avatar}
          alt={suggestion.displayName}
          className="w-12 h-12 rounded-full border-2 border-border-dark flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-text-dark truncate">{suggestion.displayName}</h3>
            {suggestion.verified && (
              <Award className="w-4 h-4 text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-text-dark opacity-60 truncate">{suggestion.username}</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1 text-sm text-text-dark opacity-60">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{suggestion.mutualFriends} mutual</span>
            </div>
            {suggestion.reason && (
              <div className="text-sm text-text-dark opacity-60 truncate">
                {suggestion.reason}
              </div>
            )}
          </div>
        </div>
      </div>
      <button 
        onClick={() => addFriend(suggestion.id)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-background-dark rounded-lg hover:bg-primary-dark transition-colors w-full md:w-auto justify-center"
      >
        <UserPlus className="w-5 h-5" />
        <span>Add</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-dark mb-2">Peels</h1>
              <p className="text-text-dark opacity-60">
                Connect with fellow roasters and build your network
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-card-dark rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-primary" />
              </button>
              <button className="relative p-2 hover:bg-card-dark rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-primary" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-dark opacity-60" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card-dark border border-border-dark rounded-lg pl-10 pr-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'friends', icon: UserCheck, label: `Friends (${friends.length})` },
              { id: 'requests', icon: UserPlus, label: `Requests (${requests.length})` },
              { id: 'suggestions', icon: Users, label: 'Suggestions' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${activeTab === id
                    ? 'bg-primary text-background-dark'
                    : 'text-text-dark hover:bg-card-dark'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {activeTab === 'friends' && (
                  friends.length > 0 ? (
                    friends.map(friend => (
                      <FriendCard key={friend.id} friend={friend} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-text-dark mb-2">No friends yet</h3>
                      <p className="text-text-dark opacity-60">
                        Start connecting with other roasters to build your network
                      </p>
                    </div>
                  )
                )}

                {activeTab === 'requests' && (
                  requests.length > 0 ? (
                    requests.map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-text-dark mb-2">No pending requests</h3>
                      <p className="text-text-dark opacity-60">
                        You're all caught up! Check back later for new friend requests
                      </p>
                    </div>
                  )
                )}

                {activeTab === 'suggestions' && (
                  suggestions.length > 0 ? (
                    suggestions.map(suggestion => (
                      <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-text-dark mb-2">No suggestions</h3>
                      <p className="text-text-dark opacity-60">
                        Check back later for new friend suggestions
                      </p>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peels;