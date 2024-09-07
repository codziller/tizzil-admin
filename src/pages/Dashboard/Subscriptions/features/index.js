import React, { useEffect, useMemo, useState } from "react";

import moment from "moment";
import _, { isEmpty, lowerCase } from "lodash";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount, SUBSCRIPTION_TYPES } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";

import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./OrderDetailsModal";
import dateConstants from "utils/dateConstants";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import SubscriptionStore from "../store";
import SearchBar from "components/General/Searchbar/SearchBar";
import { observer } from "mobx-react-lite";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import Tabs from "components/General/Tabs";
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

const { ACTIVE, DUE } = SUBSCRIPTION_TYPES;
const SubscriptionsPage = ({ isRecent }) => {
  const {
    searchOrders,
    searchLoading,
    searchResult,
    searchResultCount,

    getAllActiveProductSubscriptions,
    getAllDueProductSubscriptions,

    allActiveProductSubscriptions,
    allActiveProductSubscriptionsCount,
    allActiveProductSubscriptionsLoading,
    allDueProductSubscriptions,
    allDueProductSubscriptionsCount,
    allDueProductSubscriptionsLoading,
  } = SubscriptionStore;

  const TABS = [
    {
      name: ACTIVE,
      label: `Active subscriptions (${
        allActiveProductSubscriptionsCount || "0"
      })`,
    },
    {
      name: DUE,
      label: `Due subscriptions (${allDueProductSubscriptionsCount || "0"})`,
    },
  ];

  const { width } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);

  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const payload = { page: currentPage, searchQuery };
    await searchOrders({ data: payload });
  };

  const handleGetAllData = () => {
    // const endDate = moment(dateFilter.end_date)
    //   .add(1, "day")
    //   .format("YYYY-MM-DD");
    // const datePayload = { startDate: dateFilter.start_date, endDate };
    getAllActiveProductSubscriptions({ data: { page: 1 } });
    getAllDueProductSubscriptions({ data: { page: 1 } });
  };
  const handleGetData = () => {
    // const endDate = moment(dateFilter.end_date)
    //   .add(1, "day")
    //   .format("YYYY-MM-DD");
    // const datePayload = { startDate: dateFilter.start_date, endDate };
    if (activeTab === ACTIVE) {
      getAllActiveProductSubscriptions({ data: { page: currentPage } });
    } else if (activeTab === DUE) {
      getAllDueProductSubscriptions({ data: { page: currentPage } });
    }
  };

  useEffect(() => {
    handleGetAllData();
  }, []);
  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [currentPage, currentPageSearch, activeTab, dateFilter]);

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
      name: "Customer",
      selector: (row) => (
        <span onClick={() => handleView(row)}>
          {row?.guestFirstName || row?.user?.firstName}{" "}
          {row?.guestLastName || row?.user?.lastName}
        </span>
      ),
      sortable: false,
    },

    {
      name: "Order Source",
      selector: (row) => (
        <span
          className={classNames({
            "text-grey-text3": !row?.orderSource,
            "text-blue-bright":
              row?.orderSource === "WEB" || row?.orderSource === "APP",
            "text-blue-textHover": row?.orderSource === "STORE",
            "text-green": row?.orderSource === "WHATSAPP",
            "text-red-deep": row?.orderSource === "INSTAGRAM",
          })}
          onClick={() => handleView(row)}
        >
          {row?.orderSource}
        </span>
      ),
      sortable: false,
    },

    {
      name: "Delivery Method",
      selector: (row) => (
        <span onClick={() => handleView(row)}>{row?.deliveryMethod}</span>
      ),
      sortable: false,
    },
    {
      name: "Subscription Date",
      selector: (row) => moment(row.createdAt).format("MMM Do, YYYY hh:mma"),
      sortable: true,
    },

    {
      name: "Next Debit Date",
      selector: (row) =>
        moment(row.nextDebitDate).format("MMM Do, YYYY hh:mma"),
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
    let items = [];
    switch (activeTab) {
      case ACTIVE:
        items = allActiveProductSubscriptions;
        break;
      case DUE:
        items = allDueProductSubscriptions;
        break;

      default:
        items = [];
        break;
    }
    return isSearchMode ? searchResult : items;
  }, [
    searchResult,
    activeTab,
    isSearchMode,
    allActiveProductSubscriptions,
    allDueProductSubscriptions,
  ]);

  const displayedItemsCount = useMemo(() => {
    let itemsCount;
    switch (activeTab) {
      case ACTIVE:
        itemsCount = allActiveProductSubscriptionsCount;
        break;
      case DUE:
        itemsCount = allDueProductSubscriptionsCount;
        break;
      default:
        itemsCount = [];
        break;
    }
    return isSearchMode ? searchResultCount : itemsCount;
  }, [
    searchResult,
    activeTab,
    isSearchMode,
    displayedItems,
    allActiveProductSubscriptionsCount,
    allDueProductSubscriptionsCount,
  ]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchLoading
      : allActiveProductSubscriptionsLoading ||
          allDueProductSubscriptionsLoading;
  }, [
    searchLoading,
    allActiveProductSubscriptionsLoading,
    allDueProductSubscriptionsLoading,
  ]);

  useEffect(() => scrollToTop(), [displayedItems]);

  return (
    <>
      <div className="h-full w-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          {isRecent && (
            <div className="flex justify-between items-center w-full mb-3 gap-1">
              <div className="sm:min-w-[200px]">
                <DashboardFilterDropdown
                  placeholder="Filter by: "
                  options={dateFilters}
                  name="payout_filter"
                  onClick={(e) => setDateFilter(e)}
                  value={dateFilter?.label}
                />
              </div>

              <div className="flex justify-start items-center w-full truncate text-base">
                {dateFilter.value === "today"
                  ? moment(dateFilter.start_date).format("MMM Do, YYYY")
                  : `${moment(dateFilter.start_date).format(
                      "MMM Do, YYYY"
                    )} - ${moment(dateFilter.end_date).format("MMM Do, YYYY")}`}
              </div>
            </div>
          )}

          {isRecent ? (
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
          ) : null}
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
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
                            : `There are currently no ${lowerCase(
                                activeTab?.replaceAll("_", " ")
                              )} subscriptions`}
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

export default observer(SubscriptionsPage);
