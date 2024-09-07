/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";

import { ReactComponent as UploadCardIcon } from "assets/icons/uploadCard.svg";

const UploadCard = ({ errorFunc, handleUpload, data = null, active }) => {
  const domNode = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if ((data === null) | (data === undefined)) return;
    setSelectedFiles([data]);
  }, [data]);

  useEffect(() => {
    if (active) return;
    setSelectedFiles([]);
  }, [active]);

  const onFileChange = useCallback(
    (files) => {
      if (files.size > 1048576 * 3) {
        errorFunc();
        return;
      }
      const filesArray = Array.from([files])
        .filter((file) => file.type.includes("image"))
        .map((file) => URL.createObjectURL(file));
      setSelectedFiles(filesArray);
      Array.from([files]).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );
      if (!handleUpload) return;
      handleUpload(files);
    },
    [errorFunc, handleUpload]
  );

  const renderPhotos = (source) => {
    return source.map((photo) => {
      return (
        <img
          className="w-full h-full object-cover !my-0"
          src={photo}
          alt=""
          key={photo}
        />
      );
    });
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center h-24 w-full rounded-lg border border-grey-border space-y-2 cursor-pointer overflow-hidden bg-[#F5F6FA]"
      onClick={() => domNode.current.click()}
    >
      <UploadCardIcon className="cursor-pointer" />
      {selectedFiles.length > 0 ? (
        renderPhotos(selectedFiles)
      ) : (
        <>
          <span className="text-grey text-xs cursor-pointer">Select Image</span>
        </>
      )}
      <input
        ref={domNode}
        className=" absolute !mt-0 top-0 left-0 opacity-0 h-full w-full cursor-pointer z-10 placeholder:pointer-events-none hidden"
        type="file"
        onChange={(event) => {
          onFileChange(event.target.files[0]);
        }}
        accept=".jpg,.png,.jpeg"
      />
    </div>
  );
};

export default UploadCard;
