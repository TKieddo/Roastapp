import React, { useState } from 'react';
import { X, Image, Code, Hash } from 'lucide-react';
import { usePostStore } from '../store/postStore';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createPost } = usePostStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await createPost({
        title,
        content,
        image_url: imageUrl || undefined,
        code_snippet: codeSnippet || undefined
      });
      
      onClose();
      setTitle('');
      setContent('');
      setImageUrl('');
      setCodeSnippet('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card-dark border border-border-dark rounded-xl w-full max-w-2xl p-6 shadow-xl animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-dark hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-text-dark mb-6">Create New Roast</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-dark mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your roast..."
              className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-text-dark mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your roast here..."
              className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary resize-none"
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-text-dark mb-1">
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4 text-primary" />
                <span>Image URL (optional)</span>
              </div>
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter an image URL..."
              className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="codeSnippet" className="block text-sm font-medium text-text-dark mb-1">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-primary" />
                <span>Code Snippet (optional)</span>
              </div>
            </label>
            <textarea
              id="codeSnippet"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Paste your code snippet here..."
              className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary font-mono resize-none"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-dark text-text-dark rounded-lg hover:bg-card-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="px-4 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Hash className="w-5 h-5" />
                  <span>Post Roast</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal