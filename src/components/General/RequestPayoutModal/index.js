import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { Button } from "components/General/Button";

const RequestPayoutModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [errors, setErrors] = useState({});

  // Mock bank options
  const bankOptions = [
    { label: "Access Bank", value: "access" },
    { label: "GTBank", value: "gtbank" },
    { label: "First Bank", value: "firstbank" },
    { label: "Zenith Bank", value: "zenith" },
    { label: "UBA", value: "uba" },
    { label: "Fidelity Bank", value: "fidelity" },
    { label: "Sterling Bank", value: "sterling" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.bankName) {
      newErrors.bankName = "Please select a bank";
    }

    if (!formData.accountNumber || formData.accountNumber.length < 10) {
      newErrors.accountNumber = "Please enter a valid account number";
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Please enter account name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Reset form on successful submission
      setFormData({
        amount: "",
        bankName: "",
        accountNumber: "",
        accountName: "",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      amount: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal active={isOpen} toggler={onClose} isSideModal={true}>
      <div className="w-full h-full flex flex-col">
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-black">Request Payout</h2>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Enter Amount */}
            <div>
              <Input
                label="Enter Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                fullWidth
                error={errors.amount}
              />
            </div>

            {/* Select Bank */}
            <div>
              <Select
                label="Select Bank"
                options={bankOptions}
                value={formData.bankName}
                onChange={(selected) =>
                  handleInputChange("bankName", selected.value)
                }
                placeholder="Choose a bank"
                fullWidth
                error={errors.bankName}
              />
            </div>

            {/* Account Number */}
            <div>
              <Input
                label="Account Number"
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                placeholder="1234567890"
                fullWidth
                maxLength={10}
                error={errors.accountNumber}
              />
            </div>

            {/* Account Name */}
            <div>
              <Input
                label="Account Name"
                type="text"
                value={formData.accountName}
                onChange={(e) =>
                  handleInputChange("accountName", e.target.value)
                }
                placeholder="John Doe"
                fullWidth
                error={errors.accountName}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex gap-5">
            <Button
              text="Cancel"
              isOutline
              onClick={handleCancel}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              text={isLoading ? "Processing..." : "Continue"}
              onClick={handleSubmit}
              className="flex-1"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

RequestPayoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default RequestPayoutModal;
