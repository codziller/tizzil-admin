import React, { useMemo, useState } from "react";
import ReactSelect, { components } from "react-select";
import AsyncSelect from "react-select/async";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import PropTypes from "prop-types";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";

import { ReactComponent as BsCaretDownFill } from "assets/icons/Arrow/caret-down.svg";
import { FormErrorMessage } from "../FormErrorMessage";
import ToolTip from "../ToolTip";
import { isObject } from "lodash";

const Select = ({
  label,
  options,
  name,
  onChange,
  value,
  async,
  labelControl,
  address,
  addressValue,
  addressPlaceholder,
  fullWidth,
  style,
  formError,
  onBlur,
  showFormError,
  tooltip,
  ...rest
}) => {
  const classNames = `${
    fullWidth ? "w-full" : "w-fit"
  } h-fit mx-[1px] text-lg md:text-[13px] border-slate-300 placeholder-slate-400 !placeholder:text-grey cursor-pointer`;
  const [isBlurred, setIsBlurred] = useState(false);
  const handleBlur = (val) => {
    setIsBlurred(val);
  };
  const errorObject = useMemo(
    () => (showFormError || isBlurred) && formError,
    [formError, isBlurred, showFormError]
  );
  const isError = !!errorObject;
  const styles = {
    control: (base, state) => ({
      ...base,

      height: address ? "38px" : "40px",
      minHeight: address ? "38px" : "40px",
      borderRadius: 0,
      border: isError
        ? `1px solid #F3564D !important`
        : state.isFocused || state.hasValue
        ? `1px solid #111111 !important`
        : `1px solid #BBBBBB !important`,
      outline: "none !important",
      boxShadow:
        state.isFocused || state.hasValue
          ? "0px 0px 0px 2.5px rgba(8,8,8,0.1) !important"
          : "none",
      cursor: "pointer",
      transition: `all 0.3s ease-in-out`,
      backgroundColor:
        state.isFocused || state.hasValue ? "#FFFFFF" : "transparent",
      "&:hover": {
        backgroundColor: "#FFFFFF",
        border: `1px solid #111111 !important`,
        boxShadow: "0px 0px 0px 2.5px rgba(8,8,8,0.1) !important",
      },
    }),

    singleValue: (base) => ({
      ...base,
      color: `${style?.color || "#000000"} !important`,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    placeholder: (base) => ({
      ...base,
      color: addressValue ? "#000000" : "#ACACAC",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "99%",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "white",
      zIndex: 20,
      cursor: "pointer",
      border: "1px solid #E1E1E1",
      top: "40px",
      borderRadius: 8,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "12px",
      backgroundColor: (state.isFocused || state.isSelected) && "#F5F6FA",
      cursor: "pointer",
      color: "#000",
    }),
    multiValue: (base, state) => ({
      ...base,
      display: state.selectProps.isMulti ? "none" : "flex", // Hide selected values inside select for isMulti
    }),
    multiValueLabel: (base, state) => ({
      ...base,
      display: state.selectProps.isMulti ? "none" : "block",
    }),
    multiValueRemove: (base, state) => ({
      ...base,
      display: state.selectProps.isMulti ? "none" : "block",
    }),
  };
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <BsCaretDownFill size={11} color={style?.color || "#000"} />
      </components.DropdownIndicator>
    );
  };
  const selectValue = useMemo(() => {
    if (isObject(value)) {
      return value;
    }
    return options?.find((_) => _?.value === value);
  }, [rest, options]);

  return (
    <div className={`${fullWidth ? "w-[calc(100%-1px)]" : "w-fit"}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <label className="general-input-label text-grey-dark text-[13px] font-bold !flex justify-start items-center gap-1.5">
            {label}

            {tooltip && (
              <ToolTip content={tooltip}>
                <InfoIcon />
              </ToolTip>
            )}
          </label>
          {labelControl && labelControl}
        </div>
      )}
      {async ? (
        <AsyncSelect
          cacheOptions
          options={options}
          onChange={(selected) => onChange(selected, { name, value: selected })}
          styles={styles}
          className={classNames}
          onBlur={() => onBlur || handleBlur(true)}
          {...rest}
        ></AsyncSelect>
      ) : (
        // : address ? (
        //   <GooglePlacesAutocomplete
        //     apiKey={GOOGLE_MAP_API_KEY}
        //     selectProps={{
        //       address: addressValue,
        //       onChange,
        //       onBlur: () => onBlur || handleBlur(true),
        //       styles,
        //       options,
        //       placeholder: addressPlaceholder,
        //       componentRestrictions: {
        //         country: "ng",
        //       },
        //     }}
        //   />
        // )

        <ReactSelect
          options={options}
          onChange={(selected) => onChange(selected, { name, value: selected })}
          styles={styles}
          className={classNames}
          components={{ DropdownIndicator }}
          onBlur={() => onBlur || handleBlur(true)}
          value={selectValue}
          {...rest}
        ></ReactSelect>
      )}
      {/* Selected options display for isMulti */}
      {rest.isMulti && Array.isArray(value) && value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((selectedOption, index) => (
            <div
              key={selectedOption.value || index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded-md border"
            >
              <span>{selectedOption.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newValue = value.filter((_, i) => i !== index);
                  onChange(newValue, { name, value: newValue });
                }}
                className="ml-1 text-[#6B7280] hover:text-[#374151] focus:outline-none"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="h-[13px]">
        {errorObject && <FormErrorMessage type={errorObject} />}
      </div>
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  name: PropTypes.string,
  onChange: PropTypes.func,
  async: PropTypes.bool,
  labelControl: PropTypes.any,
  address: PropTypes.bool,
  addressValue: PropTypes.any,
  addressPlaceholder: PropTypes.string,
  formError: PropTypes.object,
  onBlur: PropTypes.func,
  showFormError: PropTypes.bool,
  style: PropTypes.object,
  fullWidth: PropTypes.bool,
  value: PropTypes.any,
  tooltip: PropTypes.string,
};

export default Select;
