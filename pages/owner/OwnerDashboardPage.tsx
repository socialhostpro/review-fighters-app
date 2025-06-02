
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ownerService } from '../../services/ownerService'; // Assuming you'll create this
import { Payout, Affiliate, SystemSetting, AuditLogActionType, PayoutStatus } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { DollarSign, Users, Settings, ListChecks, AlertTriangle, ShieldCheck, BarChart3, Landmark } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  linkTo?: string;
  colorClass?: string;
  description?: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ title, value, icon, linkTo, colorClass = 'border-gray-300', description }) => {
  const cardContent = (
    <div className={`bg-surface p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-textSecondary font-medium uppercase">{title}</h3>
        <div className={`p-2 rounded-full bg-opacity-20 ${colorClass.replace('border-', 'bg-')}`}>
           {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-textPrimary">{value}</p>
      {description && <p className="text-xs text-textSecondary mt-1">{description}</p>}
    </div>
  );
  return linkTo ? <Link to={linkTo} className="block">{cardContent}</Link> : cardContent;
};


const OwnerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  // Mock data for now, replace with actual service calls
  const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
  const [totalAffiliates, setTotalAffiliates] = useState(0);
  // Add more states for KPIs as needed
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        // Replace with actual service calls
        const payouts = await ownerService.getPayoutsByStatus(PayoutStatus.PENDING_APPROVAL);
        setPendingPayouts(payouts);
        
        // Simulate fetching other data
        // const affiliates = await affiliateService.getAllAffiliates(); // Assuming this exists
        // setTotalAffiliates(affiliates.length);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setTotalAffiliates(mockAffiliates.length); // Using mock data length for now

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load owner dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

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
  
  const totalPendingPayoutAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container mx-auto space-y-8 p-4 sm:p-6">
      <div className="flex items-center space-x-3 bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-lg text-white">
        <ShieldCheck size={40} />
        <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-indigo-100">Strategic overview and system control.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardStatCard 
          title="Pending Payouts" 
          value={pendingPayouts.length} 
          icon={<DollarSign size={24} className="text-orange-500"/>} 
          linkTo={ROUTES.OWNER_FINANCIALS}
          colorClass="border-orange-500"
          description={`Total: $${totalPendingPayoutAmount.toFixed(2)}`}
        />
        <DashboardStatCard 
          title="Total Affiliates" 
          value={totalAffiliates} 
          icon={<Users size={24} className="text-blue-500"/>} 
          linkTo={ROUTES.OWNER_AFFILIATE_OVERSIGHT}
          colorClass="border-blue-500"
          description="All registered affiliates"
        />
        <DashboardStatCard 
          title="System Settings" 
          value={"Manage"} 
          icon={<Settings size={24} className="text-purple-500"/>} 
          linkTo={ROUTES.OWNER_SYSTEM_SETTINGS}
          colorClass="border-purple-500"
          description="Configure platform parameters"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-textPrimary mb-3">Quick Actions</h2>
          <div className="space-y-3">
            <Link to={ROUTES.OWNER_FINANCIALS} className="block">
                <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center">
                    <DollarSign size={18} className="mr-2 text-primary"/> Approve Payouts
                </button>
            </Link>
            <Link to={ROUTES.OWNER_AUDIT_LOGS} className="block">
                 <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center">
                    <ListChecks size={18} className="mr-2 text-primary"/> View Audit Logs
                </button>
            </Link>
             <Link to={ROUTES.OWNER_STAFF_MANAGEMENT} className="block">
                 <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center">
                    <Users size={18} className="mr-2 text-primary"/> Manage Staff
                </button>
            </Link>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-textPrimary mb-4">Key Metrics (Placeholders)</h2>
            <div className="space-y-2">
                <p className="text-textSecondary flex items-center"><BarChart3 size={16} className="mr-2 text-green-500"/> Total Revenue (MTD): $XX,XXX</p>
                <p className="text-textSecondary flex items-center"><Landmark size={16} className="mr-2 text-blue-500"/> Affiliate Conversion Rate: X%</p>
                <p className="text-textSecondary flex items-center"><Users size={16} className="mr-2 text-purple-500"/> New Staff This Month: X</p>
            </div>
        </div>
      </div>
      
      {/* Placeholder for more complex charts or data views */}
      <div className="bg-surface p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Affiliate Program Health (Coming Soon)</h2>
        <p className="text-textSecondary">Charts on affiliate signups, top performers, etc.</p>
      </div>

    </div>
  );
};

// Mock data (can be moved to data/mockData.ts or service later)
const mockAffiliates = [
  { id: 'aff1', name: 'Top Affiliate A', earnings: 1200 },
  { id: 'aff2', name: 'Rising Star B', earnings: 850 },
];


export default OwnerDashboardPage;
