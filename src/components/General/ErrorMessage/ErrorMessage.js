import { ReactComponent as ErrorIcon } from "assets/icons/ErrorMessage/ErrorMessage.svg";
import PropTypes from "prop-types";

const ErrorMessage = ({ message, className }) => {
  return (
    <div
      className={`flex flex-row justify-start items-center space-x-2 text-red text-xs ${className}`}
    >
      <ErrorIcon />
      <span>{message}</span>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};

export default ErrorMessage;
