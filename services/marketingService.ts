
import { MarketingMedia } from '../types';
import { mockMarketingMedia } from '../data/mockData';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

let marketingMediaStore: MarketingMedia[] = [...mockMarketingMedia];

export const marketingService = {
  // For Affiliates
  getActiveMarketingMedia: async (): Promise<MarketingMedia[]> => {
    await delay(300);
    return marketingMediaStore.filter(media => media.isActive);
  },

  // For Admins
  getAllMarketingMedia: async (): Promise<MarketingMedia[]> => {
    await delay(300);
    return [...marketingMediaStore]; // Return a copy
  },

  getMarketingMediaById: async (mediaId: string): Promise<MarketingMedia | null> => {
    await delay(200);
    return marketingMediaStore.find(m => m.mediaID === mediaId) || null;
  },

  addMarketingMedia: async (mediaData: Omit<MarketingMedia, 'mediaID'>): Promise<MarketingMedia> => {
    await delay(400);
    const newMedia: MarketingMedia = {
      ...mediaData,
      mediaID: `MM_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    marketingMediaStore.push(newMedia);
    return { ...newMedia };
  },

  updateMarketingMedia: async (mediaId: string, mediaData: Partial<Omit<MarketingMedia, 'mediaID'>>): Promise<MarketingMedia> => {
    await delay(400);
    const index = marketingMediaStore.findIndex(m => m.mediaID === mediaId);
    if (index === -1) throw new Error('Marketing media not found');
    marketingMediaStore[index] = { ...marketingMediaStore[index], ...mediaData };
    return { ...marketingMediaStore[index] };
  },

  deleteMarketingMedia: async (mediaId: string): Promise<void> => {
    await delay(300);
    const initialLength = marketingMediaStore.length;
    marketingMediaStore = marketingMediaStore.filter(m => m.mediaID !== mediaId);
    if (marketingMediaStore.length === initialLength) {
      throw new Error('Marketing media not found for deletion');
    }
  }
};
