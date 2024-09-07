import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as TrashBin } from "assets/icons/TrashBin/trashBin.svg";
import Button from "./Button";

const DeleteButton = ({ onClick, text }) => (
  <Button
    {...{ onClick }}
    text={text || "Delete"}
    icon={<TrashBin className="stroke-current current-svg" />}
    fullWidth
    redBg
  />
);

DeleteButton.propTypes = {
  onClick: PropTypes.func,
};

export default DeleteButton;
