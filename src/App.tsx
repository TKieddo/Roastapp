import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './lib/auth';
import Layout from './components/Layout';
import GuestLayout from './components/GuestLayout';
import AppRoutes from './routes';

function App() {
  const theme = useThemeStore((state) => state.theme);
  const { user, loading, initialized } = useAuthStore();

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className={`${theme} min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}>
        {user ? (
          <Layout>
            <AppRoutes />
          </Layout>
        ) : (
          <GuestLayout>
            <AppRoutes />
          </GuestLayout>
        )}
      </div>
    </Router>
  );
}

export default App;