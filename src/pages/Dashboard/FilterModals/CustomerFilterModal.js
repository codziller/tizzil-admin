import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import Select from "components/General/Input/Select";
import Checkbox from "components/General/Checkbox";
import { Button } from "components/General/Button";
import PriceSlider from "components/General/PriceSlider";

const CustomerFilterModal = ({ active, onClose, onApplyFilters, currentFilters = {} }) => {
  const [customerType, setCustomerType] = useState(currentFilters.customerType || "");
  const [dateFrom, setDateFrom] = useState(currentFilters.dateFrom || "");
  const [dateTo, setDateTo] = useState(currentFilters.dateTo || "");
  const [minTotalSpent, setMinTotalSpent] = useState(currentFilters.minTotalSpent || "");
  const [maxTotalSpent, setMaxTotalSpent] = useState(currentFilters.maxTotalSpent || "");
  const [minOrderCount, setMinOrderCount] = useState(currentFilters.minOrderCount || "");
  const [sortDirection, setSortDirection] = useState(currentFilters.sortDirection || "");
  const [sortOrder, setSortOrder] = useState(currentFilters.sortOrder || "");

  // Customer type options
  const customerTypeOptions = [
    { label: "All Customers", value: "" },
    { label: "Registered Customers", value: "registered" },
    { label: "Guest Customers", value: "guest" },
  ];

  // Sort direction options
  const sortDirectionOptions = [
    { label: "Ascending", value: "ASC" },
    { label: "Descending", value: "DESC" },
  ];

  // Sort order options
  const sortOrderOptions = [
    { label: "Total Spent", value: "totalSpent" },
    { label: "Total Orders", value: "totalOrders" },
    { label: "First Order Date", value: "firstOrderDate" },
    { label: "Last Order Date", value: "lastOrderDate" },
  ];

  const handleApply = () => {
    const filters = {
      customerType,
      dateFrom,
      dateTo,
      minTotalSpent,
      maxTotalSpent,
      minOrderCount,
      sortDirection,
      sortOrder,
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setCustomerType("");
    setDateFrom("");
    setDateTo("");
    setMinTotalSpent("");
    setMaxTotalSpent("");
    setMinOrderCount("");
    setSortDirection("");
    setSortOrder("");

    const resetFilters = {
      customerType: "",
      dateFrom: "",
      dateTo: "",
      minTotalSpent: "",
      maxTotalSpent: "",
      minOrderCount: "",
      sortDirection: "",
      sortOrder: "",
    };
    onApplyFilters(resetFilters);
    onClose();
  };

  const handleDateReset = () => {
    setDateFrom("");
    setDateTo("");
  };

  const handleSpentReset = () => {
    setMinTotalSpent("");
    setMaxTotalSpent("");
  };

  const handleSortReset = () => {
    setSortDirection("");
    setSortOrder("");
  };

  const handlePriceChange = (min, max) => {
    setMinTotalSpent(min.toString());
    setMaxTotalSpent(max.toString());
  };

  return (
    <Modal
      active={active}
      toggler={onClose}
      title="Filter Customers"
      size="lg"
      footer={
        <div className="flex justify-between gap-3 w-full">
          <Button
            text="Reset all"
            isOutline
            onClick={handleReset}
            className="flex-1"
          />
          <Button
            text="Apply filters"
            onClick={handleApply}
            className="flex-1"
          />
        </div>
      }
    >
      <div className="space-y-6">
        {/* Customer Type */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Customer Type</span>
            <button
              onClick={() => setCustomerType("")}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <Select
            placeholder="Select customer type"
            options={customerTypeOptions}
            value={customerTypeOptions.find((option) => option.value === customerType)}
            onChange={(selected) => setCustomerType(selected?.value || "")}
            fullWidth
          />
        </div>

        {/* Date Range */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Date Range</span>
            <button
              onClick={handleDateReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Total Spent Range */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Total Spent Range</span>
            <button
              onClick={handleSpentReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <PriceSlider
            min={0}
            max={10000000}
            value={[
              minTotalSpent ? parseFloat(minTotalSpent) : 0,
              maxTotalSpent ? parseFloat(maxTotalSpent) : 10000000
            ]}
            onChange={handlePriceChange}
            step={10000}
            formatValue={(value) => `₦${value.toLocaleString()}`}
          />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Min Amount</label>
              <input
                type="number"
                value={minTotalSpent}
                onChange={(e) => setMinTotalSpent(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Max Amount</label>
              <input
                type="number"
                value={maxTotalSpent}
                onChange={(e) => setMaxTotalSpent(e.target.value)}
                placeholder="10000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Minimum Order Count */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Minimum Order Count</span>
            <button
              onClick={() => setMinOrderCount("")}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <input
            type="number"
            value={minOrderCount}
            onChange={(e) => setMinOrderCount(e.target.value)}
            placeholder="Enter minimum number of orders"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Sort Options */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Sort Options</span>
            <button
              onClick={handleSortReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Sort By</label>
              <Select
                placeholder="Select sort field"
                options={sortOrderOptions}
                value={sortOrderOptions.find((option) => option.value === sortOrder)}
                onChange={(selected) => setSortOrder(selected?.value || "")}
                fullWidth
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Direction</label>
              <Select
                placeholder="Select direction"
                options={sortDirectionOptions}
                value={sortDirectionOptions.find((option) => option.value === sortDirection)}
                onChange={(selected) => setSortDirection(selected?.value || "")}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

CustomerFilterModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  currentFilters: PropTypes.object,
};

export default CustomerFilterModal;