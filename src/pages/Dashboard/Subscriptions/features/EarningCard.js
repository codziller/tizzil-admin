import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const EarningCard = ({ icon, title, value, link, isDecimal }) => (
  <Link
    to={link}
    className="bg-white flex flex-col justify-start items-start w-full border border-transparent hover:border-grey-text pt-3 pb-5 gap-3.5 cursor-pointer transition-colors duration-500 ease-in-out"
  >
    <div className="flex justify-start items-start w-full gap-1  border-b-[0.4px] border-grey-border5 px-3 pb-3">
      <span>{icon}</span>
      <p className="text-sm text-grey-dark ">{title}</p>
    </div>
    <div className="px-3 truncate max-w-[99%]">
      <span className="text-2xl font-600 truncate max-w-full">
        {value}
        {isDecimal && <span className="font-500 text-[10px]">{".00"}</span>}
      </span>
    </div>
  </Link>
);

EarningCard.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
  value: PropTypes.string,
  isDecimal: PropTypes.bool,
};

export default EarningCard;
