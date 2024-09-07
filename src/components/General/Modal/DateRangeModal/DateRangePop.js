import React, { useEffect } from "react";
import clsx from "classnames";
import PropTypes from "prop-types";
import Popover from "@material-ui/core/Popover";
import DatePicker from "components/General/DatePicker/MaterialDatePicker";

const DateRangePop = ({ open, onChange, anchorEl, setAnchorEl }) => {
  useEffect(() => {
    // setSelectionRange(inflowSelectionRange);
  }, []);
  //   const handleSelect = (ranges) => {
  //     setSelectionRange(ranges.selection);
  //   };
  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     toggler();
  //   };
  return (
    <Popover
      id={open ? "simple-popover" : undefined}
      open={open}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <div
        className={clsx(
          "transition-all w-[260px] rounded-lg p-3 bg-white border-1/2 border-grey-bordercolor"
        )}
      >
        <div className="flex flex-col justify-start items-start mb-4 space-y-2 w-full">
          <DatePicker label="From" placeholder="From" name="start_date" />
        </div>

        <div className="flex flex-col justify-start items-start space-y-2 w-full">
          <DatePicker label="To" placeholder="To" name="end_date" />
        </div>
      </div>
    </Popover>
  );
};
DateRangePop.propTypes = {
  open: PropTypes.bool,
  onChange: PropTypes.func,
  anchorEl: PropTypes.element,
  setAnchorEl: PropTypes.func,
};
export default DateRangePop;
