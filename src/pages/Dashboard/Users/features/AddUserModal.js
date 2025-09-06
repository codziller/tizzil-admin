import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal";
import { Button } from "components/General/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";

const AddUserModal = ({ active, onClose, onSubmit, adminNavItems }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    permissions: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert adminNavItems to permission options
  const permissionOptions = adminNavItems.map((item) => ({
    label: item.label,
    value: item.id,
  }));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePermissionsChange = (selectedOptions) => {
    const permissions = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    handleInputChange("permissions", permissions);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "Please select at least one permission";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        permissions: [],
      });
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      permissions: [],
    });
    setErrors({});
    onClose();
  };

  const getSelectedPermissions = () => {
    return permissionOptions.filter((option) =>
      formData.permissions.includes(option.value)
    );
  };

  return (
    <Modal active={active} toggler={handleClose} modalTitle="Add New User">
      <div className="flex flex-col gap-6">
        {/* Name Fields Row */}
        <div className="flex gap-5">
          <div className="flex-1">
            <Input
              label="Enter first name"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={errors.firstName}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Enter last name"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={errors.lastName}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <Input
            label="Enter email"
            placeholder="Email address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
          />
        </div>

        {/* Password Field */}
        <div>
          <Input
            label="Enter password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
          />
        </div>

        {/* Permissions Field */}
        <div>
          <Select
            label="Select permissions"
            placeholder="Choose permissions"
            options={permissionOptions}
            value={getSelectedPermissions()}
            onChange={handlePermissionsChange}
            isMulti
            fullWidth
            error={errors.permissions}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            text="Cancel"
            onClick={handleClose}
            isOutline
            className="flex-1"
          />
          <Button
            text={isSubmitting ? "Adding..." : "Add User"}
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            className="flex-1"
          />
        </div>
      </div>
    </Modal>
  );
};

AddUserModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  adminNavItems: PropTypes.array.isRequired,
};

export default AddUserModal;
