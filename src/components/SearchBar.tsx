import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Users, MessageCircle, Hash } from 'lucide-react';
import { useSearchStore } from '../store/searchStore';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  className = '',
  onSearch
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { query, results, isLoading, setQuery, search, clearResults } = useSearchStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      setIsOpen(true);
      await search(value);
      onSearch?.(value);
    } else {
      clearResults();
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearResults();
    setIsOpen(false);
  };

  const handleResultClick = (type: string, id: string) => {
    setIsOpen(false);
    clearResults();
    navigate(`/${type}/${id}`);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-dark opacity-60" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder={placeholder}
          className="w-full bg-card-dark border border-border-dark rounded-lg pl-10 pr-10 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-text-dark animate-spin" />
            ) : (
              <X className="w-5 h-5 text-text-dark hover:text-primary transition-colors" />
            )}
          </button>
        )}
      </div>

      {isOpen && (query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card-dark border border-border-dark rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
              <p className="text-sm text-text-dark mt-2">Searching...</p>
            </div>
          ) : (
            <div className="p-2">
              {/* Users */}
              {results.users.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center px-3 py-2 text-sm text-text-dark opacity-60">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Users</span>
                  </div>
                  {results.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleResultClick('user', user.username)}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-background-dark rounded-lg transition-colors"
                    >
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-left">
                        <div className="font-medium text-text-dark">{user.displayName}</div>
                        <div className="text-sm text-text-dark opacity-60">{user.username}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Communities */}
              {results.communities.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center px-3 py-2 text-sm text-text-dark opacity-60">
                    <Hash className="w-4 h-4 mr-2" />
                    <span>Communities</span>
                  </div>
                  {results.communities.map((community) => (
                    <button
                      key={community.id}
                      onClick={() => handleResultClick('c', community.name)}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-background-dark rounded-lg transition-colors"
                    >
                      <img
                        src={community.avatar}
                        alt={community.name}
                        className="w-8 h-8 rounded-lg"
                      />
                      <div className="text-left">
                        <div className="font-medium text-text-dark">{community.name}</div>
                        <div className="text-sm text-text-dark opacity-60">
                          {community.members.toLocaleString()} members
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Posts */}
              {results.posts.length > 0 && (
                <div>
                  <div className="flex items-center px-3 py-2 text-sm text-text-dark opacity-60">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>Posts</span>
                  </div>
                  {results.posts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleResultClick('post', post.id)}
                      className="w-full text-left px-3 py-2 hover:bg-background-dark rounded-lg transition-colors"
                    >
                      <div className="font-medium text-text-dark line-clamp-1">{post.title}</div>
                      <div className="text-sm text-text-dark opacity-60 line-clamp-1">
                        {post.content}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!results.users.length && !results.communities.length && !results.posts.length && (
                <div className="p-4 text-center text-text-dark opacity-60">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
};

export default SearchBar;