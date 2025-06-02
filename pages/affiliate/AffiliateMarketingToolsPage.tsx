
import React, { useEffect, useState } from 'react';
import { marketingService } from '../../services/marketingService';
import { MarketingMedia } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AlertTriangle, Image as ImageIcon, Link as LinkIcon, FileText as TextIcon, Video as VideoIcon, Copy, Download } from 'lucide-react';
import Button from '../../components/Button';

const getIconForType = (type: MarketingMedia['type']) => {
  switch (type) {
    case 'Banner': return <ImageIcon size={20} className="text-blue-500" />;
    case 'Text Link': return <TextIcon size={20} className="text-green-500" />;
    case 'Email Template': return <TextIcon size={20} className="text-purple-500" />;
    case 'Video': return <VideoIcon size={20} className="text-red-500" />;
    default: return <TextIcon size={20} className="text-gray-500" />;
  }
};

interface MediaAssetCardProps {
  asset: MarketingMedia;
  affiliateLink?: string; // To embed in text links or email templates
}

const MediaAssetCard: React.FC<MediaAssetCardProps> = ({ asset, affiliateLink }) => {
  const [copied, setCopied] = useState(false);
  
  let displayContent: React.ReactNode;
  let actionContent: string = asset.assetURL_Or_Content;

  if (asset.type === 'Text Link' && affiliateLink) {
    // Simple example: Asset content is the text, action content is text + link
    displayContent = <p className="text-sm text-textPrimary italic">"{asset.assetURL_Or_Content}"</p>;
    actionContent = `${asset.assetURL_Or_Content} - Learn more: ${affiliateLink}`;
  } else if (asset.type === 'Email Template' && affiliateLink) {
    displayContent = <pre className="text-xs bg-gray-50 p-2 rounded border whitespace-pre-wrap max-h-32 overflow-y-auto">{asset.assetURL_Or_Content.replace('[Your Affiliate Link Here]', affiliateLink)}</pre>;
    actionContent = asset.assetURL_Or_Content.replace('[Your Affiliate Link Here]', affiliateLink);
  } else if (asset.type === 'Banner') {
    displayContent = <img src={asset.assetURL_Or_Content} alt={asset.title} className="max-h-32 object-contain my-2 border rounded" />;
    actionContent = `<a href="${affiliateLink || '#'}" target="_blank"><img src="${asset.assetURL_Or_Content}" alt="${asset.title}" /></a>`;
  } else if (asset.type === 'Video') {
     displayContent = (
        <div className="aspect-video bg-black rounded overflow-hidden my-2">
            {asset.assetURL_Or_Content.includes("youtube.com/embed") ? (
                 <iframe
                    className="w-full h-full"
                    src={asset.assetURL_Or_Content}
                    title={asset.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <a href={asset.assetURL_Or_Content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block p-4 text-center">
                    Watch Video ({asset.assetURL_Or_Content.substring(0,30)}...)
                </a>
            )}
        </div>
     );
     actionContent = `Watch our video: ${asset.assetURL_Or_Content}\nAnd sign up using my link: ${affiliateLink || '#'}`;
  } else {
    displayContent = <p className="text-sm text-textPrimary">{asset.assetURL_Or_Content.substring(0, 100)}...</p>;
  }


  const handleCopy = (contentToCopy: string) => {
    navigator.clipboard.writeText(contentToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => console.error("Failed to copy:", err));
  };

  return (
    <div className="bg-surface p-4 rounded-lg shadow-md flex flex-col">
      <div className="flex items-center mb-2">
        {getIconForType(asset.type)}
        <h3 className="ml-2 text-md font-semibold text-textPrimary truncate" title={asset.title}>{asset.title}</h3>
      </div>
      {asset.dimensions && <p className="text-xs text-textSecondary mb-1">Dimensions: {asset.dimensions}</p>}
      {asset.targetAudience && asset.targetAudience.length > 0 && (
        <p className="text-xs text-textSecondary mb-2">Target: {asset.targetAudience.join(', ')}</p>
      )}
      
      <div className="my-2 flex-grow">{displayContent}</div>

      <div className="mt-auto pt-3 border-t border-gray-200">
        {asset.type === 'Banner' && (
            <a 
                href={asset.assetURL_Or_Content} 
                download={`${asset.title.replace(/\s+/g, '_')}.${asset.assetURL_Or_Content.split('.').pop() || 'png'}`}
                className="text-xs flex items-center justify-center w-full px-3 py-1.5 mb-2 border border-secondary text-secondary rounded hover:bg-secondary hover:text-white transition-colors"
            >
                <Download size={14} className="mr-1" /> Download Banner
            </a>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleCopy(actionContent)}
          className="w-full text-xs"
          leftIcon={<Copy size={14}/>}
        >
          {copied ? 'Copied!' : (asset.type === 'Banner' ? 'Copy HTML Code' : 'Copy Link/Content')}
        </Button>
      </div>
    </div>
  );
};


const AffiliateMarketingToolsPage: React.FC = () => {
  const [mediaAssets, setMediaAssets] = useState<MarketingMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // In a real app, the affiliate's unique link would come from their profile/dashboard data
  const mockAffiliateLink = "https://reviewfighters.com/?ref=YOUR_AFFILIATE_ID"; 

  useEffect(() => {
    const fetchMediaAssets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const assets = await marketingService.getActiveMarketingMedia();
        setMediaAssets(assets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load marketing assets.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMediaAssets();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error Loading Marketing Tools</h2>
        <p className="text-textSecondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">Marketing Tools</h1>
      <p className="text-textSecondary">
        Utilize these assets to promote Review Fighters. Your unique affiliate link 
        (<code>{mockAffiliateLink}</code>) 
        will be automatically included where applicable.
      </p>

      {mediaAssets.length === 0 ? (
        <p className="text-center text-textSecondary py-10">No marketing assets currently available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaAssets.map(asset => (
            <MediaAssetCard key={asset.mediaID} asset={asset} affiliateLink={mockAffiliateLink} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AffiliateMarketingToolsPage;
