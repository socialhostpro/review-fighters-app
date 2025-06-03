import React, { useState } from 'react';
import { 
  Search, Filter, Eye, MessageSquare, Flag, CheckCircle, XCircle, 
  Star, Calendar, User, Building, Image, FileText, Clock, ChevronDown,
  AlertTriangle, ThumbsUp, ThumbsDown, MoreHorizontal, Trash2, Edit2
} from 'lucide-react';

interface ReviewAssignment {
  id: string;
  reviewId: string;
  assignedStaffId: string;
  assignedOwnerId: string;
  assignedAt: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
}

interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  businessId: string;
  businessName: string;
  rating: number;
  title: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
  source: 'app' | 'google' | 'yelp' | 'facebook';
  isVerified: boolean;
  assignment: ReviewAssignment;
}

// Mock review data
const mockReviews: Review[] = [
  {
    id: 'rev_001',
    customerId: 'cust_001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    businessId: 'biz_001',
    businessName: 'Pizza Palace Downtown',
    rating: 5,
    title: 'Amazing food and service!',
    content: 'Had an incredible dining experience. The pizza was perfect, staff was friendly, and the atmosphere was great. Will definitely be coming back!',
    mediaUrls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    source: 'app',
    isVerified: true,
    assignment: {
      id: 'assign_001',
      reviewId: 'rev_001',
      assignedStaffId: 'staff_001',
      assignedOwnerId: 'owner_001',
      assignedAt: '2024-01-15T10:31:00Z',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-01-17T10:30:00Z'
    }
  },
  {
    id: 'rev_002',
    customerId: 'cust_002', 
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    businessId: 'biz_002',
    businessName: 'Coffee Corner Cafe',
    rating: 2,
    title: 'Disappointing experience',
    content: 'Coffee was cold, service was slow, and the place was dirty. Very disappointed with my visit.',
    mediaUrls: ['https://example.com/complaint1.jpg'],
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
    source: 'google',
    isVerified: false,
    assignment: {
      id: 'assign_002',
      reviewId: 'rev_002',
      assignedStaffId: 'staff_001',
      assignedOwnerId: 'owner_002',
      assignedAt: '2024-01-14T15:46:00Z',
      status: 'flagged',
      priority: 'high',
      dueDate: '2024-01-15T15:45:00Z'
    }
  },
  {
    id: 'rev_003',
    customerId: 'cust_003',
    customerName: 'Mike Wilson',
    customerEmail: 'mike.w@email.com',
    businessId: 'biz_001',
    businessName: 'Pizza Palace Downtown',
    rating: 4,
    title: 'Good food, could be better',
    content: 'Overall good experience. Pizza was tasty but took a while to arrive. Staff was helpful.',
    mediaUrls: [],
    createdAt: '2024-01-13T12:20:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
    source: 'yelp',
    isVerified: true,
    assignment: {
      id: 'assign_003',
      reviewId: 'rev_003',
      assignedStaffId: 'staff_001',
      assignedOwnerId: 'owner_001',
      assignedAt: '2024-01-13T12:21:00Z',
      status: 'approved',
      priority: 'low',
      dueDate: '2024-01-15T12:20:00Z'
    }
  }
];

const StaffReviewManagementPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected' | 'flagged'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'app' | 'google' | 'yelp' | 'facebook'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Filter reviews based on search and filters
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.assignment.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesSource = sourceFilter === 'all' || review.source === sourceFilter;
    const matchesPriority = priorityFilter === 'all' || review.assignment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesRating && matchesSource && matchesPriority;
  });

  const handleStatusChange = (reviewId: string, newStatus: 'pending' | 'in_review' | 'approved' | 'rejected' | 'flagged') => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, assignment: { ...review.assignment, status: newStatus } }
        : review
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      flagged: 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600 mt-1">Manage assigned customer reviews and media</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2">
            <Flag size={20} />
            Flag Review
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search reviews, customers, businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="app">App</option>
            <option value="google">Google</option>
            <option value="yelp">Yelp</option>
            <option value="facebook">Facebook</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{reviews.filter(r => r.assignment.status === 'pending').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-orange-600">{reviews.filter(r => r.assignment.status === 'flagged').length}</p>
            </div>
            <Flag className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{reviews.filter(r => r.assignment.status === 'approved').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-blue-600">{(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{review.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2 mt-1">{review.content}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            review.source === 'app' ? 'bg-blue-100 text-blue-800' :
                            review.source === 'google' ? 'bg-red-100 text-red-800' :
                            review.source === 'yelp' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {review.source.charAt(0).toUpperCase() + review.source.slice(1)}
                          </span>
                          {review.mediaUrls.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Image size={12} />
                              {review.mediaUrls.length} media
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{review.customerName}</div>
                      <div className="text-sm text-gray-500">{review.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{review.businessName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {getRatingStars(review.rating)}
                      <span className="text-sm text-gray-600 ml-1">{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(review.assignment.status)}
                  </td>
                  <td className="px-6 py-4">
                    {getPriorityBadge(review.assignment.priority)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {new Date(review.assignment.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {setSelectedReview(review); setShowReviewModal(true);}}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Approve"
                        disabled={review.assignment.status === 'approved'}
                      >
                        <CheckCircle size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Reject"
                        disabled={review.assignment.status === 'rejected'}
                      >
                        <XCircle size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleStatusChange(review.id, 'flagged')}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                        title="Flag for review"
                      >
                        <Flag size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Review Detail Modal */}
      {showReviewModal && selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => {setShowReviewModal(false); setSelectedReview(null);}}
          onStatusChange={(newStatus) => {
            handleStatusChange(selectedReview.id, newStatus);
            setShowReviewModal(false);
            setSelectedReview(null);
          }}
        />
      )}
    </div>
  );
};

// Review Detail Modal Component
interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onStatusChange: (status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'flagged') => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose, onStatusChange }) => {
  const getRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={20} 
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{review.title}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  {getRatingStars(review.rating)}
                  <span className="text-lg font-semibold ml-2">{review.rating}/5</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  review.source === 'app' ? 'bg-blue-100 text-blue-800' :
                  review.source === 'google' ? 'bg-red-100 text-red-800' :
                  review.source === 'yelp' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {review.source.charAt(0).toUpperCase() + review.source.slice(1)}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Review Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer</label>
                  <p className="text-gray-900">{review.customerName}</p>
                  <p className="text-sm text-gray-500">{review.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Business</label>
                  <p className="text-gray-900">{review.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Review Content</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{review.content}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900">{new Date(review.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {review.mediaUrls.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Attached Media</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {review.mediaUrls.map((url, index) => (
                      <div key={index} className="border rounded-lg p-4 text-center">
                        <Image className="mx-auto mb-2 text-gray-400" size={32} />
                        <p className="text-sm text-gray-600">Image {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Assignment Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      review.assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      review.assignment.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                      review.assignment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      review.assignment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {review.assignment.status.charAt(0).toUpperCase() + review.assignment.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      review.assignment.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                      review.assignment.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                      review.assignment.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {review.assignment.priority.charAt(0).toUpperCase() + review.assignment.priority.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned Date</label>
                  <p className="text-gray-900">{new Date(review.assignment.assignedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p className="text-gray-900">{new Date(review.assignment.dueDate).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onStatusChange('approved')}
                    className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => onStatusChange('rejected')}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => onStatusChange('in_review')}
                    className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    <Eye size={16} />
                    Mark In Review
                  </button>
                  <button
                    onClick={() => onStatusChange('flagged')}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                  >
                    <Flag size={16} />
                    Flag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffReviewManagementPage; 