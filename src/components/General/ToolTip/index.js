import "tippy.js/dist/tippy.css";
import React from "react";
import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";

const ToolTip = ({ content, children }) => {
  return <Tippy content={content}>{children}</Tippy>;
};

ToolTip.propTypes = {
  content: PropTypes.string,
  children: PropTypes.any,
};

export default ToolTip;
