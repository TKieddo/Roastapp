import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth';
import PasswordStrength from '../components/auth/PasswordStrength';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match");
          return;
        }
        await signUp(formData.email, formData.password);
        navigate('/'); // Redirect to home after successful signup
      } else {
        await signIn(formData.email, formData.password);
        navigate('/'); // Redirect to home after successful login
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-dark">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-text-dark opacity-60">
            {isSignUp
              ? 'Join the most savage roasting community'
              : 'Welcome back, roaster!'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-card-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-card-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
              />
            </div>

            {isSignUp && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-dark">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-card-dark border border-border-dark rounded-lg px-4 py-2 text-text-dark placeholder-text-dark/60 focus:outline-none focus:border-primary"
                  />
                </div>

                <PasswordStrength password={formData.password} />
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-background-dark bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                isSignUp ? 'Sign up' : 'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-primary hover:text-primary-dark text-sm"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;