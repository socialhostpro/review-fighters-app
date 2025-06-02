import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  prefixIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, error, className = '', containerClassName = '', prefixIcon, ...props }) => {
  const baseInputClasses = "block w-full py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-textPrimary placeholder-gray-500"; // Added text-textPrimary and placeholder-gray-500
  const errorInputClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const inputPadding = prefixIcon ? "pl-10 pr-3" : "px-3";

  return (
    <div className={`${containerClassName || 'mb-4'}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-textPrimary mb-1">{label}</label>}
      <div className="relative"> {/* Wrapper for input and icon */}
        {prefixIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {prefixIcon}
          </div>
        )}
        <input
          id={id}
          className={`${baseInputClasses} ${inputPadding} ${error ? errorInputClasses : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;