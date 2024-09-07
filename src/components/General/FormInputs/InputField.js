import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { ReactComponent as PasswordCloseIcon } from "../../../assets/icons/Password/passwordCloseIcon.svg";
import { ReactComponent as PasswordIcon } from "../../../assets/icons/Password/passwordIcon.svg";
import { useField } from "formik";

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

const InputField = ({
  placeholder,
  name,
  type,
  onChangeFunc,
  isFocused,
  isError,
  isLoading,
  ...otherProps
}) => {
  const [field, mata] = useField(name);
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef();

  const domNode = useClickOutside(() => {
    setActive(false);
  });

  useEffect(() => {
    if (!isFocused) return;
    inputRef.current.focus();
    setActive(true);
  }, [isFocused]);

  useEffect(() => {
    if (!(mata && mata.touched && mata.error) && !isError)
      return setError(false);
    if (isError) return setError(true);
    setError(true);
  }, [mata, isError]);

  // useEffect(() => {
  //   if (!isError) return setError(false);
  //   setError(true);
  // }, [isError]);

  const configInputField = {
    ...field,
    ...otherProps,
    onChange: field.onChange,
    placeholder,
  };

  return (
    <>
      <div
        className={`relative flex flex-col justify-start items-center h-full w-full`}
        ref={domNode}
      >
        <div
          className={`relative h-11 w-full bg-white rounded-lg flex  space-x-1 items-center justify-between  font-normal outline-none capitalize tracking-wider focus:outline-none transition-all duration-150 whitespace-nowrap  text-base leading-relaxed border border-solid shadow-none text-left 
        ${
          error
            ? "!border-red"
            : active
            ? "border-blue"
            : "hover:bg-grey-whitesmoke border-grey-border"
        }
        ${isLoading ? "pointer-events-none" : "pointer-events-auto"}
        `}
          onClick={() => setActive(true)}
          ref={domNode}
        >
          <input
            {...configInputField}
            ref={inputRef}
            type={
              type === "password"
                ? showPassword
                  ? "text"
                  : "password"
                : "text"
            }
            placeholder={placeholder}
            className={`p-3  h-full w-full focus:outline-none focus:border-none rounded-lg ${
              field.value &&
              (field.value.length > 0 || field.value > 0) &&
              "text-black"
            }
          ${!active && "hover:bg-grey-whitesmoke"}
          `}
          />

          {type === "password" && (
            <span
              className={`h-full w-12 absolute top-0 right-0 flex justify-center items-center cursor-pointer z-10`}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <PasswordCloseIcon className="stroke-current" />
              ) : (
                <PasswordIcon className="stroke-current" />
              )}
            </span>
          )}

          {/* <label
            htmlFor={placeholder}
            className={`z-30 absolute  ease-in-out duration-150 h-2 !mx-0 ${
              active || field.value.length > 0 || field.value > 0
                ? "left-2.5 -top-2 text-xs bg-white px-1"
                : "left-4 top-0 text-sm h-full flex justify-center items-center "
            } ${
              active
                ? "text-blue"
                : field.value.length > 0 || field.value > 0
                ? "text-black"
                : "text-grey"
            }  ${isHover && "text-blue"}`}
            onClick={() => inputRef.current.focus()}
          >
            {placeholder}
          </label> */}
        </div>
      </div>
    </>
  );
};

InputField.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  onChangeFunc: PropTypes.func,
  isFocused: PropTypes.bool,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default InputField;
