import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { UserProfile, UserRole, StripeSubscription, Affiliate } from '../types'; // Added Affiliate
import { profileService } from '../services/profileService';
import { affiliateService } from '../services/affiliateService'; // Added affiliateService
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { User as UserIcon, Briefcase, Edit3, Save, CreditCard, Link as LinkIcon, PlusCircle, Trash2, Settings, DollarSign } from 'lucide-react'; // Added DollarSign

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
const ProfileSection: React.FC<ProfileSectionProps> = ({ title, icon, children }) => (
  <div className="bg-surface p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-textPrimary ml-2">{title}</h2>
    </div>
    {children}
  </div>
);

interface SocialLinkForm { platform: string; link: string; id: number; }

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [affiliateDetails, setAffiliateDetails] = useState<Affiliate | null>(null); // For affiliate-specific data
  const [editableProfile, setEditableProfile] = useState<Partial<UserProfile & { payoutDetails?: string }>>({}); // Combined for editing
  const [socialLinks, setSocialLinks] = useState<SocialLinkForm[]>([]);
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAffiliate = user?.role === UserRole.AFFILIATE;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const promises: Promise<any>[] = [profileService.getProfile(user.id)];
        if (!isAffiliate) { // Non-affiliates might have subscriptions
          promises.push(profileService.getSubscriptionDetails(user.id));
        }
        if (isAffiliate && user.affiliateId) { // Affiliates have affiliate-specific details
          promises.push(affiliateService.getAffiliateDashboardData(user.affiliateId));
        }

        const results = await Promise.all(promises);
        const fetchedProfile = results[0] as UserProfile | null;
        setProfile(fetchedProfile);

        let currentEditableData: Partial<UserProfile & { payoutDetails?: string }> = fetchedProfile || {};

        if (isAffiliate) {
          const fetchedAffiliateDetails = results[1] as Affiliate | null;
          setAffiliateDetails(fetchedAffiliateDetails);
          if (fetchedAffiliateDetails) {
            currentEditableData.payoutDetails = fetchedAffiliateDetails.payoutDetails;
          }
        } else {
          setSubscription(results[1] as StripeSubscription | null);
        }
        
        setEditableProfile(currentEditableData);
        if (fetchedProfile?.businessSocials) {
            setSocialLinks(fetchedProfile.businessSocials.map((s, i) => ({...s, id: i})));
        } else {
            setSocialLinks([]);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [user, isAffiliate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'link', value: string) => {
    const newSocialLinks = [...socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setSocialLinks(newSocialLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', link: '', id: Date.now() }]);
  };

  const removeSocialLink = (id: number) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const openEditModal = () => {
    let initialEditableData: Partial<UserProfile & { payoutDetails?: string }> = profile || {};
    if (isAffiliate && affiliateDetails) {
        initialEditableData.payoutDetails = affiliateDetails.payoutDetails;
    }
    setEditableProfile(initialEditableData);

    if (profile?.businessSocials) {
        setSocialLinks(profile.businessSocials.map((s, i) => ({...s, id: i})));
    } else {
        setSocialLinks([{ platform: '', link: '', id: Date.now() }]);
    }
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setError(null);
    
    const finalSocials = socialLinks
        .filter(s => s.platform.trim() !== '' && s.link.trim() !== '')
        .map(({ id, ...rest}) => rest);

    try {
      const { payoutDetails, ...userProfileDataToSave } = editableProfile;
      const updatedProfileData = { ...userProfileDataToSave, businessSocials: finalSocials };
      
      const updatedProfile = await profileService.updateProfile(user.id, updatedProfileData as UserProfile);
      setProfile(updatedProfile);

      if (isAffiliate && user.affiliateId && payoutDetails !== undefined) {
        // This assumes affiliateService needs a way to update *just* payoutDetails or similar
        // For simplicity, mock an update or integrate with a proper update function in affiliateService
        await affiliateService.updateAffiliateStatus(user.affiliateId, affiliateDetails?.status || 'Active'); // This is a placeholder; needs proper update method
        
        // Simulate updating payoutDetails directly if no specific service method exists
        const updatedAffiliate = { ...affiliateDetails, payoutDetails: payoutDetails } as Affiliate;
        // In a real scenario: const updatedAffiliate = await affiliateService.updateAffiliate(user.affiliateId, { payoutDetails });
        setAffiliateDetails(updatedAffiliate); 
        console.log("Mocked update of affiliate payout details for:", user.affiliateId, "to:", payoutDetails);
      }
      
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    try {
        const stripeUrl = await profileService.getStripeManagementUrl(user.id);
        alert(`Redirecting to Stripe: ${stripeUrl} (This is a mock URL)`);
        // window.open(stripeUrl, '_blank');
    } catch (err) {
        alert('Could not retrieve subscription management link.');
        console.error(err);
    }
  };
  
  const renderSocialLinksInputs = () => (
    <div className="space-y-3 mb-3">
        {socialLinks.map((social, index) => (
            <div key={social.id} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <Input 
                    placeholder="Platform (e.g., Twitter)" 
                    value={social.platform} 
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} 
                    containerClassName="flex-grow !mb-0"
                    className="!mt-0"
                />
                <Input 
                    placeholder="Link (e.g., https://...)" 
                    value={social.link} 
                    onChange={(e) => handleSocialLinkChange(index, 'link', e.target.value)} 
                    containerClassName="flex-grow !mb-0"
                    className="!mt-0"
                />
                <Button type="button" variant="danger" size="sm" onClick={() => removeSocialLink(social.id)} className="p-2 h-10">
                    <Trash2 size={16} />
                </Button>
            </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addSocialLink} leftIcon={<PlusCircle size={16}/>}>Add Social Link</Button>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error && !profile && !affiliateDetails) {
    return <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">{error}</div>;
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-textPrimary">My Profile</h1>
        <Button onClick={openEditModal} leftIcon={<Edit3 size={18}/>}>Edit Profile</Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
      
      {profile && (
        <ProfileSection title="Personal Information" icon={<UserIcon size={24} className="text-primary"/>}>
          <InfoItem label="Name" value={profile.name} />
          <InfoItem label="Email" value={profile.email} />
          <InfoItem label="Phone" value={profile.phone} />
          <InfoItem label="Address" value={profile.address} />
          <InfoItem label="Zip Code" value={profile.zipCode} />
        </ProfileSection>
      )}

      {isAffiliate && affiliateDetails && (
        <ProfileSection title="Affiliate Information" icon={<DollarSign size={24} className="text-primary"/>}>
            <InfoItem label="Affiliate ID" value={affiliateDetails.affiliateID} />
            <InfoItem label="Affiliate Link" value={affiliateDetails.affiliateLink} isLink={true} />
            <InfoItem label="Payout Details" value={affiliateDetails.payoutDetails} />
            <InfoItem label="Current Balance" value={`$${affiliateDetails.currentBalance.toFixed(2)}`} />
        </ProfileSection>
      )}

      {profile?.businessName && !isAffiliate && ( // Show business info only if not a pure affiliate or if profile has it
        <ProfileSection title="Business Information" icon={<Briefcase size={24} className="text-primary"/>}>
          <InfoItem label="Business Name" value={profile.businessName} />
          <InfoItem label="Business Email" value={profile.businessEmail} />
          <InfoItem label="Business Phone" value={profile.businessPhoneNumber} />
          <InfoItem label="Business Address" value={profile.businessAddress} />
          <InfoItem label="Website" value={profile.businessWebsite} isLink={true} />
          {profile.businessSocials && profile.businessSocials.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-textSecondary mb-1">Social Media:</h4>
              <ul className="list-none space-y-1">
                {profile.businessSocials.map((social, index) => (
                  <li key={index} className="flex items-center">
                    <LinkIcon size={14} className="mr-2 text-gray-500"/>
                    <span className="font-medium mr-1">{social.platform}:</span>
                    <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                      {social.link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ProfileSection>
      )}

      {profile && (
        <ProfileSection title="Notes" icon={<Edit3 size={24} className="text-primary"/>}>
            {profile.customerNotes && <InfoItem label="Customer Notes" value={profile.customerNotes} preformatted={true}/>}
            {(user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER) && profile.adminNotes && (
              <InfoItem label="Admin/Owner Notes" value={profile.adminNotes} preformatted={true}/>
            )}
            {!profile.customerNotes && !(user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER && profile.adminNotes) && (
                <p className="text-textSecondary">No notes available.</p>
            )}
        </ProfileSection>
      )}
      

      {!isAffiliate && subscription && ( // Hide subscription for affiliates
         <ProfileSection title="Subscription" icon={<CreditCard size={24} className="text-primary"/>}>
            <InfoItem label="Plan" value={subscription.planName} />
            <InfoItem 
              label="Status" 
              value={
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {subscription.status.replace('_', ' ').toUpperCase()}
                </span>
              } 
            />
            <InfoItem label="Renews On" value={new Date(subscription.currentPeriodEnd).toLocaleDateString()} />
            <Button onClick={handleManageSubscription} variant="secondary" className="mt-4" leftIcon={<Settings size={18}/>}>
                Manage Subscription
            </Button>
         </ProfileSection>
      )}

      {!profile && !affiliateDetails && !isLoading && (
        <p className="text-center text-textSecondary">Profile data not found.</p>
      )}

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile" size="lg">
        <form onSubmit={handleSaveChanges} className="space-y-4">
            <h3 className="text-lg font-medium text-textPrimary border-b pb-2 mb-3">Personal Information</h3>
            <Input label="Name" name="name" value={editableProfile.name || ''} onChange={handleInputChange} />
            <Input label="Email" name="email" type="email" value={editableProfile.email || ''} onChange={handleInputChange} />
            <Input label="Phone" name="phone" type="tel" value={editableProfile.phone || ''} onChange={handleInputChange} />
            <Input label="Address" name="address" value={editableProfile.address || ''} onChange={handleInputChange} />
            <Input label="Zip Code" name="zipCode" value={editableProfile.zipCode || ''} onChange={handleInputChange} />

            {isAffiliate && (
              <>
                <h3 className="text-lg font-medium text-textPrimary border-b pb-2 mb-3 pt-4">Affiliate Payout Details</h3>
                <Input label="Payout Details (e.g., PayPal email, Stripe ID)" name="payoutDetails" value={editableProfile.payoutDetails || ''} onChange={handleInputChange} />
              </>
            )}

            {!isAffiliate && (
              <>
                <h3 className="text-lg font-medium text-textPrimary border-b pb-2 mb-3 pt-4">Business Information</h3>
                <Input label="Business Name" name="businessName" value={editableProfile.businessName || ''} onChange={handleInputChange} />
                <Input label="Business Email" name="businessEmail" type="email" value={editableProfile.businessEmail || ''} onChange={handleInputChange} />
                <Input label="Business Phone" name="businessPhoneNumber" type="tel" value={editableProfile.businessPhoneNumber || ''} onChange={handleInputChange} />
                <Input label="Business Address" name="businessAddress" value={editableProfile.businessAddress || ''} onChange={handleInputChange} />
                <Input label="Business Website" name="businessWebsite" type="url" value={editableProfile.businessWebsite || ''} onChange={handleInputChange} />
                
                <h4 className="text-md font-medium text-textPrimary pt-2">Business Social Links</h4>
                {renderSocialLinksInputs()}
              </>
            )}
            
            <h3 className="text-lg font-medium text-textPrimary border-b pb-2 mb-3 pt-4">Notes</h3>
            <Textarea label="Customer Notes" name="customerNotes" value={editableProfile.customerNotes || ''} onChange={handleInputChange} />
            {(user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER) && (
              <Textarea label="Admin/Owner Notes" name="adminNotes" value={editableProfile.adminNotes || ''} onChange={handleInputChange} />
            )}

          <div className="flex justify-end space-x-3 pt-5">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Save size={18}/>}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value?: string | React.ReactNode;
  isLink?: boolean;
  preformatted?: boolean;
}
const InfoItem: React.FC<InfoItemProps> = ({ label, value, isLink, preformatted }) => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    if (typeof value === 'object' && value !== null) { 
        // Allow rendering ReactNode even if it's conceptually "empty" (e.g. an empty span for styling)
    } else {
        return <div className="mb-2"><span className="font-medium text-textSecondary">{label}: </span> <span className="text-textSecondary italic">N/A</span></div>;
    }
  }
  return (
    <div className="mb-2">
      <span className="font-medium text-textSecondary">{label}: </span>
      {isLink && typeof value === 'string' ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value}
        </a>
      ) : preformatted && typeof value === 'string' ? (
        <pre className="whitespace-pre-wrap font-sans text-textPrimary bg-gray-50 p-2 rounded-md border text-sm">{value}</pre>
      ) : (
        <span className="text-textPrimary">{value}</span>
      )}
    </div>
  );
};

export default ProfilePage;