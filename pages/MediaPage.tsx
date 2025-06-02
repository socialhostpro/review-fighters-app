
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { MediaItem, Review } from '../types';
import { mediaService } from '../services/mediaService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { UploadCloud, Image as ImageIcon, FileText as PdfIcon, Trash2, Link2, Eye } from 'lucide-react';

const MediaCard: React.FC<{ item: MediaItem; onDelete: (id: string) => void; onAssociate?: (item: MediaItem) => void }> = ({ item, onDelete, onAssociate }) => {
  const isImage = item.fileType.startsWith('image/');
  return (
    <div className="bg-surface rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">
      {isImage ? (
        <img src={item.url} alt={item.fileName} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
          <PdfIcon size={48} className="text-primary" />
        </div>
      )}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-textPrimary truncate mb-1" title={item.fileName}>{item.fileName}</h3>
        <p className="text-xs text-textSecondary mb-1">Type: {item.fileType}</p>
        <p className="text-xs text-textSecondary mb-3">Uploaded: {new Date(item.uploadedDate).toLocaleDateString()}</p>
        
        {item.associatedReviewId && <p className="text-xs text-green-600 mb-1">Linked to Review ID: <span className="font-mono">{item.associatedReviewId.substring(0,8)}...</span></p>}
        {item.associatedCustomerId && <p className="text-xs text-blue-600 mb-1">Linked to Customer ID: <span className="font-mono">{item.associatedCustomerId.substring(0,8)}...</span></p>}
        
        <div className="mt-auto pt-3 border-t border-gray-200 flex justify-between items-center gap-2">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark p-1 rounded hover:bg-primary-light/10" title="View File">
            <Eye size={18}/>
          </a>
          {onAssociate && (
             <Button size="sm" variant="ghost" onClick={() => onAssociate(item)} className="p-1" title="Associate File">
                <Link2 size={18} />
             </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 p-1" title="Delete File">
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};


const MediaPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [associationType, setAssociationType] = useState<'review' | 'customer' | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string>('');
  
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [mediaToAssociate, setMediaToAssociate] = useState<MediaItem | null>(null);


  const fetchMedia = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedMedia, fetchedReviews] = await Promise.all([
        mediaService.getMediaItems(user.id),
        reviewService.getReviews(user.id) // Fetch reviews for association dropdown
      ]);
      setMediaItems(fetchedMedia);
      setReviews(fetchedReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media items or reviews.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload || !user) return;
    setIsUploading(true);
    setError(null);
    try {
      const association: { reviewId?: string; customerId?: string } = {};
      if (associationType === 'review' && selectedReviewId) {
        association.reviewId = selectedReviewId;
      } else if (associationType === 'customer') {
        association.customerId = user.id; // Or allow selecting a customer if applicable
      }
      await mediaService.uploadMediaItem(user.id, fileToUpload, association);
      await fetchMedia(); // Refresh list
      setIsUploadModalOpen(false);
      setFileToUpload(null);
      setAssociationType(null);
      setSelectedReviewId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this media file?')) return;
    // Optimistic UI or loading state
    setMediaItems(prev => prev.filter(item => item.id !== mediaId));
    try {
      await mediaService.deleteMediaItem(mediaId);
      // fetchMedia(); // Or rely on optimistic update if no error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media item. Restoring item.');
      fetchMedia(); // Re-fetch to restore if delete failed
    }
  };
  
  const openAssociateModal = (item: MediaItem) => {
    setMediaToAssociate(item);
    setSelectedReviewId(item.associatedReviewId || ''); // Pre-fill if already associated
    setAssociationType(item.associatedReviewId ? 'review' : (item.associatedCustomerId ? 'customer' : null));
    setIsAssociateModalOpen(true);
  };

  const handleAssociate = async () => {
    if (!mediaToAssociate || !user) return;
    setIsLoading(true); // Or a specific modal loading state
    
    const updatedAssociations: Partial<MediaItem> = {
        associatedReviewId: associationType === 'review' && selectedReviewId ? selectedReviewId : undefined,
        // Clear customerId if associating with review, or vice versa logic might be needed
        associatedCustomerId: associationType === 'customer' ? user.id : (associationType === 'review' && selectedReviewId ? undefined : mediaToAssociate.associatedCustomerId)
    };
    if (associationType === null) { // If user chose 'None'
      updatedAssociations.associatedReviewId = undefined;
      updatedAssociations.associatedCustomerId = undefined;
    }

    try {
      // This would typically be an updateMediaItem call in mediaService
      // For now, simulate by updating local state then re-fetching (or just re-fetch)
      // Mock: find item in mediaItems and update its association fields, then setMediaItems
      // For a real app: await mediaService.updateMediaItem(mediaToAssociate.id, updatedAssociations);
      console.log("Simulating update for item:", mediaToAssociate.id, "with associations:", updatedAssociations);
      // For now, we'll just close modal and re-fetch to show changes from a mock backend update
      await fetchMedia(); 
      setIsAssociateModalOpen(false);
      setMediaToAssociate(null);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update media association.');
    } finally {
        setIsLoading(false);
    }
  };


  if (isLoading && mediaItems.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-textPrimary">Media Library</h1>
        <Button onClick={() => setIsUploadModalOpen(true)} leftIcon={<UploadCloud size={18}/>}>
          Upload Media
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
      {isUploading && <div className="my-4"><LoadingSpinner /> <span className="ml-2">Uploading...</span></div>}

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaItems.map(item => (
            <MediaCard key={item.id} item={item} onDelete={handleDelete} onAssociate={openAssociateModal} />
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-center text-textSecondary py-10">No media items found. Upload some!</p>
      )}

      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload New Media" size="md">
        <div className="space-y-4">
          <Input type="file" onChange={handleFileChange} label="Choose File" accept="image/*,application/pdf" />
          {fileToUpload && <p className="text-sm text-gray-600">Selected: {fileToUpload.name} ({(fileToUpload.size / 1024).toFixed(1)} KB)</p>}
          
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">Associate with (optional):</label>
            <select 
              value={associationType || ""}
              onChange={(e) => setAssociationType(e.target.value as 'review' | 'customer' || null)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="">None</option>
              <option value="customer">This Customer Account</option>
              <option value="review">A Specific Review</option>
            </select>
          </div>

          {associationType === 'review' && (
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1">Select Review:</label>
              <select 
                value={selectedReviewId}
                onChange={(e) => setSelectedReviewId(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required={associationType === 'review'}
              >
                <option value="">-- Select a Review --</option>
                {reviews.map(review => (
                  <option key={review.id} value={review.id}>
                    {review.reviewerName} - {review.reviewContent.substring(0,30)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!fileToUpload || isUploading} isLoading={isUploading}>
              Upload
            </Button>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={isAssociateModalOpen} onClose={() => setIsAssociateModalOpen(false)} title={`Associate: ${mediaToAssociate?.fileName}`} size="md">
        {mediaToAssociate && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">Associate with:</label>
            <select 
              value={associationType || ""}
              onChange={(e) => setAssociationType(e.target.value as 'review' | 'customer' || null)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="">None (General)</option>
              <option value="customer">This Customer Account</option>
              <option value="review">A Specific Review</option>
            </select>
          </div>

          {associationType === 'review' && (
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1">Select Review:</label>
              <select 
                value={selectedReviewId}
                onChange={(e) => setSelectedReviewId(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required={associationType === 'review'}
              >
                <option value="">-- Select a Review --</option>
                {reviews.map(review => (
                  <option key={review.id} value={review.id}>
                    {review.reviewerName} - {review.reviewContent.substring(0,30)}...
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-3">
             <Button variant="outline" onClick={() => setIsAssociateModalOpen(false)}>Cancel</Button>
             <Button onClick={handleAssociate} isLoading={isLoading}>Save Association</Button>
          </div>
        </div>
        )}
      </Modal>
    </div>
  );
};

export default MediaPage;
    