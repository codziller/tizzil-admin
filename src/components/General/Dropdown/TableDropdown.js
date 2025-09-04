import React, { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Popover from "@material-ui/core/Popover";
import { ThreeDots } from "react-loader-spinner";
import { ReactComponent as Check } from "assets/icons/CheckIcon/small-check.svg";
import { FiChevronDown } from "react-icons/fi";

export default function TableDropdown({
  content,
  handleClick,
  options,
  isLoading,
  className,
  isDisabled,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected] = useState("");
  const open = Boolean(anchorEl);
  return (
    <>
      <div
        className="flex justify-start gap-1"
        onClick={(e) => {
          if (isDisabled) {
            return;
          }
          // // handleClick(e);
          setAnchorEl(open ? null : e.currentTarget);
        }}
      >
        <div
          className={classNames(
            "relative flex items-center justify-center font-normal outline-none capitalize tracking-wider focus:outline-none transition-all duration-300 whitespace-nowrap leading-relaxed shadow-none cursor-pointer text-left rounded-[80px] px-3 py-1.5 border w-[150px]",
            {
              "rounded-bl-none rounded-br-none": open,
              "border-yellow": className?.includes("text-yellow"),
              "border-green": className?.includes("text-green"),
              "border-red-deep": className?.includes("text-red-deep"),
              "border-gray-300":
                !className?.includes("text-yellow") &&
                !className?.includes("text-green") &&
                !className?.includes("text-red-deep"),
            }
          )}
        >
          {/* Main section */}
          <div className="flex flex-row justify-between items-center">
            {isLoading ? (
              <ThreeDots
                height="20"
                width="20"
                color="#000000"
                ariaLabel="tail-spin-loading"
                radius="1"
                visible={true}
              />
            ) : (
              <div
                className={`overflow-ellipsis overflow-hidden whitespace-nowrap max-w-12 flex flex-row justify-start items-center
            
            `}
              >
                <div
                  className={classNames(
                    "text-[10px] font-normal capitalize",
                    className
                  )}
                >
                  {selected?.label || content}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main section end */}
        {isDisabled ? null : (
          <span
            className={`flex justify-center items-center transition-transform ease-in-out duration-300 transform
                ${open ? "-rotate-180" : "rotate-0 text-blue"}
                `}
          >
            <FiChevronDown className="text-[#999999] h-4 w-4" />
          </span>
        )}
      </div>

      <Popover
        id={open ? "simple-popover" : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={() => (isLoading ? null : setAnchorEl(null))}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div
          className={classNames(
            "transition-all w-[200px] rounded-lg py-3 bg-white border-1/2 border-grey-bordercolor no-scroll"
          )}
        >
          {options?.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (isLoading) {
                  return;
                }
                // setSelected(item);
                handleClick?.(item);
                setAnchorEl(null);
              }}
              className="flex items-center justify-between p-3 w-full transition-colors duration-500 ease-in-out hover:bg-grey-whitesmoke3 current-svg text-[#690007]"
            >
              <span className="text-sm text-grey-text capitalize">
                {item?.label}
              </span>
              {item.value === (selected?.value || content) && <Check />}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

TableDropdown.propTypes = {
  content: PropTypes.any,
  handleClick: PropTypes.func,
  options: PropTypes.array,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};
