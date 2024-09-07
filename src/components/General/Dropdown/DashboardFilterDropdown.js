import React from "react";
import PropTypes from "prop-types";
import DropdownHead from "components/General/Dropdown/Dropdown";
import DropdownLink from "components/General/Dropdown/DropdownLink";

const DashboardFilterDropdown = ({
  onClick,
  value,
  placeholder,
  options = [],
  noBackgroundColor,
  content,
  align,
  containerClassName,
}) => {
  return (
    <DropdownHead
      placeholder={
        content || value || <span className="!text-grey">{placeholder}</span>
      }
      isValue={!!value}
      clickAndClose
      isFilter
      noBackgroundColor={noBackgroundColor}
      align={align}
      containerClassName={containerClassName}
    >
      {options?.map((item) => (
        <DropdownLink
          key={item.label}
          onClick={() => {
            onClick(item);
          }}
        >
          {item.label}
        </DropdownLink>
      ))}
    </DropdownHead>
  );
};

DashboardFilterDropdown.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string,
  noBackgroundColor: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  content: PropTypes.element,
  align: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default DashboardFilterDropdown;
