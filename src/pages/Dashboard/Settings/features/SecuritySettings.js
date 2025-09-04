import React, { useState } from "react";
import Input from "components/General/Input/Input";
import Button from "components/General/Button/Button";

const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (value, meta) => {
    setFormData((prev) => ({
      ...prev,
      [meta.name]: value,
    }));

    // Clear error when user starts typing
    if (errors[meta.name]) {
      setErrors((prev) => ({
        ...prev,
        [meta.name]: null,
      }));
    }
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
  };

  const handleSave = () => {
    const newErrors = {};

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = { message: "Current password is required" };
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = { message: "New password is required" };
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = {
        message:
          "Password must be at least 8 characters with uppercase, lowercase, and number",
      };
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = { message: "Please confirm your password" };
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = { message: "Passwords do not match" };
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Saving security settings:", formData);
      // Handle save logic here
      // Reset form after successful save
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleCancel = () => {
    console.log("Cancelling security changes");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const isNewPasswordValid =
    formData.newPassword && validatePassword(formData.newPassword);

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-10">
        <h2
          style={{
            fontSize: "17px",
            fontWeight: "bold",
            color: "#050505",
            marginBottom: "6px",
          }}
        >
          Security
        </h2>
        <p style={{ fontSize: "14px", color: "#666666" }}>
          Please enter your current password to change your password.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: "40px" }}>
        {/* Form Fields */}
        <div className="space-y-6">
          {/* Current Password */}
          <Input
            label="Current password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChangeFunc={handleInputChange}
            placeholder="Enter current password"
            fullWidth
            formError={errors.currentPassword}
            showFormError={!!errors.currentPassword}
          />

          {/* New Password */}
          <div>
            <Input
              label="New password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChangeFunc={handleInputChange}
              placeholder="Enter new password"
              fullWidth
              formError={errors.newPassword}
              showFormError={!!errors.newPassword}
            />
            <div
              style={{
                fontSize: "14px",
                color: "#4B5563",
                marginTop: "4px",
                paddingLeft: "4px",
              }}
            >
              Use at least 8 characters, including an uppercase letter, a
              lowercase letter and a number
            </div>
          </div>

          {/* Confirm Password */}
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChangeFunc={handleInputChange}
            placeholder="Confirm new password"
            fullWidth
            formError={errors.confirmPassword}
            showFormError={!!errors.confirmPassword}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 justify-end mt-9">
          <Button
            text="Cancel"
            isOutline
            onClick={handleCancel}
            textClass="text-sm font-medium"
            className="px-6 py-2"
          />
          <Button
            text="Save"
            onClick={handleSave}
            textClass="text-sm font-medium"
            className="px-6 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
