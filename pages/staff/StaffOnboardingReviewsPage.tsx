import React, { useState, useEffect } from 'react';
import { Building2, Clock, CheckCircle, XCircle, Eye, User, Phone, Mail, MapPin, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { onboardingService } from '../../services/onboardingService';
import { useAuth } from '../../hooks/useAuth';
import { OnboardingApplication, OnboardingBusinessInfo, OnboardingSubscription, OnboardingTask } from '../../types';

interface ApplicationWithDetails {
  application: OnboardingApplication;
  businessInfo: OnboardingBusinessInfo | null;
  subscription: OnboardingSubscription | null;
}

const StaffOnboardingReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [myTasks, setMyTasks] = useState<OnboardingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithDetails | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get my onboarding tasks
      const staffId = user?.staffId || 'STAFF_001'; // Fallback for demo
      const tasks = await onboardingService.getTasksForStaff(staffId);
      setMyTasks(tasks);

      // Get pending applications
      const pendingApps = await onboardingService.getAllPendingApplications();
      
      // Get details for each application
      const appsWithDetails = await Promise.all(
        pendingApps.map(async (app) => {
          const [businessInfo, subscription] = await Promise.all([
            onboardingService.getBusinessInfo(app.applicationId),
            onboardingService.getSubscription(app.applicationId)
          ]);
          
          return {
            application: app,
            businessInfo,
            subscription
          };
        })
      );

      setApplications(appsWithDetails);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    try {
      const staffId = user?.staffId || 'STAFF_001';
      await onboardingService.acceptReviewTask(taskId, staffId);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to accept task:', error);
    }
  };

  const handleCompleteReview = async (approved: boolean) => {
    if (!selectedApplication) return;
    
    const task = myTasks.find(t => 
      t.applicationId === selectedApplication.application.applicationId && 
      t.status === 'In Progress'
    );
    
    if (!task) return;

    try {
      setIsReviewing(true);
      await onboardingService.completeReview(
        task.taskId, 
        approved, 
        reviewNotes || undefined,
        approved ? undefined : rejectionReason
      );
      
      setSelectedApplication(null);
      setReviewNotes('');
      setRejectionReason('');
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to complete review:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Subscription_Confirmed': { color: 'bg-blue-100 text-blue-800', label: 'Ready for Review' },
      'Under_Review': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      'Approved': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'Rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'High': { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      'Medium': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Low': { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || 
                  { color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {priority}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Reviews</h1>
        <p className="text-gray-600">Review and manage customer reviews from Google, Facebook, Yelp, and other platforms</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Response</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.application.status === 'Subscription_Confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.application.status === 'Under_Review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Active Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {myTasks.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pending Reviews</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews to process</h3>
              <p className="text-gray-600">All reviews have been handled.</p>
            </div>
          ) : (
            applications.map((appData) => {
              const { application, businessInfo, subscription } = appData;
              const myTask = myTasks.find(t => t.applicationId === application.applicationId);
              
              return (
                <div key={application.applicationId} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {businessInfo?.businessName || 'Unknown Business'}
                        </h3>
                        {getStatusBadge(application.status)}
                        {getPriorityBadge(application.priority)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{businessInfo?.businessType || 'Unknown Type'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {formatDate(application.submissionDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{subscription?.planType || 'No Plan'} - ${subscription?.amount || 0}/mo</span>
                        </div>
                      </div>

                      {myTask && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Your Task:</strong> {myTask.title}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Status: {myTask.status} | Due: {myTask.dueDate ? formatDate(myTask.dueDate) : 'No due date'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      {myTask && myTask.status === 'To Do' && (
                        <button
                          onClick={() => handleAcceptTask(myTask.taskId)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          Accept Task
                        </button>
                      )}
                      
                      <button
                        onClick={() => setSelectedApplication(appData)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <Eye className="h-4 w-4 inline mr-2" />
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Review Application</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Business Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Business Name:</span>
                      <p className="text-gray-900">{selectedApplication.businessInfo?.businessName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Business Type:</span>
                      <p className="text-gray-900">{selectedApplication.businessInfo?.businessType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Description:</span>
                      <p className="text-gray-900">{selectedApplication.businessInfo?.businessDescription}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Website:</span>
                      <p className="text-gray-900">{selectedApplication.businessInfo?.website || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Contact:</span>
                      <p className="text-gray-900">
                        <Mail className="inline h-4 w-4 mr-1" />
                        {selectedApplication.businessInfo?.email}
                      </p>
                      <p className="text-gray-900">
                        <Phone className="inline h-4 w-4 mr-1" />
                        {selectedApplication.businessInfo?.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Address:</span>
                      <p className="text-gray-900">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        {selectedApplication.businessInfo?.address}, {selectedApplication.businessInfo?.city}, {selectedApplication.businessInfo?.state} {selectedApplication.businessInfo?.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Plan:</span>
                      <p className="text-gray-900">{selectedApplication.subscription?.planType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Billing:</span>
                      <p className="text-gray-900">${selectedApplication.subscription?.amount} / {selectedApplication.subscription?.billingCycle}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Confirmed:</span>
                      <p className="text-gray-900">{selectedApplication.subscription?.confirmedDate ? formatDate(selectedApplication.subscription.confirmedDate) : 'Not confirmed'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Actions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Status</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Current Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedApplication.application.status)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submitted:</span>
                      <p className="text-gray-900">{formatDate(selectedApplication.application.submissionDate)}</p>
                    </div>
                    {selectedApplication.application.reviewStartedDate && (
                      <div>
                        <span className="font-medium text-gray-700">Review Started:</span>
                        <p className="text-gray-900">{formatDate(selectedApplication.application.reviewStartedDate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="Add your review notes here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Reason for rejection (required if rejecting)"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleCompleteReview(true)}
                    disabled={isReviewing}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                  >
                    {isReviewing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleCompleteReview(false)}
                    disabled={isReviewing || !rejectionReason.trim()}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
                  >
                    {isReviewing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOnboardingReviewsPage; 