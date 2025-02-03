import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Share2,
  Star,
  Award,
  Flame,
  Gift
} from 'lucide-react';
import { useAuthStore } from '../lib/auth';
import AwardModal from './AwardModal';
import PostModal from './PostModal';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    image?: string;
    codeSnippet?: string;
    author: {
      id: string;
      name: string;
      avatar: string;
      verified: boolean;
    };
    community: {
      name: string;
      slug: string;
    };
    stats: {
      upvotes: number;
      comments: number;
      shares: number;
      awards: number;
    };
    timeAgo: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuthStore();
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const handleCommentClick = () => {
    setShowPostModal(true);
  };

  return (
    <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
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
            <div className="flex items-center text-sm">
              <span className="text-text-dark opacity-60">in</span>
              <Link
                to={`/c/${post.community.slug}`}
                className="ml-1 text-primary hover:underline"
              >
                {post.community.name}
              </Link>
              <span className="mx-1 text-text-dark opacity-60">•</span>
              <span className="text-text-dark opacity-60">{post.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-text-dark mb-4">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-lg mb-4"
          />
        )}

        {post.codeSnippet && (
          <pre className="bg-background-dark rounded-lg p-4 overflow-x-auto mb-4">
            <code className="text-text-dark font-mono text-sm">
              {post.codeSnippet}
            </code>
          </pre>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors">
              <Flame className="w-4 h-4" />
              <span>{post.stats.upvotes.toLocaleString()}</span>
            </button>
            <button 
              onClick={handleCommentClick}
              className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.stats.comments.toLocaleString()}</span>
            </button>
            <button className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
              <span>{post.stats.shares.toLocaleString()}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAwardModal(true)}
              className="p-2 hover:bg-background-dark rounded-lg transition-colors text-primary"
            >
              <Gift className="w-4 h-4" />
              {post.stats.awards > 0 && (
                <span className="ml-1 text-sm">{post.stats.awards}</span>
              )}
            </button>
            <button className="p-2 hover:bg-background-dark rounded-lg transition-colors">
              <Star className="w-4 h-4 text-text-dark opacity-60" />
            </button>
          </div>
        </div>
      </div>

      {/* Award Modal */}
      {showAwardModal && (
        <AwardModal
          isOpen={showAwardModal}
          onClose={() => setShowAwardModal(false)}
          postId={post.id}
          postAuthorId={post.author.id}
        />
      )}

      {/* Post Modal */}
      {showPostModal && (
        <PostModal
          isOpen={showPostModal}
          onClose={() => setShowPostModal(false)}
          post={post}
        />
      )}
    </div>
  );
};

export default PostCard;