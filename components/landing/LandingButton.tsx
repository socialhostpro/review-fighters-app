import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingButtonProps {
  href: string;
  text: string;
  variant?: 'primary' | 'secondary' | 'image' | 'ghost';
  imageSrc?: string;
  altText?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const LandingButton: React.FC<LandingButtonProps> = ({ href, text, variant = 'primary', imageSrc, altText, className = '', children, onClick }) => {
  const baseStyles = "inline-block font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variantStyles = "";

  const isPageAnchor = href.startsWith('#');
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
        onClick(event);
        if (event.defaultPrevented) return;
    }

    if (isPageAnchor) {
      event.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Element with ID '${id}' not found for scrolling.`);
      }
    } else if (href.startsWith('/')) { // Internal navigation
        event.preventDefault();
        navigate(href);
    }
    // If it's an external link, default anchor behavior will apply
  };

  if (variant === 'image' && imageSrc) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`hover:opacity-90 transform hover:scale-105 ${className}`}
      >
        <img src={imageSrc} alt={altText || text} className="max-h-14 md:max-h-16" />
      </a>
    );
  }

  switch (variant) {
    case 'primary':
      variantStyles = "bg-brand-blue text-white px-6 py-3 md:px-8 md:py-3.5 text-base md:text-lg hover:bg-blue-700 focus:ring-blue-500";
      break;
    case 'secondary':
      variantStyles = "bg-transparent border-2 border-brand-blue text-brand-blue px-6 py-3 md:px-8 md:py-3.5 text-base md:text-lg hover:bg-blue-50 focus:ring-blue-500";
      break;
    case 'ghost': 
        variantStyles = "text-textSecondary hover:text-brand-blue"; // Base ghost styles
        break;
  }
  
  // Apply passed className last to allow overrides
  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children || text}
    </a>
  );
};

export default LandingButton;
