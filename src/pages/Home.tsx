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

const Home = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulated loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCommentClick = (post: any) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleAwardClick = (postId: string, authorId: string) => {
    setSelectedPostId(postId);
    setSelectedAuthorId(authorId);
    setShowAwardModal(true);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Dummy data
  const userData = {
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    displayName: "Alex Rodriguez",
    username: "@alexr",
    stats: {
      roasts: 248,
      reputation: 15400
    },
    badges: ['🏆', '⭐', '🔥']
  };

  const tags = [
    "JavaScript", "Python", "React", "CSS", "TypeScript", 
    "Node.js", "Docker", "Git", "Frontend", "Backend"
  ];

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

  const posts = [
    {
      id: '1',
      title: "Your code is so nested, it needs its own ZIP code",
      content: "Just reviewed a PR where the callback hell is so deep, Satan himself filed a noise complaint. #JavaScriptRoast",
      author: {
        id: 'author1',
        name: "RoastMaster Pro",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        verified: true
      },
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      tags: ["JavaScript", "CleanCode", "CodeReview"],
      stats: {
        upvotes: 423,
        comments: 89,
        shares: 28,
        awards: 5
      },
      timeAgo: "2h ago"
    },
    {
      id: '2',
      title: "CSS Specificity Wars",
      content: "Your CSS specificity is so high, it's breaking through the !important barrier. Time to refactor! 🎨",
      author: {
        id: 'author2',
        name: "StyleMaster",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        verified: true
      },
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      tags: ["CSS", "WebDev", "FrontEnd"],
      stats: {
        upvotes: 312,
        comments: 45,
        shares: 18,
        awards: 3
      },
      timeAgo: "4h ago"
    },
    {
      id: '3',
      title: "Python Indentation Drama",
      content: "Your code indentation is so inconsistent, PEP 8 filed a restraining order! 🐍",
      author: {
        id: 'author3',
        name: "PythonPro",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        verified: false
      },
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      tags: ["Python", "CodeStyle", "PEP8"],
      stats: {
        upvotes: 256,
        comments: 34,
        shares: 12,
        awards: 2
      },
      timeAgo: "6h ago"
    }
  ];

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-card-dark rounded-lg"></div>
      <div className="space-y-3">
        <div className="h-4 bg-card-dark rounded w-3/4"></div>
        <div className="h-4 bg-card-dark rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className={`
          col-span-2 border-r border-border-dark p-4
          fixed lg:relative w-64 lg:w-auto h-full bg-background-dark z-30
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="sticky top-20">
            {/* User Profile */}
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
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <Link
                to="/trending"
                className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-primary" />
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
        <div className="col-span-12 lg:col-span-7 px-4">
          {/* Search and Filters */}
          <div className={`
            sticky top-16 bg-background-dark z-10 py-4
            transition-transform duration-300 ease-in-out
            ${isAtTop ? 'translate-y-0' : '-translate-y-[150%]'}
          `}>
            <div className="flex items-center space-x-4 mb-6">
              <button 
                className="lg:hidden p-2 hover:bg-card-dark rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Filter className="w-5 h-5 text-primary" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-dark opacity-60" />
                <input
                  type="text"
                  placeholder="Search roasts, users, or communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card-dark border border-border-dark rounded-lg pl-10 pr-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
                />
              </div>
              <button className="p-2 hover:bg-card-dark rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`
                    flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                    transition-colors whitespace-nowrap
                    ${selectedTags.includes(tag)
                      ? 'bg-primary text-background-dark'
                      : 'bg-card-dark text-text-dark hover:border-primary border border-border-dark'
                    }
                  `}
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>

            {/* Feed Tabs */}
            <div className="flex space-x-4 border-b border-border-dark">
              {['following', 'popular', 'latest'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 relative font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-primary'
                      : 'text-text-dark opacity-60 hover:opacity-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6 pt-4">
            {isLoading ? (
              Array(3).fill(null).map((_, i) => <LoadingSkeleton key={i} />)
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-card-dark border border-border-dark rounded-xl p-4">
                  {/* Post content */}
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
                  </div>

                  <h3 className="text-lg font-medium text-text-dark mb-2">{post.title}</h3>
                  <p className="text-text-dark mb-4">{post.content}</p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full rounded-lg mb-4"
                    />
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        className="px-2 py-1 bg-background-dark rounded-md text-sm text-text-dark hover:text-primary transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

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
                      </button>
                      <button className="p-1.5 hover:bg-background-dark rounded-lg transition-colors">
                        <Star className="w-4 h-4 text-text-dark opacity-60" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block col-span-3 border-l border-border-dark p-4">
          <div className="sticky top-20 space-y-6">
            {/* Notifications */}
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

            {/* Active Users */}
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

export default Home;