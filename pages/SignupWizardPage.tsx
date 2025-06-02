
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { ROUTES } from '../constants';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import { authService } from '../services/authService'; // Import authService
import { User, Briefcase, ShieldCheck, CheckCircle, PlusCircle, Trash2, Home, AlertTriangle } from 'lucide-react'; // Added Home, AlertTriangle

const logoUrl = "https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/0d4urifbt7s6/footer-logo.png";

interface SignupFormData {
  // Step 1
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;

  // Step 2
  businessName: string;
  businessAddress: string;
  businessPhoneNumber: string;
  businessEmail: string;
  businessWebsite: string;
  businessSocials: Array<{ platform: string; link: string; id: number }>;

  // Step 3
  reviewPlatforms: string[];
  monthlyReviewsVolume: string;
  reviewPainPoint: string;
}

const initialFormData: SignupFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  businessAddress: '',
  businessPhoneNumber: '',
  businessEmail: '',
  businessWebsite: '',
  businessSocials: [{ platform: '', link: '', id: Date.now() }],
  reviewPlatforms: [],
  monthlyReviewsVolume: '',
  reviewPainPoint: '',
};

const reviewPlatformOptions = ['Google My Business', 'Yelp', 'Trustpilot', 'Facebook Pages', 'Amazon', 'Capterra', 'G2', 'Other'];
const volumeOptions = ['<50 per month', '50-200 per month', '200-1000 per month', '1000+ per month'];

const SignupWizardPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData | 'confirmPassword' | 'form', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state during submission
  const navigate = useNavigate();

  const steps = [
    { title: 'Account Details', icon: <User className="w-5 h-5" /> },
    { title: 'Business Information', icon: <Briefcase className="w-5 h-5" /> },
    { title: 'Review Setup', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "reviewPlatforms") {
      const platform = value;
      setFormData(prev => ({
        ...prev,
        reviewPlatforms: checked
          ? [...prev.reviewPlatforms, platform]
          : prev.reviewPlatforms.filter(p => p !== platform),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    if (errors[name as keyof SignupFormData] || errors.form) {
        setErrors(prev => ({...prev, [name]: undefined, form: undefined }));
    }
  };
  
  const handleSocialLinkChange = (index: number, field: 'platform' | 'link', value: string) => {
    const newSocialLinks = formData.businessSocials.map((social, i) => 
        i === index ? { ...social, [field]: value } : social
    );
    setFormData(prev => ({ ...prev, businessSocials: newSocialLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      businessSocials: [...prev.businessSocials, { platform: '', link: '', id: Date.now() }],
    }));
  };

  const removeSocialLink = (id: number) => {
    setFormData(prev => ({
      ...prev,
      businessSocials: prev.businessSocials.filter(link => link.id !== id),
    }));
  };


  const validateStep1 = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: typeof errors = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
    // Add more validations as needed for other business fields
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors: typeof errors = {};
    if (formData.reviewPlatforms.length === 0) newErrors.form = 'Please select at least one review platform.';
    if (!formData.monthlyReviewsVolume) newErrors.monthlyReviewsVolume = 'Please select your monthly review volume.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    // Step 3 validation will happen on final submit attempt, or can be done here too if desired.
    
    if (isValid || currentStep === steps.length -1) { // Allow moving to final step if current step valid
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous form-wide errors
    if (currentStep === steps.length && !validateStep3()) {
        return;
    }
    // Also ensure step 1 and 2 validations pass if user somehow skipped to submit early (though UI prevents this)
    if (!validateStep1() || !validateStep2()) {
        setErrors(prev => ({ ...prev, form: "Please complete all previous steps correctly."}));
        // Optionally, navigate back to the first invalid step.
        if (!validateStep1()) setCurrentStep(1);
        else if (!validateStep2()) setCurrentStep(2);
        return;
    }

    setIsSubmitting(true);
    try {
      // Destructure only needed fields for authService.signup
      const { name, email, password } = formData;
      if (!password) { // Should be caught by validateStep1, but good to double check
          throw new Error("Password is required.");
      }
      
      await authService.signup(name, email, password);
      // Signup successful
      // The full formData (including business details, review setup) can be sent to another service here
      // to create/update the user's full profile after account creation.
      // For this example, we assume this data is captured for now and proceed to payment.

      // Store other form data (e.g., in localStorage for retrieval after payment, or send to backend)
      const { password: _p, confirmPassword: _cp, ...otherSignupData } = formData;
      localStorage.setItem('pendingSignupData', JSON.stringify(otherSignupData));


      alert('Account created successfully! You will now be redirected to complete your subscription.');
      window.location.href = 'https://buy.stripe.com/test_cN2bK69B11nz6tOcMM'; // Redirect to Stripe Paylink
      
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during signup.';
        setErrors({ form: errorMessage });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Account Details
        return (
          <div className="space-y-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required disabled={isSubmitting} />
            <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required disabled={isSubmitting} />
            <Input label="Password" name="password" type="password" value={formData.password || ''} onChange={handleChange} error={errors.password} required disabled={isSubmitting} />
            <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword || ''} onChange={handleChange} error={errors.confirmPassword} required disabled={isSubmitting} />
          </div>
        );
      case 2: // Business Information
        return (
          <div className="space-y-4">
            <Input label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} error={errors.businessName} required disabled={isSubmitting} />
            <Input label="Business Address" name="businessAddress" value={formData.businessAddress} onChange={handleChange} disabled={isSubmitting} />
            <Input label="Business Phone" name="businessPhoneNumber" type="tel" value={formData.businessPhoneNumber} onChange={handleChange} disabled={isSubmitting} />
            <Input label="Business Email" name="businessEmail" type="email" value={formData.businessEmail} onChange={handleChange} disabled={isSubmitting} />
            <Input label="Business Website" name="businessWebsite" type="url" value={formData.businessWebsite} onChange={handleChange} placeholder="https://example.com" disabled={isSubmitting} />
            
            <div>
                <h4 className="text-sm font-medium text-textPrimary mb-1">Business Social Media Links</h4>
                {formData.businessSocials.map((social, index) => (
                    <div key={social.id} className="flex items-center gap-2 mb-2 p-2 border rounded-md bg-gray-50">
                        <Input placeholder="Platform (e.g., Facebook)" value={social.platform} onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} containerClassName="flex-grow !mb-0" className="!mt-0 text-sm py-1.5" disabled={isSubmitting} />
                        <Input placeholder="Link (e.g., https://facebook.com/...)" value={social.link} onChange={(e) => handleSocialLinkChange(index, 'link', e.target.value)} containerClassName="flex-grow !mb-0" className="!mt-0 text-sm py-1.5" disabled={isSubmitting} />
                        {formData.businessSocials.length > 1 && (
                             <Button type="button" variant="danger" size="sm" onClick={() => removeSocialLink(social.id)} className="p-2 h-9" disabled={isSubmitting}>
                                <Trash2 size={14} />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addSocialLink} leftIcon={<PlusCircle size={14}/>} className="mt-1 text-xs" disabled={isSubmitting}>Add Social Link</Button>
            </div>
          </div>
        );
      case 3: // Review Setup
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Which review platforms do you primarily use or want to monitor? (Select all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {reviewPlatformOptions.map(platform => (
                  <label key={platform} className={`flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                    <input type="checkbox" name="reviewPlatforms" value={platform} checked={formData.reviewPlatforms.includes(platform)} onChange={handleChange} className="form-checkbox h-4 w-4 text-primary focus:ring-primary-light" disabled={isSubmitting} />
                    <span className="text-sm text-textPrimary">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
                <label htmlFor="monthlyReviewsVolume" className="block text-sm font-medium text-textPrimary mb-1">Roughly how many reviews does your business receive per month?</label>
                <select id="monthlyReviewsVolume" name="monthlyReviewsVolume" value={formData.monthlyReviewsVolume} onChange={handleChange} required className={`w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary ${isSubmitting ? 'bg-gray-100' : ''}`} disabled={isSubmitting}>
                    <option value="">Select volume...</option>
                    {volumeOptions.map(vol => <option key={vol} value={vol}>{vol}</option>)}
                </select>
                {errors.monthlyReviewsVolume && <p className="text-sm text-red-600 mt-1">{errors.monthlyReviewsVolume}</p>}
            </div>
            <Textarea label="What is your biggest pain point regarding online reviews currently?" name="reviewPainPoint" value={formData.reviewPainPoint} onChange={handleChange} rows={3} disabled={isSubmitting} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex flex-col justify-center items-center p-4">
      <div className="bg-surface p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-xl lg:max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          <img src={logoUrl} alt="Review Fighters Logo" className="h-12 w-auto mb-3" />
          <h1 className="text-2xl font-bold text-textPrimary">Join Review Fighters</h1>
          <p className="text-textSecondary mt-1 text-sm">Create your account in a few simple steps.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className={`flex flex-col items-center ${index + 1 <= currentStep ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${index + 1 <= currentStep ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-gray-100'}`}>
                    {index + 1 < currentStep ? <CheckCircle size={18}/> : step.icon}
                  </div>
                  <p className="text-xs mt-1 text-center w-20 truncate">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 ${index + 1 < currentStep ? 'bg-primary' : 'bg-gray-300'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-textPrimary mb-5 text-center">{steps[currentStep - 1].title}</h2>
          
          {errors.form && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded text-sm flex items-center">
              <AlertTriangle size={18} className="mr-2 flex-shrink-0" /> {errors.form}
            </div>
          )}

          {renderStepContent()}

          <div className="mt-8 pt-5 border-t flex justify-between items-center">
            <Button type="button" onClick={prevStep} disabled={currentStep === 1 || isSubmitting} variant="outline">
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep} variant="primary" disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                Complete Signup & Pay
              </Button>
            )}
          </div>
        </form>
         <p className="text-center text-sm text-textSecondary mt-6">
            Already have an account? <a href={`#${ROUTES.LOGIN}`} onClick={(e) => {e.preventDefault(); navigate(ROUTES.LOGIN);}} className="font-medium text-primary hover:underline">Log In</a>
        </p>
        <div className="text-center mt-4">
            <Link to={ROUTES.LANDING}>
                <Button variant="ghost" size="sm" leftIcon={<Home size={16}/>}>
                Go to Homepage
                </Button>
            </Link>
        </div>
      </div>
       <footer className="text-center text-sm text-white/70 mt-6">
        © {new Date().getFullYear()} Review Fighters Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default SignupWizardPage;