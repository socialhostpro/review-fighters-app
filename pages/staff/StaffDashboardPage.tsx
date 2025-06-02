
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { staffService } from '../../services/staffService';
import { Task, StaffReviewItem, SupportTicket, StaffMember } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { ListChecks, Eye, Bell, HelpCircle, Briefcase, UserCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  linkTo: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, linkTo, colorClass }) => (
  <Link to={linkTo} className={`block bg-surface p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 ${colorClass}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-textSecondary font-medium">{title}</p>
        <p className="text-3xl font-bold text-textPrimary">{count}</p>
      </div>
      <div className={`p-3 rounded-full bg-opacity-20 ${colorClass.replace('border-', 'bg-')}`}>
        {icon}
      </div>
    </div>
  </Link>
);

const StaffDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [staffDetails, setStaffDetails] = useState<StaffMember | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviewItems, setReviewItems] = useState<StaffReviewItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.staffId) {
        setError("Staff information not available for this user.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [sDetails, sTasks, sReviewItems, sTickets] = await Promise.all([
          staffService.getStaffMemberDetails(user.staffId),
          staffService.getTasksForStaff(user.staffId),
          staffService.getReviewItemsForStaff(user.staffId),
          staffService.getSupportTicketsForStaff(user.staffId),
        ]);
        setStaffDetails(sDetails);
        setTasks(sTasks.filter(t => t.status !== 'Completed')); // Show active tasks
        setReviewItems(sReviewItems.filter(ri => ri.status === 'Pending Review' || ri.status === 'Pending Assignment'));
        setTickets(sTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed'));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load staff dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">{error}</div>;
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
            {staffDetails?.internalRole === 'Manager' ? <Briefcase size={32} /> : <UserCircle size={32}/>}
            <div>
                <h1 className="text-3xl font-bold">Welcome, {staffDetails?.name || user?.name}!</h1>
                <p className="text-indigo-100 text-sm">{staffDetails?.internalRole} | {staffDetails?.team}</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Active Tasks" 
          count={tasks.length} 
          icon={<ListChecks size={24} />} 
          linkTo={ROUTES.STAFF_TASKS}
          colorClass="border-blue-500"
        />
        <StatCard 
          title="Pending Reviews" 
          count={reviewItems.length} 
          icon={<Eye size={24} />} 
          linkTo={ROUTES.STAFF_ITEMS_TO_REVIEW}
          colorClass="border-yellow-500"
        />
        <StatCard 
          title="Open Support Tickets" 
          count={tickets.length} 
          icon={<HelpCircle size={24} />} 
          linkTo={ROUTES.STAFF_SUPPORT_TICKETS}
          colorClass="border-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-textPrimary mb-3">Quick Look: My Tasks</h2>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.slice(0, 5).map(task => (
                <li key={task.taskID} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                  <Link to={`${ROUTES.STAFF_TASKS}?taskId=${task.taskID}`} className="text-sm text-primary hover:underline font-medium block">{task.title}</Link>
                  <p className="text-xs text-textSecondary">Priority: {task.priority} | Status: {task.status}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-textSecondary">No active tasks assigned.</p>}
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-textPrimary mb-3">Recent Notifications (Coming Soon)</h2>
          <p className="text-textSecondary">Your latest important alerts will appear here.</p>
           {/* Placeholder for notifications list */}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
