
import { Affiliate, Click, Sale, UserRole } from '../types';
import { mockAffiliates, mockClicks, mockSales, mockUsers } from '../data/mockData';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

let affiliatesStore: Affiliate[] = [...mockAffiliates];
let clicksStore: Click[] = [...mockClicks];
let salesStore: Sale[] = [...mockSales];

export const affiliateService = {
  // For Affiliates (their own data)
  getAffiliateDashboardData: async (affiliateId: string): Promise<Affiliate | null> => {
    await delay(300);
    const affiliate = affiliatesStore.find(a => a.affiliateID === affiliateId);
    if (!affiliate) return null;

    // Simulate calculating/fetching related data like clicks and sales counts for the dashboard
    // In a real backend, this might be a more complex query or pre-calculated.
    const relatedClicks = clicksStore.filter(c => c.affiliateID_Ref === affiliateId).length;
    const relatedSales = salesStore.filter(s => s.affiliateID_Ref === affiliateId && s.status === 'Approved').length;
    const currentBalance = salesStore
        .filter(s => s.affiliateID_Ref === affiliateId && s.status === 'Approved') // Assuming 'Paid' status reduces balance
        .reduce((sum, sale) => sum + sale.commissionEarned, 0);


    return { 
        ...affiliate, 
        totalClicks: relatedClicks, // Overwrite with fresh count
        totalSales: relatedSales,   // Overwrite with fresh count
        currentBalance: parseFloat(currentBalance.toFixed(2)) // Ensure two decimal places
    };
  },

  getAffiliateSales: async (affiliateId: string): Promise<Sale[]> => {
    await delay(300);
    return salesStore.filter(s => s.affiliateID_Ref === affiliateId);
  },

  getAffiliateClicks: async (affiliateId: string): Promise<Click[]> => {
    await delay(300);
    return clicksStore.filter(c => c.affiliateID_Ref === affiliateId);
  },
  
  // For Admins (managing all affiliates)
  getAllAffiliates: async (): Promise<Affiliate[]> => {
    await delay(400);
    return [...affiliatesStore]; // Return a copy
  },

  getAffiliateById: async (affiliateId: string): Promise<Affiliate | null> => {
    await delay(200);
    return affiliatesStore.find(a => a.affiliateID === affiliateId) || null;
  },

  updateAffiliateStatus: async (affiliateId: string, status: Affiliate['status']): Promise<Affiliate> => {
    await delay(300);
    const index = affiliatesStore.findIndex(a => a.affiliateID === affiliateId);
    if (index === -1) throw new Error('Affiliate not found');
    affiliatesStore[index].status = status;
    return { ...affiliatesStore[index] };
  },
  
  createAffiliate: async (newAffiliateData: Omit<Affiliate, 'affiliateID' | 'affiliateLink' | 'qrCodeLink' | 'totalClicks' | 'totalSales' | 'currentBalance' | 'signupDate'>): Promise<Affiliate> => {
    await delay(300);
    const affiliateID = `AFF_${newAffiliateData.name.toUpperCase().replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}`;
    const newAffiliate: Affiliate = {
        ...newAffiliateData, // Spreads name, email, status, payoutDetails, userId (if present)
        affiliateID,
        affiliateLink: `https://reviewfighters.com/?ref=${affiliateID}`,
        qrCodeLink: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://reviewfighters.com/?ref=${affiliateID}`,
        totalClicks: 0,
        totalSales: 0,
        currentBalance: 0,
        signupDate: new Date().toISOString(), // signupDate is generated here
    };
    affiliatesStore.push(newAffiliate);
    
    // If a user with this email exists, update their role and affiliateId
    const userIndex = mockUsers.findIndex(u => u.email === newAffiliate.email);
    if (userIndex > -1) {
        mockUsers[userIndex].role = UserRole.AFFILIATE; // Promote to affiliate
        mockUsers[userIndex].affiliateId = newAffiliate.affiliateID;
        if(newAffiliate.userId) { // if userId was passed in newAffiliateData, ensure it's consistent or handle logic
            mockUsers[userIndex].id = newAffiliate.userId; // This might be redundant if email is the key for finding user
        } else {
             newAffiliate.userId = mockUsers[userIndex].id; // Link affiliate to existing user
        }
    }


    return { ...newAffiliate };
  },

  // Placeholder for click/sale recording - would be external in reality
  recordClick: async (affiliateId: string, sourceTag?: string, targetURL?: string): Promise<Click> => {
    await delay(100);
    const newClick: Click = {
      clickID: `CLICK_${Date.now()}`,
      affiliateID_Ref: affiliateId,
      timestamp: new Date().toISOString(),
      sourceTag,
      targetURL
    };
    clicksStore.push(newClick);
    // Update affiliate's total clicks (in a real system, this might be aggregated differently)
    const affIndex = affiliatesStore.findIndex(a => a.affiliateID === affiliateId);
    if (affIndex > -1) affiliatesStore[affIndex].totalClicks += 1;
    return newClick;
  },

  recordSale: async (saleData: Omit<Sale, 'saleID' | 'commissionEarned'>): Promise<Sale> => {
    await delay(200);
    const commissionEarned = saleData.saleAmount * saleData.commissionRate;
    const newSale: Sale = {
      ...saleData,
      saleID: `SALE_${Date.now()}`,
      commissionEarned: parseFloat(commissionEarned.toFixed(2)),
    };
    salesStore.push(newSale);
    // Update affiliate's total sales and balance (simplified)
    const affIndex = affiliatesStore.findIndex(a => a.affiliateID === saleData.affiliateID_Ref);
    if (affIndex > -1) {
      if (newSale.status === 'Approved') { // Only count approved sales towards total and balance for simplicity
        affiliatesStore[affIndex].totalSales += 1;
        affiliatesStore[affIndex].currentBalance += newSale.commissionEarned;
        affiliatesStore[affIndex].currentBalance = parseFloat(affiliatesStore[affIndex].currentBalance.toFixed(2));
      }
    }
    return newSale;
  }
};
