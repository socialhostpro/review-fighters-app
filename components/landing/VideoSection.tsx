import React from 'react';
import SectionHeading from './SectionHeading';
import { landingPageContent } from '../../data/landingPageContent';

type VideoData = typeof landingPageContent.sections.video;

interface VideoSectionProps {
  videoData: VideoData;
}

const VideoSection: React.FC<VideoSectionProps> = ({ videoData }) => {
    return (
      <section className="py-16 md:py-24 bg-slate-800 text-white px-6">
        <div className="container mx-auto">
          <SectionHeading mainText={videoData.headline.main} emphasizedText={videoData.headline.emphasis} suffix={videoData.headlineSuffix} subHeadline={videoData.subHeadline} />
          <div className="aspect-video max-w-3xl mx-auto rounded-lg shadow-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoData.youtubeVideoId}`}
              title="ReviewFighters Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    );
};

export default VideoSection;
