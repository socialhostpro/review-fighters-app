import React, { useState } from 'react';
import { DollarSign, CreditCard, Calendar, TrendingUp, Download, AlertCircle, Check } from 'lucide-react';

const AffiliateAccountPage: React.FC = () => {
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);

  // Mock data - in real app this would come from API
  const accountData = {
    currentBalance: 1250.75,
    pendingEarnings: 325.50,
    totalEarnings: 5875.25,
    lastPayoutDate: '2024-11-15',
    nextPayoutDate: '2024-12-15',
    payoutThreshold: 100,
    commissionsThisMonth: 425.75,
    totalClicks: 1250,
    conversions: 45,
    conversionRate: 3.6
  };

  const payoutHistory = [
    { id: 1, date: '2024-11-15', amount: 850.00, status: 'completed', method: 'PayPal' },
    { id: 2, date: '2024-10-15', amount: 725.50, status: 'completed', method: 'Bank Transfer' },
    { id: 3, date: '2024-09-15', amount: 615.25, status: 'completed', method: 'PayPal' },
    { id: 4, date: '2024-08-15', amount: 485.75, status: 'completed', method: 'Bank Transfer' }
  ];

  const pendingPayouts = [
    { id: 1, date: '2024-12-15', amount: 325.50, status: 'pending', method: 'PayPal' }
  ];

  const handleRequestPayout = () => {
    if (accountData.currentBalance >= accountData.payoutThreshold) {
      alert('Payout request submitted successfully! You will receive your payment within 5-7 business days.');
    } else {
      alert(`Minimum payout amount is $${accountData.payoutThreshold}. Current balance: $${accountData.currentBalance}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account & Earnings</h1>
            <p className="text-gray-600">Manage your affiliate account and track your earnings</p>
          </div>
        </div>
      </div>

      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">${accountData.currentBalance.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4">
            <button
              onClick={handleRequestPayout}
              disabled={accountData.currentBalance < accountData.payoutThreshold}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                accountData.currentBalance >= accountData.payoutThreshold
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Request Payout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
              <p className="text-2xl font-bold text-orange-600">${accountData.pendingEarnings.toFixed(2)}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Next payout: {accountData.nextPayoutDate}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lifetime Earnings</p>
              <p className="text-2xl font-bold text-blue-600">${accountData.totalEarnings.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Since joining</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-purple-600">${accountData.commissionsThisMonth.toFixed(2)}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">{accountData.conversions} conversions</p>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{accountData.totalClicks.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{accountData.conversions}</p>
            <p className="text-sm text-gray-600">Conversions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{accountData.conversionRate}%</p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Payout Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Information</h2>
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Payout Schedule:</strong> Payouts are processed on the 15th of each month for balances over ${accountData.payoutThreshold}.
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Payments typically arrive within 5-7 business days depending on your selected payment method.
              </p>
            </div>
          </div>
        </div>

        {/* Pending Payouts */}
        {pendingPayouts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Pending Payouts</h3>
            <div className="space-y-2">
              {pendingPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">${payout.amount.toFixed(2)}</span>
                    <span className="text-sm text-gray-600">via {payout.method}</span>
                  </div>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    Processing {payout.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payout History */}
        <h3 className="font-medium text-gray-900 mb-3">Payout History</h3>
        <div className="space-y-2">
          {payoutHistory.map((payout) => (
            <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">${payout.amount.toFixed(2)}</span>
                <span className="text-sm text-gray-600">via {payout.method}</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-900">{payout.date}</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded ml-2">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-600">affiliate@example.com</p>
              </div>
            </div>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Bank Transfer</p>
                <p className="text-sm text-gray-600">****1234</p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
          </div>

          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors">
            + Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateAccountPage; 