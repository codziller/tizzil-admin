import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import Select from "components/General/Input/Select";
import { Button } from "components/General/Button";

const OrderFilterModal = ({ isOpen, onClose, onApply, users = [] }) => {
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");

  // Order status options based on ORDER_STATUS enum
  const statusOptions = [
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Dispatched", value: "DISPATCHED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
  ];

  // Convert users to options for Select component
  const userOptions = users.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id,
  }));

  const selectedStatus = statusOptions.find((option) => option.value === status);
  const selectedUser = userOptions.find((option) => option.value === userId);

  const handleApply = () => {
    onApply({ status, userId });
    onClose();
  };

  const handleReset = () => {
    setStatus("");
    setUserId("");
    onApply({ status: "", userId: "" });
    onClose();
  };

  const handleStatusReset = () => {
    setStatus("");
  };

  const handleUserReset = () => {
    setUserId("");
  };

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      title="Filter Orders"
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
            <span className="text-[#111827] text-sm font-bold">Status</span>
            <button
              onClick={handleStatusReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <Select
            placeholder="Select status"
            options={statusOptions}
            value={selectedStatus}
            onChange={(option) => setStatus(option?.value || "")}
            className="mb-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#111827] text-sm font-bold">User</span>
            <button
              onClick={handleUserReset}
              className="text-[#690007] text-sm font-bold"
            >
              Reset
            </button>
          </div>
          <Select
            placeholder="Select user"
            options={userOptions}
            value={selectedUser}
            onChange={(option) => setUserId(option?.value || "")}
            className="mb-4"
          />
        </div>
      </div>
    </Modal>
  );
};

OrderFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    })
  ),
};

export default OrderFilterModal;