import React from "react";
import PropTypes from "prop-types";
import { RadioInputWrapper } from "./style";

export default function RadioInput({
  onChange,
  name,
  spacing = "5",
  label,
  value,
  align = "center",
}) {
  const id = `radio-${value}`;
  return (
    <RadioInputWrapper spacing={spacing} align={align}>
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
      />
      {label && (
        <label className="text-base" htmlFor={id}>
          {label}
        </label>
      )}
    </RadioInputWrapper>
  );
}

RadioInput.propTypes = {
  spacing: PropTypes.number,
  label: PropTypes.any,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  align: PropTypes.string,
  onChange: PropTypes.func,
};
