import React from "react";
import PropTypes from "prop-types";
const SliderPagination = ({ pages, className, activePage, setActivePage }) => (
  <div
    className={`flex justify-start items-center gap-2 transition-all duration-[0.5s] ease-in-out ${className}`}
  >
    {pages?.map((item, i) => (
      <div
        key={i}
        onClick={() => setActivePage(i)}
        className={`min-h-[5px] w-[45px] rounded-[4px] cursor-pointer transition-all duration-[0.5s] ease-in-out ${
          i === activePage
            ? "bg-black basis-3/6"
            : "bg-grey-144 opacity-20 basis-1/6"
        }`}
      />
    ))}
  </div>
);
SliderPagination.propTypes = {
  setActivePage: PropTypes.func,
  activePage: PropTypes.number,
  className: PropTypes.string,
  pages: PropTypes.array,
};

export default SliderPagination;
