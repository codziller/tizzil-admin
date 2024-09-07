import { useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import PropTypes from "prop-types";
import clsx from "classnames";
import ReactPaginate from "react-paginate";
import { ReactComponent as Calender } from "assets/icons/calender.svg";
import { ReactComponent as Chevron } from "assets/icons/chevron-right.svg";
import { TableWrapper, PaginationWrapper } from "./table.style";
import SearchBar from "../Searchbar/SearchBar";
import DateRangeModal from "../Modal/DateRangeModal/DateRangeModal";
import DateRangePopUp from "../Modal/DateRangeModal/DateRangePop";

createTheme("default", {
  text: {
    primary: "#65717c",
    secondary: "#000000",
  },
  background: {
    default: "transparent",
  },
  divider: {
    default: "rgba(245, 246, 250, 1);",
  },
  action: {
    hover: "yellow",
  },
  striped: {
    default: "rgba(245, 246, 250, 0.7)",
  },
});

const renderMobileRows = (mobileRowRender, keyField, data, otherProps) => {
  const onRowPress = (row) => {
    if (otherProps?.onRowClicked) {
      otherProps.onRowClicked(row);
    }
  };

  const onMouseEnter = (row) => {
    if (otherProps?.onRowMouseEnter) {
      otherProps.onRowMouseEnter(row);
    }
  };
  return (
    <div>
      {data.map((row, index) => (
        <div
          onClick={() => onRowPress(row)}
          onMouseEnter={() => onMouseEnter(row)}
          key={row[keyField]}
          className={clsx({ "cursor-pointer": otherProps?.onRowClicked })}
        >
          {mobileRowRender(row, index)}
        </div>
      ))}
    </div>
  );
};

export default function Table({
  columns,
  data,
  extendMinHeight,
  isLoading,
  extraChild,
  pageCount,
  onPageChange,
  currentPage,
  tableClassName,
  isAlt,
  mobileRowRender,
  keyField,
  noPadding,
  title,
  placeholder,
  setSearchInput,
  searchInput,
  searching,
  header,
  hover,
  dataRangeFromTo,
  dateFilter,
  filterButton,
  ...rest
}) {
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  return (
    <TableWrapper
      hover={hover}
      extendMinHeight={extendMinHeight}
      noPadding={noPadding}
    >
      <div className={`${isAlt ? "" : "table-container"} ${tableClassName}`}>
        {header ? (
          <div
            className={clsx(
              "flex flex-col justify-start items-start w-full pb-4",
              { "px-[16px] md::px-[40px]": title },
              { "pl-[10px]": noPadding },
              { "pt-8": title || filterButton }
            )}
          >
            {title && (
              <span className="text-base whitespace-nowrap font-600 mb-2 sm:mb-6">
                {title}
              </span>
            )}
            <div className="flex flex-col sm:flex-row justify-start items-start w-full gap-4">
              <div className="w-full sm:w-[45%] sm:min-w-[300px]">
                <SearchBar
                  placeholder={placeholder}
                  onChange={setSearchInput}
                  value={searchInput}
                  isLoading={searching}
                  className="flex"
                />
              </div>

              {dateFilter ? (
                <button
                  onClick={(e) =>
                    dataRangeFromTo
                      ? setAnchorEl(e.currentTarget)
                      : setShowRangeModal(true)
                  }
                  className="flex justify-center items-center gap-1 text-blue text-base border-1/2 border-blue rounded px-8 h-[40px] hover:bg-grey-light hover:border-blue-border transition-all duration-[700ms] ease-in-out"
                >
                  <Calender />
                  <span>Filter by Date</span>
                </button>
              ) : (
                filterButton
              )}
            </div>
          </div>
        ) : null}

        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={data}
            theme="default"
            progressPending={isLoading}
            progressComponent={<h1>Loading...</h1>}
            {...rest}
          />
          {extraChild}
        </div>
        <div className="block md:hidden">
          {mobileRowRender ? (
            renderMobileRows(mobileRowRender, keyField, data, rest)
          ) : (
            <div>
              <DataTable
                columns={columns}
                data={data}
                theme="default"
                progressPending={isLoading}
                progressComponent={<h1>Loading...</h1>}
                {...rest}
              />
            </div>
          )}
          {extraChild}
        </div>
      </div>

      {pageCount && pageCount > 1 ? (
        <PaginationWrapper>
          <ReactPaginate
            className="react-paginate"
            pageClassName="pagination-page-item"
            activeClassName="active-page"
            breakLabel="..."
            nextLabel={<Chevron />}
            onPageChange={(page) => onPageChange(page.selected + 1)} // Library uses zero index for page number
            pageRangeDisplayed={7}
            marginPagesDisplayed={3}
            pageCount={pageCount}
            previousLabel={<Chevron className="rotate-180" />}
            forcePage={currentPage - 1} // Library uses zero index for page number
            breakClassName="page-item-break"
            renderOnZeroPageCount={null}
          />
        </PaginationWrapper>
      ) : null}

      {dataRangeFromTo ? (
        <DateRangePopUp
          open={open}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      ) : (
        <DateRangeModal
          active={showRangeModal}
          toggler={() => setShowRangeModal(false)}
        />
      )}
    </TableWrapper>
  );
}

Table.propTypes = {
  extendMinHeight: PropTypes.bool,
  columns: PropTypes.array,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  rest: PropTypes.object,
  extraChild: PropTypes.elementType,
  pageCount: PropTypes.number,
  onPageChange: PropTypes.func,
  currentPage: PropTypes.number,
  isAlt: PropTypes.bool,
  tableClassName: PropTypes.string,
  mobileRowRender: PropTypes.func,
  keyField: PropTypes.string,
  title: PropTypes.string,
  noPadding: PropTypes.bool,
  placeholder: PropTypes.string,
  setSearchInput: PropTypes.func,
  searchInput: PropTypes.string,
  searching: PropTypes.bool,
  header: PropTypes.bool,
  hover: PropTypes.bool,
  dataRangeFromTo: PropTypes.bool,
  dateFilter: PropTypes.bool,
  filterButton: PropTypes.element,
};
