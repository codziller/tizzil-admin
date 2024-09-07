import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FlagWrapper = styled.div`
  img {
    height: 32px;
    width: 32px;
    max-width: 32px;
  }
`;
const Flag = ({ countryCode }) => {
  return (
    <FlagWrapper className="rounded-[2px] h-[15px] w-[20px] overflow-hidden flex justify-center items-center">
      <img
        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
      />
    </FlagWrapper>
  );
};

Flag.propTypes = {
  countryCode: PropTypes.string,
};

export default Flag;
