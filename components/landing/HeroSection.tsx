import React from 'react';
import LandingButton from './LandingButton';
import { landingPageContent } from '../../data/landingPageContent'; // Direct import for simplicity here

type HeroData = typeof landingPageContent.sections.hero;

interface HeroSectionProps {
  heroData?: HeroData; // Make heroData optional to handle cases where it might be undefined
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroData }) => {
  const headline = heroData?.headline || "Welcome!";
  const subHeadline = heroData?.subHeadline || "Discover amazing things.";
  const primaryCta = heroData?.primaryCta || { href: '#', text: 'Get Started', imageSrc: '', altText: 'Get Started' };
  const secondaryCta = heroData?.secondaryCta || { href: '#', text: 'Learn More' };
  
  const browserMockup = heroData?.browserMockup || {
    url: 'example.com',
    analysisTitle: 'Analysis',
    analysisSubtitle: 'Details',
    progressPercentage: 0,
    progressText: 'Processing...',
    indicatorsHeadline: 'Key Indicators:',
    indicators: [{ text: "Loading data..." }]
  };

  return (
    <section
        id="hero"
        className="relative text-white py-20 md:py-32 px-6 overflow-hidden min-h-[70vh] md:min-h-[80vh] flex items-center"
        style={{
          backgroundImage: 'url("https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/yxu69zbt7x66/Untitled_design_(1).gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
    >
      {/* Dark Blue-Black Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/75 to-slate-800/85 z-0"></div>
      
      {/* Additional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-5"></div>

      {/* Content */}
      <div className="container mx-auto relative z-10 text-center">
        <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up drop-shadow-lg"
            dangerouslySetInnerHTML={{ __html: headline }}
        />
        <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto animate-fade-in-up drop-shadow-md" style={{animationDelay: '0.2s'}}>{subHeadline}</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <LandingButton href={primaryCta.href} text={primaryCta.text} variant="image" imageSrc={primaryCta.imageSrc} altText={primaryCta.altText} />
          <LandingButton href={secondaryCta.href} text={secondaryCta.text} variant="secondary" />
        </div>

        {/* Browser Mockup */}
        <div className="mt-12 md:mt-20 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-t-lg shadow-2xl p-3 flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <div className="bg-gray-700/90 text-gray-300 text-xs rounded px-3 py-1 flex-grow truncate">{browserMockup.url}</div>
          </div>
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-b-lg shadow-2xl p-6 text-left">
            <h3 className="text-xl font-semibold text-gray-100 mb-1">{browserMockup.analysisTitle}</h3>
            <p className="text-sm text-gray-400 mb-4">{browserMockup.analysisSubtitle}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${browserMockup.progressPercentage || 0}%` }}></div>
            </div>
            <p className="text-xs text-blue-300 mb-4">{browserMockup.progressText}</p>

            {browserMockup.indicatorsHeadline && (
                <h4 className="text-sm font-semibold text-gray-300 mt-4 mb-2">{browserMockup.indicatorsHeadline}</h4>
            )}
            {(browserMockup.indicators || []).length > 0 && (
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                {browserMockup.indicators.map((indicator, index) => (
                  <li key={index}>{indicator?.text || "Indicator text missing."}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
