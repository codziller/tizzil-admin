import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "classnames";
import { ReactComponent as CancelIcon } from "assets/icons/cancel.svg";
import { hideSideNav, showSideNav } from "utils/functions";

const Modal = ({
  active,
  toggler,
  size,
  children,
  noPadding,
  className,
  hasToggler = true,
  maxHeight = "670px",
  containerClassName = "overflow-y-auto",
  modalClassName,
  isSideModal,
  title,
  closeOnClickOutside,
}) => {
  const modalClassNames = {
    "w-full md:max-w-[86%] md:max-h-[89%] md:w-[86%] md:h-[89%]":
      size === "2xl",
    "w-full md:max-w-[500px]": size === "xl",
    "w-full md:max-w-lg": size === "lg",
    "w-full md:max-w-md": size === "md",
    "w-full md:max-w-sm": size === "sm",
    "w-full md:w-fit": !size,
    "opacity-100 translate-y-0 bottom-0 pointer-events-auto":
      active && !isSideModal,
    "md:translate-y-1/4 translate-y-[1000px] opacity-0 pointer-events-none bottom-0":
      !active && !isSideModal,

    "opacity-100 translate-x-0 bottom-0 pointer-events-auto":
      active && isSideModal,
    "md:translate-x-1/4 translate-x-[1000px] opacity-0 pointer-events-none bottom-0":
      !active && isSideModal,
    "p-[24px]": !noPadding,
    [className]: className,
  };

  useEffect(() => {
    if (active) {
      hideSideNav();
    } else {
      showSideNav();
    }
  }, [active]);

  return (
    <div
      className={clsx(
        `h-screen overflow-hidden w-full fixed !m-0 flex items-start backdrop z-[99999] bottom-0 md:top-0 left-0`,
        containerClassName,
        {
          "transition-all duration-100 ease-in-out opacity-100 pointer-events-auto":
            active,
        },
        {
          "transition-all duration-300 ease-in-out opacity-0 !pointer-events-none":
            !active,
        },
        {
          "py-8 justify-center": !isSideModal,
        },
        {
          "py-8 md:py-0 justify-end": isSideModal,
        }
      )}
    >
      <div
        style={{ maxHeight }}
        className={clsx(
          `!absolute md:!relative modal-content-area flex flex-col justify-start bg-white rounded-bl-none rounded-br-none  w-full transition-all z-[99999] duration-300 ease-in-out`,

          { "md:min-h-[100vh] overflow-y-auto overflow-x-hidden": isSideModal },
          {
            "md:max-h-[670px] mt-4 md:rounded-bl-lg md:rounded-br-lg rounded-lg":
              !isSideModal,
          },
          { ...modalClassNames },
          modalClassName
        )}
      >
        {isSideModal && (
          <div className="flex w-full justify-between items-center mb-3">
            {title && (
              <span className="text-[14px] #000000 font-600">{title}</span>
            )}
            <div
              className="cursor-pointer w-fit flex justify-start items-start text-white hover:bg-blue-border hover:text-black hover:bg-white rounded-full transition-all duration-150 ease-in-out "
              onClick={toggler}
            >
              <div className="h-8 w-8 relative flex justify-center items-center">
                <CancelIcon className="stroke-current" />
              </div>
            </div>
          </div>
        )}

        {children}
        {hasToggler && (
          <div
            className="absolute md:top-0 top-[-60px]  toggler right-[16.33px] md:-right-14 cursor-pointer flex justify-center items-center text-white bg-grey-whitesmoke bg-opacity-30 hover:bg-opacity-100 hover:text-black hover:bg-white rounded-full transition-all duration-150 ease-in-out "
            onClick={toggler}
          >
            <div className="h-8 w-8 relative flex justify-center items-center">
              <CancelIcon className="stroke-current" />
            </div>
          </div>
        )}
      </div>

      <div
        onClick={() => {
          if (!closeOnClickOutside) {
            return;
          }
          toggler();
        }}
        className="fixed top-0 left-0 h-screen w-full !my-0 "
      ></div>
    </div>
  );
};

Modal.propTypes = {
  active: PropTypes.bool,
  toggler: PropTypes.func,
  size: PropTypes.string,
  children: PropTypes.elementType,
  noPadding: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  hasToggler: PropTypes.bool,
  maxHeight: PropTypes.string,
  modalClassName: PropTypes.string,
  isSideModal: PropTypes.bool,
  closeOnClickOutside: PropTypes.bool,
};

export default Modal;
