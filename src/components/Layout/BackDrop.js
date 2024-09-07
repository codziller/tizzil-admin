import React from "react";
import propTypes from "prop-types";
import clsx from "classnames";

const BackDrop = ({ active, onClick, className }) => {
  return (
    <div
      className={clsx(
        "opacity-0 sidenav-backdrop pointer-events-none hidden md:block transition-all bg-black/[.5]",
        {
          "opacity-100 pointer-events-auto fixed top-0 !block left-0 h-full w-full z-[99]":
            active,
        },
        className
      )}
      onClick={onClick}
    />
  );
};

BackDrop.propTypes = {
  active: propTypes.bool,
  onClick: propTypes.func,
  className: propTypes.string,
};

export default BackDrop;
