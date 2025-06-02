
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, error, className = '', containerClassName = '', ...props }) => {
  const baseTextareaClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorTextareaClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-textPrimary">{label}</label>}
      <textarea
        id={id}
        className={`${baseTextareaClasses} ${error ? errorTextareaClasses : ''} ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;
    