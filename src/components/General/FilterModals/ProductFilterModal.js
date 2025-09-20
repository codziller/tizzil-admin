import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import Select from "components/General/Input/Select";
import { Button } from "components/General/Button";

const ProductFilterModal = ({ isOpen, onClose, onApply, categories = [] }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [status, setStatus] = useState("");

  // Sort options based on ProductSortBy enum
  const sortOptions = [
    { label: "Best Selling", value: "BESTSELLING" },
    { label: "Newest First", value: "DATE_NEW_TO_OLD" },
    { label: "Oldest First", value: "DATE_OLD_TO_NEW" },
    { label: "Price: High to Low", value: "PRICE_HIGH_TO_LOW" },
    { label: "Price: Low to High", value: "PRICE_LOW_TO_HIGH" },
  ];

  // Convert categories to options for Select component
  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const selectedCategories = categoryOptions.filter((option) =>
    categoryIds.includes(option.value)
  );

  const handleApply = () => {
    onApply({ fromDate, toDate, categoryIds, sortBy, status });
    onClose();
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setCategoryIds([]);
    setSortBy("");
    setStatus("");
    onApply({ fromDate, toDate, categoryIds, sortBy, status });
    onClose();
  };

  const handleDateReset = () => {
    setFromDate("");
    setToDate("");
  };

  const handleCategoryReset = () => {
    setCategoryIds([]);
  };

  const handleSortReset = () => {
    setSortBy("");
  };

  const handleStatusReset = () => {
    setStatus("");
  };

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      title="Filter Products"
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
      <div className="">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Categories</span>
            <button
              onClick={handleCategoryReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <Select
            placeholder="Select categories"
            options={categoryOptions}
            value={selectedCategories}
            onChange={(selected) => {
              const values = Array.isArray(selected)
                ? selected.map((item) => item.value)
                : selected
                ? [selected.value]
                : [];
              setCategoryIds(values);
            }}
            isMulti
            fullWidth
            showSelectedOutside={false}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">Sort By</span>
            <button
              onClick={handleSortReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <Select
            placeholder="Select sort order"
            options={sortOptions}
            value={sortOptions.find((option) => option.value === sortBy)}
            onChange={(selected) => setSortBy(selected?.value || "")}
            fullWidth
          />
        </div>

        {/* <div>
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
        </div> */}
      </div>
    </Modal>
  );
};

ProductFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  categories: PropTypes.array,
};

export default ProductFilterModal;
