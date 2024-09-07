import React from "react";
import PropTypes from "prop-types";
import clsx from "classnames";
import Button from "components/General/Button/Button";
import { ReactComponent as Export } from "assets/icons/Export/export.svg";
import { ReactComponent as Filter } from "assets/icons/Filter/filter.svg";
import SearchBar from "components/General/Searchbar/SearchBar";
import useWindowDimensions from "hooks/useWindowDimensions";

function TableManipulation({
  placeholder,
  onSearchClick,
  onSearchChange,
  searchValue,
  onFilter,
  onExport,
  className,
  searchClass = "hidden lg:flex",
  searchLoading,
}) {
  const { width } = useWindowDimensions();
  return (
    <div
      className={clsx(
        "flex flex-row justify-start items-center h-11 w-full rounded-lg space-x-3",
        className
      )}
    >
      {onSearchChange && (
        <div className="w-full relative">
          <SearchBar
            placeholder={placeholder}
            onClick={onSearchClick}
            onChange={onSearchChange}
            value={searchValue}
            className={searchClass}
            isLoading={searchLoading}
          />
        </div>
      )}
      {(onFilter || onExport) && (
        <div className="flex justify-between items-center space-x-3 w-full md:w-fit">
          {onFilter && (
            <Button
              text="Filter"
              whiteBg
              icon={<Filter className="stroke-current" />}
              onClick={onFilter}
              fullWidth={!onExport && !onSearchChange && width < 640}
            />
          )}

          {onExport && (
            <Button
              whiteBg
              text="Export"
              icon={<Export className="stroke-current" />}
              onClick={onExport}
              fullWidth={!onFilter && !onSearchChange && width < 640}
            />
          )}
        </div>
      )}
    </div>
  );
}

TableManipulation.propTypes = {
  placeholder: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchClick: PropTypes.func,
  onSearchChange: PropTypes.func,
  onFilter: PropTypes.func,
  onExport: PropTypes.func,
  className: PropTypes.string,
  searchClass: PropTypes.string,
  searchLoading: PropTypes.bool,
};

export default TableManipulation;
