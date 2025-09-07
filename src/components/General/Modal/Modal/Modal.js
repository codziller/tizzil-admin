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
  // New submodal props
  submodal = null,
  // Footer prop
  footer = null,
  zIndex = 99999,
}) => {
  // Check if submodal is active
  const isSubmodalActive = submodal && submodal.active;

  const getModalWidth = (modalSize) => {
    switch (modalSize) {
      case "2xl":
        return "w-full md:max-w-[86%] md:w-[86%]";
      case "xl":
        return "w-full md:max-w-[500px] md:w-[500px]";
      case "lg":
        return "w-full md:max-w-[400px] md:w-[400px]";
      case "md":
        return "w-full md:max-w-[300px] md:w-[300px]";
      case "sm":
        return "w-full md:max-w-[250px] md:w-[250px]";
      default:
        return "w-full md:w-fit";
    }
  };

  const getMainModalClasses = () => {
    const baseClasses = {
      [getModalWidth(size)]: true,
      "md:max-h-[89%] md:h-[89%]": size === "2xl",
      "p-[24px]": !noPadding,
      [className]: className,
    };

    if (isSideModal) {
      return {
        ...baseClasses,
        "opacity-100 translate-x-0 bottom-0 pointer-events-auto": active,
        "md:translate-x-1/4 translate-x-[1000px] opacity-0 pointer-events-none bottom-0":
          !active,
      };
    } else {
      return {
        ...baseClasses,
        "opacity-100 translate-y-0 bottom-0 pointer-events-auto": active,
        "md:translate-y-1/4 translate-y-[1000px] opacity-0 pointer-events-none bottom-0":
          !active,
      };
    }
  };

  const getSubmodalClasses = () => {
    if (!submodal) return {};

    const baseClasses = {
      [getModalWidth(submodal.size || "xl")]: true, // Use submodal size or default to xl
      "p-[24px]": !submodal.noPadding,
      [submodal.className]: submodal.className,
    };

    return {
      ...baseClasses,
      "opacity-100 translate-x-0 pointer-events-auto": isSubmodalActive,
      "-translate-x-full opacity-0 pointer-events-none": !isSubmodalActive, // Slide from left
    };
  };

  useEffect(() => {
    if (active) {
      hideSideNav();
    } else {
      showSideNav();
    }
  }, [active]);

  const handleBackdropClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      if (isSubmodalActive && submodal.toggler) {
        submodal.toggler();
      } else if (toggler) {
        toggler();
      }
    }
  };

  return (
    <div
      style={{ zIndex }}
      className={clsx(
        `h-screen w-full fixed !m-0 flex items-start backdrop bottom-0 md:top-0 left-0 !overflow-hidden`,
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
      onClick={handleBackdropClick}
    >
      {/* Modal Container - holds both main and submodal */}
      <div className="flex transition-all duration-300 ease-in-out">
        {/* Submodal - positioned to the LEFT */}
        {submodal && (
          <div
            style={{ maxHeight, marginRight: "12px" }}
            className={clsx(
              `!absolute md:!relative modal-content-area flex flex-col justify-start bg-white rounded-bl-none rounded-br-none transition-all z-[99999] duration-300 ease-in-out`,
              { "md:min-h-[100vh] overflow-hidden": true },
              getSubmodalClasses()
            )}
          >
            {/* Fixed Submodal Header */}
            <div className="flex w-full justify-between items-center border-b border-gray-200 bg-white sticky top-0 z-10">
              {submodal.title && (
                <span className="text-[14px] #000000 font-600">
                  {submodal.title}
                </span>
              )}
              {submodal.hasToggler !== false && submodal.toggler && (
                <div
                  className="cursor-pointer w-fit flex justify-start items-start text-white hover:bg-blue-border hover:text-black hover:bg-white rounded-full transition-all duration-150 ease-in-out "
                  onClick={submodal.toggler}
                >
                  <div className="h-8 w-8 relative flex justify-center items-center">
                    <CancelIcon className="stroke-current" />
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Submodal Content */}
            <div className="flex-1 overflow-y-auto py-6">
              {submodal.children}
            </div>

            {/* Fixed Submodal Footer */}
            {submodal.footer && (
              <div className="border-t border-gray-200 bg-white sticky bottom-0 z-10 py-6">
                {submodal.footer}
              </div>
            )}
          </div>
        )}

        {/* Main Modal */}
        <div
          style={{ maxHeight }}
          className={clsx(
            `!absolute md:!relative modal-content-area flex flex-col justify-start bg-white rounded-bl-none rounded-br-none transition-all z-[99999] duration-300 ease-in-out`,
            { "md:min-h-[100vh] overflow-hidden": isSideModal },
            {
              "md:max-h-[670px] mt-4 md:rounded-bl-lg md:rounded-br-lg rounded-lg":
                !isSideModal,
            },
            getMainModalClasses(),
            modalClassName
          )}
        >
          {/* Fixed Main Modal Header */}
          {isSideModal && (
            <div className="flex w-full justify-between items-center border-b border-gray-200 bg-white sticky top-0 z-10">
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

          {/* Scrollable Main Modal Content */}
          <div className="flex-1 overflow-y-auto py-6">{children}</div>

          {/* Fixed Main Modal Footer */}
          {footer && (
            <div className="border-t border-gray-200 bg-white sticky bottom-0 z-10 py-6">
              {footer}
            </div>
          )}

          {hasToggler && !isSideModal && (
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
  zIndex: PropTypes.number,
  footer: PropTypes.node,
  submodal: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    toggler: PropTypes.func,
    hasToggler: PropTypes.bool,
    noPadding: PropTypes.bool,
    className: PropTypes.string,
    size: PropTypes.string,
    footer: PropTypes.node,
  }),
};

export default Modal;
