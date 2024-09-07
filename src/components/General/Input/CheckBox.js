import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import ToolTip from "../ToolTip";
import classNames from "classnames";

const CheckBox = ({
  onChange,
  checked,
  square,
  label,
  tooltip,
  labelClass = "text-[13px] font-bold",
  isDisabled,
}) => {
  const outer = {
    width: "20px",
    height: "20px",
    borderRadius: square ? "3px" : "10px",
    border: "1.5px solid rgba(16, 3, 3, 0.35)",
    flexShrink: 0,
  };

  const inner = {
    backgroundColor: "transparent",
    height: "12px",
    width: "12px",
    borderRadius: square ? "3px" : "6px",
  };

  const styles = {
    checkedOuter: {
      ...outer,
      border: "1.5px solid #000000",
    },
    checkedInner: {
      ...inner,
      backgroundColor: "#000000",
    },
  };
  return (
    <div
      onClick={() => {
        if (isDisabled) {
          return;
        }
        onChange?.();
      }}
      className={classNames(
        "flex justify-start cursor-pointer gap-5 items-center w-fit",
        { "opacity-[0.7]": isDisabled }
      )}
    >
      {label && (
        <div className="flex flex-row justify-between items-center w-full cursor-pointer">
          <label
            className={classNames(
              "general-input-label relative text-grey-dark !flex justify-start items-center gap-1 cursor-pointer",
              labelClass
            )}
          >
            {label}{" "}
            {tooltip && (
              <ToolTip content={tooltip}>
                <InfoIcon />
              </ToolTip>
            )}
          </label>
        </div>
      )}
      <div
        className="flex justify-center items-center"
        style={checked ? styles.checkedOuter : outer}
      >
        <div style={checked ? styles.checkedInner : inner}></div>
      </div>
    </div>
  );
};

CheckBox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  square: PropTypes.bool,
  label: PropTypes.string,
  tooltip: PropTypes.string,
  labelClass: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default CheckBox;
