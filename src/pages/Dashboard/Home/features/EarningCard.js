import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { NAIRA } from "utils/appConstant";
import { numberWithCommas } from "utils/formatter";

const EarningCard = ({
  icon,
  title,
  value,
  link,
  decimalValue,
  isLoading,
  isAmount,
}) => (
  <Link
    to={link}
    className="bg-white flex flex-col justify-start items-start w-full border border-transparent hover:border-grey-text pt-3 pb-5 gap-3.5 cursor-pointer transition-colors duration-500 ease-in-out"
  >
    <div className="flex justify-start items-start w-full gap-1  border-b-[0.4px] border-grey-border5 px-3 pb-3">
      <span>{icon}</span>
      <p className="text-sm text-grey-dark ">{title}</p>
    </div>
    <div className="px-3 truncate max-w-[99%]">
      {isLoading ? (
        <TailSpin
          height="25"
          width="25"
          color="#000000"
          ariaLabel="tail-spin-loading"
          radius="3"
          visible={true}
        />
      ) : (
        <span className="text-2xl font-600 truncate max-w-full">
          {isAmount && NAIRA}
          {numberWithCommas(value)}
          {decimalValue ? (
            <span className="font-500 text-[10px]">{"." + decimalValue}</span>
          ) : null}
        </span>
      )}
    </div>
  </Link>
);

EarningCard.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
  value: PropTypes.string,
  decimalValue: PropTypes.bool,
  isLoading: PropTypes.bool,
  isAmount: PropTypes.bool,
};

export default EarningCard;
