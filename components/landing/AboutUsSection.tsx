import React from 'react';
import SectionHeading from './SectionHeading';
import IconMapper from './IconMapper';
import { landingPageContent } from '../../data/landingPageContent';

type AboutUsData = typeof landingPageContent.sections.aboutUs;

interface AboutUsSectionProps {
  aboutUsData: AboutUsData;
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({ aboutUsData }) => {
    return (
      <section id={aboutUsData.id} className="py-16 md:py-24 bg-white px-6">
        <div className="container mx-auto">
          <SectionHeading mainText={aboutUsData.headline.main} emphasizedText={aboutUsData.headline.emphasis} subHeadline={aboutUsData.subHeadline} />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src={aboutUsData.imageSrc} alt={aboutUsData.altText} className="rounded-lg shadow-xl w-full" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-textPrimary mb-4">{aboutUsData.storyHeadline}</h3>
              <p className="text-textSecondary mb-6">{aboutUsData.storyText}</p>
              <div className="space-y-6">
                {aboutUsData.missionPoints.map(point => (
                  <div key={point.title} className="flex items-start">
                    <IconMapper iconClass={point.iconClass} className="w-6 h-6 text-brand-blue mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold text-textPrimary mb-1">{point.title}</h4>
                      <p className="text-textSecondary">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default AboutUsSection;
