import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';
import { Lock, Home, ArrowLeft } from 'lucide-react';

const logoUrl = "https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/0d4urifbt7s6/footer-logo.png";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    if (!resetToken) {
      setError('Invalid or missing reset token');
      return;
    }
    setToken(resetToken);
  }, [location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex flex-col justify-center items-center p-4">
      <div className="bg-surface p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-300">
        <div className="flex flex-col items-center mb-8">
          <img src={logoUrl} alt="Review Fighters Logo" className="h-16 w-auto mb-4" />
          <h1 className="text-3xl font-bold text-textPrimary">Reset Password</h1>
          <p className="text-textSecondary mt-1">Enter your new password below.</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              <p className="font-bold">Success!</p>
              <p>Your password has been reset. Redirecting to login...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="password"
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              isLoading={isLoading}
              size="lg"
              leftIcon={<Lock size={18}/>}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        <div className="flex justify-between items-center mt-8 text-sm">
          <Link to={ROUTES.LOGIN} className="text-primary hover:text-primary-dark">
            <span className="flex items-center">
              <ArrowLeft size={16} className="mr-1" />
              Back to Login
            </span>
          </Link>
          <Link to={ROUTES.LANDING}>
            <Button variant="ghost" size="sm" leftIcon={<Home size={16}/>}>
              Homepage
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

export default ResetPasswordPage; 