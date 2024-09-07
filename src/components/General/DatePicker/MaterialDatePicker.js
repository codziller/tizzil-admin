import PropTypes from "prop-types";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import clsx from "classnames";

import { DatePickerWrapper } from "./style";

export default function MaterialDatePicker({
  label,
  onChange,
  value,
  placeholder,
  name,
  containerStyle,
  labelClass,
  ...rest
}) {
  return (
    <DatePickerWrapper containerStyle={containerStyle}>
      <label className={clsx(labelClass)}>{label}</label>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker onChange={onChange} />
      </LocalizationProvider>
    </DatePickerWrapper>
  );
}

MaterialDatePicker.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  containerStyle: PropTypes.object,
  labelClass: PropTypes.string,
  rest: PropTypes.object,
};
