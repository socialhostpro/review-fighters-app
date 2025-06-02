import React from 'react';
import SectionHeading from './SectionHeading';
import LandingButton from './LandingButton';
import { CheckCircle } from 'lucide-react';
import { landingPageContent } from '../../data/landingPageContent';

type PricingData = typeof landingPageContent.sections.pricing;

interface PricingSectionProps {
  pricingData: PricingData;
}

const PricingSection: React.FC<PricingSectionProps> = ({ pricingData }) => {
    return (
      <section id={pricingData.id} className="py-16 md:py-24 bg-slate-800 text-white px-6">
        <div className="container mx-auto">
          <SectionHeading mainText={pricingData.headline.main} emphasizedText={pricingData.headline.emphasis} subHeadline={pricingData.subHeadline} />
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
            {pricingData.plan.bannerText && (
              <div className="bg-brand-blue text-center text-white text-sm font-semibold py-2 uppercase tracking-wider">
                {pricingData.plan.bannerText}
              </div>
            )}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-brand-blue text-center mb-2">{pricingData.plan.name}</h3>
              <p className="text-textSecondary text-center text-sm mb-6">{pricingData.plan.description}</p>
              <div className="text-center mb-8">
                <span className="text-5xl font-extrabold text-textPrimary">{pricingData.plan.price}</span>
                <span className="text-textSecondary">{pricingData.plan.billingCycle}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {pricingData.plan.features.map(feature => (
                  <li key={feature.text} className="flex items-center text-textSecondary">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature.text}
                  </li>
                ))}
              </ul>
              <LandingButton href={pricingData.plan.cta.href} text={pricingData.plan.cta.text} variant="primary" className="w-full text-lg text-center" />
            </div>
            <div className="bg-gray-50 p-6 text-center">
              <p className="text-sm text-textSecondary">
                {pricingData.contactSales.text}
                <LandingButton href={pricingData.contactSales.href} text={pricingData.contactSales.linkText} variant="ghost" className="text-brand-blue font-semibold hover:underline ml-1" />
              </p>
            </div>
          </div>
        </div>
      </section>
    );
};

export default PricingSection;
