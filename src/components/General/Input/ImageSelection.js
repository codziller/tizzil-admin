import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { BsImages } from "react-icons/bs";
import { ReactComponent as GalleryIcon } from "assets/icons/gallery-icon.svg";
import { MdClose } from "react-icons/md";

const ImageSelection = ({
  label,
  value = [],
  onChange,
  multiple = false,
  accept = "image/*",
  maxFiles = 1,
  className = "",
  required = false,
  error = null,
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (accept.includes("image/*")) {
        return file.type.startsWith("image/");
      }
      return accept.split(",").some((type) => file.type.includes(type.trim()));
    });

    if (multiple) {
      const newFiles = [...(value || []), ...validFiles].slice(0, maxFiles);
      onChange(newFiles);
    } else {
      onChange(validFiles[0] || null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (indexToRemove) => {
    if (multiple) {
      const newFiles = value.filter((_, index) => index !== indexToRemove);
      onChange(newFiles);
    } else {
      onChange(null);
    }
  };

  const renderFilePreview = (file, index) => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      return (
        <div key={index} className="relative group">
          <img
            src={objectUrl}
            alt={`Preview ${index + 1}`}
            className="w-24 h-24 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={() => removeFile(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MdClose size={12} />
          </button>
        </div>
      );
    }
    return null;
  };

  const displayFiles = multiple ? value || [] : value ? [value] : [];

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[#374151] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-3">
        {/* Upload box - styled like Input.js container */}
        <div
          className={`flex-shrink-0 w-12 h-11 border border-solid cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center ${
            dragActive
              ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
              : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
          }`}
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <GalleryIcon />
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>

        {/* File input field - styled like Input.js */}
        <div className="flex-1">
          <input
            type="text"
            value={
              displayFiles.length > 0
                ? `${displayFiles.length} file(s) selected`
                : ""
            }
            placeholder="Click the gallery icon to select files"
            readOnly
            className={`relative h-11 w-full flex items-center font-normal outline-none transition-all duration-300 ease-in-out text-base leading-relaxed border border-solid px-3 cursor-pointer ${
              displayFiles.length > 0
                ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
                : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
            }`}
            onClick={handleClick}
          />
        </div>
      </div>

      {/* File previews */}
      {displayFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {displayFiles.map((file, index) => renderFilePreview(file, index))}
        </div>
      )}

      {/* Error message */}
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

ImageSelection.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.arrayOf(PropTypes.instanceOf(File)),
    PropTypes.oneOf([null]),
  ]),
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  maxFiles: PropTypes.number,
  className: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
};

export default ImageSelection;
