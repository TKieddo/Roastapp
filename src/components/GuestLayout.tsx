import React from 'react';
import GuestNavbar from './GuestNavbar';

interface GuestLayoutProps {
  children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-dark">
      <GuestNavbar />
      <main className="pt-24">
        {children}
      </main>
      <footer className="py-8 border-t border-border-dark">
        <div className="container mx-auto px-component text-center">
          <div className="space-x-6 text-sm text-text-dark font-mono">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms & Conditions</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;