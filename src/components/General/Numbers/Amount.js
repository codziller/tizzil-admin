import React from "react";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";

import { numberWithCommas } from "utils/formatter";
import useWindowDimensions from "hooks/useWindowDimensions";
import ToolTip from "../ToolTip";
import { NAIRA } from "utils/appConstant";

const Amount = ({
  prefix = NAIRA,
  className,
  value,
  noDefaultPrefix,
  onClick,
}) => {
  const { width } = useWindowDimensions();
  return (
    <ToolTip content={`${prefix || ""} ${numberWithCommas(value)}`}>
      <div className={className} onClick={onClick}>
        <NumberFormat
          decimalScale={2}
          fixedDecimalScale
          thousandSeparator=","
          displayType="text"
          value={value}
          className={className}
          prefix={
            noDefaultPrefix
              ? null
              : (prefix === NAIRA && width < 768 ? NAIRA : prefix) + " "
          }
        />
      </div>
    </ToolTip>
  );
};

Amount.propTypes = {
  prefix: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.number,
  noDefaultPrefix: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Amount;
