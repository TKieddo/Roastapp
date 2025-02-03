import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useAuthStore } from '../lib/auth';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.user_metadata.username || user.id}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-dark border-b border-border-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-14">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-card-dark rounded-lg"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <Link to="/" className="text-lg font-mono font-bold text-primary">
              ROASTAPP®
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-dark opacity-60" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-card-dark border border-border-dark rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <Link to="/shop" className="p-2 hover:bg-card-dark rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </Link>
            <button
              onClick={handleProfileClick}
              className="p-2 hover:bg-card-dark rounded-lg"
            >
              <User className="w-5 h-5 text-primary" />
            </button>
            <button className="p-2 hover:bg-card-dark rounded-lg lg:hidden">
              <Search className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;