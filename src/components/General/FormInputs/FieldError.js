/* eslint-disable react/prop-types */
import React from "react";

const FieldError = ({ error }) => {
  return (
    <span className="font-500 text-red" style={{ fontSize: 10 }}>
      {error}
    </span>
  );
};

export default FieldError;
