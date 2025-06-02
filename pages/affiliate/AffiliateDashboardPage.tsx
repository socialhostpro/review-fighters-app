
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { affiliateService } from '../../services/affiliateService';
import { Affiliate } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link as LinkIconLucide, DollarSign, MousePointerClick, ShoppingCart, AlertTriangle, Copy } from 'lucide-react';
// Consider adding a QR code generation library if needed, e.g., qrcode.react
// import QRCode from 'qrcode.react'; 

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => (
  <div className={`bg-surface p-5 rounded-lg shadow-md border-l-4 ${colorClass}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-textSecondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-textPrimary">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-opacity-20 ${colorClass.replace('border-', 'bg-')}`}>
        {icon}
      </div>
    </div>
  </div>
);

const AffiliateDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [affiliateData, setAffiliateData] = useState<Affiliate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user.affiliateId) {
        setError("Affiliate ID not found for this user.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await affiliateService.getAffiliateDashboardData(user.affiliateId);
        setAffiliateData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load affiliate dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const handleCopyLink = () => {
    if (affiliateData?.affiliateLink) {
      navigator.clipboard.writeText(affiliateData.affiliateLink)
        .then(() => {
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy link: ', err));
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error Loading Dashboard</h2>
        <p className="text-textSecondary">{error}</p>
      </div>
    );
  }

  if (!affiliateData) {
    return <div className="container mx-auto p-4 text-center text-textSecondary">No affiliate data available.</div>;
  }

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">Affiliate Dashboard</h1>
      <p className="text-textSecondary">Welcome, {affiliateData.name}! Here's an overview of your affiliate performance.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Current Balance" value={`$${affiliateData.currentBalance.toFixed(2)}`} icon={<DollarSign size={24} />} colorClass="border-green-500" />
        <StatCard title="Total Clicks" value={affiliateData.totalClicks} icon={<MousePointerClick size={24} />} colorClass="border-blue-500" />
        <StatCard title="Total Sales (Approved)" value={affiliateData.totalSales} icon={<ShoppingCart size={24} />} colorClass="border-purple-500" />
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-textPrimary mb-3">Your Unique Affiliate Link</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-100 rounded-md">
          <LinkIconLucide size={20} className="text-primary flex-shrink-0 mt-1 sm:mt-0" />
          <input 
            type="text" 
            value={affiliateData.affiliateLink} 
            readOnly 
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none"
            onFocus={(e) => e.target.select()}
          />
          <button 
            onClick={handleCopyLink}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm transition-colors duration-150 flex items-center justify-center w-full sm:w-auto"
          >
            <Copy size={16} className="mr-2" />
            {linkCopied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <p className="text-xs text-textSecondary mt-2">Share this link to earn commissions. You can also find more marketing materials in the "Marketing Tools" section.</p>
      </div>
      
      <div className="bg-surface p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-textPrimary mb-3">Your QR Code</h2>
        <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
          {affiliateData.qrCodeLink ? (
            <img src={affiliateData.qrCodeLink} alt="Affiliate QR Code" className="w-40 h-40 border rounded-md p-1" />
          ) : (
            <div className="w-40 h-40 border rounded-md flex items-center justify-center bg-gray-100 text-textSecondary">QR Code N/A</div>
          )}
          <div>
            <p className="text-textPrimary mb-2">Use this QR code for offline promotions or easy mobile sharing. It directs users to your affiliate link.</p>
            {affiliateData.qrCodeLink && (
                <a 
                    href={affiliateData.qrCodeLink} 
                    download={`affiliate_qr_${affiliateData.affiliateID}.png`}
                    className="inline-block px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark text-sm transition-colors duration-150"
                >
                    Download QR Code
                </a>
            )}
          </div>
        </div>
        {/* If using qrcode.react:
          <QRCode value={affiliateData.affiliateLink} size={160} level="H" /> 
        */}
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-textPrimary mb-3">Recent Activity (Coming Soon)</h2>
        <p className="text-textSecondary">Details about your recent clicks, sales, and payouts will appear here.</p>
        {/* Placeholder for tables or lists of recent sales/clicks */}
      </div>
    </div>
  );
};

export default AffiliateDashboardPage;
