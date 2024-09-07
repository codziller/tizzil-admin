import { isString } from "lodash";
import React from "react";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import classNames from "classnames";
const ImageCard = ({
  image,
  multiple,
  type,
  removeImage,
  isBanner,
  isPost,
  isMarketingImg,
}) => {
  return type === "video" ? (
    <div key={image?.name} className="image-item w-full h-full relative">
      <div className="flex justify-between items-center absolute bottom-0 left-0">
        <span className="text-grey text-xs truncate max-w-[calc(100%-30px)]">
          {image?.name}
        </span>
        {multiple && (
          <button
            onClick={() => removeImage?.(image)}
            className="text-red "
            type="button"
          >
            <Close className="current-svg w-[20px]" />
          </button>
        )}
      </div>
      <video controls width="400" height="100">
        <source
          src={isString(image) ? image : URL.createObjectURL(image)}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : (
    <div
      className={classNames("image-item w-full relative", {
        "min-h-[420px] max-h-[420px]": isBanner,
        "h-[250px] sm:h-[300px] rounded-[6px]": isPost,
        "h-[275px] min-w-[187px]  max-w-[187px]": isMarketingImg,
        "h-[150] max-h-[150px] min-h-[150px]":
          !isBanner && !isPost && !isMarketingImg,
      })}
    >
      <div className="flex justify-between items-center absolute top-0 right-0 z-20">
        <span className="text-black font-[700] text-xs truncate max-w-[calc(100%-30px)]">
          {image?.name}
        </span>
        {multiple && (
          <button
            onClick={() => removeImage?.(image)}
            className="text-red flex justify-center items-center min-w-[25px] min-h-[25px] hover:bg-grey-fade rounded-full transition-colors duration-300 ease-in-out"
            type="button"
          >
            <Close className="current-svg w-[20px]" />
          </button>
        )}
      </div>
      <img
        src={isString(image) ? image : image ? URL.createObjectURL(image) : ""}
        alt={`Image`}
        className={classNames("object-contain object-center w-full relative", {
          "min-h-[420px] max-h-[420px]": isBanner,
          "h-[250px] sm:h-[300px] rounded-[6px]": isPost,
          "h-[275px] min-w-[187px]  max-w-[187px]": isMarketingImg,
          "h-[150] max-h-[150px] min-h-[150px] w-full":
            !isBanner && !isPost && !isMarketingImg,
        })}
      />
    </div>
  );
};

export default ImageCard;
