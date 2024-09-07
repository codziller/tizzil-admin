import React from "react";
import PropTypes from "prop-types";
import clsx from "classnames";

const ModalHeader = ({
  children,
  fulWidthHeight,
  onClose,
  className,
  noBack,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center border-b border-grey-border pb-4 w-full",
        className
      )}
    >
      {!noBack && (
        <span
          className={clsx("text-grey-text md:hidden cursor-pointer text-sm", {
            hidden: !fulWidthHeight,
          })}
          onClick={onClose}
        >
          Back
        </span>
      )}
      <div
        className={clsx(
          "",
          { "w-full text-center text-sm AvenirRegular": fulWidthHeight },
          { "text-xl text-left": !fulWidthHeight }
        )}
      >
        {children}
      </div>
    </div>
  );
};

ModalHeader.propTypes = {
  children: PropTypes.any,
  fulWidthHeight: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  noBack: PropTypes.bool,
};

export default ModalHeader;
