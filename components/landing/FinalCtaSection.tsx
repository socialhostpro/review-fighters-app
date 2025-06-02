import React from 'react';
import LandingButton from './LandingButton';
import { landingPageContent } from '../../data/landingPageContent';

type FinalCtaData = typeof landingPageContent.sections.finalCta;

interface FinalCtaSectionProps {
  finalCtaData: FinalCtaData;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ finalCtaData }) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white text-center px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{finalCtaData.headline}</h2>
        <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-xl mx-auto">{finalCtaData.subHeadline}</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
           <LandingButton 
            href={finalCtaData.primaryCta.href} 
            text={finalCtaData.primaryCta.text} 
            variant="image" 
            imageSrc={finalCtaData.primaryCta.imageSrc} 
            altText={finalCtaData.primaryCta.altText} 
          />
          <LandingButton href={finalCtaData.secondaryCta.href} text={finalCtaData.secondaryCta.text} variant="secondary" className="bg-white border-white text-primary hover:bg-gray-100" />
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
