import React from 'react';
import SectionHeading from './SectionHeading';
import LandingButton from './LandingButton';
import { Star as StarIcon, CheckCircle } from 'lucide-react';
import { landingPageContent } from '../../data/landingPageContent';

type GetStartedData = typeof landingPageContent.sections.getStarted;

interface GetStartedSectionProps {
  getStartedData: GetStartedData;
}

const GetStartedSection: React.FC<GetStartedSectionProps> = ({ getStartedData }) => {
    const renderStars = (rating: number) => {
      return Array(5).fill(0).map((_, i) => (
          <StarIcon key={i} size={18} className={`inline-block ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ));
    };

    return (
      <section id={getStartedData.id} className="py-16 md:py-24 bg-white px-6">
        <div className="container mx-auto">
          <SectionHeading mainText={getStartedData.headline.main} emphasizedText={getStartedData.headline.emphasis} subHeadline={getStartedData.subHeadline} />
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="bg-gray-50 p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-semibold text-textPrimary mb-6 text-center">{getStartedData.integrationSteps.headline}</h3>
              <ol className="space-y-6">
                {getStartedData.integrationSteps.steps.map((step, index) => (
                  <li key={step.title} className="flex items-start">
                    <div className="bg-brand-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">{index + 1}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-textPrimary mb-1">{step.title}</h4>
                      <p className="text-textSecondary text-sm">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-10 text-center">
                <LandingButton href={getStartedData.integrationSteps.cta.href} text={getStartedData.integrationSteps.cta.text} variant="primary" className="text-lg" />
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-textPrimary mb-4">{getStartedData.whyChooseUs.headline}</h3>
              <ul className="space-y-3">
                {getStartedData.whyChooseUs.points.map(point => (
                  <li key={point.text} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-textSecondary">{point.text}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-slate-800 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-3">
                  <img src={getStartedData.whyChooseUs.testimonial.avatarSrc} alt={getStartedData.whyChooseUs.testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold">{getStartedData.whyChooseUs.testimonial.name}</p>
                    <p className="text-sm text-slate-300">{getStartedData.whyChooseUs.testimonial.title}</p>
                  </div>
                </div>
                <p className="italic mb-3 text-slate-200">"{getStartedData.whyChooseUs.testimonial.quote}"</p>
                <div>{renderStars(getStartedData.whyChooseUs.testimonial.rating)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default GetStartedSection;
