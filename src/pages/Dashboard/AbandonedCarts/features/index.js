import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import qs from "query-string";

import useTableFilter from "hooks/useTableFilter";
import ActiveFilter from "components/General/ActiveFilter";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { ReactComponent as Filter } from "assets/icons/Filter/filter.svg";
import { pageCount, staffs } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";

import useWindowDimensions from "hooks/useWindowDimensions";

import { paramsObjectToQueryString } from "utils/request";
import EarningCard from "./EarningCard";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "./OrderDetailsModal";
import dateConstants from "utils/dateConstants";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import { MdOutlineSend } from "react-icons/md";
import SearchBar from "components/General/Searchbar/SearchBar";

export const dateFilters = [
  {
    value: "today",
    label: "Today",
    start_date: dateConstants?.today,
    end_date: dateConstants?.today,
  },
  {
    value: "this_week",
    label: "This Week",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
  {
    value: "all_time",
    label: "All Time",
    start_date: dateConstants?.firstDay,
    end_date: dateConstants?.today,
  },

  {
    value: "custom",
    label: "Custom Date",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
];
export default function AbandonedCartsPage() {
  const requiredFilters = {
    start_date: "2020-01-01",
    end_date: moment().format("YYYY-MM-DD"),
  };

  const defaultFilters = {
    start_date: "",
    end_date: "",
    tx_verb: "",
    fiat_wallet_id: "",
    coin_wallet_id: "",
    account_status: "",
  };

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [searchInput, setSearchInput] = useState("");

  const searching = "";

  const params = qs.parse(location.hash?.substring(1));

  const searchQuery = searchInput?.trim();

  const { filterData, onRemoveFilter } = useTableFilter({
    defaultFilters,
    currentPage,
    setCurrentPage,
    params,
  });

  const fetchMerchants = () => {
    const filters = {
      start_date: hasValue(filterData?.start_date)
        ? filterData?.start_date
        : requiredFilters.start_date,
      end_date: hasValue(filterData?.end_date)
        ? filterData?.end_date
        : requiredFilters.end_date,
      ...(hasValue(searchQuery) && {
        account_trade_name: searchQuery,
      }),
      ...(hasValue(filterData?.account_status) && {
        account_status: filterData.account_status.value,
      }),
    };

    const paramsData = {
      ...filters,
    };

    if (
      _.isEqual(
        { start_date: paramsData.start_date, end_date: paramsData.end_date },
        requiredFilters
      )
    ) {
      delete paramsData.start_date;
      delete paramsData.end_date;
    }

    window.location.hash = paramsObjectToQueryString(paramsData);
  };

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      // fetchMerchants();
    }
  }, [searchInput]);

  const columns = [
    {
      name: "Customer",
      minWidth: isMobile ? "50%" : "35%",
      selector: (row) => (
        <div
          onClick={() => setCurrentTxnDetails({ ...row })}
          className="py-4 mt-[5px] mb-[5px] flex-col justify-start items-start gap-1 flex"
        >
          <div className="text-black text-sm font-medium font-700">
            {row.name}
          </div>
          <div className="text-grey text-sm font-normal">{row.email}</div>
        </div>
      ),
      sortable: false,
    },
    {
      name: "Cart Items",
      selector: "products",
      sortable: true,
    },

    {
      name: "Date",
      selector: (row) => moment(row.order_date).format("MMM Do, YYYY"),
      sortable: true,
    },

    {
      name: "Actions",
      minWidth: isMobile ? "50%" : "25%",
      selector: (row) => (
        <a
          className="flex justify-start items-center gap-1.5"
          href="mailto:mubbzy124@gmail.com"
          rel="noreferrer"
          target="_blank"
        >
          <span className="flex justify-center items-center cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white gap-2">
            Contact Customer
            <MdOutlineSend className="stroke-current" />
          </span>
        </a>
      ),
      sortable: true,
    },
  ];

  const containsActiveFilter = () =>
    Object.keys(filterData).filter(
      (item) => filterData[item] && filterData[item] !== ""
    );

  const renderFilters = () => {
    if (filterData) {
      return containsActiveFilter().map((item) => {
        const hasChanged = defaultFilters[item] !== filterData[item];
        if (hasChanged) {
          return (
            <ActiveFilter
              key={item}
              type={_.lowerCase(item).replace(/ /g, " ")}
              value={
                moment(filterData[item]?.value || filterData[item]).isValid()
                  ? filterData[item]?.value || filterData[item]
                  : _.lowerCase(filterData[item]?.value).replace(/ /g, " ")
              }
              onRemove={() => onRemoveFilter(item)}
            />
          );
        }
        return null;
      });
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [staffs]);

  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search for a product"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>
            <button
              onClick={(e) => {}}
              className="flex justify-center items-center gap-1 text-blue text-base border-1/2 border-blue rounded px-8 h-[40px] hover:bg-grey-light hover:border-blue-border transition-all duration-[700ms] ease-in-out"
            >
              <Filter className="scale-75" />
              <span>Filter</span>
            </button>
          </div>

          {searching ? (
            <CircleLoader blue />
          ) : (
            <>
              {containsActiveFilter().length > 0 && (
                <div className="active-filters-container flex items-center w-full">
                  <p className="title-text mr-[8px] text-blue">Filters:</p>
                  <div className="active-filter-list flex items-center space-x-[8px]">
                    {renderFilters()}
                  </div>
                </div>
              )}

              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {staffs?.length > 0 ? (
                  <Table
                    data={staffs?.length ? staffs.slice(0, pageCount) : []}
                    columns={width >= 640 ? columns : columns.slice(0, 2)}
                    onRowClicked={(e) => {
                      setCurrentTxnDetails(e);
                    }}
                    pointerOnHover
                    isLoading={searching}
                    pageCount={staffs?.length / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>Search for orders by order ID</span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        transaction={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
      <DateRangeModal
        active={dateFilter.value === "custom"}
        toggler={() =>
          setDateFilter({
            value: `${moment(dateConstants?.startOfWeek).format(
              "DD MMM"
            )} - ${moment(dateConstants?.endOfWeek).format("DD MMM")}`,
            label: `${moment(dateConstants?.startOfWeek).format(
              "DD MMM"
            )} - ${moment(dateConstants?.endOfWeek).format("DD MMM")}`,
            start_date: dateConstants?.startOfWeek,
            end_date: dateConstants?.endOfWeek,
          })
        }
      />
    </>
  );
}
