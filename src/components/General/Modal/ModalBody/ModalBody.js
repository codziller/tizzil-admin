import React from "react";
import PropTypes from "prop-types";

const ModalBody = ({ children, className = "max-h-[500px]" }) => {
  return (
    <div
      className={`body-content flex flex-col justify-start items-start w-full h-full flex-grow ${className}`}
    >
      {children}
    </div>
  );
};

ModalBody.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default ModalBody;
