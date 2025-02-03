import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Settings, TrendingUp, Users, MessageCircle, Bell, Plus } from 'lucide-react';
import { useAuthStore } from '../lib/auth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onCreateClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, userData, onCreateClick }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onClose();
    navigate(`/profile/${userData.username}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-[280px] bg-background-dark z-50
        border-r border-border-dark transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex justify-between items-center p-4 border-b border-border-dark">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-3"
          >
            <img
              src={userData.avatar}
              alt={userData.displayName}
              className="w-10 h-10 rounded-full border-2 border-primary"
            />
            <div>
              <h3 className="font-bold text-text-dark">{userData.displayName}</h3>
              <p className="text-sm text-text-dark opacity-60">{userData.username}</p>
            </div>
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-card-dark rounded-lg"
          >
            <X className="w-6 h-6 text-text-dark" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-card-dark rounded-lg">
              <div className="text-lg font-bold text-primary">{userData.stats.roasts}</div>
              <div className="text-xs text-text-dark opacity-60">Roasts</div>
            </div>
            <div className="text-center p-3 bg-card-dark rounded-lg">
              <div className="text-lg font-bold text-primary">{userData.stats.reputation}</div>
              <div className="text-xs text-text-dark opacity-60">Rep</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <button
              onClick={() => {
                onClose();
                onCreateClick();
              }}
              className="w-full px-4 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Roast
            </button>
          </div>

          <div className="space-y-1">
            <Link
              to="/trending"
              className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg"
              onClick={onClose}
            >
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Trending</span>
            </Link>
            <Link
              to="/communities"
              className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg"
              onClick={onClose}
            >
              <Users className="w-5 h-5 text-primary" />
              <span>Communities</span>
            </Link>
            <Link
              to="/messages"
              className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg"
              onClick={onClose}
            >
              <MessageCircle className="w-5 h-5 text-primary" />
              <span>Messages</span>
            </Link>
            <Link
              to="/notifications"
              className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg"
              onClick={onClose}
            >
              <Bell className="w-5 h-5 text-primary" />
              <span>Notifications</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg"
              onClick={onClose}
            >
              <Settings className="w-5 h-5 text-primary" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;