import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as Export } from "assets/icons/Export/export.svg";
import Button from "./Button";

const ExportButton = ({ onClick }) => (
  <Button
    {...{ onClick }}
    text="Export"
    icon={<Export className="stroke-current" />}
    whiteBg
  />
);

ExportButton.propTypes = {
  onClick: PropTypes.func,
};

export default ExportButton;
