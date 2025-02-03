import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Plus, MessageCircle, Bell } from 'lucide-react';

interface MobileNavProps {
  onCreateClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onCreateClick }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/peels', icon: Users, label: 'Peels' },
    { label: 'Create', icon: Plus, onClick: onCreateClick },
    { path: '/messages', icon: MessageCircle, label: 'Chat' },
    { path: '/notifications', icon: Bell, label: 'Inbox' },
  ];

  return (
    <nav className={`
      lg:hidden fixed bottom-0 left-0 right-0 bg-background-dark
      border-t border-border-dark z-50
      transition-transform duration-300
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path ? location.pathname === item.path : false;
          const hasNotification = item.label === 'Inbox';
          
          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-text-dark'}`} />
                <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-text-dark'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path!}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-text-dark'}`} />
                {hasNotification && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-text-dark'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;