import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, MessageCircle, Share2, Trophy, TrendingUp, Users, Award, Hash, Zap, Star, Target } from 'lucide-react';
import HeroSection from '../components/HeroSection';

const GuestHome = () => {
  const [activeTab, setActiveTab] = useState('top');

  const topRoasters = [
    {
      id: 1,
      username: "@roastmaster",
      displayName: "RoastMaster Pro",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      stats: {
        roasts: 1420,
        comments: 3280,
        reputation: 15400
      },
      verified: true,
      badges: ['🏆', '⭐', '🔥'],
    },
    {
      id: 2,
      username: "@savagedev",
      displayName: "Savage Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      stats: {
        roasts: 980,
        comments: 2150,
        reputation: 12300
      },
      verified: true,
      badges: ['🏆', '⚡'],
    },
    {
      id: 3,
      username: "@coderoaster",
      displayName: "Code Roaster",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      stats: {
        roasts: 750,
        comments: 1840,
        reputation: 9800
      },
      verified: false,
      badges: ['🔥', '⚡'],
    }
  ];

  const samplePosts = [
    {
      id: 1,
      username: "@roastmaster",
      displayName: "RoastMaster Pro",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content: "I've seen better code written by a keyboard smashing cat 🐱",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      upvotes: 420,
      comments: 69,
      shares: 28,
      verified: true,
      badges: ['🏆', '⭐'],
    },
  ].concat(Array(6).fill(null).map((_, i) => ({
    id: i + 2,
    username: "@user" + (i + 2),
    displayName: "User " + (i + 2),
    avatar: `https://images.unsplash.com/photo-${500000000 + i}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
    content: "This is a sample roast post " + (i + 2),
    coverImage: `https://images.unsplash.com/photo-${500000100 + i}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80`,
    upvotes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    verified: Math.random() > 0.5,
    badges: ['🔥'],
  })));

  const categories = [
    "Programming", "Design", "DevOps", "Frontend", "Backend", 
    "Mobile", "AI/ML", "Blockchain"
  ];

  const communities = [
    {
      id: 1,
      name: "JavaScript Roasters",
      description: "Where semicolons are optional, but roasts are mandatory",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      members: 15420,
      roasts: 4230,
      isJoined: false,
    },
    {
      id: 2,
      name: "CSS Crushers",
      description: "Making your layouts cry since 1996",
      coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      members: 12350,
      roasts: 3180,
      isJoined: false,
    },
    {
      id: 3,
      name: "Python Roasts",
      description: "Indentation errors are just the beginning",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      members: 18760,
      roasts: 5430,
      isJoined: true,
    },
    {
      id: 4,
      name: "DevOps Disasters",
      description: "Your pipeline is as broken as your promises",
      coverImage: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      members: 9840,
      roasts: 2760,
      isJoined: false,
    },
    {
      id: 5,
      name: "UI/UX Roasts",
      description: "Your design is my comedy",
      coverImage: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      members: 11230,
      roasts: 3450,
      isJoined: false,
    },
    {
      id: 6,
      name: "Database Roasts",
      description: "SQL you later, alligator",
      coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      members: 8920,
      roasts: 2340,
      isJoined: false,
    },
  ];

  const topPosts = samplePosts.slice(0, 3);
  const morePosts = samplePosts.slice(3, 7);

  const RoasterStats = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-sm text-text-dark font-medium tabular-nums">{value.toLocaleString()}</span>
        <span className="text-xs text-text-dark opacity-60 truncate">{label}</span>
      </div>
    </div>
  );

  const PostCard = ({ post, className = "" }) => (
    <div className={`bg-card-dark border border-border-dark rounded-lg p-4 md:p-6 hover:border-primary transition-colors ${className}`}>
      <div className="flex items-center mb-4">
        <img 
          src={post.avatar} 
          alt={post.displayName} 
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-border-dark"
        />
        <div className="ml-3 min-w-0">
          <div className="flex items-center">
            <span className="font-mono font-bold text-text-dark truncate">{post.displayName}</span>
            {post.verified && (
              <span className="ml-1 text-primary flex-shrink-0">
                <Award className="w-4 h-4" />
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-text-dark opacity-60 truncate">{post.username}</span>
            <div className="flex-shrink-0">
              {post.badges.map((badge, index) => (
                <span key={index} className="text-sm">{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-base md:text-xl text-text-dark font-mono mb-4 break-words">{post.content}</p>

      <div className="mb-6 rounded-lg overflow-hidden border border-border-dark">
        <img 
          src={post.coverImage} 
          alt="Post content"
          className="w-full h-32 md:h-48 object-cover"
        />
      </div>

      <div className="flex items-center justify-between text-sm font-mono">
        <button className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors">
          <Flame className="w-4 h-4 md:w-5 md:h-5" />
          <span>{post.upvotes.toLocaleString()}</span>
        </button>
        <button className="flex items-center space-x-2 text-text-dark hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          <span>{post.comments.toLocaleString()}</span>
        </button>
        <button className="flex items-center space-x-2 text-text-dark hover:text-primary transition-colors">
          <Share2 className="w-4 h-4 md:w-5 md:h-5" />
          <span>{post.shares.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <HeroSection />

      <div className="relative border-t border-border-dark py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-component">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Main Content */}
            <div className="flex-grow order-2 lg:order-1">
              <div className="flex justify-center mb-6 md:mb-8 font-mono border-b border-border-dark overflow-x-auto">
                <button 
                  className={`px-4 md:px-6 py-3 md:py-4 flex items-center space-x-2 ${activeTab === 'top' ? 'text-primary border-b-2 border-primary' : 'text-text-dark hover:text-primary'}`}
                  onClick={() => setActiveTab('top')}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Top Roasted</span>
                </button>
                <button 
                  className={`px-4 md:px-6 py-3 md:py-4 flex items-center space-x-2 ${activeTab === 'new' ? 'text-primary border-b-2 border-primary' : 'text-text-dark hover:text-primary'}`}
                  onClick={() => setActiveTab('new')}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>New</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {topPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
                {morePosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Roaster Sidebar */}
            <div className="lg:w-80 order-1 lg:order-2">
              <div className="bg-card-dark border border-border-dark rounded-lg p-4 md:p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-mono font-bold text-text-dark">Top Roasters</h2>
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-6">
                  {topRoasters.map((roaster) => (
                    <div key={roaster.id} className="group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center min-w-0">
                          <img 
                            src={roaster.avatar} 
                            alt={roaster.displayName} 
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-border-dark flex-shrink-0"
                          />
                          <div className="ml-3 overflow-hidden">
                            <div className="flex items-center">
                              <span className="font-mono text-sm text-text-dark truncate">{roaster.displayName}</span>
                              {roaster.verified && (
                                <span className="ml-1 text-primary flex-shrink-0">
                                  <Award className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-mono text-text-dark opacity-60 truncate block">{roaster.username}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                          {roaster.badges.map((badge, idx) => (
                            <span key={idx} className="text-sm">{badge}</span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <RoasterStats 
                          icon={Flame} 
                          label="roasts" 
                          value={roaster.stats.roasts} 
                        />
                        <RoasterStats 
                          icon={MessageCircle} 
                          label="comments" 
                          value={roaster.stats.comments} 
                        />
                        <RoasterStats 
                          icon={Star} 
                          label="rep" 
                          value={roaster.stats.reputation} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/leaderboard"
                  className="mt-6 block text-center py-2 border border-primary text-primary hover:bg-primary hover:text-background-dark transition-colors rounded-lg font-mono text-sm"
                >
                  View Full Leaderboard
                </Link>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-text-dark mb-6 md:mb-8 text-center">Popular Categories</h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/category/${category.toLowerCase()}`}
                  className="px-4 md:px-6 py-2 md:py-3 bg-card-dark border border-border-dark rounded-full hover:border-primary transition-colors flex items-center space-x-2 font-mono"
                >
                  <Hash className="w-4 h-4 text-primary" />
                  <span className="text-text-dark text-sm md:text-base">{category}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Communities Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-text-dark mb-6 md:mb-8 text-center">Popular Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              {communities.map(community => (
                <div key={community.id} className="bg-card-dark border border-border-dark rounded-lg overflow-hidden hover:border-primary transition-colors">
                  <div className="h-32 md:h-48 overflow-hidden">
                    <img 
                      src={community.coverImage} 
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-mono font-bold text-text-dark mb-2 truncate">{community.name}</h3>
                    <p className="text-sm text-text-dark opacity-60 mb-4 line-clamp-2">{community.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-dark">{community.members.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Flame className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-dark">{community.roasts.toLocaleString()}</span>
                        </div>
                      </div>
                      <button 
                        className={`px-3 md:px-4 py-1 rounded-full text-sm font-mono ${
                          community.isJoined 
                            ? 'bg-primary text-background-dark' 
                            : 'border border-primary text-primary hover:bg-primary hover:text-background-dark'
                        } transition-colors`}
                      >
                        {community.isJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-card-dark border border-border-dark rounded-lg p-4 md:p-6 text-center">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                <h4 className="text-xl md:text-2xl font-mono font-bold text-text-dark mb-1">150K+</h4>
                <p className="text-xs md:text-sm text-text-dark opacity-60">Active Roasters</p>
              </div>
              <div className="bg-card-dark border border-border-dark rounded-lg p-4 md:p-6 text-center">
                <Flame className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                <h4 className="text-xl md:text-2xl font-mono font-bold text-text-dark mb-1">2.5M+</h4>
                <p className="text-xs md:text-sm text-text-dark opacity-60">Roasts Served</p>
              </div>
              <div className="bg-card-dark border border-border-dark rounded-lg p-4 md:p-6 text-center">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                <h4 className="text-xl md:text-2xl font-mono font-bold text-text-dark mb-1">500+</h4>
                <p className="text-xs md:text-sm text-text-dark opacity-60">Communities</p>
              </div>
              <div className="bg-card-dark border border-border-dark rounded-lg p-4 md:p-6 text-center">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                <h4 className="text-xl md:text-2xl font-mono font-bold text-text-dark mb-1">98%</h4>
                <p className="text-xs md:text-sm text-text-dark opacity-60">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestHome;