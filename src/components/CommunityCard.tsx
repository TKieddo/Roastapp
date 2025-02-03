import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Flame, TrendingUp, Award } from 'lucide-react';

interface CommunityCardProps {
  community: {
    id: number;
    name: string;
    description: string;
    coverImage: string;
    members: number;
    roasts: number;
    isVerified?: boolean;
    isTrending?: boolean;
    creator: {
      name: string;
      avatar: string;
    };
  };
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const communitySlug = community.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link 
      to={`/c/${communitySlug}`} 
      className="block bg-card-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary transition-colors group"
    >
      <div className="relative h-40">
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
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium truncate group-hover:text-primary transition-colors">{community.name}</h3>
          {community.isVerified && (
            <Award className="w-4 h-4 text-primary flex-shrink-0" />
          )}
        </div>
        
        <p className="text-sm opacity-60 mb-4 line-clamp-2">{community.description}</p>
        
        <div className="flex items-center justify-between">
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
    </Link>
  );
};

export default CommunityCard;