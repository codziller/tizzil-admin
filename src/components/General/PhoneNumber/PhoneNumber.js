import "react-phone-number-input/style.css";

import Input, {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import { ReactComponent as ArrowIcon } from "../../../assets/icons/Arrow/arrow-icon.svg";
import PropTypes from "prop-types";
import en from "react-phone-number-input/locale/en.json";
import { FormErrorMessage } from "../FormErrorMessage";
import ToolTip from "../ToolTip";
import classNames from "classnames";

const useClickOutside = (handler) => {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      if (!domNode.current.contains(event.target || event.target.childNodes)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={(event) => onChange(event.target.value || undefined)}
  >
    <option value="">{labels.ZZ}</option>
    {getCountries().map((country) => (
      <option key={country} value={country}>
        {labels[country]} +{getCountryCallingCode(country)}
      </option>
    ))}
  </select>
);

const PhoneNumber = ({
  placeholder,
  name,
  flag_name,
  label,
  labelClasses,
  value,
  onPhoneChange,
  onCountryChange,
  countryClicked,
  isError,
  required,
  isDisabled,
  tooltip,
  isRequired,
  formError,
  showFormError,
  noError,
  labelControl,
}) => {
  const [country, setCountry] = useState();
  const [error, setError] = useState(false);
  const [active, setActive] = useState(false);

  const domNode = useClickOutside(() => {
    setActive(false);
  });

  useEffect(() => {
    setCountry(countryClicked);
  }, [countryClicked]);

  useEffect(() => {
    if (!isError) return setError(false);
    setError(true);
  }, [isError]);

  return (
    <div className="w-full">
      {label && (
        <div className="flex flex-row justify-between items-center w-full">
          <label
            className={classNames(
              labelClasses,
              "general-input-label mb-1 relative text-[13px] font-bold text-grey-dark !flex justify-start items-center gap-1.5"
            )}
          >
            {label}{" "}
            {tooltip && (
              <ToolTip content={tooltip}>
                <InfoIcon />
              </ToolTip>
            )}
            {isRequired && <span className="text-red text-sm -mt-1 ">*</span>}
          </label>
          {labelControl}
        </div>
      )}
      <div
        className={`h-11 border border-gray-border rounded text-grey focus:border flex flex-row w-full text-gray leading-normal shadow-none outline-none focus:outline-none focus:ring-0 focus:text-gray overflow-ellipsis overflow-hidden whitespace-nowrap
        ${
          error
            ? "!border-red"
            : active
            ? "border-blue"
            : "hover:bg-grey-whitesmoke border-grey-border"
        }
        `}
        ref={domNode}
      >
        <div className="flex justify-center items-center h-full  relative overflow-hidden space-x-2 c border-gray-xlight ">
          <div className="absolute h-full top-0 left-0 z-10 opacity-0 w-full cursor-pointer">
            <CountrySelect
              className="h-full cursor-pointer"
              labels={en}
              disabled={isDisabled}
              value={country || "NG"}
              onChange={(value) =>
                onCountryChange(value, { name: flag_name, value })
              }
              name="countrySelect"
            />
          </div>
          <div className="w-10 ml-4 flex justify-center items-center">
            <div className="flex h-6 w-6 relative overflow-hidden !mx-0">
              <img
                className="h-full w-6"
                alt={country || "NG"}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
                  country || "NG"
                }.svg`}
              />
            </div>
          </div>

          <ArrowIcon className="stroke-current" />
        </div>

        <div
          className="ml-2 w-full flex justify-start items-center"
          onClick={() => setActive(true)}
        >
          <Input
            country={country || "NG"}
            value={value}
            className={`shadow-none outline-none focus:outline-none focus:ring-0 focus:text-black h-full w-full pl-2 placeholder:text-grey bg-grey-alt text-base
            ${value && value.length > 1 && "text-black"}
            `}
            disabled={isDisabled}
            onChange={(value) => onPhoneChange(value, { name, value })}
            placeholder={placeholder}
            name={name}
            required={required}
          />
        </div>
      </div>

      {!noError && (
        <div className="h-[13px]">
          {showFormError && formError && <FormErrorMessage type={formError} />}
        </div>
      )}
    </div>
  );
};

PhoneNumber.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  flag_name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  onPhoneChange: PropTypes.func,
  onCountryChange: PropTypes.func,
  countryClicked: PropTypes.func,
  isError: PropTypes.bool,
  required: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showFormError: PropTypes.bool,
  tooltip: PropTypes.string,
  noError: PropTypes.bool,
  isRequired: PropTypes.bool,
  labelControl: PropTypes.any,
};

CountrySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  labels: PropTypes.array,
  rest: PropTypes.object,
};

export default PhoneNumber;
