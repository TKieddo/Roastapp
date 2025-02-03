import React, { useState } from 'react';
import { useAuthStore } from '../lib/auth';
import { MessageCircle, Send, MoreVertical, Award, Heart, Gift } from 'lucide-react';
import AwardModal from './AwardModal';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  timestamp: string;
  likes: number;
  awards: number;
  replies: Comment[];
  isLiked: boolean;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments: initialComments }) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Math.random().toString(),
      content: newComment,
      author: {
        id: user?.id || 'anonymous',
        name: user?.email?.split('@')[0] || 'Anonymous',
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        verified: false
      },
      timestamp: 'just now',
      likes: 0,
      awards: 0,
      replies: [],
      isLiked: false
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: Math.random().toString(),
      content: replyContent,
      author: {
        id: user?.id || 'anonymous',
        name: user?.email?.split('@')[0] || 'Anonymous',
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        verified: false
      },
      timestamp: 'just now',
      likes: 0,
      awards: 0,
      replies: [],
      isLiked: false
    };

    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId
          ? { ...comment, replies: [reply, ...comment.replies] }
          : comment
      )
    );

    setReplyingTo(null);
    setReplyContent('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      )
    );
  };

  const handleAwardClick = (commentId: string, authorId: string) => {
    setSelectedCommentId(commentId);
    setSelectedAuthorId(authorId);
    setShowAwardModal(true);
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <div className={`flex space-x-3 ${!isReply ? 'mb-4' : 'mt-4'}`}>
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-card-dark rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-text-dark">{comment.author.name}</span>
              {comment.author.verified && (
                <Award className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm text-text-dark opacity-60">{comment.timestamp}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAwardClick(comment.id, comment.author.id)}
                className="p-1 hover:bg-background-dark rounded-lg transition-colors text-primary"
              >
                <Gift className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-background-dark rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-text-dark opacity-60" />
              </button>
            </div>
          </div>
          <p className="text-text-dark mb-2">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`flex items-center space-x-1 text-sm ${
                comment.isLiked ? 'text-primary' : 'text-text-dark opacity-60'
              } hover:text-primary transition-colors`}
            >
              <Heart className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center space-x-1 text-sm text-text-dark opacity-60 hover:text-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
            {comment.awards > 0 && (
              <div className="flex items-center space-x-1 text-sm text-primary">
                <Award className="w-4 h-4" />
                <span>{comment.awards}</span>
              </div>
            )}
          </div>
        </div>

        {replyingTo === comment.id && (
          <div className="mt-4">
            <div className="flex space-x-3">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
                alt="Your avatar"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full bg-card-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary resize-none"
                    rows={2}
                  />
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim()}
                    className="absolute right-2 bottom-2 p-1.5 bg-primary text-background-dark rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className="ml-8 space-y-4">
            {comment.replies.map(reply => (
              <CommentComponent key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="flex space-x-3">
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
          alt="Your avatar"
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmitComment} className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-card-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary resize-none"
              rows={2}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-2 bottom-2 p-1.5 bg-primary text-background-dark rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Award Modal */}
      {showAwardModal && selectedCommentId && selectedAuthorId && (
        <AwardModal
          isOpen={showAwardModal}
          onClose={() => {
            setShowAwardModal(false);
            setSelectedCommentId(null);
            setSelectedAuthorId(null);
          }}
          postId={selectedCommentId}
          postAuthorId={selectedAuthorId}
          isComment={true}
        />
      )}
    </div>
  );
};

export default CommentSection;