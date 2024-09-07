import React from "react";
import PropTypes from "prop-types";

const DropdownLink = ({
  onClick,
  children,
  big,
  noHover,
  redHover,
  isLink,
  isFilter,
  color,
  className,
}) => {
  return (
    <>
      <div
        className={`flex justify-start items-center px-4 ${
          big ? "h-14" : "h-10"
        } w-full text-black-light  font-normal  antialiased
        ${
          noHover
            ? color === "red"
              ? "bg-error-bg text-error-text cursor-default pointer-events-none"
              : "bg-grey-whitesmoke text-black cursor-default pointer-events-none"
            : redHover
            ? " hover:bg-red-50 hover:text-red cursor-pointer pointer-events-auto"
            : isLink
            ? " hover:bg-blue-2xlight hover:text-blue cursor-pointer pointer-events-auto"
            : " hover:bg-grey-whitesmoke cursor-pointer pointer-events-auto"
        } transition-all ease-in-out duration-300 ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    </>
  );
};

DropdownLink.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any,
  big: PropTypes.bool,
  noHover: PropTypes.bool,
  redHover: PropTypes.bool,
  isLink: PropTypes.bool,
  isFilter: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default DropdownLink;
