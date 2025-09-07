import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import { Button } from "components/General/Button";

const CategoryFilterModal = ({ isOpen, onClose, onApply }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    onApply({ fromDate, toDate, category, status });
    onClose();
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setCategory("");
    setStatus("");
  };

  const handleDateReset = () => {
    setFromDate("");
    setToDate("");
  };

  const handleCategoryReset = () => {
    setCategory("");
  };

  const handleStatusReset = () => {
    setStatus("");
  };

  return (
    <Modal active={isOpen} toggler={onClose}>
      <div className="w-full max-w-md mx-auto bg-white rounded-lg p-4">
        <h3 className="text-[#111827] text-base font-bold mb-6">Filter Categories</h3>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">
                Date created
              </span>
              <button
                onClick={handleDateReset}
                className="text-[#690007] text-sm font-bold"
              >
                Reset
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                placeholder="From"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="date"
                placeholder="To"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">Category Type</span>
              <button
                onClick={handleCategoryReset}
                className="text-[#690007] text-sm font-bold"
              >
                Reset
              </button>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select category type</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="home-garden">Home & Garden</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">Status</span>
              <button
                onClick={handleStatusReset}
                className="text-[#690007] text-sm font-bold"
              >
                Reset
              </button>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select status</option>
              <option value="live">Live</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between gap-5 mt-9">
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
      </div>
    </Modal>
  );
};

CategoryFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default CategoryFilterModal;