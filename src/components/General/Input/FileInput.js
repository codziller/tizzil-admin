import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as DocumentUpload } from "assets/icons/document-upload.svg";
import { convertHeicToJpg } from "utils/fileFormatter";

const FileInput = ({
  placeholder,
  title,
  required,
  file,
  type,
  onChangeFunc,
  isDisabled,
  isError,
  className,
  icon,
  handleLoading,
  ...rest
}) => {
  const fileRef = useRef();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isError) return setError(false);
    setError(true);
  }, [isError]);

  useEffect(() => {
    const fileSize = (file?.size || 0) / 1024 ** 2;
    if (fileSize > 50) return setError(true);
    setError(false);
  }, [file]);

  const extractFileNameFromUrl = (str) => {
    let filename = "";
    if (str) {
      const startIndex = str?.lastIndexOf("/") + 1;
      const endIndex = str?.length;
      filename = str?.slice(startIndex, endIndex);
    }
    return filename;
  };

  const handleFileChange = async (e) => {
    if (handleLoading && typeof handleLoading === "function")
      handleLoading(true);

    const files = await Promise.all(
      Array.from(e.target.files).map(async (file) => {
        const fileName = file.name;
        const fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
        if (fileNameExt === "heic") {
          const [heicFile] = await convertHeicToJpg(file);
          return heicFile;
        }
        return file;
      })
    );

    if (handleLoading && typeof handleLoading === "function")
      handleLoading(false);
    return onChangeFunc(files);
  };

  return (
    <div
      className={`flex flex-col justify-start items-start space-y-2 max-w-full ${className}`}
    >
      {title && (
        <span className="text-grey-text text-xs font-light">{title}</span>
      )}
      <button
        className={`flex justify-between items-center bg-white rounded-lg text-sm font-thin p-4 h-[44px] w-full
       border border-dashed 
       ${error || isError ? "!border-red" : "border-grey-bordercolor"} 
      `}
        type="button"
        onClick={() => {
          fileRef.current.click();
        }}
        disabled={isDisabled}
      >
        <span className="mt-1">
          {" "}
          <DocumentUpload className="stroke-current mr-2" />
        </span>
        <p className="w-full text-center text-grey-text overflow-ellipsis overflow-hidden whitespace-nowrap">
          {extractFileNameFromUrl(file && typeof file === "string" && file) ||
            file?.name ||
            placeholder}
        </p>
        {file?.name && (
          <a type="button" className="text-blue text-xs font-light pl-2">
            Change
          </a>
        )}
        {icon && <span className={`w-12 -mr-[17px]`}>{icon}</span>}
      </button>

      <input
        type="file"
        className="hidden"
        accept={
          type === "video"
            ? ".mp4"
            : type === "pdf"
            ? ".pdf, .doc, .docx"
            : type === "pdf_image"
            ? ".jpg, .jpeg, .png, .heic, .heif, .pdf, .doc, .docx"
            : ".jpg, .jpeg, .png, .heic, .heif,"
        }
        onChange={handleFileChange}
        ref={fileRef}
        {...rest}
      />
    </div>
  );
};

FileInput.propTypes = {
  placeholder: PropTypes.string,
  title: PropTypes.string,
  required: PropTypes.bool,
  file: PropTypes.any,
  type: PropTypes.string,
  onChangeFunc: PropTypes.func,
  isDisabled: PropTypes.bool,
  isError: PropTypes.bool,
  className: PropTypes.string,
  rest: PropTypes.object,
  icon: PropTypes.any,
  handleLoading: PropTypes.func,
};

export default FileInput;
