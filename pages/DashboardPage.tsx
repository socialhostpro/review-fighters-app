
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
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
  
  const chartData = Object.entries(ratingDistribution)
    .map(([rating, count]) => ({ name: `${rating} Star${parseInt(rating) > 1 ? 's' : ''}`, count }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));


  // Mock data for reviews over time
  const reviewsOverTimeData = [
    { name: 'Jan', reviews: 4 }, { name: 'Feb', reviews: 3 },
    { name: 'Mar', reviews: 5 }, { name: 'Apr', reviews: 7 },
    { name: 'May', reviews: 6 }, { name: 'Jun', reviews: 9 },
    { name: 'Jul', reviews: totalReviews - (4+3+5+7+6+9) > 0 ? totalReviews - (4+3+5+7+6+9) : 5 }, // Distribute current reviews
  ].slice(0,7);


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
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#757575' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#757575' }} />
                <Tooltip wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}/>
                <Legend wrapperStyle={{fontSize: '14px'}}/>
                <Bar dataKey="count" fill="#1976D2" name="Number of Reviews" barSize={40} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-textSecondary">No review data available to display chart.</p>
          )}
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">Reviews Over Time (Mock)</h2>
           <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reviewsOverTimeData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#757575' }}/>
              <YAxis tick={{ fontSize: 12, fill: '#757575' }}/>
              <Tooltip  wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}/>
              <Legend wrapperStyle={{fontSize: '14px'}}/>
              <Line type="monotone" dataKey="reviews" stroke="#FF6F00" strokeWidth={2} activeDot={{ r: 6 }} name="New Reviews"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Placeholder for more charts/data */}
      <div className="bg-surface p-6 rounded-xl shadow-lg mt-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Review Sources (Coming Soon)</h2>
        <p className="text-textSecondary">A breakdown of where your reviews are coming from (e.g., Google, Yelp, Direct).</p>
        {/* Placeholder for Pie Chart or Table */}
      </div>
    </div>
  );
};

export default DashboardPage;
    