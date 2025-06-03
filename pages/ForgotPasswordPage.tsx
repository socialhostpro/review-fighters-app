import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';
import { Mail, Home, ArrowLeft } from 'lucide-react';

const logoUrl = "https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/0d4urifbt7s6/footer-logo.png";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
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
          <p className="text-textSecondary mt-1">Enter your email to receive a password reset link.</p>
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
              <p>Check your email for password reset instructions.</p>
            </div>
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" leftIcon={<ArrowLeft size={18}/>}>
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
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
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              isLoading={isLoading}
              size="lg"
              leftIcon={<Mail size={18}/>}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage; 