import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconMapper from './IconMapper';
import { Send } from 'lucide-react'; // Using Lucide Send icon
import { landingPageContent } from '../../data/landingPageContent'; // Import for type only

type FooterData = typeof landingPageContent.footer;
type GlobalLogoData = typeof landingPageContent.global.logo;

interface LandingFooterProps {
  footerData: FooterData;
  globalLogo: GlobalLogoData;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ footerData, globalLogo }) => {
  const navigate = useNavigate();

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      event.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Element with ID '${id}' not found for scrolling.`);
      }
    } else if (href.startsWith('/')) {
      event.preventDefault();
      navigate(href);
    }
    // External links will behave normally
  };
  
  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle newsletter subscription logic here
    alert('Newsletter subscription submitted! (Placeholder)');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About Section */}
          <div>
            <img src={globalLogo.footerSrc} alt="ReviewFighters Logo" className="h-12 mb-4" />
            <p className="text-sm mb-4">{footerData.about.text}</p>
            <div className="flex space-x-4">
              {footerData.socialLinks.map(link => (
                <a key={link.platform} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors">
                  <IconMapper iconClass={link.iconClass} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerData.linkSections.map(section => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.text}>
                    <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-sm hover:text-brand-blue hover:underline transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{footerData.contactInfo.title}</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-start">
                <IconMapper iconClass={footerData.contactInfo.address.iconClass} className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-brand-blue" />
                {footerData.contactInfo.address.text}
              </li>
              <li className="flex items-center">
                <IconMapper iconClass={footerData.contactInfo.phone.iconClass} className="w-4 h-4 mr-3 flex-shrink-0 text-brand-blue" />
                {footerData.contactInfo.phone.text}
              </li>
              <li className="flex items-center">
                <IconMapper iconClass={footerData.contactInfo.email.iconClass} className="w-4 h-4 mr-3 flex-shrink-0 text-brand-blue" />
                <a href={`mailto:${footerData.contactInfo.email.text}`} className="hover:text-brand-blue hover:underline">{footerData.contactInfo.email.text}</a>
              </li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2">{footerData.newsletter.title}</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                placeholder={footerData.newsletter.placeholder}
                className="w-full px-3 py-2 text-sm text-textPrimary bg-slate-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
              <button type="submit" className="bg-brand-blue text-white p-2.5 rounded-r-md hover:bg-blue-700 transition-colors" aria-label="Subscribe to newsletter">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-sm text-center md:flex md:justify-between">
          <p className="mb-4 md:mb-0">{footerData.copyright}</p>
          <div className="space-x-4">
            {footerData.legalLinks.map(link => (
              <a key={link.text} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="hover:text-brand-blue hover:underline">
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
