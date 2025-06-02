
import { UserProfile, StripeSubscription } from '../types';
import { mockUserProfiles, mockStripeSubscription } from '../data/mockData';

// Simulates API delay
const delay = <T,>(ms: number, value: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value), ms));

// In a real app, these would be stored in a database. For mock, we use an in-memory array.
let profilesStore: UserProfile[] = [...mockUserProfiles];

export const profileService = {
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    console.log(`Fetching profile for user ID: ${userId}`);
    await delay(300, null);
    const profile = profilesStore.find(p => p.id === userId);
    return profile ? { ...profile } : null; // Return a copy
  },

  updateProfile: async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    console.log(`Updating profile for user ID: ${userId}`, profileData);
    await delay(500, null);
    const profileIndex = profilesStore.findIndex(p => p.id === userId);
    if (profileIndex > -1) {
      profilesStore[profileIndex] = { ...profilesStore[profileIndex], ...profileData, id: userId }; // Ensure ID isn't overwritten if not in partial
      return { ...profilesStore[profileIndex] }; // Return a copy
    }
    throw new Error('Profile not found');
  },

  getSubscriptionDetails: async (userId: string): Promise<StripeSubscription> => {
    console.log(`Fetching subscription for user ID: ${userId}`);
    // In a real app, this would call your backend, which then calls Stripe.
    await delay(400, null);
    // For now, return mock subscription. Assume all users share it or customize if needed.
    return { ...mockStripeSubscription };
  },

  getStripeManagementUrl: async (userId: string): Promise<string> => {
    console.log(`Fetching Stripe management URL for user ID: ${userId}`);
    // This would call your backend to generate a Stripe Billing Portal session URL.
    await delay(600, null);
    // Mock URL - in reality, this is a one-time use, secure URL from Stripe.
    return `https://billing.stripe.com/p/session/test_mock_session_url_for_${userId}`;
  }
};
    