
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { AlertTriangle, Home } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex flex-col justify-center items-center text-center p-6">
      <AlertTriangle size={80} className="text-yellow-300 mb-6" />
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-white mb-6">Page Not Found</h2>
      <p className="text-lg text-indigo-100 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link to={ROUTES.LANDING}>
        <Button variant="secondary" size="lg" leftIcon={<Home size={20} />}>
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
    