
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { affiliateService } from '../../services/affiliateService'; // Assuming this exists and has admin functions
import { Affiliate, UserRole } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { AlertTriangle, Users, DollarSign, TrendingUp, ShieldCheck, Edit3 } from 'lucide-react';

const OwnerAffiliateOversightPage: React.FC = () => {
  const { user } = useAuth();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAffiliates = useCallback(async () => {
    if (!user || user.role !== UserRole.OWNER) {
      setError("Access denied.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await affiliateService.getAllAffiliates(); // Admin function
      setAffiliates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load affiliates.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const handleOpenEditModal = (affiliate: Affiliate) => {
    setEditingAffiliate({ ...affiliate });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAffiliate(null);
  };

  const handleAffiliateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingAffiliate) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setEditingAffiliate(prev => prev ? { 
        ...prev, 
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value) 
    } : null);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAffiliate || !user || !user.staffId) return;
    setIsSaving(true);
    try {
      // Example: Update status or flag as high value
      // This would call a specific service function, e.g., ownerService.updateAffiliateDetails
      // For now, we'll just update status as an example, and refresh.
      // A more robust solution would be needed in ownerService.
      await affiliateService.updateAffiliateStatus(editingAffiliate.affiliateID, editingAffiliate.status);
      // await ownerService.updateAffiliateFlags(editingAffiliate.affiliateID, { isHighValue: editingAffiliate.isHighValue });
      
      // Mock update for isHighValue flag for demonstration
      const updatedAffiliates = affiliates.map(aff => 
        aff.affiliateID === editingAffiliate.affiliateID 
        ? { ...aff, status: editingAffiliate.status, isHighValue: editingAffiliate.isHighValue } 
        : aff
      );
      setAffiliates(updatedAffiliates);

      // In a real app, you'd call fetchAffiliates() after a successful backend update.
      // For now, we directly update the local state.
      // await fetchAffiliates(); 
      
      handleCloseEditModal();
    } catch (err) {
      alert(`Error saving affiliate: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };


  if (isLoading && affiliates.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error Loading Affiliate Data</h2>
        <p className="text-textSecondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center space-x-3">
        <Users size={32} className="text-primary"/>
        <h1 className="text-3xl font-bold text-textPrimary">Affiliate Program Oversight</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-blue-700">Total Affiliates</h3>
            <p className="text-2xl font-bold text-blue-900">{affiliates.length}</p>
        </div>
         <div className="bg-green-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-green-700">Active Affiliates</h3>
            <p className="text-2xl font-bold text-green-900">{affiliates.filter(a => a.status === 'Active').length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-yellow-700">Pending Affiliates</h3>
            <p className="text-2xl font-bold text-yellow-900">{affiliates.filter(a => a.status === 'Pending').length}</p>
        </div>
      </div>

      <div className="bg-surface shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Total Sales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">High Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {affiliates.map((affiliate) => (
              <tr key={affiliate.affiliateID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-textPrimary font-medium">{affiliate.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-textSecondary">{affiliate.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    affiliate.status === 'Active' ? 'bg-green-100 text-green-800' :
                    affiliate.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {affiliate.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-textSecondary">${affiliate.currentBalance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-textSecondary">{affiliate.totalSales}</td>
                <td className="px-6 py-4 whitespace-nowrap text-textSecondary">
                  {affiliate.isHighValue ? <ShieldCheck size={18} className="text-purple-600"/> : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(affiliate)} title="Edit Affiliate">
                    <Edit3 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center">
            <TrendingUp size={22} className="mr-2 text-primary"/>Performance Analytics (Coming Soon)
        </h2>
        <p className="text-textSecondary">Charts for conversion rates, click-through rates, and top performers.</p>
      </div>
      
      <div className="bg-surface p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center">
            <AlertTriangle size={22} className="mr-2 text-red-500"/>Fraud Monitoring (Coming Soon)
        </h2>
        <p className="text-textSecondary">View affiliates with high fraud scores or suspicious activity (requires backend logic).</p>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title={`Edit Affiliate: ${editingAffiliate?.name}`} size="md">
        {editingAffiliate && (
            <form onSubmit={handleSaveChanges} className="space-y-4">
                <Input label="Name" name="name" value={editingAffiliate.name || ''} onChange={handleAffiliateInputChange} disabled />
                <Input label="Email" name="email" type="email" value={editingAffiliate.email || ''} onChange={handleAffiliateInputChange} disabled />
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-textPrimary mb-1">Status</label>
                    <select 
                        name="status" 
                        id="status"
                        value={editingAffiliate.status || 'Pending'} 
                        onChange={handleAffiliateInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <Input label="Payout Details" name="payoutDetails" value={editingAffiliate.payoutDetails || ''} onChange={handleAffiliateInputChange} />
                {/* Add commission rate input if owner can adjust it */}
                {/* <Input label="Commission Rate (e.g., 0.15 for 15%)" name="commissionRate" type="number" step="0.01" value={editingAffiliate.commissionRate || ''} onChange={handleAffiliateInputChange} /> */}
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        name="isHighValue" 
                        id="isHighValue"
                        checked={editingAffiliate.isHighValue || false} 
                        onChange={handleAffiliateInputChange} 
                        className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded"
                    />
                    <label htmlFor="isHighValue" className="ml-2 block text-sm text-textPrimary">Flag as High Value Affiliate</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCloseEditModal} disabled={isSaving}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>Save Changes</Button>
                </div>
            </form>
        )}
      </Modal>

    </div>
  );
};

export default OwnerAffiliateOversightPage;
