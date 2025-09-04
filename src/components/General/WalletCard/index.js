import React from "react";
import PropTypes from "prop-types";

const WalletCard = ({ icon: Icon, label, value, className = "" }) => {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] px-5 py-3 rounded-lg flex items-center ${className}`}
    >
      {/* Icon */}
      <div className="mr-7">
        <Icon className="w-[54px] h-[54px]" />
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-[15px] text-[#222B38CC] mb-1.5">{label}</span>
        <span className="text-[28px] font-bold text-[#222B38]">{value}</span>
      </div>
    </div>
  );
};

WalletCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default WalletCard;
