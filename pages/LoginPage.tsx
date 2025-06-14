import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import { LogIn, Home } from 'lucide-react'; // Removed UserCheck, Shield, Crown, Briefcase icons

const logoUrl = "https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/0d4urifbt7s6/footer-logo.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('user@example.com'); // Pre-filled email for a regular user
  const [password, setPassword] = useState('password123'); // Pre-filled password
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(ROUTES.LANDING); // App.tsx will handle role-based redirection from LANDING
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex flex-col justify-center items-center p-4">
      <div className="bg-surface p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-300">
        <div className="flex flex-col items-center mb-8">
          <img src={logoUrl} alt="Review Fighters Logo" className="h-16 w-auto mb-4" />
          <h1 className="text-3xl font-bold text-textPrimary">Review Fighters Login</h1>
          <p className="text-textSecondary mt-1">Access your review management dashboard.</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          <div className="text-right">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary hover:text-primary-dark">
              Forgot your password?
            </Link>
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            isLoading={isLoading}
            size="lg"
            leftIcon={<LogIn size={18}/>}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-textSecondary mt-8">
          Don't have an account?{' '}
          <Link to={ROUTES.SIGNUP} className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
        <div className="text-center mt-4">
          <Link to={ROUTES.LANDING}>
            <Button variant="ghost" size="sm" leftIcon={<Home size={16}/>}>
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
       <footer className="text-center text-sm text-white/70 mt-8">
        © {new Date().getFullYear()} Review Fighters Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;