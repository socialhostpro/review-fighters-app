import React, { useState } from 'react';
import { Shield, Users, Settings, Check, X, Edit3, Save, RotateCcw } from 'lucide-react';
import { UserRole } from '../../types';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermission {
  role: UserRole;
  permissions: Set<string>;
}

const AdminRolePermissionsPage: React.FC = () => {
  // Define all available permissions
  const allPermissions: Permission[] = [
    // Dashboard & Core Features
    { id: 'view_dashboard', name: 'View Dashboard', description: 'Access main dashboard', category: 'Core' },
    { id: 'view_reviews', name: 'View Reviews', description: 'Access reviews page', category: 'Core' },
    { id: 'manage_reviews', name: 'Manage Reviews', description: 'Create, edit, delete reviews', category: 'Core' },
    { id: 'view_media', name: 'View Media', description: 'Access media library', category: 'Core' },
    { id: 'manage_media', name: 'Manage Media', description: 'Upload, edit, delete media', category: 'Core' },
    { id: 'view_profile', name: 'View Profile', description: 'Access user profile', category: 'Core' },
    { id: 'edit_profile', name: 'Edit Profile', description: 'Modify user profile', category: 'Core' },
    { id: 'view_chat', name: 'View Chat', description: 'Access chat/support system', category: 'Core' },

    // User Management
    { id: 'view_users', name: 'View Users', description: 'View user list and details', category: 'User Management' },
    { id: 'create_users', name: 'Create Users', description: 'Add new users to system', category: 'User Management' },
    { id: 'edit_users', name: 'Edit Users', description: 'Modify user accounts', category: 'User Management' },
    { id: 'delete_users', name: 'Delete Users', description: 'Remove users from system', category: 'User Management' },
    { id: 'change_user_roles', name: 'Change User Roles', description: 'Modify user role assignments', category: 'User Management' },

    // Affiliate System
    { id: 'view_affiliate_dashboard', name: 'Affiliate Dashboard', description: 'Access affiliate dashboard', category: 'Affiliate' },
    { id: 'view_affiliate_tools', name: 'Marketing Tools', description: 'Access marketing resources', category: 'Affiliate' },
    { id: 'view_affiliate_stats', name: 'Affiliate Stats', description: 'View commission and performance data', category: 'Affiliate' },
    { id: 'manage_affiliates', name: 'Manage Affiliates', description: 'Admin affiliate accounts', category: 'Affiliate' },
    { id: 'approve_affiliates', name: 'Approve Affiliates', description: 'Approve affiliate applications', category: 'Affiliate' },
    { id: 'manage_payouts', name: 'Manage Payouts', description: 'Process affiliate payments', category: 'Affiliate' },

    // Staff Portal
    { id: 'view_staff_dashboard', name: 'Staff Dashboard', description: 'Access staff portal', category: 'Staff' },
    { id: 'manage_tasks', name: 'Manage Tasks', description: 'Create and assign tasks', category: 'Staff' },
    { id: 'review_items', name: 'Review Items', description: 'Review submitted content/requests', category: 'Staff' },
    { id: 'handle_support', name: 'Handle Support', description: 'Manage support tickets', category: 'Staff' },
    { id: 'view_notifications', name: 'View Notifications', description: 'Access staff notifications', category: 'Staff' },

    // Admin Features
    { id: 'view_admin_panel', name: 'Admin Panel', description: 'Access admin interface', category: 'Admin' },
    { id: 'manage_system_settings', name: 'System Settings', description: 'Configure system-wide settings', category: 'Admin' },
    { id: 'view_audit_logs', name: 'Audit Logs', description: 'View system activity logs', category: 'Admin' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Configure role permissions', category: 'Admin' },

    // Owner Features
    { id: 'view_financials', name: 'View Financials', description: 'Access financial reports', category: 'Owner' },
    { id: 'manage_staff', name: 'Manage Staff', description: 'Hire, fire, manage staff', category: 'Owner' },
    { id: 'owner_oversight', name: 'Owner Oversight', description: 'Full system oversight capabilities', category: 'Owner' },
    { id: 'edit_landing_page', name: 'Edit Landing Page', description: 'Modify public landing page', category: 'Owner' }
  ];

  // Default role permissions matrix
  const defaultRolePermissions: RolePermission[] = [
    {
      role: UserRole.USER,
      permissions: new Set([
        'view_dashboard', 'view_reviews', 'manage_reviews', 'view_media', 'manage_media',
        'view_profile', 'edit_profile', 'view_chat'
      ])
    },
    {
      role: UserRole.AFFILIATE,
      permissions: new Set([
        'view_dashboard', 'view_profile', 'edit_profile', 'view_chat',
        'view_affiliate_dashboard', 'view_affiliate_tools', 'view_affiliate_stats'
      ])
    },
    {
      role: UserRole.STAFF,
      permissions: new Set([
        'view_dashboard', 'view_reviews', 'manage_reviews', 'view_media', 'manage_media',
        'view_profile', 'edit_profile', 'view_chat', 'view_users', 'edit_users',
        'view_staff_dashboard', 'manage_tasks', 'review_items', 'handle_support', 'view_notifications'
      ])
    },
    {
      role: UserRole.ADMIN,
      permissions: new Set([
        'view_dashboard', 'view_reviews', 'manage_reviews', 'view_media', 'manage_media',
        'view_profile', 'edit_profile', 'view_chat', 'view_users', 'create_users', 'edit_users', 'delete_users',
        'manage_affiliates', 'approve_affiliates', 'view_staff_dashboard', 'manage_tasks', 'review_items',
        'handle_support', 'view_notifications', 'view_admin_panel', 'manage_system_settings', 'view_audit_logs', 'manage_roles'
      ])
    },
    {
      role: UserRole.OWNER,
      permissions: new Set([
        // Owners have access to everything
        ...allPermissions.map(p => p.id)
      ])
    }
  ];

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(defaultRolePermissions);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Group permissions by category
  const permissionsByCategory = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const togglePermission = (role: UserRole, permissionId: string) => {
    if (!isEditing) return;

    setRolePermissions(prev => prev.map(rp => {
      if (rp.role === role) {
        const newPermissions = new Set(rp.permissions);
        if (newPermissions.has(permissionId)) {
          newPermissions.delete(permissionId);
        } else {
          newPermissions.add(permissionId);
        }
        return { ...rp, permissions: newPermissions };
      }
      return rp;
    }));
    setHasChanges(true);
  };

  const hasPermission = (role: UserRole, permissionId: string): boolean => {
    const rolePermission = rolePermissions.find(rp => rp.role === role);
    return rolePermission?.permissions.has(permissionId) || false;
  };

  const saveChanges = () => {
    // In a real app, this would make an API call to save permissions
    console.log('Saving role permissions:', rolePermissions);
    setIsEditing(false);
    setHasChanges(false);
    
    // Show success message
    alert('Role permissions updated successfully!');
  };

  const resetChanges = () => {
    setRolePermissions(defaultRolePermissions);
    setHasChanges(false);
  };

  const getPermissionCount = (role: UserRole): number => {
    const rolePermission = rolePermissions.find(rp => rp.role === role);
    return rolePermission?.permissions.size || 0;
  };

  const getCategoryPermissionCount = (role: UserRole, category: string): number => {
    const rolePermission = rolePermissions.find(rp => rp.role === role);
    if (!rolePermission) return 0;
    
    const categoryPermissions = permissionsByCategory[category] || [];
    return categoryPermissions.filter(p => rolePermission.permissions.has(p.id)).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Role & Permissions Matrix</h1>
              <p className="text-gray-600">Manage access control for different user roles</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing && (
              <>
                <button
                  onClick={resetChanges}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={saveChanges}
                  disabled={!hasChanges}
                  className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </>
            )}
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isEditing 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Permissions'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.values(UserRole).map(role => (
          <div key={role} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900 capitalize">{role}</h3>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {getPermissionCount(role)}
            </div>
            <div className="text-sm text-gray-600">
              of {allPermissions.length} permissions
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Permissions Matrix</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing ? 'Click on cells to toggle permissions' : 'View current role permissions'}
          </p>
        </div>

        <div className="overflow-x-auto">
          {Object.entries(permissionsByCategory).map(([category, permissions]) => (
            <div key={category} className="border-b last:border-b-0">
              {/* Category Header */}
              <div className="bg-gray-100 px-6 py-3 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    {Object.values(UserRole).map(role => (
                      <span key={role} className="min-w-[60px] text-center capitalize">
                        {getCategoryPermissionCount(role, category)}/{permissions.length}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Permission Rows */}
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-center hover:bg-gray-50">
                  {/* Permission Info */}
                  <div className="flex-1 px-6 py-3">
                    <div className="font-medium text-gray-900">{permission.name}</div>
                    <div className="text-sm text-gray-600">{permission.description}</div>
                  </div>

                  {/* Role Permissions */}
                  {Object.values(UserRole).map(role => (
                    <div key={role} className="w-20 px-3 py-3 text-center border-l">
                      <button
                        onClick={() => togglePermission(role, permission.id)}
                        disabled={!isEditing}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          hasPermission(role, permission.id)
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        } ${isEditing ? 'cursor-pointer' : 'cursor-default'} ${
                          !isEditing ? 'opacity-75' : ''
                        }`}
                        title={`${role} ${hasPermission(role, permission.id) ? 'has' : 'does not have'} ${permission.name}`}
                      >
                        {hasPermission(role, permission.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
            <span className="text-gray-700">Permission granted</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <X className="h-4 w-4" />
            </div>
            <span className="text-gray-700">Permission denied</span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use This Page</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• View current permissions for each role in the matrix above</li>
          <li>• Click "Edit Permissions" to modify role access</li>
          <li>• Toggle individual permissions by clicking the check/cross icons</li>
          <li>• Save changes to apply new permission settings</li>
          <li>• Owner role automatically has access to all features</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminRolePermissionsPage; 