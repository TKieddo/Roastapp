import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Flame,
  Users,
  Award,
  TrendingUp,
  Star,
  Filter,
  Hash,
  Globe,
  Zap,
  Trophy,
  Target,
  MessageCircle,
  ChevronDown,
  Info
} from 'lucide-react';

const GuestCommunities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCommunities, setVisibleCommunities] = useState(9);

  const tags = [
    "JavaScript", "Python", "React", "CSS", "TypeScript", 
    "Node.js", "Docker", "Git", "Frontend", "Backend"
  ];

  const featuredCommunity = {
    id: 1,
    name: "JavaScript Roasters",
    description: "Where semicolons are optional, but roasts are mandatory! Join the most savage JS community where we turn your callback hell into comedy heaven. We're here to debug your career choices and compile your worst coding decisions into pure entertainment. Remember: undefined is not a function, but roasting is!",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
    members: 15420,
    roasts: 4230,
    dailyActive: 1240,
    creator: {
      name: "RoastMaster Pro",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      verified: true
    },
    currentChallenge: {
      title: "Roast My Code: TypeScript Edition",
      timeLeft: "15h 32m 17s",
      prize: "1,500 🔥"
    }
  };

  const communities = [
    {
      id: 1,
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
      id: 2,
      name: "CSS Crushers",
      description: "Making your layouts cry since 1996. Join us for some style-based savagery!",
      coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      members: 12350,
      roasts: 3180,
      isVerified: true,
      isTrending: false,
      creator: {
        name: "StyleMaster",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
  ].concat(Array(6).fill(null).map((_, i) => ({
    id: i + 4,
    name: \`Tech Community \${i + 4}\`,
    description: \`Join our community of developers who love to share knowledge and roast code! #\${i + 4}\`,
    coverImage: \`https://images.unsplash.com/photo-\${1560000000 + i}?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80\`,
    members: Math.floor(Math.random() * 10000) + 5000,
    roasts: Math.floor(Math.random() * 3000) + 1000,
    isVerified: Math.random() > 0.5,
    isTrending: Math.random() > 0.7,
    creator: {
      name: \`Creator \${i + 4}\`,
      avatar: \`https://images.unsplash.com/photo-\${1500000000 + i}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80\`
    }
  })));

  const stats = [
    { icon: Users, label: 'Active Roasters', value: '150K+' },
    { icon: Flame, label: 'Roasts Served', value: '2.5M+' },
    { icon: Trophy, label: 'Communities', value: '500+' },
    { icon: Target, label: 'Success Rate', value: '98%' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCommunities(prev => prev + 9);
      setIsLoading(false);
    }, 1000);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredCommunities = communities.filter(community =>
    (activeFilter === 'all' || 
     (activeFilter === 'trending' && community.isTrending) ||
     (activeFilter === 'verified' && community.isVerified)) &&
    (searchQuery === '' || 
     community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     community.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, visibleCommunities);

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-card-dark border-b border-border-dark">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 py-16">
          <div className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
                Join the World's Most Savage
                <span className="text-primary block mt-2">Code Roasting Communities</span>
              </h1>
              <p className="text-xl text-text-dark opacity-80 mb-8">
                Connect with fellow developers, share your roasts, and build your reputation in the most entertaining tech communities.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors group"
              >
                Start Roasting
                <Zap className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-background-dark border border-border-dark rounded-lg p-6 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-text-dark mb-1">{stat.value}</div>
                  <div className="text-sm text-text-dark opacity-60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Community */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-dark">Featured Community</h2>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-text-dark opacity-60">Trending Now</span>
          </div>
        </div>

        <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden">
          <div className="relative h-64 md:h-96">
            <img
              src={featuredCommunity.coverImage}
              alt={featuredCommunity.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={featuredCommunity.creator.avatar}
                  alt={featuredCommunity.creator.name}
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-text-dark">{featuredCommunity.name}</h3>
                    {featuredCommunity.creator.verified && (
                      <Award className="w-6 h-6 text-primary ml-2" />
                    )}
                  </div>
                  <p className="text-text-dark opacity-80">Created by {featuredCommunity.creator.name}</p>
                </div>
              </div>

              <p className="text-lg text-text-dark opacity-90 mb-6 max-w-3xl">
                {featuredCommunity.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-background-dark/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">
                    {featuredCommunity.members.toLocaleString()}
                  </div>
                  <div className="text-sm text-text-dark opacity-80">Members</div>
                </div>
                <div className="bg-background-dark/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">
                    {featuredCommunity.roasts.toLocaleString()}
                  </div>
                  <div className="text-sm text-text-dark opacity-80">Roasts</div>
                </div>
                <div className="bg-background-dark/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">
                    {featuredCommunity.dailyActive.toLocaleString()}
                  </div>
                  <div className="text-sm text-text-dark opacity-80">Daily Active</div>
                </div>
                <div className="bg-background-dark/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-lg font-bold text-primary truncate">
                    {featuredCommunity.currentChallenge.prize}
                  </div>
                  <div className="text-sm text-text-dark opacity-80">Challenge Prize</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-dark opacity-60" />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card-dark border border-border-dark rounded-lg pl-10 pr-4 py-3 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 px-4 py-2 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="text-text-dark">Filter</span>
                  <ChevronDown className="w-4 h-4 text-text-dark opacity-60" />
                </button>
              </div>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-4 py-2 bg-card-dark border border-border-dark rounded-lg text-text-dark focus:outline-none focus:border-primary"
              >
                <option value="all">All Communities</option>
                <option value="trending">Trending</option>
                <option value="verified">Verified</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={\`
                  flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                  transition-colors whitespace-nowrap
                  \${selectedTags.includes(tag)
                    ? 'bg-primary text-background-dark'
                    : 'bg-card-dark text-text-dark hover:border-primary border border-border-dark'
                  }
                \`}
              >
                <Hash className="w-3 h-3 mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="bg-card-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary transition-colors group"
            >
              <div className="relative h-48">
                <img
                  src={community.coverImage}
                  alt={community.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {community.isTrending && (
                  <div className="absolute top-3 right-3 bg-background-dark/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-xs font-mono">Trending</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg truncate group-hover:text-primary transition-colors">
                    {community.name}
                  </h3>
                  {community.isVerified && (
                    <Award className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-sm opacity-80 mb-6 line-clamp-2">{community.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">{community.members.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">{community.roasts.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Link
                    to="/auth"
                    className="px-4 py-2 bg-primary text-background-dark rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Join
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCommunities < communities.length && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-4 bg-card-dark border border-border-dark rounded-lg font-medium hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Load More Communities</span>
                  <ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-card-dark border-t border-border-dark">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-text-dark mb-4">
              Ready to Join the Roasting Revolution?
            </h2>
            <p className="text-xl text-text-dark opacity-80 mb-8">
              Sign up now to join the most savage code roasting communities and start building your reputation!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth"
                className="px-8 py-4 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-background-dark transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCommunities;