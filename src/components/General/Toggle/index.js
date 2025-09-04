import React from "react";
import PropTypes from "prop-types";
import clsx from "classnames";

const Toggle = ({
  isOn = false,
  onToggle,
  label,
  disabled = false,
  className = "",
}) => {
  const handleToggle = () => {
    if (!disabled && onToggle) {
      onToggle(!isOn);
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-2 cursor-pointer select-none",
        { "cursor-not-allowed opacity-50": disabled },
        className
      )}
      onClick={handleToggle}
    >
      {/* Toggle Switch */}
      <div
        className={clsx(
          "relative inline-flex items-center h-5 w-[34px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          {
            "bg-[#690007]": isOn && !disabled,
            "bg-[#EAECF0]": !isOn && !disabled,
            "cursor-not-allowed": disabled,
          }
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
            {
              "translate-x-[14px]": isOn,
              "translate-x-0": !isOn,
            }
          )}
        />
      </div>

      {/* Label */}
      {label && (
        <span
          className={clsx("text-sm font-medium", { "text-gray-400": disabled })}
        >
          {label}
        </span>
      )}
    </div>
  );
};

Toggle.propTypes = {
  isOn: PropTypes.bool,
  onToggle: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Toggle;
