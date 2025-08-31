import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiChevronDown, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { 
  BsClipboardData, 
  BsCurrencyDollar, 
  BsGraphUp, 
  BsCalculator,
  BsBox,
  BsShop,
  BsPeople,
  BsCartCheck 
} from 'react-icons/bs';
import RateCard from '../RateCard/RateCard';

const AdminDashboard = () => {
  const [revenueDateFilter, setRevenueDateFilter] = useState('Today');
  const [showRevenueDateDropdown, setShowRevenueDateDropdown] = useState(false);

  const dateFilterOptions = ["Today", "Yesterday", "This week", "This month", "All Time", "Custom date"];

  // Admin rate cards data (8 cards in 4x2 grid)
  const adminRateCards = [
    {
      icon: BsClipboardData,
      title: "Total Orders",
      rateItems: [{ 
        label: "Total Orders", 
        value: "1,247", 
        rate: "12.5%", 
        type: "up" 
      }]
    },
    {
      icon: BsCurrencyDollar,
      title: "Total Income", 
      rateItems: [{ 
        label: "Total Income", 
        value: "$89,432", 
        rate: "8.2%", 
        type: "up" 
      }]
    },
    {
      icon: BsGraphUp,
      title: "Tizzil Revenue",
      rateItems: [{ 
        label: "Tizzil Revenue", 
        value: "$23,156", 
        rate: "15.3%", 
        type: "up" 
      }]
    },
    {
      icon: BsCalculator,
      title: "Average Order Value",
      rateItems: [{ 
        label: "Average Order Value", 
        value: "$71.80", 
        rate: "3.2%", 
        type: "down" 
      }]
    },
    {
      icon: BsBox,
      title: "Total Product Created",
      rateItems: [{ 
        label: "Total Product Created", 
        value: "2,847", 
        rate: "18.7%", 
        type: "up" 
      }]
    },
    {
      icon: BsShop,
      title: "No. of Active Brands",
      rateItems: [{ 
        label: "No. of Active Brands", 
        value: "184", 
        rate: "5.1%", 
        type: "up" 
      }]
    },
    {
      icon: BsPeople,
      title: "Total No. of New Users",
      rateItems: [{ 
        label: "Total No. of New Users", 
        value: "3,672", 
        rate: "22.4%", 
        type: "up" 
      }]
    },
    {
      icon: BsCartCheck,
      title: "No. of Products Sold",
      rateItems: [{ 
        label: "No. of Products Sold", 
        value: "5,934", 
        rate: "9.8%", 
        type: "up" 
      }]
    }
  ];

  // Progress bar data
  const progressData = [
    { 
      title: "Tizzil Revenue", 
      value: "21,043/48,345", 
      percentage: 43.5,
      color: "#690007" 
    },
    { 
      title: "Brands Revenue", 
      value: "14,058/30,000", 
      percentage: 46.9,
      color: "#0CAF60" 
    },
    { 
      title: "Affiliate Revenue", 
      value: "8,234/20,000", 
      percentage: 41.2,
      color: "#FFD023" 
    },
    { 
      title: "Delivery Cost", 
      value: "12,456/25,000", 
      percentage: 49.8,
      color: "#FE964A" 
    }
  ];

  const ProgressBar = ({ title, value, percentage, color }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-[#111827]">{title}</span>
        <span className="text-xs text-[#718096]">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color 
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-[22px] font-bold text-[#111111]">Dashboard Overview</h1>

      {/* Admin Rate Cards - 4 per row on desktop, 3 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {adminRateCards.map((cardData, index) => (
          <RateCard
            key={index}
            icon={cardData.icon}
            title={cardData.title}
            rateItems={cardData.rateItems}
            hasDateFilter={false}
            cardStyle="admin"
          />
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Section - Placeholder for future graph */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <BsGraphUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Analytics Graph</p>
              <p className="text-sm">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Right Section - Revenue */}
        <div className="bg-white rounded-lg border border-[#E5E7EB]">
          <div className="px-[18px] py-[14px] border-b border-[#EAEBF0] flex justify-between items-center">
            <h3 className="text-base font-bold text-[#111827]">Revenue</h3>
            <div className="relative">
              <button
                onClick={() => setShowRevenueDateDropdown(!showRevenueDateDropdown)}
                className="flex items-center gap-2 text-xs text-[#6D7280] hover:text-[#374151] transition-colors"
              >
                <span>{revenueDateFilter}</span>
                <FiChevronDown className="w-3 h-3" />
              </button>
              {showRevenueDateDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-20">
                  {dateFilterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setRevenueDateFilter(option);
                        setShowRevenueDateDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Revenue Details */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[22px] font-bold text-[#111827]">$76,345</span>
                <div className="bg-[#0CAF60] px-1 py-0.5 rounded-full flex items-center gap-1">
                  <FiTrendingUp className="w-2 h-2 text-white" />
                  <span className="text-[8px] text-white font-medium">12.00%</span>
                </div>
              </div>
              <p className="text-[10px] text-[#718096]">Compared to last month</p>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {progressData.map((item, index) => (
                <ProgressBar
                  key={index}
                  title={item.title}
                  value={item.value}
                  percentage={item.percentage}
                  color={item.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showRevenueDateDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowRevenueDateDropdown(false)}
        />
      )}
    </div>
  );
};

AdminDashboard.propTypes = {
  userRole: PropTypes.string,
};

export default AdminDashboard;