
import { Review } from '../types';
import { mockReviews } from '../data/mockData';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

// In-memory store for mock reviews
let reviewsStore: Review[] = [...mockReviews];

export const reviewService = {
  getReviews: async (userId: string): Promise<Review[]> => {
    // In a real app, userId would be used to filter reviews or for authorization
    console.log(`Fetching reviews for user ID: ${userId}`);
    await delay(500);
    return [...reviewsStore]; // Return a copy
  },

  addReview: async (reviewData: Omit<Review, 'id' | 'reviewDate'>): Promise<Review> => {
    await delay(300);
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      reviewDate: new Date().toISOString(),
    };
    reviewsStore.push(newReview);
    console.log('Added review:', newReview);
    return { ...newReview }; // Return a copy
  },

  updateReview: async (reviewId: string, reviewData: Partial<Review>): Promise<Review> => {
    await delay(400);
    const reviewIndex = reviewsStore.findIndex(r => r.id === reviewId);
    if (reviewIndex > -1) {
      reviewsStore[reviewIndex] = { ...reviewsStore[reviewIndex], ...reviewData };
      console.log('Updated review:', reviewsStore[reviewIndex]);
      return { ...reviewsStore[reviewIndex] }; // Return a copy
    }
    throw new Error('Review not found for update');
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await delay(300);
    const initialLength = reviewsStore.length;
    reviewsStore = reviewsStore.filter(r => r.id !== reviewId);
    if (reviewsStore.length === initialLength) {
      throw new Error('Review not found for deletion');
    }
    console.log('Deleted review ID:', reviewId);
  },
};
    