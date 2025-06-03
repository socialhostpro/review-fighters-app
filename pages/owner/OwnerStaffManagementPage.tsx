import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { staffService } from '../../services/staffService'; // Assuming this exists
import { StaffMember, UserRole, StaffInternalRole } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { AlertTriangle, Users, UserPlus, Edit3, Briefcase, BarChartHorizontal, Lock } from 'lucide-react';

const OwnerStaffManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffMember> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newStaffPassword, setNewStaffPassword] = useState('');


  const fetchStaffMembers = useCallback(async () => {
    if (!user || user.role !== UserRole.OWNER) {
      setError("Access denied.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await staffService.getAllStaffMembers();
      setStaffMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staff members.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStaffMembers();
  }, [fetchStaffMembers]);

  const handleOpenModal = (staffMember?: StaffMember) => {
    setEditingStaff(staffMember ? { ...staffMember } : { name: '', email: '', internalRole: 'Support', team: '' });
    setNewStaffPassword(''); // Clear password field for new/edit
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingStaff(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff || !user) return;
    setIsSaving(true);
    try {
      if (editingStaff.staffId) {
        // Update existing staff member
        await staffService.updateStaffMember(editingStaff.staffId, editingStaff);
        const updatedStaff = staffMembers.map(sm => 
          sm.staffId === editingStaff.staffId ? {...sm, ...editingStaff} : sm
        );
        setStaffMembers(updatedStaff);
      } else {
        // Create new staff member with invitation
        const newStaff = await staffService.createStaffMember({
          ...editingStaff,
          sendInvite: true // This will trigger password generation and email
        });
        setStaffMembers(prev => [...prev, newStaff]);
      }
      handleCloseModal();
    } catch (err) {
      alert(`Error saving staff member: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async (staffId: string) => {
    if (window.confirm('Are you sure you want to reset this user\'s password? A new password will be generated and sent to their email.')) {
      try {
        await staffService.resetStaffPassword(staffId);
        alert('Password has been reset and sent to the user\'s email.');
      } catch (error) {
        alert(`Failed to reset password: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  // Deactivation would be a status change, not outright deletion usually
  const handleDeactivateStaff = async (staffId: string) => {
    if (!window.confirm("Are you sure you want to deactivate this staff member? This typically involves changing their user role or status.")) return;
    // await staffService.deactivateStaffMember(staffId);
    console.log("Mock deactivating staff:", staffId);
    // fetchStaffMembers();
  };


  if (isLoading && staffMembers.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error Loading Staff Data</h2>
        <p className="text-textSecondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
            <Briefcase size={32} className="text-primary"/>
            <h1 className="text-3xl font-bold text-textPrimary">Staff Management</h1>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<UserPlus size={18}/>}>
          Add New Staff
        </Button>
      </div>

      <div className="bg-surface shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {staffMembers.map((staff) => (
              <tr key={staff.staffId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-textPrimary font-medium">{staff.name} {staff.isOwner && <span className="text-xs text-purple-600">(Owner)</span>}</td>
                <td className="px-6 py-4 whitespace-nowrap text-textSecondary">{staff.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-textSecondary">{staff.internalRole}</td>
                <td className="px-6 py-4 whitespace-nowrap text-textSecondary">{staff.team || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResetPassword(staff.staffId)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Reset Password"
                    >
                      <Lock size={16} />
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(staff)} title="Edit Staff Details">
                      <Edit3 size={16} />
                    </Button>
                  </div>
                  {/* Add deactivate/activate button based on status */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-surface p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center">
            <BarChartHorizontal size={22} className="mr-2 text-primary"/>Team Workload Overview (Coming Soon)
        </h2>
        <p className="text-textSecondary">Aggregated data from tasks and support tickets to show workload by staff/team.</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStaff?.staffId ? 'Edit Staff Member' : 'Add New Staff Member'} size="md">
        {editingStaff && (
            <form onSubmit={handleSaveChanges} className="space-y-4">
                <Input label="Full Name" name="name" value={editingStaff.name || ''} onChange={handleInputChange} required />
                <Input label="Email Address" name="email" type="email" value={editingStaff.email || ''} onChange={handleInputChange} required />
                {!editingStaff.staffId && ( // Only show password for new staff
                    <Input label="Password" name="password" type="password" value={newStaffPassword} onChange={(e) => setNewStaffPassword(e.target.value)} required />
                )}
                 <div>
                    <label htmlFor="internalRole" className="block text-sm font-medium text-textPrimary mb-1">Internal Role</label>
                    <select 
                        name="internalRole" 
                        id="internalRole"
                        value={editingStaff.internalRole || 'Support'} 
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        {(['Support', 'Manager', 'Reviewer', 'Admin'] as StaffInternalRole[]).map(role => (
                           <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                <Input label="Team (Optional)" name="team" value={editingStaff.team || ''} onChange={handleInputChange} />
                {/* Add more fields as needed, e.g., permissions */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSaving}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {editingStaff.staffId ? 'Save Changes' : 'Create Staff Member'}
                    </Button>
                </div>
            </form>
        )}
      </Modal>

    </div>
  );
};

export default OwnerStaffManagementPage;
