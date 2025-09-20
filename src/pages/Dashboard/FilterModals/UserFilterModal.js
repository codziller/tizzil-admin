import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import Select from "components/General/Input/Select";
import Checkbox from "components/General/Checkbox";
import { Button } from "components/General/Button";

const UserFilterModal = ({ active, onClose, onApplyFilters, currentFilters = {} }) => {
  const [brandId, setBrandId] = useState(currentFilters.brandId || "");
  const [createdAfter, setCreatedAfter] = useState(currentFilters.createdAfter || "");
  const [createdBefore, setCreatedBefore] = useState(currentFilters.createdBefore || "");
  const [hasOrders, setHasOrders] = useState(currentFilters.hasOrders ?? "");
  const [isDeleted, setIsDeleted] = useState(currentFilters.isDeleted ?? "");
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(currentFilters.isEmailConfirmed ?? "");

  // Boolean options for filters
  const booleanOptions = [
    { label: "All", value: "" },
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const handleApply = () => {
    const filters = {
      brandId: brandId || undefined,
      createdAfter: createdAfter || undefined,
      createdBefore: createdBefore || undefined,
      hasOrders: hasOrders !== "" ? hasOrders : undefined,
      isDeleted: isDeleted !== "" ? isDeleted : undefined,
      isEmailConfirmed: isEmailConfirmed !== "" ? isEmailConfirmed : undefined,
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setBrandId("");
    setCreatedAfter("");
    setCreatedBefore("");
    setHasOrders("");
    setIsDeleted("");
    setIsEmailConfirmed("");

    const resetFilters = {
      brandId: undefined,
      createdAfter: undefined,
      createdBefore: undefined,
      hasOrders: undefined,
      isDeleted: undefined,
      isEmailConfirmed: undefined,
    };
    onApplyFilters(resetFilters);
    onClose();
  };

  const handleDateReset = () => {
    setCreatedAfter("");
    setCreatedBefore("");
  };

  const handleBooleanReset = () => {
    setHasOrders("");
    setIsDeleted("");
    setIsEmailConfirmed("");
  };

  return (
    <Modal
      active={active}
      toggler={onClose}
      title="Filter Users"
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
        {/* Brand ID */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Brand ID</span>
            <button
              onClick={() => setBrandId("")}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <input
            type="text"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            placeholder="Enter brand ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Date Range */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Created Date Range</span>
            <button
              onClick={handleDateReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Created After</label>
              <input
                type="date"
                value={createdAfter}
                onChange={(e) => setCreatedAfter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Created Before</label>
              <input
                type="date"
                value={createdBefore}
                onChange={(e) => setCreatedBefore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Boolean Filters */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">User Status Filters</span>
            <button
              onClick={handleBooleanReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* Has Orders */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Has Orders</label>
              <Select
                placeholder="Select option"
                options={booleanOptions}
                value={booleanOptions.find((option) => option.value === hasOrders)}
                onChange={(selected) => setHasOrders(selected?.value ?? "")}
                fullWidth
              />
            </div>

            {/* Is Deleted */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Is Deleted</label>
              <Select
                placeholder="Select option"
                options={booleanOptions}
                value={booleanOptions.find((option) => option.value === isDeleted)}
                onChange={(selected) => setIsDeleted(selected?.value ?? "")}
                fullWidth
              />
            </div>

            {/* Is Email Confirmed */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Is Email Confirmed</label>
              <Select
                placeholder="Select option"
                options={booleanOptions}
                value={booleanOptions.find((option) => option.value === isEmailConfirmed)}
                onChange={(selected) => setIsEmailConfirmed(selected?.value ?? "")}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

UserFilterModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  currentFilters: PropTypes.object,
};

export default UserFilterModal;