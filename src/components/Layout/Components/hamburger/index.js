import React from "react";
import PropTypes from "prop-types";
import "./styles.css";
const Hamburger = ({ className, click }) => (
  <button
    className={`hamburger_btn z-[99999] lg:hidden ${className}`}
    onClick={click}
  >
    <div className="hamburger" />
    <div className="hamburger" />
    <div className="hamburger" />
  </button>
);
Hamburger.propTypes = {
  click: PropTypes.func,
  className: PropTypes.any,
};

export default Hamburger;
