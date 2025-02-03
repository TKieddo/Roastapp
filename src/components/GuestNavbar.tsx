import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../lib/auth';
import { Sun, Moon, Github, Twitter, Linkedin } from 'lucide-react';

const GuestNavbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="fixed w-full top-0 z-50">
      {/* Social Media Top Bar */}
      <div className="border-b border-border-dark">
        <div className="container mx-auto px-component">
          <div className="flex justify-end items-center py-2 text-sm font-mono">
            <span className="text-text-dark mr-4">Follow me</span>
            <span className="mx-2 text-border-dark">|</span>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-text-dark hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-text-dark hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-text-dark hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-component py-8">
        <div className="flex items-center justify-between border-b border-border-dark pb-4">
          <Link to="/" className="text-xl font-mono font-bold text-primary">
            ROASTAPP®
          </Link>
          
          <div className="flex items-center space-x-12">
            <Link 
              to="/" 
              className="text-text-dark hover:text-primary transition-colors relative group font-mono"
            >
              Home
              <span className="absolute left-0 bottom-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link 
              to="/communities" 
              className="text-text-dark hover:text-primary transition-colors relative group font-mono"
            >
              Communities
              <span className="absolute left-0 bottom-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-text-dark hover:text-primary transition-colors relative group font-mono"
            >
              About
              <span className="absolute left-0 bottom-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <Link 
                to="/profile/me" 
                className="text-text-dark hover:text-primary transition-colors relative group font-mono"
              >
                Profile
                <span className="absolute left-0 bottom-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="text-text-dark hover:text-primary transition-colors relative group font-mono"
              >
                Sign In
                <span className="absolute left-0 bottom-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            )}
            <button 
              onClick={toggleTheme}
              className="text-text-dark hover:text-primary transition-colors"
            >
              {theme === 'dark' ? 
                <Sun className="w-5 h-5" /> : 
                <Moon className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default GuestNavbar;