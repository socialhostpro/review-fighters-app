
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ownerService } from '../../services/ownerService';
import { Payout, PayoutStatus, Affiliate, StaffMember } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Textarea from '../../components/Textarea';
import { AlertTriangle, CheckCircle, XCircle, DollarSign, ListFilter, Landmark } from 'lucide-react';

interface PayoutRowProps {
  payout: Payout;
  affiliate?: Affiliate | null;
  approvedBy?: StaffMember | null;
  processedBy?: StaffMember | null;
  onApprove: (payoutId: string) => void;
  onReject: (payoutId: string, notes?: string) => void;
  // onProcess: (payoutId: string) => void; // For future finance role
}

const PayoutRow: React.FC<PayoutRowProps> = ({ payout, affiliate, approvedBy, processedBy, onApprove, onReject }) => {
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  const handleRejectWithNotes = () => {
    onReject(payout.payoutID, rejectionNotes);
    setShowRejectionInput(false);
    setRejectionNotes('');
  };
  
  const statusColor = {
    [PayoutStatus.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-800',
    [PayoutStatus.APPROVED]: 'bg-blue-100 text-blue-800',
    [PayoutStatus.PROCESSED]: 'bg-green-100 text-green-800',
    [PayoutStatus.REJECTED]: 'bg-red-100 text-red-800',
    [PayoutStatus.FAILED]: 'bg-pink-100 text-pink-800',
  };

  return (
    <tr className="hover:bg-gray-50 text-sm">
      <td className="px-4 py-3 whitespace-nowrap text-textPrimary font-medium">{affiliate?.name || payout.affiliateID_Ref}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">${payout.amount.toFixed(2)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{new Date(payout.requestedDate).toLocaleDateString()}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[payout.status]}`}>
          {payout.status}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{approvedBy?.name || (payout.approvalDate ? 'N/A' : '')}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{processedBy?.name || (payout.processingDate ? 'N/A' : '')}</td>
      <td className="px-4 py-3 whitespace-nowrap text-xs text-textSecondary truncate max-w-xs" title={payout.notes}>{payout.notes}</td>
      <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
        {payout.status === PayoutStatus.PENDING_APPROVAL && (
          <>
            <Button size="sm" variant="primary" className="bg-green-500 hover:bg-green-600" onClick={() => onApprove(payout.payoutID)} leftIcon={<CheckCircle size={14}/>}>Approve</Button>
            <Button size="sm" variant="danger" onClick={() => setShowRejectionInput(true)} leftIcon={<XCircle size={14}/>}>Reject</Button>
          </>
        )}
        {showRejectionInput && payout.status === PayoutStatus.PENDING_APPROVAL && (
          <div className="mt-2 flex gap-2">
            <Textarea value={rejectionNotes} onChange={(e) => setRejectionNotes(e.target.value)} placeholder="Rejection reason (optional)" rows={1} containerClassName="flex-grow !mb-0"/>
            <Button size="sm" onClick={handleRejectWithNotes}>Confirm Reject</Button>
          </div>
        )}
      </td>
    </tr>
  );
};


const OwnerFinancialsPage: React.FC = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [affiliateDetails, setAffiliateDetails] = useState<Record<string, Affiliate | null>>({});
  const [staffDetails, setStaffDetails] = useState<Record<string, StaffMember | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<PayoutStatus | ''>(PayoutStatus.PENDING_APPROVAL);

  const fetchPayoutsAndDetails = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPayouts = filterStatus 
        ? await ownerService.getPayoutsByStatus(filterStatus)
        : await ownerService.getAllPayouts();
      setPayouts(fetchedPayouts);

      // Fetch affiliate and staff details for display
      const affiliateIds = new Set(fetchedPayouts.map(p => p.affiliateID_Ref));
      const staffIds = new Set(
        fetchedPayouts.flatMap(p => [p.approvedByStaffId, p.processedByStaffId].filter(Boolean) as string[])
      );
      
      const newAffiliateDetails: Record<string, Affiliate | null> = {};
      for (const id of affiliateIds) {
        if (!affiliateDetails[id]) { // Fetch only if not already fetched
          newAffiliateDetails[id] = await ownerService.getAffiliateForPayout(id);
        }
      }
      setAffiliateDetails(prev => ({...prev, ...newAffiliateDetails}));
      
      const newStaffDetails: Record<string, StaffMember | null> = {};
      for (const id of staffIds) {
         if (!staffDetails[id]) {
            newStaffDetails[id] = await ownerService.getStaffForPayout(id);
         }
      }
      setStaffDetails(prev => ({...prev, ...newStaffDetails}));

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load financial data.");
    } finally {
      setIsLoading(false);
    }
  }, [user, filterStatus, affiliateDetails, staffDetails]); // Added dependencies

  useEffect(() => {
    fetchPayoutsAndDetails();
  }, [fetchPayoutsAndDetails]); // fetchPayoutsAndDetails is memoized

  const handleApprovePayout = async (payoutId: string) => {
    if (!user || !user.staffId) return;
    if (!window.confirm("Are you sure you want to approve this payout?")) return;
    try {
      await ownerService.updatePayoutStatus(payoutId, PayoutStatus.APPROVED, user.staffId);
      fetchPayoutsAndDetails(); // Refresh
    } catch (err) {
      alert("Error approving payout: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleRejectPayout = async (payoutId: string, notes?: string) => {
    if (!user || !user.staffId) return;
    if (!window.confirm("Are you sure you want to reject this payout?")) return;
    try {
      await ownerService.updatePayoutStatus(payoutId, PayoutStatus.REJECTED, user.staffId, notes);
      fetchPayoutsAndDetails(); // Refresh
    } catch (err) {
      alert("Error rejecting payout: " + (err instanceof Error ? err.message : String(err)));
    }
  };


  if (isLoading && payouts.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center space-x-3">
        <DollarSign size={32} className="text-primary"/>
        <h1 className="text-3xl font-bold text-textPrimary">Financial Management</h1>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center"><AlertTriangle size={18} className="mr-2"/>{error}</div>}

      <div className="bg-surface p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <ListFilter size={20} className="text-textSecondary"/>
          <label htmlFor="statusFilter" className="text-sm font-medium text-textPrimary">Filter by Status:</label>
          <select 
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PayoutStatus | '')}
            className="p-2 border border-gray-300 rounded-md sm:text-sm focus:ring-primary focus:border-primary"
          >
            <option value="">All Payouts</option>
            {Object.values(PayoutStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {isLoading && payouts.length > 0 && <div className="my-4 text-center"><LoadingSpinner /></div>}

        {payouts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Affiliate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Requested</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Approved By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Processed By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Notes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payouts.map(payout => (
                  <PayoutRow 
                    key={payout.payoutID} 
                    payout={payout} 
                    affiliate={affiliateDetails[payout.affiliateID_Ref]}
                    approvedBy={payout.approvedByStaffId ? staffDetails[payout.approvedByStaffId] : null}
                    processedBy={payout.processedByStaffId ? staffDetails[payout.processedByStaffId] : null}
                    onApprove={handleApprovePayout}
                    onReject={handleRejectPayout}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading && <p className="text-center text-textSecondary py-10">No payouts found matching your criteria.</p>
        )}
      </div>
      
      <div className="bg-surface p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center"><Landmark size={22} className="mr-2 text-primary"/>Reports (Coming Soon)</h2>
        <p className="text-textSecondary">Detailed financial reports, revenue trends, and expense breakdowns will be available here.</p>
      </div>
    </div>
  );
};

export default OwnerFinancialsPage;
