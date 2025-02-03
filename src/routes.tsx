import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/auth';
import Home from './pages/Home';
import GuestHome from './pages/GuestHome';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Communities from './pages/Communities';
import Shop from './pages/Shop';
import Messages from './pages/Messages';
import About from './pages/About';
import Trending from './pages/Trending';
import Peels from './pages/Peels';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <GuestHome />} />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/about" element={<About />} />
      <Route path="/communities" element={<Communities />} />
      <Route path="/c/:name" element={<Community />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/peels" element={
        <ProtectedRoute>
          <Peels />
        </ProtectedRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/profile/:username" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/shop" element={
        <ProtectedRoute>
          <Shop />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;