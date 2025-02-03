import React from 'react';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import MobileMenu from './MobileMenu';
import CreatePostModal from './CreatePostModal';
import { useAuthStore } from '../lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { user } = useAuthStore();

  // Dummy user data - replace with real data
  const userData = {
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    displayName: "Alex Rodriguez",
    username: "@alexr",
    stats: {
      roasts: 248,
      reputation: 15400
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      <main className="flex-1 container mx-auto px-4 py-8 mb-16 lg:mb-0">
        {children}
      </main>
      <MobileNav onCreateClick={() => setIsCreateModalOpen(true)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        userData={userData}
        onCreateClick={() => {
          setIsMobileMenuOpen(false);
          setIsCreateModalOpen(true);
        }}
      />
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default Layout;