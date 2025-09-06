import { useState, useRef, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import PropTypes from "prop-types";
import clsx from "classnames";
import ReactPaginate from "react-paginate";
import { ReactComponent as Calender } from "assets/icons/calender.svg";
import { ReactComponent as Chevron } from "assets/icons/chevron-right.svg";
import { ReactComponent as ChevronUpDown } from "assets/icons/chevron-up-down.svg";
import { ReactComponent as TableMoreIcon } from "assets/icons/table-more-icon.svg";
import { ReactComponent as MoreIcon } from "assets/icons/more-table-icon.svg";
import { TableWrapper, PaginationWrapper } from "./table.style";
import SearchBar from "../Searchbar/SearchBar";
import DateRangeModal from "../Modal/DateRangeModal/DateRangeModal";
import DateRangePopUp from "../Modal/DateRangeModal/DateRangePop";

createTheme("default", {
  text: {
    primary: "#666666", // Table cell text color (14px)
    secondary: "#444444", // Table header text color (14px)
  },
  background: {
    default: "transparent", // Transparent background for all table elements
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
  headRow: {
    style: {
      backgroundColor: "transparent", // Table head row transparent bg
      fontSize: "14px",
      color: "#444444",
    },
  },
  headCells: {
    style: {
      fontSize: "14px",
      color: "#444444",
      backgroundColor: "transparent",
    },
  },
  rows: {
    style: {
      backgroundColor: "transparent", // Table body rows transparent bg
    },
  },
  cells: {
    style: {
      fontSize: "14px",
      color: "#666666",
      backgroundColor: "transparent",
    },
  },
});

// Context Menu Component
const ContextMenu = ({ isOpen, onClose, options, position }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bg-white shadow-lg border border-gray-200 rounded-md py-1 min-w-[150px] z-50"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            option.onClick?.();
            onClose();
          }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
          type="button"
        >
          {option.icon && <span className="w-4 h-4">{option.icon}</span>}
          <span>{option.name}</span>
        </button>
      ))}
    </div>
  );
};

// Table Title Header Component
const TableTitleHeader = ({ title, itemCount, menuOptions = [], titleTabs = [], activeTab, onTabChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleMenuIconClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.right - 150, // Align menu to right of icon
      y: rect.bottom + 5,
    });
    setShowMenu(true);
  };

  // If titleTabs are provided, render tabbed version
  if (titleTabs && titleTabs.length > 0) {
    return (
      <div className="flex items-center gap-0 px-0 py-0 border-b border-[#D2D5DA] bg-transparent">
        {titleTabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange?.(tab, index)}
            className={`px-5 py-2 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === index
                ? 'text-[#111827] border-[#690007]'
                : 'text-[#999999] border-transparent hover:text-[#666666]'
            }`}
            type="button"
          >
            <span className="text-base font-normal">{tab.title}</span>
            <div className={`px-1.5 py-0.5 border rounded-sm ${
              activeTab === index
                ? 'border-[#690007]'
                : 'border-[#999999]'
            }`}>
              <span className={`text-base ${
                activeTab === index
                  ? 'text-[#690007]'
                  : 'text-[#999999]'
              }`}>{tab.itemCount}</span>
            </div>
          </button>
        ))}
        
        {/* menuOptions section for tabbed version */}
        {menuOptions.length > 0 && (
          <div className="ml-auto px-4 py-2">
            <button
              onClick={handleMenuIconClick}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
            >
              <TableMoreIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}

        <ContextMenu
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          options={menuOptions}
          position={menuPosition}
        />
      </div>
    );
  }

  // Regular single title version
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#D2D5DA] bg-transparent">
      {/* Title section */}
      <div className="flex items-center gap-2">
        <span className="text-base font-normal text-[#111827]">{title}</span>
        {itemCount !== undefined && (
          <div className="px-1.5 py-0.5 border border-[#690007] rounded-sm">
            <span className="text-base text-[#690007]">{itemCount}</span>
          </div>
        )}
      </div>

      {/* menuOptions section */}
      {menuOptions.length > 0 && (
        <button
          onClick={handleMenuIconClick}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <TableMoreIcon className="w-4 h-4 text-gray-600" />
        </button>
      )}

      <ContextMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        options={menuOptions}
        position={menuPosition}
      />
    </div>
  );
};

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
  // Props for title header functionality
  itemCount,
  menuOptions = [],
  // Props for tabbed title sections
  titleTabs = [],
  activeTab = 0,
  onTabChange,
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
      <div
        className={clsx(
          isAlt ? "" : "table-container",
          tableClassName,
          "border-[0.89px] border-[#D2D5DA] rounded-lg bg-transparent",
          { "overflow-hidden": title } // Only add overflow-hidden when we have a title header
        )}
      >
        {/* Top row with title and menu for all tables */}
        {(title || titleTabs.length > 0) && (
          <TableTitleHeader
            title={title}
            itemCount={itemCount}
            menuOptions={menuOptions}
            titleTabs={titleTabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        )}

        {header ? (
          <div
            className={clsx(
              "flex flex-col justify-start items-start w-full pb-4",
              { "px-[16px] md::px-[40px]": title && !title }, // Avoid double padding when using new title header
              { "pl-[10px]": noPadding },
              { "pt-8": (!title && title) || filterButton } // Only add top padding if not using new title header
            )}
          >
            {!title && ( // Only show old title if new title header is not being used
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
            progressComponent={<h1 className="p-8">Loading...</h1>}
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
                progressComponent={<h1 className="p-8">Loading...</h1>}
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
  // Props for title header functionality
  itemCount: PropTypes.number,
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.element,
      onClick: PropTypes.func,
    })
  ),
  // Props for tabbed title sections
  titleTabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      itemCount: PropTypes.number.isRequired,
    })
  ),
  activeTab: PropTypes.number,
  onTabChange: PropTypes.func,
};

// PropTypes for helper components
ContextMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

TableTitleHeader.propTypes = {
  title: PropTypes.string,
  itemCount: PropTypes.number,
  menuOptions: PropTypes.array,
  titleTabs: PropTypes.array,
  activeTab: PropTypes.number,
  onTabChange: PropTypes.func,
};
