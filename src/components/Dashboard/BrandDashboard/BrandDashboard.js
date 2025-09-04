import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiChevronDown } from "react-icons/fi";
import RateCard from "../RateCard/RateCard";
import {
  SaleIcon,
  CustomerIcon,
  OrderIcon,
  WalletRateIcon,
  CartRateIcon,
} from "../RateCard/RateCardIcons";
import { ReactComponent as EmptyBagIcon } from "assets/icons/empty-bag-icon.svg";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BrandDashboard = ({ userRole }) => {
  const [selectedGraphOption, setSelectedGraphOption] = useState("Sales");
  const [showGraphDropdown, setShowGraphDropdown] = useState(false);
  const [graphDateFilter, setGraphDateFilter] = useState("Today");
  const [showGraphDateDropdown, setShowGraphDateDropdown] = useState(false);
  const [pieChartDateFilter, setPieChartDateFilter] = useState("Today");
  const [showPieDateDropdown, setShowPieDateDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dateFilterOptions = [
    "Today",
    "Yesterday",
    "This week",
    "This month",
    "All Time",
    "Custom date",
  ];
  const graphOptions = ["Sales", "Orders"];

  // Sample data for rate cards
  const rateCardsData = [
    {
      icon: SaleIcon,
      rateItems: [
        { label: "Sales", value: "₦0.00", rate: "0", type: "" },
        { label: "Volume", value: "0", rate: "", type: "" },
      ],
    },
    {
      icon: CustomerIcon,
      rateItems: [
        { label: "Customers", value: "0", rate: "0", type: "" },
        { label: "New", value: "0", rate: "", type: "" },
      ],
    },
    {
      icon: OrderIcon,
      rateItems: [
        { label: "Orders", value: "0", rate: "0", type: "" },
        { label: "Pending", value: "0", rate: "", type: "" },
      ],
    },
  ];

  // Sample chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: selectedGraphOption,
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "#690007",
        backgroundColor: "rgba(105, 0, 7, 0.1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Sample pie chart data
  const pieData = {
    labels: ["Nigeria", "United States", "Canada", "Others"],
    datasets: [
      {
        data: [4765, 3241, 1876, 982],
        backgroundColor: ["#0062FF", "#0CAF60", "#FFD023", "#FE964A"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const handleDateFilterChange = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-[22px] font-bold text-[#111111]">Dashboard</h1>

      {/* Rate Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {rateCardsData.map((cardData, index) => (
          <RateCard
            key={index}
            icon={cardData.icon}
            rateItems={cardData.rateItems}
          />
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Section - Graph */}
        <div className="lg:col-span-2 space-y-5">
          {/* Graph Card */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            {/* Graph Header */}
            <div className="px-[18px] py-[14px] border-b border-[#EAEBF0] flex justify-between items-center">
              <div className="relative">
                <button
                  onClick={() => setShowGraphDropdown(!showGraphDropdown)}
                  className="flex items-center gap-2 text-base text-[#050505] hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                >
                  <span>{selectedGraphOption}</span>
                  <FiChevronDown className="w-4 h-4" />
                </button>
                {showGraphDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-20">
                    {graphOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedGraphOption(option);
                          setShowGraphDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowGraphDateDropdown(!showGraphDateDropdown);
                    handleDateFilterChange();
                  }}
                  className="flex items-center gap-2 text-xs text-[#6D7280] hover:text-[#374151] transition-colors"
                >
                  <span>{graphDateFilter}</span>
                  <FiChevronDown className="w-3 h-3" />
                </button>
                {showGraphDateDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-20">
                    {dateFilterOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setGraphDateFilter(option);
                          setShowGraphDateDropdown(false);
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

            {/* Graph Content */}
            <div className="p-4 h-[300px] flex items-center justify-center">
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Pie Chart Card */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E7EB]">
              <div className="px-[18px] py-[14px] border-b border-[#EAEBF0] flex justify-between items-center">
                <h3 className="text-base text-[#050505]">
                  Customer Demographics
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowPieDateDropdown(!showPieDateDropdown)}
                    className="flex items-center gap-2 text-xs text-[#6D7280] hover:text-[#374151] transition-colors"
                  >
                    <span>{pieChartDateFilter}</span>
                    <FiChevronDown className="w-3 h-3" />
                  </button>
                  {showPieDateDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-20">
                      {dateFilterOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setPieChartDateFilter(option);
                            setShowPieDateDropdown(false);
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
              <div className="p-4 flex items-center">
                <div className="w-[150px] h-[150px]">
                  <Pie data={pieData} options={pieOptions} />
                </div>
                <div className="ml-5 space-y-3">
                  {pieData.labels.map((label, index) => (
                    <div
                      key={label}
                      className="flex items-center justify-between min-w-[150px]"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              pieData.datasets[0].backgroundColor[index],
                          }}
                        />
                        <span className="text-sm text-[#111827]">{label}</span>
                      </div>
                      <span className="text-sm text-[#576477]">
                        {pieData.datasets[0].data[index].toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rate Cards Column */}
            <div className="space-y-5">
              <RateCard
                icon={WalletRateIcon}
                rateItems={[
                  { label: "All Products", value: "24" },
                  { label: "Active", value: "18" },
                ]}
                hasDateFilter={false}
                cardStyle="dark"
              />
              <RateCard
                icon={CartRateIcon}
                rateItems={[
                  { label: "Abandoned Cart", value: "12" },
                  { label: "Checkout rate", value: "78%" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Recent Orders */}
        <div className="bg-white rounded-lg border border-[#E5E7EB]">
          <div className="px-[18px] py-[14px] border-b border-[#EAEBF0]">
            <h3 className="text-base text-[#050505]">Recent Orders</h3>
          </div>
          <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
            <EmptyBagIcon className="mb-4" />
            <h4 className="text-lg font-bold text-[#050505] mb-2">
              No Orders Yet
            </h4>
            <p className="text-sm text-[#6D7280] text-center">
              Add products to your store and start selling to see orders here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

BrandDashboard.propTypes = {
  userRole: PropTypes.string,
};

export default BrandDashboard;
