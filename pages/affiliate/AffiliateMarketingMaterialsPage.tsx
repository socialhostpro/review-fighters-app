import React, { useState } from 'react';
import { QrCode, Share2, Copy, Download, Image, FileText, Video, ExternalLink, Check, Eye } from 'lucide-react';

const AffiliateMarketingMaterialsPage: React.FC = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock affiliate code - in real app this would come from user data
  const affiliateCode = 'RF-AFF-12345';
  const affiliateId = 'jh7fkwcnheqr03r2qdhtfrgs317h2s0j';

  // Generate affiliate links
  const generateAffiliateLink = (baseUrl: string) => {
    return `${baseUrl}?ref=${affiliateCode}&aid=${affiliateId}`;
  };

  const baseUrls = {
    landing: 'https://reviewfighters.com',
    signup: 'https://reviewfighters.com/signup',
    pricing: 'https://reviewfighters.com/pricing',
    features: 'https://reviewfighters.com/features'
  };

  const affiliateLinks = {
    landing: generateAffiliateLink(baseUrls.landing),
    signup: generateAffiliateLink(baseUrls.signup),
    pricing: generateAffiliateLink(baseUrls.pricing),
    features: generateAffiliateLink(baseUrls.features)
  };

  // Generate QR Code URL (using a QR code service)
  const generateQRCode = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const marketingMaterials = [
    {
      id: 1,
      title: 'Review Fighters Banner - Large',
      type: 'image',
      category: 'banners',
      description: 'High-quality banner for websites and blogs',
      url: 'https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/banner-large.png',
      dimensions: '728x90',
      format: 'PNG'
    },
    {
      id: 2,
      title: 'Review Fighters Square Logo',
      type: 'image',
      category: 'logos',
      description: 'Square logo perfect for social media',
      url: 'https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/review-fighters-3uqlyf/assets/0d4urifbt7s6/footer-logo.png',
      dimensions: '400x400',
      format: 'PNG'
    },
    {
      id: 3,
      title: 'Product Demo Video',
      type: 'video',
      category: 'videos',
      description: 'Complete product walkthrough video',
      url: 'https://example.com/demo-video.mp4',
      duration: '3:45',
      format: 'MP4'
    },
    {
      id: 4,
      title: 'Email Template - Welcome Series',
      type: 'email',
      category: 'emails',
      description: 'Ready-to-use email template for new subscribers',
      content: `Subject: Transform Your Review Process with Review Fighters

Hi [Name],

Are you tired of managing reviews across multiple platforms? Review Fighters makes it simple to collect, manage, and showcase your customer reviews.

🌟 Automated review collection
🌟 Multi-platform management
🌟 AI-powered insights

Get started today: ${affiliateLinks.signup}

Best regards,
[Your Name]`,
      format: 'HTML'
    },
    {
      id: 5,
      title: 'Social Media Post - Features',
      type: 'social',
      category: 'social',
      description: 'Instagram/Facebook post highlighting key features',
      content: `🚀 Struggling with review management? 

Review Fighters has got you covered:
✅ Collect reviews automatically
✅ Manage all platforms in one place  
✅ Get AI-powered insights
✅ Boost your online reputation

Try it free: ${affiliateLinks.features}

#ReviewManagement #BusinessGrowth #OnlineReputation`,
      format: 'Text'
    },
    {
      id: 6,
      title: 'Comparison Chart - Competitors',
      type: 'image',
      category: 'infographics',
      description: 'Visual comparison with major competitors',
      url: 'https://example.com/comparison-chart.png',
      dimensions: '800x600',
      format: 'PNG'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Materials', count: marketingMaterials.length },
    { id: 'banners', name: 'Banners', count: marketingMaterials.filter(m => m.category === 'banners').length },
    { id: 'logos', name: 'Logos', count: marketingMaterials.filter(m => m.category === 'logos').length },
    { id: 'videos', name: 'Videos', count: marketingMaterials.filter(m => m.category === 'videos').length },
    { id: 'emails', name: 'Email Templates', count: marketingMaterials.filter(m => m.category === 'emails').length },
    { id: 'social', name: 'Social Media', count: marketingMaterials.filter(m => m.category === 'social').length },
    { id: 'infographics', name: 'Infographics', count: marketingMaterials.filter(m => m.category === 'infographics').length }
  ];

  const filteredMaterials = selectedCategory === 'all' 
    ? marketingMaterials 
    : marketingMaterials.filter(m => m.category === selectedCategory);

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadQRCode = async (url: string, filename: string) => {
    try {
      const response = await fetch(generateQRCode(url));
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to download QR code: ', err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'email': case 'social': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3">
          <Share2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing Materials</h1>
            <p className="text-gray-600">QR codes, links, and promotional materials for your affiliate campaigns</p>
          </div>
        </div>
      </div>

      {/* Affiliate Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Your Affiliate Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Affiliate Code:</span>
            <span className="font-mono text-blue-900 ml-2">{affiliateCode}</span>
          </div>
          <div>
            <span className="text-blue-700">Affiliate ID:</span>
            <span className="font-mono text-blue-900 ml-2">{affiliateId}</span>
          </div>
        </div>
      </div>

      {/* Quick Links with QR Codes */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Share Links & QR Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(affiliateLinks).map(([key, url]) => (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium capitalize">{key} Page</h3>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              
              {/* QR Code */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0">
                  <img 
                    src={generateQRCode(url)} 
                    alt={`QR Code for ${key}`}
                    className="w-20 h-20 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Scan to visit with your affiliate code</p>
                  <button
                    onClick={() => downloadQRCode(url, key)}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    <Download className="h-3 w-3 inline mr-1" />
                    Download QR
                  </button>
                </div>
              </div>

              {/* Share Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Share Link:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 px-3 py-2 text-xs border rounded bg-gray-50 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(url, key)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  >
                    {copiedItem === key ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Materials */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Marketing Materials</h2>
          <div className="text-sm text-gray-600">
            {filteredMaterials.length} of {marketingMaterials.length} materials
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(material.type)}
                  <h3 className="font-medium text-gray-900">{material.title}</h3>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase">
                  {material.format}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{material.description}</p>

              {/* Material Preview */}
              {material.type === 'image' && material.url && (
                <div className="mb-3">
                  <img 
                    src={material.url} 
                    alt={material.title}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <p className="text-xs text-gray-500 mt-1">{material.dimensions}</p>
                </div>
              )}

              {material.type === 'video' && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Duration: {material.duration}</span>
                  </div>
                </div>
              )}

              {(material.type === 'email' || material.type === 'social') && material.content && (
                <div className="mb-3">
                  <div className="bg-gray-50 rounded p-3 max-h-24 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {material.content.substring(0, 150)}...
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {material.url && (
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                  >
                    <Eye className="h-3 w-3 inline mr-1" />
                    View
                  </a>
                )}
                
                {material.content && (
                  <button
                    onClick={() => copyToClipboard(material.content!, `material-${material.id}`)}
                    className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    {copiedItem === `material-${material.id}` ? (
                      <Check className="h-3 w-3 inline mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 inline mr-1" />
                    )}
                    Copy
                  </button>
                )}

                <button className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50">
                  <Download className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="font-medium text-green-900 mb-3">📱 Usage Tips</h3>
        <ul className="text-sm text-green-800 space-y-2">
          <li>• <strong>QR Codes:</strong> Perfect for print materials, business cards, and offline promotions</li>
          <li>• <strong>Share Links:</strong> Use in emails, social media posts, and digital marketing campaigns</li>
          <li>• <strong>Marketing Materials:</strong> Customize with your own branding before sharing</li>
          <li>• <strong>Track Performance:</strong> Monitor clicks and conversions in your affiliate dashboard</li>
          <li>• <strong>Attribution:</strong> All links contain your unique affiliate code for proper tracking</li>
        </ul>
      </div>
    </div>
  );
};

export default AffiliateMarketingMaterialsPage; 