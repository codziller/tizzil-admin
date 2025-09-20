import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as CheckIcon } from "assets/icons/small-check.svg";

const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  ...rest
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const checkIconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4"
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-2
        rounded
        flex
        items-center
        justify-center
        cursor-pointer
        transition-all
        duration-200
        ${checked
          ? "bg-[#690007] border-[#690007]"
          : "bg-white border-gray-300 hover:border-gray-400"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      onClick={() => !disabled && onChange?.(!checked)}
      {...rest}
    >
      {checked && (
        <CheckIcon
          className={`${checkIconSizes[size]} text-white`}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      )}
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export default Checkbox;