import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import Select from "components/General/Input/Select";
import { Button } from "components/General/Button";

const BrandFilterModal = ({ active, onClose, onApplyFilters, currentFilters = {}, activeTab = 0 }) => {
  // Approved brands filters
  const [categoryId, setCategoryId] = useState(currentFilters.categoryId || "");
  const [city, setCity] = useState(currentFilters.city || "");
  const [country, setCountry] = useState(currentFilters.country || "");
  const [state, setState] = useState(currentFilters.state || "");

  // Pending brands filters
  const [endDate, setEndDate] = useState(currentFilters.endDate || "");
  const [hasShopifyIntegration, setHasShopifyIntegration] = useState(currentFilters.hasShopifyIntegration);
  const [maxEstimatedMonthlyOrders, setMaxEstimatedMonthlyOrders] = useState(currentFilters.maxEstimatedMonthlyOrders || "");
  const [maxYearsInBusiness, setMaxYearsInBusiness] = useState(currentFilters.maxYearsInBusiness || "");
  const [minEstimatedMonthlyOrders, setMinEstimatedMonthlyOrders] = useState(currentFilters.minEstimatedMonthlyOrders || "");
  const [minYearsInBusiness, setMinYearsInBusiness] = useState(currentFilters.minYearsInBusiness || "");
  const [productImportMethod, setProductImportMethod] = useState(currentFilters.productImportMethod || "");
  const [startDate, setStartDate] = useState(currentFilters.startDate || "");

  // Country options (add more as needed)
  const countryOptions = [
    { label: "All Countries", value: "" },
    { label: "Nigeria", value: "Nigeria" },
    { label: "Ghana", value: "Ghana" },
    { label: "Kenya", value: "Kenya" },
    { label: "South Africa", value: "South Africa" },
  ];

  // State options for Nigeria (add more as needed)
  const stateOptions = [
    { label: "All States", value: "" },
    { label: "Lagos", value: "Lagos" },
    { label: "Abuja", value: "Abuja" },
    { label: "Kano", value: "Kano" },
    { label: "Rivers", value: "Rivers" },
    { label: "Ogun", value: "Ogun" },
    { label: "Kaduna", value: "Kaduna" },
  ];

  // Category options (these should ideally come from a categories API)
  const categoryOptions = [
    { label: "All Categories", value: "" },
    { label: "Fashion", value: "fashion" },
    { label: "Electronics", value: "electronics" },
    { label: "Beauty", value: "beauty" },
    { label: "Sports", value: "sports" },
    { label: "Home & Garden", value: "home-garden" },
    { label: "Books", value: "books" },
  ];

  // Product import method options
  const productImportMethodOptions = [
    { label: "All Methods", value: "" },
    { label: "Manual", value: "manual" },
    { label: "CSV", value: "csv" },
    { label: "Shopify", value: "shopify" },
    { label: "API", value: "api" },
  ];

  // Shopify integration options
  const shopifyIntegrationOptions = [
    { label: "All", value: undefined },
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  // Update filters when currentFilters prop changes
  useEffect(() => {
    setCategoryId(currentFilters.categoryId || "");
    setCity(currentFilters.city || "");
    setCountry(currentFilters.country || "");
    setState(currentFilters.state || "");
    setEndDate(currentFilters.endDate || "");
    setHasShopifyIntegration(currentFilters.hasShopifyIntegration);
    setMaxEstimatedMonthlyOrders(currentFilters.maxEstimatedMonthlyOrders || "");
    setMaxYearsInBusiness(currentFilters.maxYearsInBusiness || "");
    setMinEstimatedMonthlyOrders(currentFilters.minEstimatedMonthlyOrders || "");
    setMinYearsInBusiness(currentFilters.minYearsInBusiness || "");
    setProductImportMethod(currentFilters.productImportMethod || "");
    setStartDate(currentFilters.startDate || "");
  }, [currentFilters]);

  const handleApply = () => {
    if (activeTab === 0) {
      // Approved brands filters
      const filters = {
        categoryId: categoryId || undefined,
        city: city || undefined,
        country: country || undefined,
        state: state || undefined,
      };
      onApplyFilters(filters);
    } else {
      // Pending brands filters
      const filters = {
        city: city || undefined,
        country: country || undefined,
        endDate: endDate || undefined,
        hasShopifyIntegration: hasShopifyIntegration,
        maxEstimatedMonthlyOrders: maxEstimatedMonthlyOrders || undefined,
        maxYearsInBusiness: maxYearsInBusiness || undefined,
        minEstimatedMonthlyOrders: minEstimatedMonthlyOrders || undefined,
        minYearsInBusiness: minYearsInBusiness || undefined,
        productImportMethod: productImportMethod || undefined,
        startDate: startDate || undefined,
        state: state || undefined,
      };
      onApplyFilters(filters);
    }
    onClose();
  };

  const handleReset = () => {
    setCategoryId("");
    setCity("");
    setCountry("");
    setState("");
    setEndDate("");
    setHasShopifyIntegration(undefined);
    setMaxEstimatedMonthlyOrders("");
    setMaxYearsInBusiness("");
    setMinEstimatedMonthlyOrders("");
    setMinYearsInBusiness("");
    setProductImportMethod("");
    setStartDate("");

    if (activeTab === 0) {
      const resetFilters = {
        categoryId: undefined,
        city: undefined,
        country: undefined,
        state: undefined,
      };
      onApplyFilters(resetFilters);
    } else {
      const resetFilters = {
        city: undefined,
        country: undefined,
        endDate: undefined,
        hasShopifyIntegration: undefined,
        maxEstimatedMonthlyOrders: undefined,
        maxYearsInBusiness: undefined,
        minEstimatedMonthlyOrders: undefined,
        minYearsInBusiness: undefined,
        productImportMethod: undefined,
        startDate: undefined,
        state: undefined,
      };
      onApplyFilters(resetFilters);
    }
    onClose();
  };

  const handleLocationReset = () => {
    setCity("");
    setCountry("");
    setState("");
  };

  return (
    <Modal
      active={active}
      toggler={onClose}
      title={`Filter ${activeTab === 0 ? 'Approved' : 'Pending'} Brands`}
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
        {/* Category Filter - Only for approved brands */}
        {activeTab === 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">Category</span>
              <button
                onClick={() => setCategoryId("")}
                className="text-[#690007] text-sm font-bold"
              >
                Reset
              </button>
            </div>
            <Select
              placeholder="Select category"
              options={categoryOptions}
              value={categoryOptions.find((option) => option.value === categoryId)}
              onChange={(selected) => setCategoryId(selected?.value || "")}
              fullWidth
            />
          </div>
        )}

        {/* Location Filters */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Location</span>
            <button
              onClick={handleLocationReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* Country */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Country</label>
              <Select
                placeholder="Select country"
                options={countryOptions}
                value={countryOptions.find((option) => option.value === country)}
                onChange={(selected) => setCountry(selected?.value || "")}
                fullWidth
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">State</label>
              <Select
                placeholder="Select state"
                options={stateOptions}
                value={stateOptions.find((option) => option.value === state)}
                onChange={(selected) => setState(selected?.value || "")}
                fullWidth
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Pending Brands Specific Filters */}
        {activeTab === 1 && (
          <>
            {/* Date Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#111827] text-sm font-bold">Submission Date Range</span>
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="text-[#690007] text-sm font-bold"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#111827] text-sm font-bold">Business Details</span>
                <button
                  onClick={() => {
                    setMinYearsInBusiness("");
                    setMaxYearsInBusiness("");
                    setMinEstimatedMonthlyOrders("");
                    setMaxEstimatedMonthlyOrders("");
                  }}
                  className="text-[#690007] text-sm font-bold"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Min Years in Business</label>
                    <input
                      type="number"
                      value={minYearsInBusiness}
                      onChange={(e) => setMinYearsInBusiness(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Max Years in Business</label>
                    <input
                      type="number"
                      value={maxYearsInBusiness}
                      onChange={(e) => setMaxYearsInBusiness(e.target.value)}
                      placeholder="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Min Monthly Orders</label>
                    <input
                      type="number"
                      value={minEstimatedMonthlyOrders}
                      onChange={(e) => setMinEstimatedMonthlyOrders(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Max Monthly Orders</label>
                    <input
                      type="number"
                      value={maxEstimatedMonthlyOrders}
                      onChange={(e) => setMaxEstimatedMonthlyOrders(e.target.value)}
                      placeholder="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Integration & Method */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#111827] text-sm font-bold">Integration & Import</span>
                <button
                  onClick={() => {
                    setHasShopifyIntegration(undefined);
                    setProductImportMethod("");
                  }}
                  className="text-[#690007] text-sm font-bold"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Shopify Integration</label>
                  <Select
                    placeholder="Select integration status"
                    options={shopifyIntegrationOptions}
                    value={shopifyIntegrationOptions.find((option) => option.value === hasShopifyIntegration)}
                    onChange={(selected) => setHasShopifyIntegration(selected?.value)}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Product Import Method</label>
                  <Select
                    placeholder="Select import method"
                    options={productImportMethodOptions}
                    value={productImportMethodOptions.find((option) => option.value === productImportMethod)}
                    onChange={(selected) => setProductImportMethod(selected?.value || "")}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

BrandFilterModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  currentFilters: PropTypes.object,
  activeTab: PropTypes.number,
};

export default BrandFilterModal;