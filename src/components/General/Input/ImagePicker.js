import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { isEmpty, isString } from "lodash";

import { ReactComponent as Gallery } from "assets/icons/upload-icon.svg";
import { FormErrorMessage } from "../FormErrorMessage";
import ImageList from "./ImageList";
import { TbDimensions } from "react-icons/tb";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 1,
  borderRadius: 8,
  borderColor: "#000000",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function ImagePicker({
  handleDrop,
  images,
  setImages,
  label,
  showFormError,
  formError,
  removeImage,
  placeholder = "Drag 'n' drop some images here, or click to select images",
  type = "image",
  multiple,
  isRequired,
  isBanner,
  isPost,
  isMarketingImg,
  dimension,
  ...rest
}) {
  const imageArray = isString(images) ? [images] : images;

  const isError = formError && showFormError;
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        ...(type === "image" && { "image/*": [] }),
        ...(type === "video" && { "video/*": [] }),
      },
      onDrop: handleDrop,
      multiple,
      ...rest,
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject || isError ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject, isError]
  );

  return (
    <div className="flex-col justify-start items-start flex w-full">
      <div className="text-[14px] text-[#555555] flex mb-2">
        {label}
        {isRequired && <span className="text-red text-sm -mt-1 ">*</span>}
      </div>
      <div
        className=" flex flex-col justify-center items-center cursor-pointer gap-4 w-full min-h-[150px] bg-stone-50 rounded-lg"
        {...getRootProps({ style })}
      >
        <input {...getInputProps()} />
        <Gallery />
        <div className="border-2 border-dashed text-center">
          <div className="mb-2">
            <span className="text-[16px] text-[#0D0D12] font-bold">
              Click to upload{" "}
            </span>
            <span className="text-[16px] text-[#667085]">or drag and drop</span>
          </div>
          <p className="text-[14px] text-[#667085]">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </div>

        {dimension ? (
          <p className="flex justify-center items-center gap-1 font-medium text-sm text-blue">
            <TbDimensions size={18} /> Dimension: {dimension?.width}
            <span className="text-red">{"X"}</span>
            {dimension?.height}
          </p>
        ) : null}
        {!isEmpty(imageArray) && (
          <p className="text-xs text-blue-bright">
            {imageArray?.length} {imageArray?.length === 1 ? type : `${type}s`}{" "}
            selected
          </p>
        )}
      </div>

      {imageArray?.[0] ? (
        <ImageList
          images={imageArray || []}
          multiple={multiple}
          type={type}
          removeImage={removeImage}
          isBanner={isBanner}
          isPost={isPost}
          isMarketingImg={isMarketingImg}
          setImages={setImages}
        />
      ) : null}

      <div className="min-h-[13px]">
        {isError && <FormErrorMessage type={formError} />}
      </div>
    </div>
  );
}

ImagePicker.propTypes = {
  images: PropTypes.array,
  handleDrop: PropTypes.func,
  label: PropTypes.string,
  removeImage: PropTypes.func,
  placeholder: PropTypes.string,
  showFormError: PropTypes.bool,
  formError: PropTypes.object,
  isRequired: PropTypes.bool,
  isBanner: PropTypes.bool,
  isPost: PropTypes.bool,
  isMarketingImg: PropTypes.bool,
  dimension: PropTypes.string,
  setImages: PropTypes.func,
  type: PropTypes.string,
  multiple: PropTypes.bool,
};
