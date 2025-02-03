import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Flame,
  MessageCircle,
  Users,
  Award,
  TrendingUp,
  Filter,
  ChevronRight,
  Star,
  Target,
  Plus,
  Settings,
  Bell,
  BarChart3
} from 'lucide-react';
import CommunityCard from '../components/CommunityCard';

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('trending');
  const [activeTab, setActiveTab] = useState('top');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCommunities, setVisibleCommunities] = useState(8);
  const [displayedCommunities, setDisplayedCommunities] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const featuredCommunity = {
    id: 1,
    name: "JavaScript Roasters",
    description: "Where semicolons are optional, but roasts are mandatory. Join the most savage JS community!",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
    creator: {
      name: "RoastMaster Pro",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      verified: true
    },
    stats: {
      members: 15420,
      roasts: 4230,
      dailyActive: 1240
    },
    currentChallenge: {
      title: "Roast My Code: TypeScript Edition",
      timeLeft: "15h 32m 17s",
      prize: "1,500 🔥"
    }
  };

  const topCommunities = [
    {
      id: 1,
      name: "Python Roasts",
      avatar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
      members: 18760,
      trending: true
    },
    {
      id: 2,
      name: "CSS Crushers",
      avatar: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
      members: 12350,
      trending: true
    },
    {
      id: 3,
      name: "DevOps Disasters",
      avatar: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
      members: 9840,
      trending: false
    },
    {
      id: 4,
      name: "UI/UX Roasts",
      avatar: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
      members: 11230,
      trending: true
    }
  ];

  const allCommunities = [
    {
      id: 1,
      name: "JavaScript Roasters",
      description: "Where semicolons are optional, but roasts are mandatory. Join the most savage JS community!",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      members: 15420,
      roasts: 4230,
      isVerified: true,
      isTrending: true,
      creator: {
        name: "RoastMaster Pro",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    },
    {
      id: 2,
      name: "Python Roasts",
      description: "Indentation errors are just the beginning. Come roast some snake code! 🐍",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      members: 18760,
      roasts: 5430,
      isVerified: true,
      isTrending: true,
      creator: {
        name: "PythonPro",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    },
    {
      id: 3,
      name: "React Roasters",
      description: "Where components get torn apart. Join us for some state management drama! 🎭",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      members: 12340,
      roasts: 3210,
      isVerified: true,
      isTrending: true,
      creator: {
        name: "ComponentKing",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    }
  ];

  useEffect(() => {
    let filtered = [...allCommunities];
    switch (activeTab) {
      case 'top':
        filtered.sort((a, b) => b.members - a.members);
        break;
      case 'new':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'active':
        filtered.sort((a, b) => b.roasts - a.roasts);
        break;
      default:
        break;
    }
    setDisplayedCommunities(filtered.slice(0, visibleCommunities));
  }, [activeTab, visibleCommunities]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCommunities(prev => Math.min(prev + 8, allCommunities.length));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="grid grid-cols-12 gap-6">
        <div className={`
          col-span-2 border-r border-border-dark p-4
          fixed lg:relative w-64 lg:w-auto h-full bg-background-dark z-30
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="sticky top-20">
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

            <div className="space-y-2 mb-8">
              <button className="w-full px-4 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                New Roast
              </button>
              <button className="w-full px-4 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-background-dark transition-colors">
                Create Community
              </button>
            </div>

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
                className="flex items-center space-x-3 px-4 py-3 text-primary bg-card-dark rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
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

        <div className="col-span-12 lg:col-span-7 px-4">
          <div className="mt-12 border-t border-border-dark pt-12">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold mb-8">Explore Communities</h2>
              
              <div className="flex items-center space-x-4 mb-8 relative">
                <div className="flex bg-card-dark rounded-lg p-1">
                  {['top', 'new', 'active'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                        activeTab === tab
                          ? 'text-background-dark'
                          : 'text-text-dark hover:text-primary'
                      }`}
                    >
                      {activeTab === tab && (
                        <div className="absolute inset-0 bg-primary rounded-lg -z-10 animate-fadeIn" />
                      )}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {displayedCommunities.map((community) => (
                  <div key={community.id} className="flex flex-col bg-card-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary transition-colors">
                    <div className="relative h-40">
                      <img
                        src={community.coverImage}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                      {community.isTrending && (
                        <div className="absolute top-3 right-3 bg-background-dark/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-primary" />
                          <span className="text-xs font-mono">Trending</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium truncate group-hover:text-primary transition-colors">{community.name}</h3>
                        {community.isVerified && (
                          <Award className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-sm opacity-60 mb-4 line-clamp-2">{community.description}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1.5">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-sm">{community.members.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Flame className="w-4 h-4 text-primary" />
                            <span className="text-sm">{community.roasts.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <img
                            src={community.creator.avatar}
                            alt={community.creator.name}
                            className="w-6 h-6 rounded-full border border-border-dark"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {visibleCommunities < allCommunities.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-6 py-3 bg-card-dark border border-border-dark rounded-lg font-medium hover:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                      View More Communities
                    </span>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block col-span-3 border-l border-border-dark p-4">
          <div className="sticky top-20 space-y-6">
            <div className="bg-card-dark border border-border-dark rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-dark">Statistics</h3>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-background-dark rounded-lg">
                  <div className="text-lg font-bold text-primary">500+</div>
                  <div className="text-xs text-text-dark opacity-60">Communities</div>
                </div>
                <div className="text-center p-3 bg-background-dark rounded-lg">
                  <div className="text-lg font-bold text-primary">150K+</div>
                  <div className="text-xs text-text-dark opacity-60">Members</div>
                </div>
              </div>
            </div>

            <div className="bg-card-dark border border-border-dark rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-dark">Top Communities</h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-4">
                {topCommunities.map((community) => (
                  <div key={community.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={community.avatar}
                        alt={community.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-text-dark">{community.name}</h3>
                        <div className="flex items-center space-x-2 text-sm opacity-60">
                          <Users className="w-4 h-4" />
                          <span>{community.members.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    {community.trending && (
                      <div className="flex items-center space-x-1 text-primary">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">Trending</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;