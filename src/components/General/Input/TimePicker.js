import React, { useState } from "react";
import clsx from "classnames";
import PropTypes from "prop-types";
import { ReactComponent as ClockIcon } from "assets/icons/clock.svg";
import { TimePickerWrapper } from "./style";

export default function TimePicker({ onChange, value, name, ...rest }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <TimePickerWrapper
      className={clsx({
        "time-is-active": isActive,
      })}
    >
      <input
        type="time"
        name={name}
        className={`w-full rounded-md placeholder-slate-400`}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        value={value}
        onChange={(e) => onChange(e, { value: e.target.value, name })}
        {...rest}
      />
      <ClockIcon className="clock-icon" />
    </TimePickerWrapper>
  );
}

TimePicker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
  name: PropTypes.string,
};
