import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import { Button } from "components/General/Button";

const CollectionFilterModal = ({ isOpen, onClose, onApply }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    onApply({ fromDate, toDate, collectionType, status });
    onClose();
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setCollectionType("");
    setStatus("");
  };

  const handleDateReset = () => {
    setFromDate("");
    setToDate("");
  };

  const handleCollectionTypeReset = () => {
    setCollectionType("");
  };

  const handleStatusReset = () => {
    setStatus("");
  };

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      title="Filter Collections"
      size="md"
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
            <span className="text-[#111827] text-sm font-bold">Collection Type</span>
            <button
              onClick={handleCollectionTypeReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <select
            value={collectionType}
            onChange={(e) => setCollectionType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select collection type</option>
            <option value="seasonal">Seasonal</option>
            <option value="featured">Featured</option>
            <option value="bestsellers">Bestsellers</option>
            <option value="new-arrivals">New Arrivals</option>
            <option value="custom">Custom</option>
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
    </Modal>
  );
};

CollectionFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default CollectionFilterModal;