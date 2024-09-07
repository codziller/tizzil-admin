import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FormErrorMessage } from "../FormErrorMessage";

export const useClickOutside = (handler) => {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      if (
        !domNode?.current?.contains?.(
          event?.target || event?.target?.childNodes
        )
      ) {
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

const Textarea = ({
  placeholder,
  value,
  onChangeFunc,
  isLoading,
  label,
  sm,
  name,
  rows,
  showFormError,
  formError,
  labelClass = "",
}) => {
  const [active, setActive] = useState(false);
  const domNode = useClickOutside(() => {
    setActive(false);
  });
  const isError = formError && showFormError;
  return (
    <div className={`relative h-full w-full`} ref={domNode}>
      {label && (
        <label
          className={`general-input-label text-[13px] mb-1 text-grey-dark ${labelClass}`}
        >
          {label}
        </label>
      )}
      <div
        className={`textarea-container relative py-3 w-full bg-grey-alt rounded flex items-center justify-between  font-normal outline-none capitalize tracking-wider focus:outline-none transition-all duration-150 whitespace-nowrap  text-base leading-relaxed  border border-solid shadow-none text-left
          ${
            isError
              ? "border-red"
              : active
              ? "border-blue text-black"
              : "hover:bg-grey-whitesmoke border-grey-border"
          }
          ${isLoading && "pointer-events-none"}
          `}
        onClick={() => setActive(true)}
        ref={domNode}
      >
        <textarea
          className={`text-[16px] sm:text-base textarea-component px-4 w-full focus:outline-none focus:border-none rounded-lg bg-transparent text-black
            ${
              value?.length > 0 || value > 0
                ? "text-black"
                : "placeholder:text-grey placeholder:font-extralight"
            }
            ${sm ? "h-20" : "h-32"}
          `}
          value={value}
          placeholder={placeholder}
          name={name}
          id=""
          cols="30"
          rows={rows || "10"}
          ref={domNode}
          onClick={() => setActive(true)}
          onChange={({ target }) => {
            onChangeFunc(target.value, { value: target.value, name });
          }}
        ></textarea>
        {/* <label
            htmlFor={placeholder}
            className={`z-10 absolute ease-in-out duration-150 h-2  pointer-events-none space-x-none ${
              active || value.length > 0
                ? "left-2.5 -top-2 text-xs bg-white px-1"
                : "left-4 top-3 text-sm "
            } ${
              active
                ? "text-blue"
                : value.length > 0
                ? "text-black-secondary"
                : "text-black-disabled"
            }  ${isHover && "text-blue"}`}
          >
            {placeholder}
          </label> */}
      </div>
      <div className="min-h-[13px] mb-4">
        {isError && <FormErrorMessage type={formError} />}
      </div>
    </div>
  );
};

Textarea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  onChangeFunc: PropTypes.func,
  isLoading: PropTypes.bool,
  sm: PropTypes.bool,
  name: PropTypes.string,
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labelClass: PropTypes.string,
  showFormError: PropTypes.bool,
  formError: PropTypes.object,
};

export default Textarea;
