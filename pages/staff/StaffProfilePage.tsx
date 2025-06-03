import React, { useState } from 'react';
import { User, Badge, Calendar, Clock, MapPin, Phone, Mail, Edit3, Save, X, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const StaffProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: 'Staff Member',
    email: 'staff@reviewfighters.com',
    phone: '+1 (555) 123-4567',
    department: 'Customer Support',
    location: 'Remote',
    startDate: '2024-01-15',
    employeeId: 'ST-2024-001',
    workHours: '9:00 AM - 5:00 PM PST',
    bio: 'Dedicated customer support specialist with 3+ years of experience helping customers resolve issues and improve their experience.'
  });

  // Mock staff data - in real app this would come from API
  const staffData = {
    profile: editedProfile,
    stats: {
      ticketsResolved: 1247,
      averageResponseTime: '2.3 hours',
      customerSatisfaction: 4.8,
      tasksCompleted: 89,
      itemsReviewed: 156
    },
    permissions: [
      'View Support Tickets',
      'Resolve Customer Issues',
      'Access Staff Dashboard',
      'Review Items',
      'Manage Tasks',
      'View Notifications'
    ],
    recentActivity: [
      { id: 1, action: 'Resolved ticket #2847', time: '2 hours ago' },
      { id: 2, action: 'Completed task: Content Review', time: '4 hours ago' },
      { id: 3, action: 'Updated customer profile', time: '1 day ago' },
      { id: 4, action: 'Approved refund request', time: '2 days ago' }
    ]
  };

  const handleSave = () => {
    // In real app, this would make an API call to update staff profile
    console.log('Saving staff profile:', editedProfile);
    setIsEditing(false);
    alert('Staff profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedProfile(staffData.profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Profile</h1>
              <p className="text-gray-600">Manage your staff account and information</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                {isEditing ? (
                  <select
                    value={editedProfile.department}
                    onChange={(e) => setEditedProfile({...editedProfile, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Customer Support">Customer Support</option>
                    <option value="Content Review">Content Review</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{editedProfile.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Hours</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.workHours}
                    onChange={(e) => setEditedProfile({...editedProfile, workHours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedProfile.workHours}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.bio}</p>
              )}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{staffData.stats.ticketsResolved}</p>
                <p className="text-sm text-gray-600">Tickets Resolved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{staffData.stats.customerSatisfaction}</p>
                <p className="text-sm text-gray-600">Customer Rating</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{staffData.stats.averageResponseTime}</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {staffData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Employment Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Employment Details</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Employee ID</p>
                  <p className="text-sm text-gray-600">{editedProfile.employeeId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Start Date</p>
                  <p className="text-sm text-gray-600">{editedProfile.startDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Role</p>
                  <p className="text-sm text-gray-600">Staff Member</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Permissions</h3>
            <div className="space-y-2">
              {staffData.permissions.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-blue-600">{staffData.stats.tasksCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Items Reviewed</p>
                <p className="text-2xl font-bold text-green-600">{staffData.stats.itemsReviewed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfilePage; 