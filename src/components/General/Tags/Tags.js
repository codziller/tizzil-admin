import React from "react";
import PropTypes from "prop-types";

const Tags = ({ name }) => {
  return (
    <div className="border border-grey-border rounded-3xl p-2 text-sm">
      {name}
    </div>
  );
};

Tags.propTypes = {
  name: PropTypes.string,
};

export default Tags;
