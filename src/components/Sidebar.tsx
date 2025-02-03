import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, ShoppingBag, Flame } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 hidden md:block bg-background-dark border-r border-border-dark">
      <div className="p-component">
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg border border-transparent hover:border-border-dark transition-colors"
          >
            <Home className="w-6 h-6 text-primary" />
            <span>Home</span>
          </Link>
          <Link
            to="/trending"
            className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg border border-transparent hover:border-border-dark transition-colors"
          >
            <Flame className="w-6 h-6 text-primary" />
            <span>Trending</span>
          </Link>
          <Link
            to="/communities"
            className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg border border-transparent hover:border-border-dark transition-colors"
          >
            <Users className="w-6 h-6 text-primary" />
            <span>Communities</span>
          </Link>
          <Link
            to="/shop"
            className="flex items-center space-x-3 px-4 py-3 text-text-dark hover:bg-card-dark rounded-lg border border-transparent hover:border-border-dark transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-primary" />
            <span>Shop</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar