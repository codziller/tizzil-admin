import React from "react";
import PropTypes from "prop-types";

const ModalFooter = ({ children }) => {
  return (
    <div className="border-t border-grey-border pt-6 text-xl text-left">
      {children}
    </div>
  );
};

ModalFooter.propTypes = {
  children: PropTypes.elementType,
};

export default ModalFooter;
