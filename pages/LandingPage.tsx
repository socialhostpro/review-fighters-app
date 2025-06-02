
import React, { useState, useEffect } from 'react';
import { landingPageContent as defaultContent } from '../data/landingPageContent';

// Import new section components
import LandingHeader from '../components/landing/LandingHeader';
import HeroSection from '../components/landing/HeroSection'; // Changed to default import
import TrustIndicatorsSection from '../components/landing/TrustIndicatorsSection';
import VideoSection from '../components/landing/VideoSection';
import AboutUsSection from '../components/landing/AboutUsSection';
import HowWeHelpSection from '../components/landing/HowWeHelpSection';
import GetStartedSection from '../components/landing/GetStartedSection';
import PricingSection from '../components/landing/PricingSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import LandingFooter from '../components/landing/LandingFooter';

// Define a type for the content, matching the structure of landingPageContent
type LandingPageContentType = typeof defaultContent;
const LANDING_PAGE_CONTENT_KEY = 'customLandingPageContent';

const LandingPage: React.FC = () => {
  const [content, setContent] = useState<LandingPageContentType>(defaultContent);

  useEffect(() => {
    try {
      const storedContent = localStorage.getItem(LANDING_PAGE_CONTENT_KEY);
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent);
        // Basic validation: check if essential keys exist to prevent crashes if localStorage is malformed
        // A more robust deep merge or validation might be needed for production
        if (parsedContent.global && parsedContent.sections && parsedContent.footer) {
          setContent(parsedContent);
        } else {
          console.warn("Stored landing page content is malformed. Using default.");
          setContent(defaultContent);
        }
      } else {
        setContent(defaultContent); // Ensure default content is set if nothing in localStorage
      }
    } catch (e) {
      console.error("Error loading custom landing page content from localStorage:", e);
      setContent(defaultContent); // Fallback to default
    }
  }, []);
  
  // Destructure with fallbacks for safety, though HeroSection will also handle defaults
  const globalData = content?.global || defaultContent.global;
  const sectionsData = content?.sections || defaultContent.sections;
  const footerData = content?.footer || defaultContent.footer;


  return (
    <div className="font-sans antialiased text-textPrimary bg-white">
      <LandingHeader globalContent={globalData} />
      <main>
        <HeroSection heroData={sectionsData?.hero} /> 
        <TrustIndicatorsSection trustIndicatorsData={sectionsData?.trustIndicators} />
        <VideoSection videoData={sectionsData?.video} />
        <AboutUsSection aboutUsData={sectionsData?.aboutUs} />
        <HowWeHelpSection howWeHelpData={sectionsData?.howWeHelp} globalIcons={globalData?.icons} />
        <GetStartedSection getStartedData={sectionsData?.getStarted} />
        <PricingSection pricingData={sectionsData?.pricing} />
        <FinalCtaSection finalCtaData={sectionsData?.finalCta} />
      </main>
      <LandingFooter footerData={footerData} globalLogo={globalData?.logo} />
    </div>
  );
};

export default LandingPage;
