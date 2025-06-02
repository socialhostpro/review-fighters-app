
import { MediaItem } from '../types';
import { mockMediaItems } from '../data/mockData';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

// In-memory store for mock media items
let mediaStore: MediaItem[] = [...mockMediaItems];

export const mediaService = {
  getMediaItems: async (userId: string): Promise<MediaItem[]> => {
    // userId might be used for filtering by owner or for authorization
    console.log(`Fetching media items for user ID: ${userId}`);
    await delay(400);
    // For mock, return all items or filter if logic is added (e.g., media associated with user's reviews)
    return [...mediaStore]; // Return a copy
  },

  uploadMediaItem: async (userId: string, file: File, association?: { reviewId?: string; customerId?: string }): Promise<MediaItem> => {
    await delay(1000); // Simulate upload time
    
    // Simulate file upload and URL generation (e.g., to a CDN or local storage if it were real)
    // For mock, we'll use a placeholder image URL or a data URL if we were reading the file.
    // For simplicity, just using a picsum URL.
    const randomSeed = Math.random().toString(36).substring(7);
    const mockUrl = file.type.startsWith('image/') 
      ? `https://picsum.photos/seed/${randomSeed}/200/150` 
      : `https://example.com/placeholder/${file.name}`; // Placeholder for non-images

    const newMediaItem: MediaItem = {
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fileName: file.name,
      fileType: file.type,
      url: mockUrl, 
      uploadedDate: new Date().toISOString(),
      associatedReviewId: association?.reviewId,
      associatedCustomerId: association?.customerId || userId, // Default to uploader if no specific customer ID
    };
    mediaStore.push(newMediaItem);
    console.log('Uploaded media item:', newMediaItem);
    return { ...newMediaItem }; // Return a copy
  },

  deleteMediaItem: async (mediaId: string): Promise<void> => {
    await delay(300);
    const initialLength = mediaStore.length;
    mediaStore = mediaStore.filter(m => m.id !== mediaId);
    if (mediaStore.length === initialLength) {
      throw new Error('Media item not found for deletion');
    }
    console.log('Deleted media item ID:', mediaId);
  },

  getMediaItemsForReview: async(reviewId: string): Promise<MediaItem[]> => {
    await delay(200);
    return mediaStore.filter(item => item.associatedReviewId === reviewId);
  }
};
    