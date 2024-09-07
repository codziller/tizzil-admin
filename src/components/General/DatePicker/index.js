import { forwardRef, useMemo, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DatePicker from "react-datepicker";
import clsx from "classnames";
import { months, years } from "utils/date";
import { ReactComponent as CalendarIcon } from "assets/icons/calendar.svg";
import { ReactComponent as PrevYearIcon } from "assets/icons/Arrow/double-arrow-left.svg";
import { ReactComponent as NextYearIcon } from "assets/icons/Arrow/double-arrow-right.svg";
import { ReactComponent as ArrowRight } from "assets/icons/Arrow/arrow-right-thick.svg";
import { ReactComponent as ArrowLeft } from "assets/icons/Arrow/arrow-left-thick.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import "react-datepicker/dist/react-datepicker.css";
import { DatePickerWrapper } from "./style";
import { FormErrorMessage } from "../FormErrorMessage";
import ToolTip from "../ToolTip";

const CustomInput = forwardRef(
  ({ value, onChange, placeholder, autoComplete, ...rest }, ref) => (
    <input
      placeholder={placeholder}
      onChange={onChange}
      ref={ref}
      value={value}
      className="custom-input text-lg md:text-base"
      {...rest}
      autoComplete={autoComplete}
    />
  )
);

CustomInput.displayName = "CustomPickerInput";

export default function DatePickerComponent({
  label,
  onChange,
  value,
  placeholder,
  name,
  containerStyle,
  labelClass,
  showFormError,
  formError,
  onBlur,
  isRequired,
  tooltip,
  dataType,
  subLabel,
  containerClassName,
  ...rest
}) {
  const [isBlurred, setIsBlurred] = useState(false);
  const errorObject = useMemo(
    () => (showFormError || isBlurred) && formError,
    [formError, isBlurred, showFormError]
  );
  const isError = !!errorObject;
  const handleBlur = (val) => {
    setIsBlurred(val);
  };

  return (
    <DatePickerWrapper
      className={containerClassName}
      isError={isError}
      containerStyle={containerStyle}
    >
      {label ? (
        <label
          className={clsx(
            "general-input-label text-sm text-grey-text !flex justify-start items-center gap-1.5",
            {
              "mb-[5px]": subLabel,
              "mb-[10px]": !subLabel,
            },
            labelClass
          )}
        >
          {label}
          {isRequired && <span className="text-red text-sm -mt-1 ">*</span>}
          {dataType && (
            <span className="bg-grey-light2 px-1 py-0.5 text-grey-text text-[10px] lowercase">
              {dataType}
            </span>
          )}
          {tooltip && (
            <ToolTip content={tooltip}>
              <InfoIcon />
            </ToolTip>
          )}
        </label>
      ) : null}

      {subLabel && (
        <div className="text-grey-dark text-[14px] lowercase mb-[10px]">
          {subLabel}
        </div>
      )}
      <div className="datepicker-full-container">
        <DatePicker
          placeholderText={placeholder}
          selected={value}
          autoComplete="off"
          onChange={(value) => onChange(value, { name, value })}
          customInput={<CustomInput />}
          showMonthDropdown
          showYearDropdown
          dropdownMode="scroll"
          onBlur={() => onBlur?.() || handleBlur(true)}
          {...rest}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            decreaseYear,
            increaseMonth,
            increaseYear,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
            nextYearButtonDisabled,
            prevYearButtonDisabled,
          }) => (
            <div className="calendar-header">
              <div></div>
              <break />
              <div
                className="year-controls prev cursor-pointer ml-[-28px]"
                onClick={decreaseYear}
                disabled={prevYearButtonDisabled}
              >
                <PrevYearIcon />
              </div>
              <div className="central-control">
                <div
                  className="month-controls prev cursor-pointer ml-[28px]"
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                >
                  <ArrowLeft className="month-arrow" />
                </div>

                <div className="current-date flex justify-center items-center gap-2">
                  <div className="flex justify-center items-center">
                    <select
                      value={moment(date).format("MMMM")}
                      className="date-month z-10 w-[26px] bg-none bg-transparent cursor-pointer"
                      onChange={({ target: { value } }) => {
                        changeMonth(months.indexOf(value));
                      }}
                    >
                      {months.map((option) => (
                        <option key={option} value={option}>
                          {option.substring(0, 3)}
                        </option>
                      ))}
                    </select>
                    <span className="mx-1.5">
                      <ArrowLeft className="month-arrow -rotate-90" />
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <select
                      className="date-year z-10 w-[39px] bg-none bg-transparent cursor-pointer"
                      value={moment(date).format("YYYY")}
                      onChange={({ target: { value } }) => changeYear(value)}
                    >
                      {years().map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="-ml-px">
                      <ArrowLeft className="month-arrow -rotate-90" />
                    </span>
                  </div>
                </div>

                <div
                  className="month-controls next ml-[-1px]"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                >
                  <ArrowRight className="month-arrow cursor-pointer" />
                </div>
              </div>

              <div
                className="year-controls next cursor-pointer ml-[18px]"
                onClick={increaseYear}
                disabled={nextYearButtonDisabled}
              >
                <NextYearIcon />
              </div>
            </div>
          )}
        />
        <CalendarIcon className="calendar-icon" />
      </div>
      {errorObject && <FormErrorMessage type={errorObject} />}
    </DatePickerWrapper>
  );
}

CustomInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
};

DatePickerComponent.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  containerStyle: PropTypes.object,
  labelClass: PropTypes.string,
  formError: PropTypes.object,
  showFormError: PropTypes.bool,
  onBlur: PropTypes.func,
  isRequired: PropTypes.bool,
  tooltip: PropTypes.string,
  rest: PropTypes.object,
  dataType: PropTypes.string,
  subLabel: PropTypes.string,
  containerClassName: PropTypes.string,
};
