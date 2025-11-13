import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ImageSelection from "components/General/Input/ImageSelection";
import ImageCropper from "components/General/Input/ImageCropper";
import { observer } from "mobx-react-lite";
import { ReactComponent as GalleryIcon } from "assets/icons/gallery-icon.svg";
import { MdClose } from "react-icons/md";

const AccountSetupThree = ({ formData, updateFormData, hideTitle = false }) => {
  const [showCropper, setShowCropper] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const schema = yup.object({
    logo: yup.mixed().required("Please upload a logo"),
    banner: yup.mixed(), // Optional
  });

  const defaultValues = {
    logo: formData?.logo || null,
    banner: formData?.banner || null,
  };

  const {
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
    updateFormData({ [prop]: val });
  };

  const form = {
    logo: watch("logo"),
    banner: watch("banner"),
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
    handleChange(currentImageType, croppedFile);
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

  const removeImage = (type) => {
    handleChange(type, null);
    if (type === "logo" && logoInputRef.current) {
      logoInputRef.current.value = "";
    } else if (type === "banner" && bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  const renderImageUpload = (type, label, accept, aspectRatio, required = false) => {
    const imageFile = type === "logo" ? form.logo : form.banner;
    const inputRef = type === "logo" ? logoInputRef : bannerInputRef;
    const error = type === "logo" ? errors.logo?.message : errors.banner?.message;

    return (
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#374151] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="flex gap-3">
          {/* Upload box */}
          <div
            className="flex-shrink-0 w-12 h-11 border border-solid cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
            onClick={() => inputRef.current?.click()}
          >
            <GalleryIcon />
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={(e) => handleFileSelect(type, e)}
              className="hidden"
            />
          </div>

          {/* File input field */}
          <div className="flex-1">
            <input
              type="text"
              value={imageFile ? "Image selected" : ""}
              placeholder="Click the gallery icon to select an image"
              readOnly
              className={`relative h-11 w-full flex items-center font-normal outline-none transition-all duration-300 ease-in-out text-base leading-relaxed border border-solid px-3 cursor-pointer ${
                imageFile
                  ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
                  : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
              }`}
              onClick={() => inputRef.current?.click()}
            />
          </div>
        </div>

        {/* Image preview */}
        {imageFile && (
          <div className="mt-3 relative inline-block">
            <img
              src={URL.createObjectURL(imageFile)}
              alt={`${type} preview`}
              className={`${
                type === "logo" ? "w-24 h-24" : "w-48 h-27"
              } object-cover rounded-lg border border-gray-300`}
            />
            <button
              type="button"
              onClick={() => removeImage(type)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <MdClose size={12} />
            </button>
          </div>
        )}

        {/* Error message */}
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  };

  return (
    <div className="w-full">
      {!hideTitle && (
        <h3 className="text-xl font-bold text-[#111111] mb-2">ASSETS</h3>
      )}
      <p className="text-sm text-[#6B7280] mb-6">
        Logo – Square (1:1), will be resized to 96×96px
        <br />
        Banner – Widescreen (16:9)
      </p>

      <div className="flex flex-col space-y-6">
        {renderImageUpload("logo", "Logo upload", "image/jpeg,image/jpg,image/png", 1, true)}
        {renderImageUpload("banner", "Banner image (optional)", "image/jpeg,image/jpg", 16 / 9, false)}
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

AccountSetupThree.propTypes = {
  formData: PropTypes.object,
  updateFormData: PropTypes.func,
  hideTitle: PropTypes.bool,
};

export default observer(AccountSetupThree);
