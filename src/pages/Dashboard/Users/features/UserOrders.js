import React, { useEffect, useMemo, useState } from "react";

import moment from "moment";
import _, { isEmpty } from "lodash";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { ORDER_STATUS_OPTIONS, pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";

import useWindowDimensions from "hooks/useWindowDimensions";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "pages/Dashboard/Orders/features/OrderDetailsModal";
import dateConstants from "utils/dateConstants";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import OrdersStore from "pages/Dashboard/Orders/store";
import SearchBar from "components/General/Searchbar/SearchBar";
import { observer } from "mobx-react-lite";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import { useParams } from "react-router-dom";
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

const UserOrders = ({ isRecent }) => {
  const { user_id } = useParams();
  const {
    searchOrders,
    searchLoading,
    searchResult,
    searchResultCount,

    getOrdersByUser,
    userOrders,
    userOrdersCount,
    userOrdersLoading,
    updateOrderStatusLoading,
  } = OrdersStore;

  const { width } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [searchInput, setSearchInput] = useState("");

  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const payload = { page: currentPage, searchQuery };
    await searchOrders({ data: payload });
  };

  const handleGetData = () => {
    getOrdersByUser({ data: { page: currentPage, id: user_id } });
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [currentPage, currentPageSearch, user_id]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      handleSearch();
    }
  }, [searchInput]);

  const handleView = (row) => {
    setCurrentTxnDetails({ ...row, modalType: "details", isSideModal: true });
  };
  const columns = [
    {
      name: "Order Code",
      selector: "orderCode",
      sortable: false,
    },
    {
      name: "Customer",
      selector: (row) => (
        <span onClick={() => handleView(row)}>
          {row?.calculatedOrder?.user?.firstName}{" "}
          {row?.calculatedOrder?.user?.lastName}
        </span>
      ),
      sortable: false,
    },
    {
      name: "Order Status",

      selector: (row) => (
        <TableDropdown
          className={classNames({
            "text-yellow":
              row?.orderStatus === "IN_PROGRESS" ||
              row?.orderStatus === "PENDING" ||
              row?.orderStatus === "DISPATCHED",
            "text-green": row?.orderStatus === "COMPLETED",
            "text-red-deep": row?.orderStatus === "CANCELLED",
          })}
          options={ORDER_STATUS_OPTIONS}
          content={row.orderStatus}
          handleClick={(e) =>
            setCurrentTxnDetails({ ...row, modalType: "prompt", ...e })
          }
          isLoading={
            currentTxnDetails?.orderCode === row?.orderCode &&
            updateOrderStatusLoading
          }
        />
      ),
      sortable: false,
    },

    {
      name: "Payment status",
      selector: (row) => (
        <span
          className={classNames({
            "text-green": row?.paid,
            "text-red": !row?.paid,
          })}
          onClick={() => handleView(row)}
        >
          {row?.paid ? "paid" : "unpaid"}
        </span>
      ),
      sortable: false,
    },
    {
      name: "Order Date",
      selector: (row) => moment(row.updatedAt).format("MMM Do, YYYY hh:mma"),
      sortable: true,
    },

    {
      name: "Total",
      selector: (row) => (
        <span onClick={() => handleView(row)} className="uppercase">
          {transactionAmount(row)}
        </span>
      ),
      sortable: true,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const displayedItems = useMemo(() => {
    return isSearchMode ? searchResult : userOrders;
  }, [searchResult, isSearchMode, userOrders]);

  const displayedItemsCount = useMemo(() => {
    return isSearchMode ? searchResultCount : userOrdersCount;
  }, [searchResult, isSearchMode, displayedItems]);

  const isLoading = useMemo(() => {
    return isSearchMode ? searchLoading : userOrdersLoading;
  }, [searchLoading, userOrdersLoading]);

  useEffect(() => scrollToTop(), [displayedItems]);

  return (
    <>
      <div className="h-full w-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          {isRecent && (
            <p className="font-700 text-start w-full pl-3 mt-5">
              Recent Orders
            </p>
          )}
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div
              className={classNames("w-full sm:w-[45%] sm:min-w-[300px]", {
                "ml-3 mt-3": isRecent,
              })}
            >
              <SearchBar
                placeholder={"Search orders"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>
          </div>

          {isLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {isSearchMode &&
                `Search results - ${numberWithCommas(searchResultCount)}`}

              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(displayedItems) ? (
                  <Table
                    data={displayedItems}
                    columns={width >= 640 ? columns : columns.slice(0, 2)}
                    onRowClicked={(e) => {
                      handleView(e);
                    }}
                    pointerOnHover
                    pageCount={displayedItemsCount / pageCount}
                    onPageChange={(page) =>
                      isSearchMode
                        ? setCurrentPageSearch(page)
                        : setCurrentPage(page)
                    }
                    currentPage={isSearchMode ? currentPageSearch : currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      {
                        <span>
                          {isSearchMode && isEmpty(searchResult)
                            ? `There are no results for your search '${searchQuery}'`
                            : `There are currently no orders`}
                        </span>
                      }
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
        details={currentTxnDetails}
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
};

export default observer(UserOrders);
