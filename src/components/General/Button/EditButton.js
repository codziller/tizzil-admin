import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as Edit } from "assets/icons/Edit/edit.svg";
import Button from "./Button";

const EditButton = ({ onClick }) => (
  <Button
    {...{ onClick }}
    text="Edit"
    icon={<Edit className="stroke-current" />}
    whiteBg
  />
);

EditButton.propTypes = {
  onClick: PropTypes.func,
};

export default EditButton;
