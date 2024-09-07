import React from "react";
import PropTypes from "prop-types";
import { Button } from "../Button";
const ProductCard = ({ details, className }) => {
  return (
    <div
      className={`flex flex-col justify-between items-center gap-2 w-full h-full ${className} overflow-hidden`}
    >
      <div
        className={`flex flex-col justify-start items-center gap-2 w-full overflow-hidden relative`}
      >
        <div className="bg-white rounded  border-grey-borderalt hover:border-blue/30 relative w-full mb-2 transition-colors duration-[0.5s] ease-in-out ">
          <div className="flex justify-center items-center w-full h-full px-2 relative">
            <div className="overflow-hidden w-full h-[250px] sm:h-[300px] rounded-[6px]">
              <img
                className="transition-all duration-[0.5s] ease-in-out !w-full !h-full object-cover rounded-[6px]"
                src={details?.sourceImageUrl}
                alt={details?.name}
              />
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col justify-start items-center gap-2 w-full overflow-hidden`}
        >
          {details?.titleText && (
            <p className="text-base text-black font-700">
              {details?.titleText}
            </p>
          )}
          {details?.descriptionText && (
            <p className="text-base text-black font-medium line-clamp text-center line-clamp-2 sentence-case">
              {details?.descriptionText}
            </p>
          )}
        </div>
      </div>

      <Button text="Edit Me 🤲🏽" fullWidth className="mt-3" />
    </div>
  );
};
ProductCard.propTypes = {
  details: PropTypes.object,
  className: PropTypes.string,
  link: PropTypes.string,
  handleQuickView: PropTypes.func,
};

export default ProductCard;
