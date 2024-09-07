import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as Filter } from "assets/icons/Filter/filter.svg";
import Button from "./Button";

const FilterButton = ({ onClick }) => (
  <Button
    {...{ onClick }}
    text="Filter"
    icon={<Filter className="stroke-current" />}
    whiteBg
  />
);

FilterButton.propTypes = {
  onClick: PropTypes.func,
};

export default FilterButton;
