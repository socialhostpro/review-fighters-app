import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DollarSign, ListChecks, CheckSquare, Star, Clock, TrendingUp } from 'lucide-react';

const SalesDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = () => {
      if (!user || !user.salesId) {
        setError("Sales information not available for this user.");
        setIsLoading(false);
        return;
      }
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    checkUser();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">{error}</div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <DollarSign size={32} />
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
            <p className="text-green-100 text-sm">
              Sales Portal - Earn money by completing tasks
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Current Balance</p>
              <p className="text-3xl font-bold text-gray-800">$275.00</p>
              <p className="text-xs text-gray-500 mt-1">Available for payout</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tasks in Progress</p>
              <p className="text-3xl font-bold text-gray-800">1</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Clock size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tasks Completed</p>
              <p className="text-3xl font-bold text-gray-800">8</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <CheckSquare size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-800">$1,450.00</p>
              <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-gray-800">4.7/5</p>
              <p className="text-xs text-gray-500 mt-1">Performance rating</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Star size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Available Tasks</p>
              <p className="text-3xl font-bold text-gray-800">5</p>
              <p className="text-xs text-gray-500 mt-1">Browse new opportunities</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100">
              <ListChecks size={24} className="text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Tasks</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-md border-l-4 border-green-400">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-800">Find LinkedIn Profile - Tech CEO</p>
                  <p className="text-xs text-gray-600">Research • Medium difficulty</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">$100.00</p>
                  <p className="text-xs text-gray-500">1-2 hours</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-400">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-800">Lead Generation - SaaS Companies</p>
                  <p className="text-xs text-gray-600">Lead Generation • Hard difficulty</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">$250.00</p>
                  <p className="text-xs text-gray-500">4-6 hours</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md border-l-4 border-purple-400">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-800">Verify Business Information</p>
                  <p className="text-xs text-gray-600">Verification • Easy difficulty</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">$75.00</p>
                  <p className="text-xs text-gray-500">2-3 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors text-center font-medium">
              Browse Available Tasks
            </button>
            <button className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors text-center font-medium">
              View My Tasks
            </button>
            <button className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition-colors text-center font-medium">
              Request Payout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Specializations</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Lead Generation
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Research
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboardPage; 