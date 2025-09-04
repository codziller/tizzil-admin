import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { ReactComponent as ChevronUpDown } from "assets/icons/chevron-up-down.svg";

const DateFilter = ({
  options = [],
  selectedOption = null,
  onOptionChange = () => {},
  placeholder = "Select date filter",
  customStyles = {},
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This week", value: "this_week" },
    { label: "This month", value: "this_month" },
    { label: "Last month", value: "last_month" },
    { label: "All time", value: "all_time" },
    { label: "Custom date", value: "custom" },
  ];

  const filterOptions = options.length > 0 ? options : defaultOptions;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    onOptionChange(option);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedOption) {
      return selectedOption.label || selectedOption;
    }
    return placeholder;
  };

  // Default styles that can be overridden
  const defaultDropdownStyles = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #BBBBBB",
    boxShadow: "0px 4px 16px 0px #0000000A",
    padding: "8px",
    fontSize: "16px",
    ...customStyles,
  };

  return (
    <div
      className={classNames("relative inline-block", className)}
      ref={dropdownRef}
    >
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={defaultDropdownStyles}
        className={classNames(
          "flex items-center justify-between gap-2 rounded-md min-w-[150px] text-left transition-colors hover:bg-gray-50",
          {
            "ring-2 ring-blue-500": isOpen,
          }
        )}
        type="button"
      >
        <span
          className="truncate"
          style={{
            color: selectedOption ? "#111111" : "#888888",
            fontSize: defaultDropdownStyles.fontSize,
          }}
        >
          {getDisplayText()}
        </span>
        <ChevronUpDown
          className={classNames("w-4 h-4 flex-shrink-0 transition-transform", {
            "rotate-180": isOpen,
          })}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1 max-h-60 overflow-y-auto">
            {filterOptions.map((option, index) => (
              <button
                key={option.value || index}
                onClick={() => handleOptionClick(option)}
                className={classNames(
                  "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors",
                  {
                    "bg-gray-100 font-medium":
                      selectedOption?.value === option.value,
                    "text-gray-900": true,
                  }
                )}
                type="button"
              >
                {option.label || option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

DateFilter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  selectedOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ]),
  onOptionChange: PropTypes.func,
  placeholder: PropTypes.string,
  customStyles: PropTypes.object,
  className: PropTypes.string,
};

export default DateFilter;
