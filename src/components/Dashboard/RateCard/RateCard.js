import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiChevronDown, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const RateCard = ({
  icon: Icon,
  rateItems = [],
  hasDateFilter = true,
  title,
  className = "",
  cardStyle = "default", // "default", "dark", "admin"
}) => {
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const dateFilterOptions = [
    "Today",
    "Yesterday",
    "This week",
    "This month",
    "All Time",
    "Custom date",
  ];

  const getCardStyles = () => {
    switch (cardStyle) {
      case "dark":
        return "bg-[#050505] text-white";
      case "admin":
        return "bg-white border border-[#E5E7EB]";
      default:
        return "bg-white border border-[#E5E7EB]";
    }
  };

  const renderRateIndicator = (rate, type) => {
    if (!rate) return null;

    const isPositive = type === "up" || (!type && !rate.startsWith("-"));
    const color = isPositive ? "#22C55E" : "#FD6A6A";
    const IconComponent = isPositive ? FiTrendingUp : FiTrendingDown;

    return (
      <div className="flex items-center gap-1 ml-2">
        <IconComponent size={12} color={color} />
        <span className="text-xs font-medium" style={{ color }}>
          {isPositive && !rate.startsWith("+") ? "+" : ""}
          {rate}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`rounded-lg px-[18px] py-[10px] ${getCardStyles()} ${className}`}
    >
      {/* Top Section */}
      <div className={`flex w-full ${cardStyle === "admin" ? "justify-between mb-[6px]" : "justify-between items-center mb-[30px]"}`}>
        {/* Title and Icon - reversed for admin */}
        {cardStyle === "admin" ? (
          <>
            {/* Title on left for admin */}
            {title && (
              <span className="text-sm text-[#888888]">
                {title}
              </span>
            )}
            {/* Icon on right for admin */}
            {Icon && (
              <Icon className="w-5 h-5 text-gray-600" />
            )}
          </>
        ) : (
          /* Default layout for non-admin */
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon className="w-5 h-5" />
            )}
            {title && (
              <span
                className={`text-sm ${
                  cardStyle === "dark" ? "text-white" : "text-[#888888]"
                }`}
              >
                {title}
              </span>
            )}
          </div>
        )}

        {/* Date Filter (only for non-admin cards) */}
        {hasDateFilter && cardStyle !== "admin" && (
          <div className="relative">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="flex items-center gap-2 text-xs text-[#6D7280] hover:text-[#374151] transition-colors"
            >
              <span>{selectedFilter}</span>
              <div className="flex items-center gap-1">
                {/* <div className="w-2 h-1 bg-[#9CA3AF] rounded-full"></div> */}
                <FiChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showDateFilter ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Date Filter Dropdown */}
            {showDateFilter && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-20">
                {dateFilterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setShowDateFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors ${
                      selectedFilter === option ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Card Special Header */}
      {cardStyle === "admin" && (
        <div className="border-b border-[rgba(17,55,112,0.24)] pb-1.5 mb-4">
          {/* Content handled above in flex container */}
        </div>
      )}

      {/* Rate Items Grid */}
      <div
        className={`grid gap-4 ${
          rateItems.length === 3
            ? "grid-cols-3"
            : rateItems.length === 2
            ? "grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {rateItems.map((item, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="flex items-center">
              <div className="flex flex-col">
                {/* Value */}
                <div className="flex items-center">
                  <span
                    className={`text-lg font-bold ${
                      cardStyle === "dark" ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>

                {/* Rate indicator for admin cards - 4px below value */}
                {cardStyle === "admin" && item.rate && (
                  <div className="mt-1">
                    {renderRateIndicator(item.rate, item.type)}
                  </div>
                )}

                {/* Label - hidden for admin cards */}
                {cardStyle !== "admin" && (
                  <span
                    className={`text-sm mt-3 ${
                      cardStyle === "dark"
                        ? "text-white opacity-80"
                        : "text-[#888888]"
                    }`}
                  >
                    {item.label}
                  </span>
                )}

                {/* Rate indicator for non-admin cards */}
                {cardStyle !== "admin" && item.rate && (
                  <div className="mt-1">
                    {renderRateIndicator(item.rate, item.type)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Click outside to close dropdown */}
      {showDateFilter && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDateFilter(false)}
        />
      )}
    </div>
  );
};

RateCard.propTypes = {
  icon: PropTypes.elementType,
  rateItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      rate: PropTypes.string,
      type: PropTypes.oneOf(["up", "down", ""]),
    })
  ).isRequired,
  hasDateFilter: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  cardStyle: PropTypes.oneOf(["default", "dark", "admin"]),
};

export default RateCard;
