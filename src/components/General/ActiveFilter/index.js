import PropTypes from "prop-types";
import moment from "moment";
import { ReactComponent as CloseCircle } from "assets/icons/close-circle.svg";
import { ActiveFilterWrapper } from "./style";

export default function ActiveFilter({ name, type, value, onRemove }) {
  return (
    <ActiveFilterWrapper className="active-filter-item flex items-center space-x-[8px] bg-white">
      <p className="filter-type content-text text-grey text-black">
        {name || type}:
      </p>
      <p className="filter-value content-text">
        {moment(value).isValid() && String(value).split("-").length === 3
          ? moment(value).format("DD MMM YYYY")
          : value}
      </p>
      <CloseCircle style={{ cursor: "pointer" }} onClick={onRemove} />
    </ActiveFilterWrapper>
  );
}

ActiveFilter.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onRemove: PropTypes.func,
};
