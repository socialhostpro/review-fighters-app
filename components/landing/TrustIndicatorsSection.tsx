import React from 'react';
import IconMapper from './IconMapper';
import { landingPageContent } from '../../data/landingPageContent';

type TrustIndicatorsData = typeof landingPageContent.sections.trustIndicators;

interface TrustIndicatorsSectionProps {
  trustIndicatorsData: TrustIndicatorsData;
}

const TrustIndicatorsSection: React.FC<TrustIndicatorsSectionProps> = ({ trustIndicatorsData }) => {
    return (
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {trustIndicatorsData.indicators.map((item, index) => (
              <div key={index} className="flex flex-col items-center p-4">
                <IconMapper iconClass={item.iconClass} className="w-10 h-10 text-brand-blue mb-3" />
                <p className="text-lg font-semibold text-textPrimary">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
};

export default TrustIndicatorsSection;
