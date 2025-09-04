import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import classNames from "classnames";
import { TailSpin } from "react-loader-spinner";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import { ReactComponent as AddIcon } from "assets/icons/add-circle.svg";
import { ReactComponent as MinusIcon } from "assets/icons/minus-cirlce.svg";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { FormErrorMessage } from "../FormErrorMessage";
import ToolTip from "../ToolTip";

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

const Input = ({
  placeholder,
  name,
  required,
  value,
  label,
  labelControl,
  type = "text",
  onChangeFunc,
  isFocused,
  isLoading,
  formError,
  currency,
  isDisabled,
  prefix,
  icon,
  labelClasses,
  extraElement,
  isRequired,
  inputClassName,
  leftIcon,
  onBlur,
  showFormError,
  tooltip,
  noError,
  isCounter,
  labelControlTwo,
  ...rest
}) => {
  const [active, setActive] = useState(false);
  const [alterBlueBorder, setAlterBlueBorder] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef();
  const prefixRef = useRef();

  const domNode = useClickOutside(() => {
    setActive(false);
  });

  const errorObject = useMemo(
    () => (showFormError || isBlurred) && formError,
    [formError, isBlurred, showFormError]
  );
  const isError = showFormError && !!errorObject;
  const handleBlur = (val) => {
    setIsBlurred(val);
  };

  useEffect(() => {
    if (!isFocused) return;
    inputRef.current.focus();
    setActive(true);
    setAlterBlueBorder(false);
  }, [isFocused]);

  useEffect(() => {
    if (prefix && type !== "number") {
      setActive(true);
      setAlterBlueBorder(true);
    }
  }, [prefix]);

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
        className={`relative flex flex-col justify-start items-center h-full w-full`}
        ref={domNode}
      >
        <div
          className={`relative h-11 w-full flex space-x-1 items-center justify-between font-normal outline-none capitalize tracking-wider focus:outline-none transition-all duration-300 ease-in-out whitespace-nowrap text-base leading-relaxed border border-solid text-left 
        ${
          isError
            ? "!border-red bg-white"
            : active || value
            ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
            : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
        }
        ${isLoading && "pointer-events-none"}
        `}
          onClick={() => {
            setActive(true);
            setAlterBlueBorder(false);
          }}
          ref={domNode}
        >
          {leftIcon && (
            <div className="h-full flex mr-1 justify-center items-center w-8">
              <span
                className={`h-full w-12 absolute top-0 left-0 flex justify-center items-center cursor-pointer z-30`}
              >
                {leftIcon}
              </span>
            </div>
          )}

          {isCounter && (
            <span
              className={classNames(
                `h-full w-12 absolute top-0 left-0 flex justify-center items-center cursor-pointer z-10 hover:bg-grey-light transition-colors ease-in-out duration-300`,
                { "opacity-30": isDisabled || value < 2 }
              )}
              onClick={() => {
                if (isDisabled) return;
                onChangeFunc(
                  Number(value) > 1 ? Number(value) - 1 : Number(value)
                );
              }}
            >
              <span>
                <MinusIcon />
              </span>
            </span>
          )}
          {type === "number" ? (
            <div
              className={classNames(
                "w-full h-full flex justify-start items-center",
                {
                  "pl-3": currency,
                }
              )}
            >
              {currency && <span>{currency}</span>}
              <NumberFormat
                ref={inputRef}
                value={value}
                name={name}
                required={required}
                placeholder={placeholder}
                thousandSeparator
                prefix={prefix}
                className={classNames(
                  `p-3 ease-in-out h-full w-full z-[5] focus:outline-none focus:border-none rounded bg-transparent placeholder:text-grey`,
                  { "px-12 text-center": isCounter, "pl-6": leftIcon },
                  inputClassName
                )}
                inputMode="numeric"
                onValueChange={(number) =>
                  onChangeFunc(number.value, { name, value: number.value })
                }
                onBlur={() => onBlur || handleBlur(true)}
                {...rest}
              />
            </div>
          ) : (
            <input
              ref={inputRef}
              type={
                type === "numberInput"
                  ? "number"
                  : type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              value={value}
              onChange={({ target }) => {
                onChangeFunc(target.value, { name, value: target.value });
              }}
              onBlur={() => onBlur || handleBlur(true)}
              placeholder={placeholder}
              className={`p-3 ease-in-out h-full w-full z-10 focus:outline-none focus:border-none rounded bg-transparent placeholder:text-grey ${
                !value
                  ? ""
                  : value?.length > 0 || value > 0
                  ? "text-black"
                  : "placeholder:text-grey"
              } ${
                type === "password" || icon ? "mr-3" : ""
              }    ${inputClassName} `}
              style={{
                paddingLeft: prefix && prefixRef?.current?.offsetWidth + 15,
              }}
              {...rest}
            />
          )}

          {isDisabled && (
            <span
              className={`h-full w-full absolute top-0 right-0 flex justify-center items-center cursor-pointer z-10 `}
            ></span>
          )}

          {type === "password" && (
            <span
              className={`h-full w-12 absolute top-0 right-0 flex justify-center items-center cursor-pointer z-20`}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={18} className="stroke-current" />
              ) : (
                <AiOutlineEye size={18} className="stroke-current" />
              )}
            </span>
          )}

          {isCounter && (
            <span
              className={classNames(
                `h-full w-12 absolute top-0 right-0 flex justify-center items-center cursor-pointer z-10 hover:bg-grey-light transition-colors ease-in-out duration-300`,

                { "opacity-30": isDisabled }
              )}
              onClick={() => {
                if (isDisabled) return;
                onChangeFunc(Number(value) + 1);
              }}
            >
              <span>
                <AddIcon />
              </span>
            </span>
          )}
          {prefix && type !== "number" && (
            <span
              ref={prefixRef}
              className={classNames(
                "absolute left-2 lowercase max-w-[300px] overflow-x-hidden ",
                {
                  "text-grey-light": !value,
                  "text-black": value,
                }
              )}
            >
              {prefix}
            </span>
          )}

          {icon || extraElement || isLoading ? (
            <div className="h-full flex mx-1 justify-center items-center">
              {icon && (
                <span
                  className={`h-full w-12 absolute top-0 right-0 flex justify-center items-center cursor-pointer z-30`}
                >
                  {icon}
                </span>
              )}
              {extraElement && <div className="z-30">{extraElement}</div>}
              {isLoading && (
                <TailSpin
                  height="20"
                  width="20"
                  color="#000000"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  visible={true}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
      {labelControlTwo ? <div className="mt-1">{labelControlTwo}</div> : null}

      {!noError && (
        <div className="h-[13px]">
          {errorObject && <FormErrorMessage type={errorObject} />}
        </div>
      )}
    </div>
  );
};

Input.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.any,
  value: PropTypes.any,
  label: PropTypes.string,
  labelControl: PropTypes.any,
  type: PropTypes.any,
  onChangeFunc: PropTypes.func,
  isFocused: PropTypes.any,
  isLoading: PropTypes.bool,
  formError: PropTypes.object,
  currency: PropTypes.any,
  isDisabled: PropTypes.bool,
  prefix: PropTypes.string,
  rest: PropTypes.object,
  icon: PropTypes.element,
  labelClasses: PropTypes.string,
  extraElement: PropTypes.any,
  isRequired: PropTypes.bool,
  inputClassName: PropTypes.string,
  leftIcon: PropTypes.element,
  onBlur: PropTypes.func,
  showFormError: PropTypes.bool,
  tooltip: PropTypes.string,
  noError: PropTypes.bool,
  isCounter: PropTypes.bool,
  labelControlTwo: PropTypes.any,
};

export default Input;
