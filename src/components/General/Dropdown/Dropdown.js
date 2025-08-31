import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as ArrowDownIcon } from "assets/icons/caret-down.svg";
import clsx from "classnames";

const DropdownHead = ({
  placeholder,
  children,
  clickAndClose,
  isLoading,
  isActive = false,
  isValue = false,
  isFilter,
  size,
  dropdownUp,
  className,
  align = "items-start",
  containerClassName,
}) => {
  const domNode = useRef();
  const [active, setActive] = useState(false);
  const [, setValue] = useState(false);
  const [positionTop, setPositionTop] = useState(false);
  const [y, setY] = useState(null);
  const innerHeight = window.innerHeight;

  useEffect(() => {
    const maybeHandler = () => {
      setY(domNode?.current?.getBoundingClientRect?.()?.top);
    };
    document.addEventListener("scroll", maybeHandler);
    return () => {
      document.removeEventListener("scroll", maybeHandler);
    };
  });
  useEffect(() => {
    const maybeHandler = (event) => {
      if (!domNode.current.contains(event.target || event.target.childNodes)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", maybeHandler);
    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  useEffect(() => {
    if (!y) return;
    y > innerHeight / 1.5 ? setPositionTop(true) : setPositionTop(false);
  }, [innerHeight, y]);

  useEffect(() => {
    if (!dropdownUp) return;
    setPositionTop(true);
  }, [dropdownUp]);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  useEffect(() => {
    setValue(isValue);
  }, [isValue]);

  const handleClick = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className={clsx(
        "relative transition-all ease-in-out duration-300 flex flex-col justify-start h-full",
        { "w-full": isFilter },
        { "min-w-[42%] sm:min-w-[50%]": active && isFilter },
        { "w-full": !isFilter },
        align,
        className
      )}
      ref={domNode}
    >
      <>
        {" "}
        <div
          className={clsx(
            "relative w-fit flex items-center justify-between font-normal outline-none capitalize tracking-wider focus:outline-none transition-all duration-300 whitespace-nowrap leading-relaxed shadow-none cursor-pointer text-left",
            {
              "w-fit bg-white border-[0.4px] border-grey-20 text-base px-3 py-[3px] hover:border-grey-35 gap-2":
                isFilter,
            },
            { "full text-sm h-11 px-4 bg-white border": !isFilter },

            { "!h-14": size === "lg" },
            { "rounded-bl-none rounded-br-none": active },
            containerClassName
          )}
          onClick={(e) => {
            handleClick(e);
            setActive((prev) => !prev);
          }}
        >
          <div className="w-fit flex flex-row justify-between items-center">
            <div
              className={`overflow-ellipsis overflow-hidden whitespace-nowrap max-w-12 flex flex-row justify-start items-center
            ${isValue ? "text-black" : "text-grey"}
            `}
            >
              {placeholder}
            </div>
          </div>

          {isLoading ? (
            <>
              <span className="ml-2  flex justify-center items-center"></span>
            </>
          ) : (
            <span
              className={`flex justify-center items-center transition-transform ease-in-out duration-300 transform
                ${active ? "-rotate-180 text-blue" : "rotate-0"}
                `}
            >
              <ArrowDownIcon className="stroke-black h-3.5 w-3.5 scale-[0.7]" />
            </span>
          )}
        </div>
      </>

      <div
        className={`shadow bg-white rounded-b-lg overflow-hidden overflow-y-auto absolute  w-full max-h-52  z-40 transform transition-none ease-in-out duration-300 
        ${positionTop ? "bottom-full" : "top-full"}
        ${
          positionTop
            ? "origin-bottom-right rounded-lg right-0 mb-2"
            : "origin-top-right rounded-b-lg right-0"
        }
        ${
          !active
            ? "opacity-0 pointer-events-none scale-0"
            : "opacity-100 scale-100"
        }
       
         `}
        onClick={() => {
          if (clickAndClose) return setActive((prev) => !prev);
        }}
      >
        {children}
      </div>
    </div>
  );
};

DropdownHead.propTypes = {
  placeholder: PropTypes.any,
  children: PropTypes.any,
  clickAndClose: PropTypes.bool,
  isLoading: PropTypes.bool,
  isActive: PropTypes.bool,
  isValue: PropTypes.bool,
  isFilter: PropTypes.bool,
  size: PropTypes.string,
  dropdownUp: PropTypes.bool,
  className: PropTypes.string,
  align: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default DropdownHead;
