import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { isEmpty, isString } from "lodash";
import { useDropzone } from "react-dropzone";

import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Gallery } from "assets/icons/gallery-black.svg";
import { FormErrorMessage } from "../FormErrorMessage";
import classNames from "classnames";
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
      <div className="general-input-label mb-2 relative text-[13px] font-bold text-grey-dark !flex justify-start items-center gap-1.5">
        {label}
        {isRequired && <span className="text-red text-sm -mt-1 ">*</span>}
      </div>
      <div
        className=" flex flex-col justify-center items-center cursor-pointer gap-4 w-full min-h-[150px] bg-stone-50 rounded-lg"
        {...getRootProps({ style })}
      >
        <input {...getInputProps()} />
        <Gallery />
        <p className="text-xs text-grey">{placeholder}</p>

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

      <div className="min-h-[13px] mb-4">
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
};
