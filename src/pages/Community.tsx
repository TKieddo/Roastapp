import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Share2, Award, Shield, MessageCircle, Flame, Info, TrendingUp, ChevronRight } from 'lucide-react';
import { useCommunityStore } from '../store/communityStore';

const Community = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('top');
  const { joinCommunity, leaveCommunity, isCommunityJoined } = useCommunityStore();

  // Dummy data for the community
  const communityData = {
    id: 1,
    name: "JavaScript Roasters",
    category: "Programming & Development",
    description: "Where semicolons are optional, but roasts are mandatory! Join the most savage JS community where we turn your callback hell into comedy heaven. We're here to debug your career choices and compile your worst coding decisions into pure entertainment. Remember: undefined is not a function, but roasting is!",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
    members: 15420,
    rules: [
      "Keep roasts code-related and professional",
      "No personal attacks or harassment",
      "Use appropriate code formatting in posts",
      "Include context with your roasts",
      "Keep it fun and constructive"
    ],
    featuredPost: {
      id: 1,
      title: "This code is so nested, it needs its own ZIP code",
      content: "Just reviewed a PR where the callback hell is so deep, Satan himself filed a noise complaint. #JavaScriptRoast",
      author: {
        name: "RoastMaster Pro",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        verified: true
      },
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80",
      stats: {
        upvotes: 1234,
        comments: 89,
        shares: 45
      },
      timeAgo: "2 hours ago"
    },
    recentPosts: [
      {
        id: 2,
        title: "Your variable naming is a crime against humanity",
        content: "Found a variable named 'x' in production. The only thing shorter than this variable name is your coding career. #RoastedCode",
        author: {
          name: "SyntaxSlayer",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          verified: true
        },
        stats: {
          upvotes: 856,
          comments: 45,
          shares: 23
        },
        timeAgo: "4 hours ago"
      },
      {
        id: 3,
        title: "Your code comments are like your dating life - non-existent",
        content: "Just spent 3 hours trying to understand what this function does. The only thing more mysterious than this code is why you're still employed. #CodeRoast",
        author: {
          name: "BugBuster",
          avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          verified: false
        },
        stats: {
          upvotes: 654,
          comments: 34,
          shares: 12
        },
        timeAgo: "6 hours ago"
      }
    ],
    relatedCommunities: [
      {
        id: 1,
        name: "Python Roasts",
        members: 12340,
        avatar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
        trending: true
      },
      {
        id: 2,
        name: "CSS Crushers",
        members: 8920,
        avatar: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
        trending: false
      },
      {
        id: 3,
        name: "TypeScript Trolls",
        members: 6540,
        avatar: "https://images.unsplash.com/photo-1537884944318-390069bb8665?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
        trending: true
      }
    ],
    topContributors: [
      {
        id: 1,
        name: "RoastMaster Pro",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        roasts: 1420,
        verified: true
      },
      {
        id: 2,
        name: "SyntaxSlayer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        roasts: 980,
        verified: true
      },
      {
        id: 3,
        name: "BugBuster",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        roasts: 750,
        verified: false
      }
    ],
    moderators: [
      {
        id: 1,
        name: "CodeCritic",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 2,
        name: "DebugDragon",
        avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      }
    ]
  };

  const isJoined = isCommunityJoined(communityData.id);

  const handleJoinToggle = () => {
    if (isJoined) {
      leaveCommunity(communityData.id);
    } else {
      joinCommunity(communityData.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: communityData.name,
        text: communityData.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content (60%) */}
        <div className="lg:w-[60%]">
          {/* Cover Image */}
          <div className="relative h-64 lg:h-96 bg-card-dark">
            <img
              src={communityData.coverImage}
              alt={communityData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent" />
          </div>

          {/* Community Info */}
          <div className="px-4 lg:px-8">
            <div className="relative -mt-16 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-text-dark mb-2">{communityData.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-text-dark opacity-60">
                  <span>{communityData.category}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{communityData.members.toLocaleString()} members</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Avatars */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {communityData.topContributors.slice(0, 5).map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full border-2 border-background-dark"
                    />
                  ))}
                </div>
                <span className="text-sm text-text-dark opacity-60">
                  {communityData.members.toLocaleString()} members
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-card-dark border border-border-dark transition-colors"
                >
                  <Share2 className="w-5 h-5 text-text-dark" />
                </button>
                <button 
                  onClick={handleJoinToggle}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isJoined
                      ? 'bg-primary text-background-dark'
                      : 'border border-primary text-primary hover:bg-primary hover:text-background-dark'
                  }`}
                >
                  {isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>

            {/* Featured Post */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Featured Post</h2>
              <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={communityData.featuredPost.image}
                    alt={communityData.featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-background-dark px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={communityData.featuredPost.author.avatar}
                      alt={communityData.featuredPost.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium">{communityData.featuredPost.author.name}</span>
                        {communityData.featuredPost.author.verified && (
                          <Award className="w-4 h-4 text-primary ml-1" />
                        )}
                      </div>
                      <span className="text-sm opacity-60">{communityData.featuredPost.timeAgo}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{communityData.featuredPost.title}</h3>
                  <p className="text-text-dark opacity-80 mb-4">{communityData.featuredPost.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4 text-primary" />
                        <span>{communityData.featuredPost.stats.upvotes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <span>{communityData.featuredPost.stats.comments.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 className="w-4 h-4 text-primary" />
                        <span>{communityData.featuredPost.stats.shares.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border-dark mb-6">
              <div className="flex space-x-8">
                {['top', 'latest', 'members', 'about'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-4 relative font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-text-dark'
                        : 'text-text-dark opacity-60 hover:opacity-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#AEFF00]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="space-y-6 mb-8">
              {communityData.recentPosts.map((post) => (
                <div key={post.id} className="bg-card-dark border border-border-dark rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium">{post.author.name}</span>
                        {post.author.verified && (
                          <Award className="w-4 h-4 text-primary ml-1" />
                        )}
                      </div>
                      <span className="text-sm opacity-60">{post.timeAgo}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-text-dark opacity-80 mb-4">{post.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4 text-primary" />
                        <span>{post.stats.upvotes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <span>{post.stats.comments.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 className="w-4 h-4 text-primary" />
                        <span>{post.stats.shares.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (40%) */}
        <div className="lg:w-[40%] px-4 lg:px-8 py-8 lg:py-0">
          {/* Community Rules */}
          <div className="bg-card-dark border border-border-dark rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-text-dark">Community Rules</h2>
            </div>
            <div className="space-y-4">
              {communityData.rules.map((rule, index) => (
                <div key={index} className="flex space-x-3">
                  <span className="text-primary font-mono">{index + 1}.</span>
                  <p className="text-sm text-text-dark">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-card-dark border border-border-dark rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-text-dark mb-4">Top Contributors</h2>
            <div className="space-y-4">
              {communityData.topContributors.map((contributor) => (
                <div key={contributor.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-text-dark">{contributor.name}</span>
                        {contributor.verified && (
                          <Award className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm opacity-60">
                        <Flame className="w-4 h-4 text-primary" />
                        <span>{contributor.roasts} roasts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Communities */}
          <div className="bg-card-dark border border-border-dark rounded-xl p-6">
            <h2 className="text-lg font-bold text-text-dark mb-4">Related Communities</h2>
            <div className="space-y-4">
              {communityData.relatedCommunities.map((community) => (
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
  );
};

export default Community;