
import React, { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react';
import { Review, MediaItem } from '../types';
import { reviewService } from '../services/reviewService';
import { mediaService } from '../services/mediaService'; // Corrected import
import { useAuth } from '../hooks/useAuth';
import ReviewCard from '../components/ReviewCard';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Textarea from '../components/Textarea'; // Imported Textarea
import { PlusCircle, Search, Filter as FilterIcon, Image as ImageIcon, X } from 'lucide-react';

// Define ReviewForm component inside or outside, ensure it's not re-declared on re-renders if stateful
const ReviewFormFields: React.FC<{
  formData: Partial<Review>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onReviewerDetailsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ formData, onFormChange, onReviewerDetailsChange }) => {
  return (
    <>
      <Input label="Reviewer Name" name="reviewerName" value={formData.reviewerName || ''} onChange={onFormChange} required />
      <Input label="Rating (1-5)" name="rating" type="number" min="1" max="5" value={formData.rating || ''} onChange={onFormChange} required />
      <Textarea label="Review Content" name="reviewContent" value={formData.reviewContent || ''} onChange={onFormChange} required />
      <Input label="Reviewer Source (e.g., Google)" name="reviewerSource" value={formData.reviewerSource || ''} onChange={onFormChange} />
      
      <div className="flex items-center space-x-4 my-4">
        <label className="flex items-center">
          <input type="checkbox" name="isCustomer" checked={formData.isCustomer || false} onChange={onFormChange} className="form-checkbox h-5 w-5 text-primary focus:ring-primary-light" />
          <span className="ml-2 text-textPrimary">Is Customer?</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" name="isFormerEmployee" checked={formData.isFormerEmployee || false} onChange={onFormChange} className="form-checkbox h-5 w-5 text-primary focus:ring-primary-light" />
          <span className="ml-2 text-textPrimary">Is Former Employee?</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" name="knowsReviewerIdentity" checked={formData.knowsReviewerIdentity || false} onChange={onFormChange} className="form-checkbox h-5 w-5 text-primary focus:ring-primary-light" />
          <span className="ml-2 text-textPrimary">Know Reviewer Identity?</span>
        </label>
      </div>

      {formData.knowsReviewerIdentity && (
        <div className="p-4 border border-gray-200 rounded-md mt-2 space-y-3 bg-gray-50">
          <h4 className="text-md font-semibold text-textPrimary">Reviewer Details</h4>
          <Input label="Reviewer Handle" name="handle" value={formData.reviewerDetails?.handle || ''} onChange={onReviewerDetailsChange} containerClassName="mb-2" />
          <Input label="Reviewer Full Name" name="name" value={formData.reviewerDetails?.name || ''} onChange={onReviewerDetailsChange} containerClassName="mb-2" />
          <Input label="Reviewer Email" name="email" type="email" value={formData.reviewerDetails?.email || ''} onChange={onReviewerDetailsChange} containerClassName="mb-2" />
          <Input label="Reviewer Phone" name="phone" type="tel" value={formData.reviewerDetails?.phone || ''} onChange={onReviewerDetailsChange} containerClassName="mb-2" />
          <Input label="Reviewer Address" name="address" value={formData.reviewerDetails?.address || ''} onChange={onReviewerDetailsChange} containerClassName="mb-2" />
          <Textarea label="Notes about Reviewer" name="notes" value={formData.reviewerDetails?.notes || ''} onChange={onReviewerDetailsChange} containerClassName="!mb-0" /> {/* Used imported Textarea */}
        </div>
      )}
       <Textarea label="Relationship with Reviewer (if any)" name="reviewerRelationship" value={formData.reviewerRelationship || ''} onChange={onFormChange} /> {/* Used imported Textarea */}
    </>
  );
};


const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<{ isCustomer?: boolean; rating?: number; source?: string }>({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedReviewForMedia, setSelectedReviewForMedia] = useState<Review | null>(null);
  const [associatedMedia, setAssociatedMedia] = useState<MediaItem[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetchedReviews = await reviewService.getReviews(user.id);
      setReviews(fetchedReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleOpenModal = (reviewToEdit?: Review) => {
    setEditingReview(reviewToEdit ? { ...reviewToEdit } : { isCustomer: true }); // Default new review as customer
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditingReview(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value),
    }));
  };

  const handleReviewerDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingReview(prev => ({
      ...prev,
      reviewerDetails: {
        ...(prev?.reviewerDetails || {}),
        [name]: value,
      }
    }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !user) return;

    setIsLoading(true); // Or a specific form loading state
    try {
      if (editingReview.id) {
        await reviewService.updateReview(editingReview.id, editingReview as Review);
      } else {
        await reviewService.addReview(editingReview as Omit<Review, 'id' | 'reviewDate'>);
      }
      await fetchReviews(); // Refresh list
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save review.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this review?')) return;
    setIsLoading(true);
    try {
      await reviewService.deleteReview(reviewId);
      await fetchReviews(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMedia = async (review: Review) => {
    setSelectedReviewForMedia(review);
    setIsMediaModalOpen(true);
    setIsMediaLoading(true);
    try {
      if(review.id) {
        const mediaItems = await mediaService.getMediaItemsForReview(review.id);
        setAssociatedMedia(mediaItems);
      } else {
        setAssociatedMedia([]);
      }
    } catch (err) {
      console.error("Failed to load media for review", err);
      setAssociatedMedia([]);
    } finally {
      setIsMediaLoading(false);
    }
  };


  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const searchMatch = searchTerm.toLowerCase() === '' ||
        review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.reviewerDetails?.name && review.reviewerDetails.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.reviewerDetails?.email && review.reviewerDetails.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const customerMatch = typeof filter.isCustomer === 'undefined' || review.isCustomer === filter.isCustomer;
      const ratingMatch = typeof filter.rating === 'undefined' || filter.rating === 0 || review.rating === filter.rating;
      const sourceMatch = typeof filter.source === 'undefined' || filter.source === '' || review.reviewerSource.toLowerCase().includes(filter.source.toLowerCase());
      
      return searchMatch && customerMatch && ratingMatch && sourceMatch;
    });
  }, [reviews, searchTerm, filter]);
  
  const uniqueSources = useMemo(() => {
    const sources = new Set(reviews.map(r => r.reviewerSource));
    return Array.from(sources);
  }, [reviews]);

  if (isLoading && reviews.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-textPrimary">Manage Reviews</h1>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusCircle size={18}/>}>
          Add New Review
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <div className="bg-surface p-4 sm:p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input 
            placeholder="Search reviews..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!mt-0" // Applied to input field itself
            containerClassName="!mb-0" // Applied to the outer div of Input component
            prefixIcon={<Search size={18} className="text-gray-400"/>}
          />
          <select 
            value={filter.rating ?? 0} 
            onChange={(e) => setFilter(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm h-[42px]" // Added height to match input
          >
            <option value={0}>All Ratings</option>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
          </select>
          <select 
            value={filter.isCustomer === undefined ? "" : (filter.isCustomer ? "yes" : "no")}
            onChange={(e) => setFilter(prev => ({ ...prev, isCustomer: e.target.value === "" ? undefined : e.target.value === "yes" }))}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm h-[42px]" // Added height
          >
            <option value="">Any Customer Status</option>
            <option value="yes">Is Customer</option>
            <option value="no">Not a Customer</option>
          </select>
           <select 
            value={filter.source ?? ""} 
            onChange={(e) => setFilter(prev => ({ ...prev, source: e.target.value }))}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm h-[42px]" // Added height
          >
            <option value="">All Sources</option>
            {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {isLoading && reviews.length > 0 && <div className="my-4"><LoadingSpinner/></div>}

      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onEdit={handleOpenModal} 
              onDelete={handleDeleteReview}
              onViewMedia={handleViewMedia}
            />
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-center text-textSecondary py-10">No reviews found matching your criteria.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingReview?.id ? 'Edit Review' : 'Add New Review'} size="lg">
        {editingReview && (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <ReviewFormFields formData={editingReview} onFormChange={handleFormChange} onReviewerDetailsChange={handleReviewerDetailsChange} />
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isLoading && !!editingReview}>
                {editingReview?.id ? 'Save Changes' : 'Add Review'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} title={`Media for ${selectedReviewForMedia?.reviewerName}'s Review`} size="md">
        {isMediaLoading && <LoadingSpinner />}
        {!isMediaLoading && associatedMedia.length === 0 && <p>No media associated with this review.</p>}
        {!isMediaLoading && associatedMedia.length > 0 && (
          <div className="space-y-3">
            {associatedMedia.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <ImageIcon size={20} className="mr-2 text-primary" />
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.fileName}</a>
                </div>
                <span className="text-xs text-gray-500">{item.fileType}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

    </div>
  );
};

// Removed local Textarea definition, will use imported one.

export default ReviewsPage;
    