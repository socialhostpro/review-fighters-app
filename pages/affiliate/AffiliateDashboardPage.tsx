import React from 'react';
import { DollarSign, TrendingUp, Users, Eye, CreditCard, Share2, BarChart3, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const AffiliateDashboardPage: React.FC = () => {
  // Mock data - in real app this would come from API
  const affiliateData = {
    currentBalance: 1250.75,
    pendingEarnings: 325.50,
    totalEarnings: 5875.25,
    thisMonthEarnings: 425.75,
    totalClicks: 1250,
    conversions: 45,
    conversionRate: 3.6,
    activeLinks: 8,
    nextPayoutDate: '2024-12-15'
  };

  const recentActivity = [
    { id: 1, type: 'conversion', description: 'New signup from social media link', amount: 25.00, date: '2024-11-28' },
    { id: 2, type: 'click', description: 'Click on landing page QR code', amount: 0, date: '2024-11-28' },
    { id: 3, type: 'conversion', description: 'Premium upgrade referral', amount: 50.00, date: '2024-11-27' },
    { id: 4, type: 'click', description: 'Email campaign link clicked', amount: 0, date: '2024-11-27' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Affiliate Dashboard</h1>
            <p className="text-gray-600">Track your performance and earnings</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">${affiliateData.currentBalance.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <Link to={ROUTES.AFFILIATE_ACCOUNT} className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
            View Account →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600">${affiliateData.thisMonthEarnings.toFixed(2)}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">{affiliateData.conversions} conversions</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-purple-600">{affiliateData.totalClicks.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">{affiliateData.conversionRate}% conversion rate</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Links</p>
              <p className="text-2xl font-bold text-orange-600">{affiliateData.activeLinks}</p>
            </div>
            <Share2 className="h-8 w-8 text-orange-600" />
          </div>
          <Link to={ROUTES.AFFILIATE_MARKETING_MATERIALS} className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
            View Materials →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to={ROUTES.AFFILIATE_MARKETING_MATERIALS}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <Share2 className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Get Marketing Materials</h3>
                <p className="text-sm text-gray-600">QR codes, links, and promotional content</p>
              </div>
            </div>
          </Link>

          <Link
            to={ROUTES.AFFILIATE_ACCOUNT}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-gray-400 group-hover:text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Account</h3>
                <p className="text-sm text-gray-600">View balance, payouts, and settings</p>
              </div>
            </div>
          </Link>

          <Link
            to={ROUTES.AFFILIATE_MARKETING_TOOLS}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-gray-400 group-hover:text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Marketing Tools</h3>
                <p className="text-sm text-gray-600">Advanced tracking and analytics</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {activity.type === 'conversion' ? (
                  <DollarSign className="h-4 w-4 text-green-600" />
                ) : (
                  <Eye className="h-4 w-4 text-blue-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
              {activity.amount > 0 && (
                <span className="text-sm font-medium text-green-600">+${activity.amount.toFixed(2)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Payout Info */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Next Payout</h3>
            <p className="text-sm text-gray-600">Scheduled for {affiliateData.nextPayoutDate}</p>
            <p className="text-lg font-bold text-green-600 mt-1">
              ${(affiliateData.currentBalance + affiliateData.pendingEarnings).toFixed(2)}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboardPage;
