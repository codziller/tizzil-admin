import React, { useState } from "react";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import Textarea from "components/General/Textarea/Textarea";
import Button from "components/General/Button/Button";
import { ReactComponent as UploadIcon } from "assets/icons/upload-icon.svg";

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    brandName: "Tizzil Sample Brand",
    email: "sample@tizzil.com",
    country: { value: "nigeria", label: "Nigeria" },
    productCategory: { value: "fashion", label: "Fashion" },
    brandDescription:
      "This is a sample brand description for demonstration purposes.",
    logoUrl: "https://via.placeholder.com/100",
  });

  const countryOptions = [
    { value: "nigeria", label: "Nigeria" },
    { value: "ghana", label: "Ghana" },
    { value: "kenya", label: "Kenya" },
    { value: "south_africa", label: "South Africa" },
    { value: "usa", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "canada", label: "Canada" },
  ];

  const categoryOptions = [
    { value: "fashion", label: "Fashion" },
    { value: "beauty", label: "Beauty" },
    { value: "electronics", label: "Electronics" },
    { value: "home", label: "Home & Garden" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "books", label: "Books" },
    { value: "toys", label: "Toys & Games" },
    { value: "food", label: "Food & Beverages" },
  ];

  const handleInputChange = (value, meta) => {
    setFormData((prev) => ({
      ...prev,
      [meta.name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, meta) => {
    setFormData((prev) => ({
      ...prev,
      [meta.name]: selectedOption,
    }));
  };

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    // Handle save logic here
  };

  const handleCancel = () => {
    console.log("Cancelling profile changes");
    // Handle cancel logic here
  };

  const handleImageUpload = () => {
    console.log("Upload image");
    // Handle image upload logic here
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: "",
    }));
  };

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
          Profile
        </h2>
        <p style={{ fontSize: "14px", color: "#666666" }}>
          Update your photo and personal details.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: "40px" }}>
        {/* Business Logo Section */}
        <div className="flex flex-col md:flex-row mb-6">
          {/* Logo Image */}
          <div className="mb-4 md:mb-0">
            {formData.logoUrl ? (
              <img
                src={formData.logoUrl}
                alt="Business Logo"
                className="w-[100px] h-[100px] rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <span className="text-gray-500 text-sm">No Logo</span>
              </div>
            )}
          </div>

          {/* Logo Controls */}
          <div
            className="flex flex-col ml-0 md:ml-6"
            style={{ marginLeft: "22px" }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#6D7280",
                marginBottom: "16px",
              }}
            >
              Business logo
            </div>
            <div className="flex flex-row gap-4">
              <Button
                text="Upload image"
                blackBg
                icon={
                  <UploadIcon
                    className="w-4 h-4"
                    style={{ filter: "invert(1)" }}
                  />
                }
                onClick={handleImageUpload}
                textClass="text-sm font-medium"
                className="px-4 py-2"
              />
              <Button
                text="Remove"
                isOutline={false}
                whiteBg
                textColor="050505"
                borderColor="DDDDDD"
                onClick={handleImageRemove}
                textClass="text-sm font-medium"
                className="px-4 py-2"
                innerClassName="!bg-[#DDDDDD] !text-[#050505] hover:!bg-[#CCCCCC]"
              />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6" style={{ marginTop: "24px" }}>
          {/* Brand Name */}
          <Input
            label="Brand Name"
            name="brandName"
            value={formData.brandName}
            onChangeFunc={handleInputChange}
            placeholder="Enter brand name"
            fullWidth
          />

          {/* Email */}
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChangeFunc={handleInputChange}
            placeholder="Enter brand email"
            fullWidth
          />

          {/* Country Selection */}
          <Select
            label="Country"
            name="country"
            options={countryOptions}
            value={formData.country}
            onChange={handleSelectChange}
            placeholder="Select country"
            fullWidth
          />

          {/* Product Category */}
          <Select
            label="Product Category"
            name="productCategory"
            options={categoryOptions}
            value={formData.productCategory}
            onChange={handleSelectChange}
            placeholder="Select category"
            fullWidth
          />

          {/* Brand Description */}
          <Textarea
            label="Brand Description"
            name="brandDescription"
            value={formData.brandDescription}
            onChangeFunc={handleInputChange}
            placeholder="Describe your brand"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 mt-9">
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

export default ProfileSettings;
