import React from "react";
import PropTypes from "prop-types";
import { BsInstagram, BsGlobe } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { ReactComponent as TiktokIcon } from "assets/icons/tiktok-icon.svg";
import { ReactComponent as InstagramIcon } from "assets/icons/instagram-icon.svg";
import { ReactComponent as WebsiteIcon } from "assets/icons/website-icon.svg";
const IconTypeInput = ({
  label,
  value = "",
  onChange,
  type = "instagram",
  placeholder = "",
  className = "",
  required = false,
  error = null,
}) => {
  const getIcon = () => {
    switch (type) {
      case "instagram":
        return <InstagramIcon className="" />;
      case "tiktok":
        return <TiktokIcon className="" />;
      case "website":
        return <WebsiteIcon className="" />;
      default:
        return <WebsiteIcon className="" />;
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;

    switch (type) {
      case "instagram":
        return "https://instagram.com/yourusername";
      case "tiktok":
        return "https://tiktok.com/@yourusername";
      case "website":
        return "https://yourwebsite.com";
      default:
        return "Enter URL";
    }
  };

  const getInputType = () => {
    return type === "phone" ? "tel" : "url";
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[#374151] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-3">
        {/* Icon box - styled like Input.js container */}
        <div
          className={`flex-shrink-0 w-12 h-11 border border-solid flex items-center justify-center transition-all duration-300 ease-in-out ${
            value
              ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
              : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
          }`}
        >
          {getIcon()}
        </div>

        {/* Input field - styled like Input.js */}
        <div className="flex-1">
          <input
            type={getInputType()}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getPlaceholder()}
            className={`relative h-11 w-full font-normal outline-none transition-all duration-300 ease-in-out text-base leading-relaxed border border-solid px-3 ${
              value
                ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
                : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white focus:bg-white focus:border-[#111111] focus:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
            }`}
          />
        </div>
      </div>

      {/* Error message */}
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

IconTypeInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["instagram", "tiktok", "website", "phone"]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
};

export default IconTypeInput;
