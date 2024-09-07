import React, { useMemo, useState } from "react";
import ReactSelect, { components } from "react-select";
import AsyncSelect from "react-select/async";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import PropTypes from "prop-types";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";

import { ReactComponent as BsCaretDownFill } from "assets/icons/Arrow/caret-down.svg";
import { FormErrorMessage } from "../FormErrorMessage";
import ToolTip from "../ToolTip";
import { isObject, isString } from "lodash";

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
  const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
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
      borderRadius: 4,
      border: isError
        ? `1px solid ${"#F3564D"} !important`
        : state.isFocused
        ? `1px solid ${style?.color || "#1E1E1E"} !important`
        : `1px solid ${style?.color || "#E1E1E1"} !important`,
      outline: state.isFocused ? "none !important" : "none !important",
      boxShadow: "none",
      cursor: "pointer",
      transition: `all 0.3s ease-in-out`,
      backgroundColor: `${style?.background || "#F4F4F4"}`,
      "&:hover": {
        backgroundColor: "#F6F6F6",
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
};

export default Select;
