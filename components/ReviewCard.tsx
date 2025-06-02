
import React from 'react';
import { Review } from '../types';
import { Star, User, MessageSquare, Briefcase, HelpCircle, FileText, Trash2, Edit3 } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
  onViewMedia: (review: Review) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete, onViewMedia }) => {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={16} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
    ));
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-primary">{review.reviewerName}</h3>
          <p className="text-xs text-textSecondary">Source: {review.reviewerSource} | Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center">{renderStars(review.rating)}</div>
      </div>

      <p className="text-textPrimary mb-4 leading-relaxed">{review.reviewContent}</p>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center text-textSecondary">
          <User size={16} className="mr-2 text-primary-light" />
          <span>Customer: <span className={review.isCustomer ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{review.isCustomer ? 'Yes' : 'No'}</span></span>
        </div>
        {typeof review.isFormerEmployee !== 'undefined' && (
          <div className="flex items-center text-textSecondary">
            <Briefcase size={16} className="mr-2 text-primary-light" />
            <span>Former Employee: <span className={review.isFormerEmployee ? "text-orange-600 font-semibold" : "text-textSecondary"}>{review.isFormerEmployee ? 'Yes' : 'No'}</span></span>
          </div>
        )}
         <div className="flex items-center text-textSecondary">
            <HelpCircle size={16} className="mr-2 text-primary-light" />
          <span>Knows Reviewer: <span className={review.knowsReviewerIdentity ? "text-green-600 font-semibold" : "text-textSecondary"}>{review.knowsReviewerIdentity ? 'Yes' : 'No'}</span></span>
        </div>
        {review.reviewerRelationship && (
          <div className="flex items-start text-textSecondary">
            <MessageSquare size={16} className="mr-2 mt-1 text-primary-light flex-shrink-0" />
            <p>Relationship: <span className="text-textPrimary">{review.reviewerRelationship}</span></p>
          </div>
        )}
      </div>
      
      {review.knowsReviewerIdentity && review.reviewerDetails && (
        <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
          <h4 className="text-xs font-semibold text-textSecondary uppercase mb-1">Reviewer Details:</h4>
          <ul className="space-y-1 text-xs text-textPrimary">
            {review.reviewerDetails.handle && <li>Handle: {review.reviewerDetails.handle}</li>}
            {review.reviewerDetails.name && <li>Name: {review.reviewerDetails.name}</li>}
            {review.reviewerDetails.email && <li>Email: {review.reviewerDetails.email}</li>}
            {review.reviewerDetails.phone && <li>Phone: {review.reviewerDetails.phone}</li>}
            {review.reviewerDetails.address && <li>Address: {review.reviewerDetails.address}</li>}
            {review.reviewerDetails.notes && <li className="mt-1">Notes: <span className="italic">{review.reviewerDetails.notes}</span></li>}
          </ul>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        {review.associatedMediaIds && review.associatedMediaIds.length > 0 && (
          <button 
            onClick={() => onViewMedia(review)} 
            className="text-xs flex items-center text-primary hover:text-primary-dark p-2 rounded hover:bg-primary-light/10 transition-colors"
            title="View Associated Media"
          >
            <FileText size={16} className="mr-1" /> ({review.associatedMediaIds.length})
          </button>
        )}
        <button 
            onClick={() => onEdit(review)} 
            className="text-xs flex items-center text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-100 transition-colors"
            title="Edit Review"
        >
            <Edit3 size={16} />
        </button>
        <button 
            onClick={() => onDelete(review.id)} 
            className="text-xs flex items-center text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-100 transition-colors"
            title="Delete Review"
        >
            <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
    