
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ownerService } from '../../services/ownerService';
import { SystemSetting, UserRole, SystemSettingCategory } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea'; // Assuming you have this
import { AlertTriangle, Settings, Save, Filter } from 'lucide-react';

interface SettingRowProps {
  setting: SystemSetting;
  onUpdate: (settingID: string, newValue: string) => void;
}

const SettingRow: React.FC<SettingRowProps> = ({ setting, onUpdate }) => {
  const [currentValue, setCurrentValue] = useState(setting.value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(setting.settingID, currentValue);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setCurrentValue(setting.value); // Reset to original
    setIsEditing(false);
  };

  return (
    <tr className="hover:bg-gray-50 text-sm">
      <td className="px-4 py-3 whitespace-nowrap text-textPrimary font-medium" title={setting.settingID}>{setting.settingName}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{setting.category}</td>
      <td className="px-4 py-3 text-textSecondary max-w-sm">
        {isEditing ? (
          <Input 
            type={setting.settingID.toLowerCase().includes('commission') || setting.settingID.toLowerCase().includes('threshold') ? 'number' : 'text'}
            value={currentValue} 
            onChange={(e) => setCurrentValue(e.target.value)}
            className="py-1 text-sm"
            containerClassName="!mb-0"
          />
        ) : (
          <span className="truncate" title={setting.value}>{setting.value}</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-textSecondary truncate max-w-xs" title={setting.description}>{setting.description}</td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        {isEditing ? (
          <div className="space-x-2">
            <Button size="sm" variant="primary" onClick={handleSave} leftIcon={<Save size={14}/>}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </td>
    </tr>
  );
};


const OwnerSystemSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<SystemSettingCategory | ''>('');

  const fetchSettings = useCallback(async () => {
    if (!user || user.role !== UserRole.OWNER) {
      setError("Access denied.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await ownerService.getSystemSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load system settings.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpdateSetting = async (settingID: string, newValue: string) => {
    if (!user || !user.staffId) {
        alert("User information missing for update.");
        return;
    }
    try {
      await ownerService.updateSystemSetting(settingID, newValue, user.staffId);
      fetchSettings(); // Refresh list
    } catch (err) {
      alert(`Error updating setting: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const filteredSettings = settings.filter(s => !filterCategory || s.category === filterCategory);

  if (isLoading && settings.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error Loading Settings</h2>
        <p className="text-textSecondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center space-x-3">
        <Settings size={32} className="text-primary"/>
        <h1 className="text-3xl font-bold text-textPrimary">System Configuration</h1>
      </div>
      <p className="text-textSecondary">Manage global settings for the application.</p>

      <div className="bg-surface p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
            <Filter size={20} className="text-textSecondary"/>
            <label htmlFor="categoryFilter" className="text-sm font-medium text-textPrimary">Filter by Category:</label>
            <select
                id="categoryFilter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as SystemSettingCategory | '')}
                className="p-2 border border-gray-300 rounded-md sm:text-sm focus:ring-primary focus:border-primary"
            >
                <option value="">All Categories</option>
                {Object.values(SystemSettingCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>

        {isLoading && settings.length > 0 && <div className="my-4 text-center"><LoadingSpinner /></div>}

        {filteredSettings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Setting Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSettings.map((setting) => (
                  <SettingRow key={setting.settingID} setting={setting} onUpdate={handleUpdateSetting} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading && <p className="text-center text-textSecondary py-10">No system settings found or matching filter.</p>
        )}
      </div>
      
      {/* For future: Add New Setting Modal if applicable */}
    </div>
  );
};

export default OwnerSystemSettingsPage;
