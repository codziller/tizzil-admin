import React from "react";
import PropTypes from "prop-types";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { ReactComponent as ArrowDown } from "assets/icons/Arrow/arrow-down.svg";
import { SelectSearchWrapper } from "./style";

export default function SelectSearchComponent({
  value,
  options,
  label,
  onChange,
  placeholder,
  name,
  ...props
}) {
  return (
    <SelectSearchWrapper>
      <label>{label}</label>
      <div className="search-wrapper">
        <SelectSearch
          options={options}
          value={value}
          onChange={(inputValue) =>
            onChange(inputValue, { value: inputValue, name })
          }
          search
          filterOptions={fuzzySearch}
          emptyMessage={() => (
            <div className="empty-message">
              <p>Not found</p>
            </div>
          )}
          placeholder={placeholder}
          {...props}
        />
        <ArrowDown className="dropdown-arrow" />
      </div>
    </SelectSearchWrapper>
  );
}

SelectSearchComponent.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  props: PropTypes.object,
};
