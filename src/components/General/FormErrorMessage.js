import PropTypes from "prop-types";

export const FormErrorMessage = ({ type }) =>
  type && (
    <span className="text-red text-xs input_error_msg">{type.message}.</span>
  );

FormErrorMessage.propTypes = {
  type: PropTypes.object,
};
