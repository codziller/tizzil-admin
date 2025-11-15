import React, { useState, useEffect, useRef } from "react";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import Textarea from "components/General/Textarea/Textarea";
import Button from "components/General/Button/Button";
import IconTypeInput from "components/General/Input/IconTypeInput";
import ImageCropper from "components/General/Input/ImageCropper";
import { ReactComponent as UploadIcon } from "assets/icons/upload-icon.svg";
import { ReactComponent as GalleryIcon } from "assets/icons/gallery-icon.svg";
import { MdClose } from "react-icons/md";
import { getUserInfoFromStorage } from "utils/storage";

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
  { value: "fashion-apparel", label: "Fashion & Apparel" },
  { value: "electronics", label: "Electronics" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "beauty-personal-care", label: "Beauty & Personal Care" },
  { value: "sports-outdoors", label: "Sports & Outdoors" },
  { value: "books", label: "Books" },
  { value: "toys", label: "Toys & Games" },
  { value: "food", label: "Food & Beverages" },
];

const ProfileSettings = () => {
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [formData, setFormData] = useState({
    brandName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: null,
    productCategory: null,
    brandDescription: "",
    logoUrl: "",
    bannerImageUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    websiteUrl: "",
  });

  const [showCropper, setShowCropper] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    // Load brand data from storage
    const userData = getUserInfoFromStorage();
    if (userData) {
      const { brand, user } = userData;

      // Find matching country option
      const countryOption = brand?.country
        ? countryOptions.find(
            (opt) => opt.label.toLowerCase() === brand.country.toLowerCase()
          ) ||
          countryOptions.find(
            (opt) => opt.value.toLowerCase() === brand.country.toLowerCase()
          )
        : null;

      // Find matching category option
      const categoryOption = brand?.productCategory
        ? categoryOptions.find((opt) => opt.value === brand.productCategory) ||
          categoryOptions.find(
            (opt) =>
              opt.label.toLowerCase() === brand.productCategory.toLowerCase()
          )
        : null;

      setFormData({
        brandName: brand?.brandName || "",
        email: user?.email || "",
        addressLine1: brand?.addressLine1 || "",
        addressLine2: brand?.addressLine2 || "",
        city: brand?.city || "",
        state: brand?.state || "",
        postalCode: brand?.postalCode || "",
        country: countryOption,
        productCategory: categoryOption,
        brandDescription: brand?.description || "",
        logoUrl: brand?.logoUrl || "",
        bannerImageUrl: brand?.bannerImageUrl || "",
        instagramUrl: brand?.instagramUrl || "",
        tiktokUrl: brand?.tiktokUrl || "",
        websiteUrl: brand?.websiteUrl || "",
      });
    }
  }, []);

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

  const handleFileSelect = (type, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result);
        setCurrentImageType(type);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile) => {
    if (currentImageType === "logo") {
      setLogoFile(croppedFile);
      setFormData((prev) => ({
        ...prev,
        logoUrl: URL.createObjectURL(croppedFile),
      }));
    } else if (currentImageType === "banner") {
      setBannerFile(croppedFile);
      setFormData((prev) => ({
        ...prev,
        bannerImageUrl: URL.createObjectURL(croppedFile),
      }));
    }
    setShowCropper(false);
    setCurrentImage(null);
    setCurrentImageType(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setCurrentImage(null);
    setCurrentImageType(null);
    // Reset file input
    if (currentImageType === "logo" && logoInputRef.current) {
      logoInputRef.current.value = "";
    } else if (currentImageType === "banner" && bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  const handleImageRemove = (type) => {
    if (type === "logo") {
      setLogoFile(null);
      setFormData((prev) => ({ ...prev, logoUrl: "" }));
      if (logoInputRef.current) logoInputRef.current.value = "";
    } else if (type === "banner") {
      setBannerFile(null);
      setFormData((prev) => ({ ...prev, bannerImageUrl: "" }));
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    console.log("Logo file:", logoFile);
    console.log("Banner file:", bannerFile);
    // Handle save logic here - upload images and update brand data
  };

  const handleCancel = () => {
    console.log("Cancelling profile changes");
    // Reload data from storage or navigate away
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
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => handleFileSelect("logo", e)}
                className="hidden"
              />
              <Button
                text="Upload image"
                blackBg
                icon={
                  <UploadIcon
                    className="w-4 h-4"
                    style={{ filter: "invert(1)" }}
                  />
                }
                onClick={() => logoInputRef.current?.click()}
                textClass="text-sm font-medium"
                className="px-4 py-2"
              />
              <Button
                text="Remove"
                isOutline={false}
                whiteBg
                textColor="050505"
                borderColor="DDDDDD"
                onClick={() => handleImageRemove("logo")}
                textClass="text-sm font-medium"
                className="px-4 py-2"
                innerClassName="!bg-[#DDDDDD] !text-[#050505] hover:!bg-[#CCCCCC]"
              />
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="mb-8">
          <label className="text-sm font-medium text-[#374151] mb-2 block">
            Banner Image (Optional)
          </label>
          <div className="flex gap-3 items-start">
            {/* Upload box */}
            <div
              className="flex-shrink-0 w-12 h-11 border border-solid cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
              onClick={() => bannerInputRef.current?.click()}
            >
              <GalleryIcon />
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => handleFileSelect("banner", e)}
                className="hidden"
              />
            </div>

            {/* File input field */}
            <div className="flex-1">
              <input
                type="text"
                value={formData.bannerImageUrl ? "Banner image selected" : ""}
                placeholder="Click the gallery icon to select a banner image"
                readOnly
                className={`relative h-11 w-full flex items-center font-normal outline-none transition-all duration-300 ease-in-out text-base leading-relaxed border border-solid px-3 cursor-pointer ${
                  formData.bannerImageUrl
                    ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
                    : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
                }`}
                onClick={() => bannerInputRef.current?.click()}
              />
            </div>
          </div>

          {/* Banner preview */}
          {formData.bannerImageUrl && (
            <div className="mt-3 relative inline-block">
              <img
                src={formData.bannerImageUrl}
                alt="banner preview"
                className="w-48 h-27 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => handleImageRemove("banner")}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <MdClose size={12} />
              </button>
            </div>
          )}
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

          {/* Address Line 1 */}
          <Input
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1}
            onChangeFunc={handleInputChange}
            placeholder="Enter street address"
            fullWidth
          />

          {/* Address Line 2 */}
          <Input
            label="Address Line 2 (Optional)"
            name="addressLine2"
            value={formData.addressLine2}
            onChangeFunc={handleInputChange}
            placeholder="Apartment, suite, etc."
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

          {/* City */}
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChangeFunc={handleInputChange}
            placeholder="Enter city"
            fullWidth
          />

          {/* State */}
          <Input
            label="State/Province"
            name="state"
            value={formData.state}
            onChangeFunc={handleInputChange}
            placeholder="Enter state or province"
            fullWidth
          />

          {/* Postal Code */}
          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChangeFunc={handleInputChange}
            placeholder="Enter postal code"
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

          {/* Social Media Links */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-[#050505] mt-6 mb-4">
              Social Media Links (Optional)
            </h3>

            <IconTypeInput
              label="Instagram"
              type="instagram"
              value={formData.instagramUrl}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, instagramUrl: val }))
              }
            />

            <IconTypeInput
              label="TikTok"
              type="tiktok"
              value={formData.tiktokUrl}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, tiktokUrl: val }))
              }
            />

            <IconTypeInput
              label="Website"
              type="website"
              value={formData.websiteUrl}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, websiteUrl: val }))
              }
            />
          </div>
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

      {/* Image Cropper Modal */}
      {showCropper && currentImage && (
        <ImageCropper
          imageSrc={currentImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspect={currentImageType === "logo" ? 1 : 16 / 9}
          cropShape="rect"
          targetWidth={currentImageType === "logo" ? 96 : 1200}
          targetHeight={currentImageType === "logo" ? 96 : 675}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
