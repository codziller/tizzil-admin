import React from 'react';
import PropTypes from 'prop-types';
import { BsInstagram, BsGlobe } from 'react-icons/bs';
import { FaTiktok } from 'react-icons/fa';

const IconTypeInput = ({ 
  label, 
  value = '', 
  onChange, 
  type = 'instagram',
  placeholder = '',
  className = "",
  required = false,
  error = null
}) => {
  
  const getIcon = () => {
    switch (type) {
      case 'instagram':
        return <BsInstagram className="text-pink-500" size={20} />;
      case 'tiktok':
        return <FaTiktok className="text-black" size={20} />;
      case 'website':
        return <BsGlobe className="text-blue-500" size={20} />;
      default:
        return <BsGlobe className="text-gray-500" size={20} />;
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (type) {
      case 'instagram':
        return 'https://instagram.com/yourusername';
      case 'tiktok':
        return 'https://tiktok.com/@yourusername';
      case 'website':
        return 'https://yourwebsite.com';
      default:
        return 'Enter URL';
    }
  };

  const getInputType = () => {
    return type === 'phone' ? 'tel' : 'url';
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[#374151] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex gap-3">
        {/* Icon box */}
        <div className="flex-shrink-0 w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          {getIcon()}
        </div>

        {/* Input field */}
        <div className="flex-1">
          <input
            type={getInputType()}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full p-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

IconTypeInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['instagram', 'tiktok', 'website', 'phone']),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
};

export default IconTypeInput;