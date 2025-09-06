import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiChevronDown, FiTrendingUp } from "react-icons/fi";
import {
  BsClipboardData,
  BsCurrencyDollar,
  BsGraphUp,
  BsCalculator,
  BsBox,
  BsShop,
  BsPeople,
  BsCartCheck,
} from "react-icons/bs";
import { ReactComponent as PieIcon } from "assets/icons/piec-icon.svg";
import RateCard from "../RateCard/RateCard";
import TopItemsCard from "../../General/TopItemsCard";
import Orders from "../../../pages/Dashboard/Orders/features/orders";

const AdminDashboard = () => {
  const [revenueDateFilter, setRevenueDateFilter] = useState("Today");
  const [showRevenueDateDropdown, setShowRevenueDateDropdown] = useState(false);

  const dateFilterOptions = [
    "Today",
    "Yesterday",
    "This week",
    "This month",
    "All Time",
    "Custom date",
  ];

  // Admin rate cards data (8 cards in 4x2 grid)
  const adminRateCards = [
    {
      icon: PieIcon,
      title: "Total Orders",
      rateItems: [
        {
          label: "Total Orders",
          value: "1,247",
          rate: "12.5%",
          type: "up",
        },
      ],
    },
    {
      icon: PieIcon,
      title: "Total Income",
      rateItems: [
        {
          label: "Total Income",
          value: "$89,432",
          rate: "8.2%",
          type: "up",
        },
      ],
    },
    {
      icon: PieIcon,
      title: "Tizzil Revenue",
      rateItems: [
        {
          label: "Tizzil Revenue",
          value: "$23,156",
          rate: "15.3%",
          type: "up",
        },
      ],
    },
    {
      icon: PieIcon,
      title: "Average Order Value",
      rateItems: [
        {
          label: "Average Order Value",
          value: "$71.80",
          rate: "3.2%",
          type: "down",
        },
      ],
    },
    {
      icon: PieIcon,
      title: "Total Product Created",
      rateItems: [
        {
          label: "Total Product Created",
          value: "2,847",
          rate: "18.7%",
          type: "up",
        },
      ],
    },
    {
      icon: PieIcon,
      title: "No. of Active Brands",
      rateItems: [
        {
          label: "No. of Active Brands",
          value: "184",
          rate: "5.1%",
          type: "up",
        },
      ],
    },
    {
      icon: PieIcon,
      title: "Total No. of New Users",
      rateItems: [
        {
          label: "Total No. of New Users",
          value: "3,672",
          rate: "22.4%",
          type: "up",
        },
      ],
    },
    {
      icon: PieIcon,
      title: "No. of Products Sold",
      rateItems: [
        {
          label: "No. of Products Sold",
          value: "5,934",
          rate: "9.8%",
          type: "up",
        },
      ],
    },
  ];

  // Top Items Data
  const topBrandsData = [
    { name: "Versace", value: "₦2,450,000", icon: "https://logo.clearbit.com/versace.com" },
    { name: "Tom Ford", value: "₦1,890,000", icon: "https://logo.clearbit.com/tomford.com" },
    { name: "ZTTW", value: "₦1,650,000" },
    { name: "Zanotti", value: "₦1,320,000", icon: "https://logo.clearbit.com/giuseppezanotti.com" },
    { name: "Balenciaga", value: "₦1,100,000", icon: "https://logo.clearbit.com/balenciaga.com" },
  ];

  const topProductsData = [
    { name: "Luxury Handbag", value: "₦890,000" },
    { name: "Designer Sneakers", value: "₦670,000" },
    { name: "Premium Watch", value: "₦540,000" },
    { name: "Silk Scarf", value: "₦320,000" },
    { name: "Leather Jacket", value: "₦280,000" },
  ];

  const topCustomersData = [
    { name: "John Doe", value: "₦1,200,000" },
    { name: "Jane Smith", value: "₦980,000" },
    { name: "Mike Johnson", value: "₦750,000" },
    { name: "Sarah Wilson", value: "₦650,000" },
    { name: "David Brown", value: "₦540,000" },
  ];

  const topAffiliatesData = [
    { name: "Fashion Influencer A", value: "₦450,000" },
    { name: "Style Blogger B", value: "₦380,000" },
    { name: "Trendsetter C", value: "₦290,000" },
    { name: "Fashion Expert D", value: "₦230,000" },
    { name: "Style Guru E", value: "₦180,000" },
  ];

  const visitorsData = [
    { name: "Organic Search", value: "12,450" },
    { name: "Direct Traffic", value: "8,670" },
    { name: "Social Media", value: "5,890" },
    { name: "Email Campaign", value: "3,220" },
    { name: "Referrals", value: "2,150" },
  ];

  // Progress bar data
  const progressData = [
    {
      title: "Tizzil Revenue",
      value: "21,043/48,345",
      percentage: 43.5,
      color: "#690007",
    },
    {
      title: "Brands Revenue",
      value: "14,058/30,000",
      percentage: 46.9,
      color: "#0CAF60",
    },
    {
      title: "Affiliate Revenue",
      value: "8,234/20,000",
      percentage: 41.2,
      color: "#FFD023",
    },
    {
      title: "Delivery Cost",
      value: "12,456/25,000",
      percentage: 49.8,
      color: "#FE964A",
    },
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
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Page Title */}
      <h1 className="text-[22px] font-bold text-[#111111]">
        Dashboard Overview
      </h1>

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
      {/* TopItemsCard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <TopItemsCard
          title="Top Brands"
          items={topBrandsData}
        />
        <TopItemsCard
          title="Top Products"
          items={topProductsData}
        />
        <TopItemsCard
          title="Top Customers"
          items={topCustomersData}
        />
      </div>

      {/* Pie Chart and Additional Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pie Chart Card (2/5 basis) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <BsGraphUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Pie Chart Analytics</p>
              <p className="text-sm">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Additional TopItemsCards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
          <TopItemsCard
            title="Top Affiliates"
            items={topAffiliatesData}
          />
          <TopItemsCard
            title="Visitors"
            items={visitorsData}
          />
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
        <Orders hideTitle={true} isRecent={true} />
      </div>

    </div>
  );
};

AdminDashboard.propTypes = {
  userRole: PropTypes.string,
};

export default AdminDashboard;
