import React from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card-dark border border-border-dark rounded-xl w-full max-w-md p-6 shadow-xl animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-dark hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthModal;