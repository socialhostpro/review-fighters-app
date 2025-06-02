import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import LandingButton from './LandingButton';
import { Menu, X } from 'lucide-react';

interface NavLinkData {
    text: string;
    href: string;
}
interface GlobalContentData {
    logo: { headerSrc: string; };
    siteName: { main: string; emphasis: string; };
    navigation: { links: NavLinkData[]; ctaButton: {text: string; }; };
}

interface LandingHeaderProps {
  globalContent: GlobalContentData;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ globalContent }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // The actual scrolling/navigation is handled by LandingButton's onClick
  };

  return (
    <header className="py-4 px-6 md:px-10 bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={ROUTES.LANDING} className="flex items-center space-x-2">
          <img src={globalContent.logo.headerSrc} alt={`${globalContent.siteName.main} ${globalContent.siteName.emphasis} Logo`} className="h-10 md:h-12" />
          <span className="text-2xl font-bold text-textPrimary">
            {globalContent.siteName.main}<span className="text-brand-blue">{globalContent.siteName.emphasis}</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-1">
          {globalContent.navigation.links.map(link => (
            <LandingButton
              key={link.text}
              href={link.href}
              text={link.text}
              variant='ghost'
              className="font-nav text-md hover:font-semibold px-3 py-2"
              onClick={handleNavLinkClick}
            />
          ))}
          <LandingButton href={ROUTES.LOGIN} text={globalContent.navigation.ctaButton.text} variant="primary" className="ml-3"/>
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="w-7 h-7 text-textPrimary" /> : <Menu className="w-7 h-7 text-textPrimary" />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-40">
          <nav className="container mx-auto flex flex-col space-y-1 px-6">
            {globalContent.navigation.links.map(link => (
               <LandingButton
                key={link.text}
                href={link.href}
                text={link.text}
                variant='ghost'
                className="font-nav text-md hover:font-semibold py-2 w-full text-left"
                onClick={handleNavLinkClick}
              />
            ))}
            <LandingButton href={ROUTES.LOGIN} text={globalContent.navigation.ctaButton.text} variant="primary" className="w-full text-center mt-2" />
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
