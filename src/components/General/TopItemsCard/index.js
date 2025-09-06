import React, { useState } from "react";
import PropTypes from "prop-types";
import DateFilter from "../DateFilter";

const TopItemsCard = ({ 
  title, 
  items = [], 
  showDateFilter = true,
  className = "" 
}) => {
  const [selectedFilter, setSelectedFilter] = useState({ label: "Today", value: "today" });

  // Generate alternating background colors for items
  const getItemBackgroundColor = (index) => {
    return index % 2 === 0 ? "#F9FAFB" : "#FFFFFF";
  };

  // Generate different colors for circle backgrounds when no icon
  const getCircleColors = () => [
    "#EF4444", "#F97316", "#EAB308", "#22C55E", "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899"
  ];

  const handleDateFilterChange = (option) => {
    setSelectedFilter(option);
  };

  return (
    <div className={`bg-white rounded-2xl p-4 ${className}`}>
      {/* Top Row - Title and Date Filter */}
      <div className="flex items-center justify-between mb-3">
        {/* Title */}
        <h3 className="text-base font-medium text-[#718096]">
          {title}
        </h3>

        {/* Date Filter */}
        {showDateFilter && (
          <DateFilter
            selectedOption={selectedFilter}
            onOptionChange={handleDateFilterChange}
            customStyles={{
              fontSize: "14px",
              padding: "6px 12px",
            }}
            className="text-sm"
          />
        )}
      </div>

      {/* Items List */}
      <div className="space-y-0">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-full px-2 py-1 transition-colors"
            style={{ backgroundColor: getItemBackgroundColor(index) }}
          >
            {/* Left Side - Icon/Circle and Name */}
            <div className="flex items-center gap-2">
              {/* Icon or Colored Circle */}
              {item.icon ? (
                <img 
                  src={item.icon} 
                  alt={`${item.name} logo`}
                  className="w-4 h-4 object-contain rounded-full"
                />
              ) : (
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ 
                    backgroundColor: getCircleColors()[index % getCircleColors().length] 
                  }}
                />
              )}
              
              {/* Item Name */}
              <span className="text-xs text-[#111827] font-medium">
                {item.name}
              </span>
            </div>

            {/* Right Side - Value */}
            <span className="text-xs text-[#718096] font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="py-8 text-center">
          <span className="text-sm text-[#718096]">No items to display</span>
        </div>
      )}
    </div>
  );
};

TopItemsCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      icon: PropTypes.string, // Optional icon URL
    })
  ),
  showDateFilter: PropTypes.bool,
  className: PropTypes.string,
};

export default TopItemsCard;