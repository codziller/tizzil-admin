import React from "react";
import PropTypes from "prop-types";

const MobileTopNav = ({
  leftText,
  onLeftTextClick,
  rightElement,
  centerText,
}) => {
  return (
    <div className="h-[58px] flex justify-between items-center border-b-1/2 px-3 py-5 border-grey-border">
      <button
        className="border-none outline-none bg-transparent"
        onClick={onLeftTextClick}
      >
        <span className="text-sm text-grey-text">{leftText}</span>
      </button>
      <span className="text-sm text-black" id="mobile-topnav-middle-text">
        {centerText}
      </span>
      {rightElement || (
        <button className=" pointer-events-none opacity-0">
          <span className="text-sm text-grey-text">{leftText}</span>
        </button>
      )}
    </div>
  );
};

MobileTopNav.propTypes = {
  onLeftTextClick: PropTypes.func,
  leftText: PropTypes.element,
  centerText: PropTypes.string,
  rightElement: PropTypes.element,
};

export default MobileTopNav;
