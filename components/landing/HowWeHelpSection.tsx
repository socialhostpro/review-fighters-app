import React from 'react';
import SectionHeading from './SectionHeading';
import IconMapper from './IconMapper';
import { landingPageContent } from '../../data/landingPageContent';

type HowWeHelpData = typeof landingPageContent.sections.howWeHelp;
type GlobalIconsData = typeof landingPageContent.global.icons;

interface HowWeHelpSectionProps {
  howWeHelpData: HowWeHelpData;
  globalIcons: GlobalIconsData;
}

interface FeatureCardProps {
    iconClass: string;
    title: string;
    description: string;
    bulletPoints: {text:string}[];
    bulletPointIconUrl: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ iconClass, title, description, bulletPoints, bulletPointIconUrl }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <IconMapper iconClass={iconClass} className="w-10 h-10 text-brand-blue mb-4" />
      <h3 className="text-xl font-semibold text-textPrimary mb-2">{title}</h3>
      <p className="text-textSecondary mb-3 text-sm">{description}</p>
      <ul className="space-y-1">
        {bulletPoints.map((point, index) => (
          <li key={index} className="flex items-start text-sm">
            <img src={bulletPointIconUrl} alt="Checkmark" className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-textSecondary">{point.text}</span>
          </li>
        ))}
      </ul>
    </div>
);

const HowWeHelpSection: React.FC<HowWeHelpSectionProps> = ({ howWeHelpData, globalIcons }) => {
    return (
      <section id={howWeHelpData.id} className="py-16 md:py-24 bg-gray-100 px-6">
        <div className="container mx-auto">
          <SectionHeading mainText={howWeHelpData.headline.main} emphasizedText={howWeHelpData.headline.emphasis} subHeadline={howWeHelpData.subHeadline} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howWeHelpData.features.map(feature => (
              <FeatureCard key={feature.title} {...feature} bulletPointIconUrl={globalIcons.bulletPointCheckmark} />
            ))}
          </div>
        </div>
      </section>
    );
};

export default HowWeHelpSection;
