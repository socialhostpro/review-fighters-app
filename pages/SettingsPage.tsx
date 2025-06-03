import React, { useState } from 'react';
import { Settings as SettingsIcon, UserCircle, Bell, Palette, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Input from '../components/Input';

const SettingsSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-surface p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-textPrimary ml-3">{title}</h2>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await authService.changePassword(user.id, currentPassword, newPassword);
      setSuccess('Password changed successfully');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center mb-8">
        <SettingsIcon size={32} className="text-primary mr-3" />
        <h1 className="text-3xl font-bold text-textPrimary">Application Settings</h1>
      </div>

      <SettingsSection title="Account Settings" icon={<UserCircle size={24} className="text-secondary" />}>
        <p className="text-textSecondary">Manage your account preferences and security.</p>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <p className="font-bold">Success</p>
            <p>{success}</p>
          </div>
        )}

        {isChangingPassword ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setError(null);
                  setSuccess(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <Lock size={16} className="mr-2" />
            Change Password
          </button>
        )}
      </SettingsSection>

      <SettingsSection title="Notification Preferences" icon={<Bell size={24} className="text-secondary" />}>
        <p className="text-textSecondary">Control how you receive notifications from the application.</p>
        <div className="flex items-center justify-between pt-2">
          <label htmlFor="emailNotifications" className="text-textPrimary">Email Notifications for New Reviews</label>
          <input type="checkbox" id="emailNotifications" className="form-checkbox h-5 w-5 text-primary focus:ring-primary-light cursor-not-allowed" disabled checked />
        </div>
        <div className="flex items-center justify-between pt-2">
          <label htmlFor="aiSummaryNotifications" className="text-textPrimary">Weekly AI Summary Digest</label>
          <input type="checkbox" id="aiSummaryNotifications" className="form-checkbox h-5 w-5 text-primary focus:ring-primary-light cursor-not-allowed" disabled />
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance" icon={<Palette size={24} className="text-secondary" />}>
        <p className="text-textSecondary">Customize the look and feel of the application.</p>
        <div className="pt-2">
          <p className="text-textPrimary">Theme Selection: Light (Default) / Dark (Coming Soon)</p>
        </div>
      </SettingsSection>

      <SettingsSection title="Data Management" icon={<SettingsIcon size={24} className="text-secondary" />}>
        <p className="text-textSecondary">Manage your application data.</p>
        <div className="pt-2">
          <button className="text-primary hover:underline">Export My Data (Coming Soon)</button>
        </div>
        <div className="pt-2">
          <button className="text-red-600 hover:underline">Delete My Account (Coming Soon - Use with caution)</button>
        </div>
      </SettingsSection>

      <div className="text-center text-textSecondary mt-10">
        <p>More settings and customizations will be available soon.</p>
      </div>
    </div>
  );
};

export default SettingsPage;