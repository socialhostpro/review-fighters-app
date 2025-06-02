import React from 'react';

interface SectionHeadingProps {
  mainText: string;
  emphasizedText?: string;
  suffix?: string;
  subHeadline?: string;
  align?: 'left' | 'center';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ mainText, emphasizedText, suffix, subHeadline, align = 'center' }) => {
  return (
    <div className={`mb-10 md:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-3">
        {mainText}
        {emphasizedText && <span className="text-brand-blue">{emphasizedText}</span>}
        {suffix}
      </h2>
      {subHeadline && <p className={`text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>{subHeadline}</p>}
    </div>
  );
};

export default SectionHeading;