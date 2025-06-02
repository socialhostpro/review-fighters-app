
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { staffService } from '../../services/staffService';
import { StaffReviewItem, StaffMember, StaffReviewItemStatus, RelatedItemType } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Textarea from '../../components/Textarea';
import { Eye, CheckCircle, XCircle, AlertTriangle, Edit } from 'lucide-react';

interface ReviewItemCardProps {
  item: StaffReviewItem;
  staffMembers: StaffMember[];
  onUpdateStatus: (itemId: string, status: StaffReviewItemStatus, comments?: string) => void;
  onViewDetails?: (item: StaffReviewItem) => void; // For future detailed view
}

const ReviewItemCard: React.FC<ReviewItemCardProps> = ({ item, staffMembers, onUpdateStatus, onViewDetails }) => {
  const assignedStaff = staffMembers.find(sm => sm.staffId === item.assignedToStaffId);
  const [showCommentsInput, setShowCommentsInput] = useState(false);
  const [comments, setComments] = useState(item.reviewerComments || '');

  const handleStatusUpdate = (status: StaffReviewItemStatus) => {
    onUpdateStatus(item.reviewItemID, status, comments);
    setShowCommentsInput(false); // Hide input after action
  };
  
  const statusColor = {
    'Pending Assignment': 'bg-gray-100 text-gray-700',
    'Pending Review': 'bg-yellow-100 text-yellow-700',
    'Approved': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700',
    'Needs More Info': 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="bg-surface p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-md font-semibold text-textPrimary">Review: {item.itemToReviewType} (ID: {item.itemToReviewId.substring(0,15)}...)</h3>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor[item.status] || 'bg-gray-200'}`}>
          {item.status}
        </span>
      </div>
      <p className="text-xs text-textSecondary">Submitted: {new Date(item.submittedDate).toLocaleString()}</p>
      {item.dueDate && <p className="text-xs text-textSecondary">Due: {new Date(item.dueDate).toLocaleDateString()}</p>}
      {assignedStaff && <p className="text-xs text-textSecondary mb-2">Assigned To: {assignedStaff.name}</p>}
      {item.reviewerComments && !showCommentsInput && <p className="text-sm text-textPrimary mt-2 p-2 bg-gray-50 rounded border italic">Comments: {item.reviewerComments}</p>}

      {showCommentsInput && (
        <Textarea 
            label="Reviewer Comments" 
            value={comments} 
            onChange={(e) => setComments(e.target.value)} 
            className="my-2"
            containerClassName="my-2"
        />
      )}

      <div className="flex flex-wrap gap-2 items-center pt-3 border-t mt-3">
        {!showCommentsInput && item.status !== 'Approved' && item.status !== 'Rejected' && (
            <Button variant="outline" size="sm" onClick={() => setShowCommentsInput(true)} leftIcon={<Edit size={14}/>}>
                Add/Edit Comments
            </Button>
        )}
        {item.status !== 'Approved' && (
            <Button variant="primary" size="sm" onClick={() => handleStatusUpdate('Approved')} leftIcon={<CheckCircle size={14}/>} className="bg-green-500 hover:bg-green-600">Approve</Button>
        )}
        {item.status !== 'Rejected' && (
            <Button variant="danger" size="sm" onClick={() => handleStatusUpdate('Rejected')} leftIcon={<XCircle size={14}/>}>Reject</Button>
        )}
        {item.status !== 'Needs More Info' && (
            <Button variant="secondary" size="sm" onClick={() => handleStatusUpdate('Needs More Info')}>Needs Info</Button>
        )}
        {/* {onViewDetails && <Button variant="ghost" size="sm" onClick={() => onViewDetails(item)}>Details</Button>} */}
      </div>
    </div>
  );
};


const StaffItemsToReviewPage: React.FC = () => {
  const { user } = useAuth();
  const [reviewItems, setReviewItems] = useState<StaffReviewItem[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add filters if needed
  const [filterType, setFilterType] = useState<RelatedItemType | ''>('');

  const fetchReviewItemsAndStaff = useCallback(async () => {
    if (!user || !user.staffId) {
      setError("User not identified as staff.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedItems, fetchedStaff] = await Promise.all([
        staffService.getAllReviewItems(), // Or getReviewItemsForStaff(user.staffId)
        staffService.getAllStaffMembers()
      ]);
      setReviewItems(fetchedItems);
      setStaffMembers(fetchedStaff);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items for review or staff members.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReviewItemsAndStaff();
  }, [fetchReviewItemsAndStaff]);

  const handleUpdateStatus = async (itemId: string, status: StaffReviewItemStatus, comments?: string) => {
    try {
        await staffService.updateStaffReviewItemStatus(itemId, status, comments);
        fetchReviewItemsAndStaff(); // Refresh list
    } catch(err) {
        alert(`Error updating review item: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  const uniqueItemTypes = Array.from(new Set(reviewItems.map(item => item.itemToReviewType)));

  const filteredReviewItems = reviewItems.filter(item => {
      return !filterType || item.itemToReviewType === filterType;
  }).sort((a,b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());


  if (isLoading && reviewItems.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center">
        <Eye size={32} className="text-primary mr-3"/>
        <h1 className="text-3xl font-bold text-textPrimary">Items Pending Review</h1>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center"><AlertTriangle size={18} className="mr-2"/>{error}</div>}
      
      <div className="bg-surface p-4 rounded-lg shadow-md mb-6">
        <label htmlFor="filterType" className="block text-sm font-medium text-textPrimary mb-1">Filter by Item Type:</label>
        <select 
            id="filterType"
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as RelatedItemType | '')}
            className="p-2 border border-gray-300 rounded-md sm:text-sm focus:ring-primary focus:border-primary w-full sm:w-auto"
        >
            <option value="">All Types</option>
            {uniqueItemTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      {isLoading && reviewItems.length > 0 && <div className="my-4"><LoadingSpinner/></div>}

      {filteredReviewItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviewItems.map(item => (
            <ReviewItemCard key={item.reviewItemID} item={item} staffMembers={staffMembers} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-center text-textSecondary py-10">No items currently pending review or matching your filter.</p>
      )}
    </div>
  );
};

export default StaffItemsToReviewPage;
