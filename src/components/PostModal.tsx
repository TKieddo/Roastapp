import React from 'react';
import { X, Flame, MessageCircle, Share2, Star, Gift } from 'lucide-react';
import CommentSection from './CommentSection';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, post }) => {
  if (!isOpen) return null;

  // Dummy comments data
  const dummyComments = [
    {
      id: '1',
      content: "This code is so nested, even birds are getting lost trying to find their way out! 😂",
      author: {
        id: '1',
        name: 'CodeRoaster',
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        verified: true
      },
      timestamp: '2h ago',
      likes: 42,
      isLiked: false,
      replies: [
        {
          id: '2',
          content: "Callback hell? More like callback purgatory! 🔥",
          author: {
            id: '2',
            name: 'JSNinja',
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            verified: false
          },
          timestamp: '1h ago',
          likes: 24,
          isLiked: false,
          replies: []
        }
      ]
    },
    {
      id: '3',
      content: "Your variable naming is so bad, even JavaScript is questioning its existence.",
      author: {
        id: '3',
        name: 'BugHunter',
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
        verified: true
      },
      timestamp: '30m ago',
      likes: 18,
      isLiked: false,
      replies: []
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-background-dark/80 backdrop-blur-sm" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-background-dark border border-border-dark rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-dark">
            <h2 className="text-lg font-bold text-text-dark">Post</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-card-dark rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-dark" />
            </button>
          </div>

          {/* Post Content */}
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-text-dark">{post.author.name}</div>
                <div className="text-sm text-text-dark opacity-60">{post.timeAgo}</div>
              </div>
            </div>

            <p className="text-text-dark mb-4">{post.content}</p>

            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="w-full rounded-lg mb-4"
              />
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between border-t border-b border-border-dark py-3">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors">
                  <Flame className="w-5 h-5" />
                  <span>{post.stats.upvotes}</span>
                </button>
                <button className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.stats.comments}</span>
                </button>
                <button className="flex items-center space-x-1.5 text-text-dark hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>{post.stats.shares}</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1.5 hover:bg-card-dark rounded-lg transition-colors text-primary">
                  <Gift className="w-5 h-5" />
                </button>
                <button className="p-1.5 hover:bg-card-dark rounded-lg transition-colors">
                  <Star className="w-5 h-5 text-text-dark opacity-60" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
              <CommentSection postId={post.id} comments={dummyComments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;