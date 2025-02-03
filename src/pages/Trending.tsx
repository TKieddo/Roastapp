import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageCircle,
  Users,
  Flame,
  TrendingUp,
  Award,
  Filter,
  ChevronRight,
  Star,
  Share2,
  BarChart3,
  Plus,
  Settings,
  Hash,
  Gift
} from 'lucide-react';
import { useAuthStore } from '../lib/auth';
import PostModal from '../components/PostModal';
import AwardModal from '../components/AwardModal';

const Trending = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  const [activeFilter, setActiveFilter] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  const userData = {
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    displayName: "Alex Rodriguez",
    username: "@alexr",
    stats: {
      roasts: 248,
      followers: 1420,
      following: 892,
      reputation: 15400
    },
    badges: ['🏆', '⭐', '🔥']
  };

  const categories = [
    "Programming", "Design", "DevOps", "Frontend", "Backend", 
    "Mobile", "AI/ML", "Blockchain", "Security", "Performance"
  ];

  const trendingPosts = [
    {
      id: 1,
      title: "Your code is so nested, it needs its own ZIP code",
      content: "Just reviewed a PR where the callback hell is so deep, Satan himself filed a noise complaint. #JavaScriptRoast",
      author: {
        name: "RoastMaster Pro",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        verified: true
      },
      community: {
        name: "JavaScript Roasters",
        avatar: "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
      },
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      category: "Programming",
      codeSnippet: `
function callback() {
  setTimeout(() => {
    fetch('/api').then(res => {
      if (res.ok) {
        try {
          // More nesting...
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, 1000);
}`,
      stats: {
        upvotes: 1234,
        comments: 89,
        shares: 45
      },
      timeAgo: "2 hours ago",
      trending: true,
      trendingReason: "Most upvoted today"
    }
  ].concat(Array(15).fill(null).map((_, i) => ({
    id: i + 2,
    title: `Trending Roast ${i + 2}`,
    content: `This is a sample trending roast ${i + 2} with some witty content about coding practices.`,
    author: {
      name: `Roaster ${i + 2}`,
      avatar: `https://images.unsplash.com/photo-${500000000 + i}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
      verified: Math.random() > 0.5
    },
    community: {
      name: `Community ${i + 2}`,
      avatar: `https://images.unsplash.com/photo-${500000100 + i}?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80`
    },
    image: `https://images.unsplash.com/photo-${500000200 + i}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80`,
    category: categories[Math.floor(Math.random() * categories.length)],
    stats: {
      upvotes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50)
    },
    timeAgo: `${Math.floor(Math.random() * 24)} hours ago`,
    trending: Math.random() > 0.5,
    trendingReason: Math.random() > 0.5 ? "Rising fast" : "Hot topic"
  })));

  const notifications = [
    {
      id: 1,
      type: "mention",
      content: "mentioned you in a roast",
      user: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      },
      timestamp: "2m ago",
      read: false
    },
    {
      id: 2,
      type: "like",
      content: "liked your roast",
      user: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      },
      timestamp: "5m ago",
      read: true
    }
  ];

  const activeUsers = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      status: "online",
      lastActive: "now"
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      status: "online",
      lastActive: "now"
    },
    {
      id: 3,
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      status: "away",
      lastActive: "5m ago"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisiblePosts(prev => prev + 10);
      setIsLoading(false);
    }, 1000);
  };

  const handleCategoryToggle = (category: string) => {
    setActiveFilter(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleCommentClick = (post: any) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleAwardClick = (postId: string, authorId: string) => {
    setSelectedPostId(postId);
    setSelectedAuthorId(authorId);
    setShowAwardModal(true);
  };

  const filteredPosts = trendingPosts.filter(post => 
    activeFilter.length === 0 || activeFilter.includes(post.category)
  ).slice(0, visiblePosts);

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-32 bg-card-dark rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-card-dark rounded w-3/4"></div>
        <div className="h-4 bg-card-dark rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar - Navigation (col-span-2) */}
        <div className={`
          col-span-2 border-r border-border-dark p-4
          fixed lg:relative w-64 lg:w-auto h-full bg-background-dark z-30
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="sticky top-20">
            {/* User Profile Summary */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={userData.avatar}
                  alt={userData.displayName}
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
                <div>
                  <h3 className="font-bold text-text-dark">{userData.displayName}</h3>
                  <p className="text-sm text-text-dark opacity-60">{userData.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-card-dark rounded-lg">
                  <div className="text-lg font-bold text-primary">{userData.stats.roasts}</div>
                  <div className="text-xs text-text-dark opacity-60">Roasts</div>
                </div>
                <div className="text-center p-3 bg-card-dark rounded-lg">
                  <div className="text-lg font-bold text-primary">{userData.stats.reputation}</div>
                  <div className="text-xs text-text-dark opacity-60">Rep</div>
                </div>
              </div>
              <div className="flex justify-center space-x-2">
                {userData.badges.map((badge, index) => (
                  <span key={index} className="text-xl">{badge}</span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mb-8">
              <button className="w-full px-4 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                New Roast
              </button>
              <button className="w-full px-4 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-background-dark transition-colors">
                Create Community
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              <Link
                to="/trending"
                className="flex items-center space-x-3 px-4 py-3 text-primary bg-card-dark rounded-lg transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Trending</span>
              </Link>
              <Link
                to="/communities"
                className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-primary" />
                <span>Communities</span>
              </Link>
              <Link
                to="/messages"
                className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Messages</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-primary" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-7 px-4 md:px-8">
          <div className={`
            sticky top-0 lg:top-4 bg-background-dark z-20
            transition-transform duration-300 ease-in-out
            ${isAtTop ? 'translate-y-0' : '-translate-y-[150%]'}
          `}>
            <div className="py-4 bg-background-dark rounded-lg border border-border-dark shadow-lg">
              <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-text-dark">Trending</h1>
                    <p className="text-text-dark opacity-60">
                      The hottest roasts from across the platform
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
                  {['today', 'week', 'month', 'all'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-primary text-background-dark'
                          : 'text-text-dark hover:bg-card-dark'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`
                        flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                        transition-colors whitespace-nowrap
                        ${activeFilter.includes(category)
                          ? 'bg-primary text-background-dark'
                          : 'bg-card-dark text-text-dark hover:border-primary border border-border-dark'
                        }
                      `}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            {isLoading ? (
              Array(3).fill(null).map((_, i) => <LoadingSkeleton key={i} />)
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-card-dark border border-border-dark rounded-xl p-4">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-text-dark">{post.author.name}</span>
                          {post.author.verified && (
                            <Award className="w-4 h-4 text-primary ml-1" />
                          )}
                        </div>
                        <span className="text-sm text-text-dark opacity-60">{post.timeAgo}</span>
                      </div>
                    </div>
                    {post.trending && (
                      <div className="px-2 py-0.5 bg-background-dark rounded-full flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span className="text-xs font-mono text-text-dark">{post.trendingReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <h3 className="text-lg font-medium text-text-dark mb-2">{post.title}</h3>
                  <p className="text-text-dark mb-4">{post.content}</p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full rounded-lg mb-4"
                    />
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm">{post.stats.upvotes}</span>
                      </button>
                      <button 
                        onClick={() => handleCommentClick(post)}
                        className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.stats.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">{post.stats.shares}</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAwardClick(post.id, post.author.id)}
                        className="p-1.5 hover:bg-background-dark rounded-lg transition-colors text-primary"
                      >
                        <Gift className="w-4 h-4" />
                        {post.stats.awards > 0 && (
                          <span className="ml-1 text-sm">{post.stats.awards}</span>
                        )}
                      </button>
                      <button className="p-1.5 hover:bg-background-dark rounded-lg transition-colors">
                        <Star className="w-4 h-4 text-text-dark opacity-60" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {visiblePosts < trendingPosts.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-card-dark border border-border-dark rounded-lg font-medium hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block col-span-3 border-l border-border-dark p-6">
          <div className="sticky top-20 space-y-6">
            <div className="bg-card-dark border border-border-dark rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-dark">Notifications</h3>
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 ${
                      !notification.read ? 'bg-background-dark' : ''
                    } p-2 rounded-lg`}
                  >
                    <img
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{notification.user.name}</span>
                        {' '}
                        <span className="text-text-dark opacity-60">{notification.content}</span>
                      </p>
                      <span className="text-xs text-text-dark opacity-60">{notification.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card-dark border border-border-dark rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-dark">Active Now</h3>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-4">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card-dark ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-dark">{user.name}</h4>
                        <span className="text-xs text-text-dark opacity-60">{user.lastActive}</span>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-background-dark rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPostModal && selectedPost && (
        <PostModal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
        />
      )}

      {showAwardModal && selectedPostId && selectedAuthorId && (
        <AwardModal
          isOpen={showAwardModal}
          onClose={() => {
            setShowAwardModal(false);
            setSelectedPostId(null);
            setSelectedAuthorId(null);
          }}
          postId={selectedPostId}
          postAuthorId={selectedAuthorId}
        />
      )}
    </div>
  );
};

export default Trending;