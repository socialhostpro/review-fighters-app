import React, { useEffect, useState } from 'react';
import { reviewService } from '../services/reviewService';
import { Review } from '../types';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, MessageSquare, AlertCircle, TrendingUp } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string; description?: string }> = 
  ({ title, value, icon, colorClass, description }) => (
  <div className={`bg-surface p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${colorClass}`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-textSecondary uppercase">{title}</h3>
      <div className={`p-2 rounded-full bg-opacity-20 ${colorClass.replace('border-', 'bg-')}`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-textPrimary">{value}</p>
    {description && <p className="text-xs text-textSecondary mt-1">{description}</p>}
  </div>
);

const DashboardPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const fetchedReviews = await reviewService.getReviews(user.id);
        setReviews(fetchedReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">{error}</div>;
  }

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : 'N/A';
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const negativeReviews = reviews.filter(r => r.rating <= 2).length;

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Reviews" value={totalReviews} icon={<Star size={20} className="text-blue-500"/>} colorClass="border-blue-500 bg-blue-500/20" description="All reviews received"/>
        <StatCard title="Average Rating" value={averageRating} icon={<TrendingUp size={20} className="text-green-500"/>} colorClass="border-green-500 bg-green-500/20" description="Overall customer satisfaction"/>
        <StatCard title="Positive Reviews" value={positiveReviews} icon={<MessageSquare size={20} className="text-yellow-500"/>} colorClass="border-yellow-500 bg-yellow-500/20" description="Rating 4 stars or higher"/>
        <StatCard title="Negative Reviews" value={negativeReviews} icon={<AlertCircle size={20} className="text-red-500"/>} colorClass="border-red-500 bg-red-500/20" description="Rating 2 stars or lower"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">Review Rating Distribution</h2>
          {Object.keys(ratingDistribution).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(ratingDistribution)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([rating, count]) => (
                  <div key={rating} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center">
                      <span className="font-medium">{rating} Star{parseInt(rating) > 1 ? 's' : ''}</span>
                      <div className="flex ml-2">
                        {Array(parseInt(rating)).fill(0).map((_, i) => (
                          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </span>
                    <span className="font-bold text-primary">{count} reviews</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-textSecondary">No review data available to display.</p>
          )}
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">Review Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">Positive Reviews (4-5 stars)</span>
              <span className="text-green-800 font-bold">{positiveReviews}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700 font-medium">Neutral Reviews (3 stars)</span>
              <span className="text-yellow-800 font-bold">{reviews.filter(r => r.rating === 3).length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700 font-medium">Negative Reviews (1-2 stars)</span>
              <span className="text-red-800 font-bold">{negativeReviews}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Placeholder for more charts/data */}
      <div className="bg-surface p-6 rounded-xl shadow-lg mt-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Review Sources (Coming Soon)</h2>
        <p className="text-textSecondary">A breakdown of where your reviews are coming from (e.g., Google, Yelp, Direct).</p>
        {/* Placeholder for future features */}
      </div>
    </div>
  );
};

export default DashboardPage;
    