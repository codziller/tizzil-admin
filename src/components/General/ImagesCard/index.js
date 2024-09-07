import React, { useCallback } from "react";

import { ReactComponent as CircleClose } from "assets/icons/CircleClose/circleClose.svg";
import CircleLoader from "../CircleLoader/CircleLoader";
import PropTypes from "prop-types";

const ImagesCard = ({ data, deleteFunc, onClick, isLoading }) => {
  const handleOnClick = useCallback(() => {
    onClick(data);
  }, [data, onClick]);

  const handleDeleteFunc = useCallback(() => {
    deleteFunc(data);
  }, [data, deleteFunc]);

  return (
    <div className="relative flex flex-col justify-center items-center h-24 w-full max-w-[124px] cursor-pointer object-cover text-grey-text hover:text-black">
      <div
        className="absolute -top-2 -right-2 z-10 bg-white rounded-full"
        onClick={handleDeleteFunc}
      >
        {" "}
        <CircleClose className="stroke-current transition-all duration-150 ease-in-out" />{" "}
      </div>
      <img
        src={data.item_photo}
        alt="product"
        className="w-full h-full rounded-lg border border-grey-border "
      />
      <div
        className="absolute top-0 left-0 w-full h-full rounded-lg border border-grey-border flex justify-center items-center opacity-0 hover:opacity-100 bg-opacity-80 bg-grey-border text-white text-sm transition-all duration-150 ease-in-out"
        onClick={handleOnClick}
      >
        View full image
      </div>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full rounded-lg border border-grey-border flex justify-center items-center bg-opacity-80 bg-grey-border text-white text-sm transition-all duration-150 ease-in-out">
          <CircleLoader blue />
        </div>
      )}
    </div>
  );
};

ImagesCard.propTypes = {
  data: PropTypes.object,
  deleteFunc: PropTypes.func,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default ImagesCard;
