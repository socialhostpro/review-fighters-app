
import React from 'react';
import { Settings as SettingsIcon, UserCircle, Bell, Palette } from 'lucide-react';

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
  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center mb-8">
        <SettingsIcon size={32} className="text-primary mr-3" />
        <h1 className="text-3xl font-bold text-textPrimary">Application Settings</h1>
      </div>

      <SettingsSection title="Account Settings" icon={<UserCircle size={24} className="text-secondary" />}>
        <p className="text-textSecondary">Manage your account preferences and security.</p>
        <div className="pt-2">
          <button className="text-primary hover:underline">Change Password (Coming Soon)</button>
        </div>
        <div className="pt-2">
          <button className="text-primary hover:underline">Two-Factor Authentication (Coming Soon)</button>
        </div>
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