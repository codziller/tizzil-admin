import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import _, { isEmpty, lowerCase } from "lodash";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import {
  ORDER_STATUSES,
  ORDER_STATUS_OPTIONS,
  pageCount,
} from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";

import useWindowDimensions from "hooks/useWindowDimensions";
import { transactionAmount } from "utils/transactions";
import OrderDetailsModal from "./OrderDetailsModal";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import OrdersStore from "../store";
import SearchBar from "components/General/Searchbar/SearchBar";
import { observer } from "mobx-react-lite";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import Tabs from "components/General/Tabs";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import { dateFilters } from "pages/Dashboard/Home/features";
import cleanPayload from "utils/cleanPayload";

const { DISPATCHED, CANCELLED, COMPLETED, INPROGRESS, PENDING, REFUNDED } =
  ORDER_STATUSES;
const deliveryHandlers = [
  {
    value: "ALL",
    label: "All Delivery Handlers",
  },
  {
    value: "BEAUTYHUT",
    label: "BeautyHut",
  },
  {
    value: "CHOWDECK",
    label: "Chowdeck",
  },
  {
    value: "TOPSHIP",
    label: "Topship",
  },
];
const Orders = ({ isRecent }) => {
  const {
    getOrders,
    loading,
    ordersCount,
    orders,
    searchOrders,
    searchLoading,
    searchResult,
    searchResultCount,

    in_progressOrders,
    in_progressOrdersCount,
    pendingOrders,
    pendingOrdersCount,
    dispatchedOrders,
    dispatchedOrdersCount,
    completedOrders,
    completedOrdersCount,
    cancelledOrders,
    cancelledOrdersCount,

    getRefundedOrders,
    refundedOrders,
    refundedOrdersCount,
    refundedOrdersLoading,
    updateOrderStatusLoading,
  } = OrdersStore;

  const TABS = [
    {
      name: INPROGRESS,
      label: `Inprogress orders (${in_progressOrdersCount || "0"})`,
    },
    {
      name: DISPATCHED,
      label: `Dispatched orders (${dispatchedOrdersCount || "0"})`,
    },
    {
      name: COMPLETED,
      label: `Completed orders (${completedOrdersCount || "0"})`,
    },
    {
      name: CANCELLED,
      label: `Cancelled orders (${cancelledOrdersCount || "0"})`,
    },
    {
      name: REFUNDED,
      label: `Refunded orders (${refundedOrdersCount || "0"})`,
    },
  ];

  const { width } = useWindowDimensions();
  const { warehouse_id } = useParams();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [currentPageRefund, setCurrentPageRefund] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [deliveryHandler, setDeliveryHandler] = useState(deliveryHandlers[0]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);

  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;
  const isRefundTab = activeTab === REFUNDED;

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const payload = {
      page: currentPageSearch,
      searchQuery,
      warehouseId: warehouse_id,
    };
    await searchOrders({ data: payload });
  };

  const handleGetAllData = () => {
    const endDate = moment(dateFilter.end_date)
      .add(1, "day")
      .format("YYYY-MM-DD");
    const datePayload = {
      startDate: dateFilter.start_date,
      endDate,
    };
    const payload = {
      page: 1,
      warehouseId: warehouse_id,
    };
    getOrders({ data: { ...payload, status: DISPATCHED, ...datePayload } });
    getOrders({ data: { ...payload, status: COMPLETED, ...datePayload } });
    getOrders({ data: { ...payload, status: CANCELLED, ...datePayload } });
    getRefundedOrders({ data: { ...payload, ...datePayload } });
  };
  const handleGetData = () => {
    const endDate = moment(dateFilter.end_date)
      .add(1, "day")
      .format("YYYY-MM-DD");
    const datePayload = {
      startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
      endDate,
      deliveryHandler:
        deliveryHandler?.value === "ALL" ? "" : deliveryHandler?.value,
    };
    cleanPayload(datePayload);
    if (isRefundTab) {
      getRefundedOrders({
        data: {
          warehouseId: warehouse_id,
          page: currentPageRefund,
          ...datePayload,
        },
      });
      return;
    }
    getOrders({
      data: {
        warehouseId: warehouse_id,
        page: currentPage,
        status: activeTab,
        ...datePayload,
      },
    });
  };

  useEffect(() => {
    handleGetAllData();
  }, []);
  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [
    currentPage,
    currentPageSearch,
    activeTab,
    dateFilter,
    deliveryHandler,
    currentPageRefund,
  ]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      handleSearch();
    }
  }, [searchInput]);

  const handleView = (row) => {
    setCurrentTxnDetails({
      ...row,
      isRefundTab,
      modalType: "details",
      isSideModal: true,
    });
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
          {row?.guestFirstName || row?.calculatedOrder?.user?.firstName}{" "}
          {row?.guestLastName || row?.calculatedOrder?.user?.lastName}
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
          isDisabled={isRefundTab}
          handleClick={(e) => {
            setCurrentTxnDetails({ ...row, modalType: "prompt", ...e });
          }}
          isLoading={
            currentTxnDetails?.orderCode === row?.orderCode &&
            updateOrderStatusLoading
          }
        />
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
    let items = [];
    switch (activeTab) {
      case INPROGRESS:
        items = in_progressOrders;
        break;
      case PENDING:
        items = pendingOrders;
        break;
      case DISPATCHED:
        items = dispatchedOrders;
        break;
      case COMPLETED:
        items = completedOrders;
        break;
      case CANCELLED:
        items = cancelledOrders;
        break;
      case REFUNDED:
        items = refundedOrders;
        break;
      default:
        items = orders;
        break;
    }
    return isSearchMode ? searchResult : items;
  }, [
    searchResult,
    activeTab,
    isSearchMode,
    in_progressOrders,
    pendingOrders,
    dispatchedOrders,
    completedOrders,
    cancelledOrders,
    refundedOrders,
  ]);

  const displayedItemsCount = useMemo(() => {
    let itemsCount;
    switch (activeTab) {
      case INPROGRESS:
        itemsCount = in_progressOrdersCount;
        break;
      case PENDING:
        itemsCount = pendingOrdersCount;
        break;
      case DISPATCHED:
        itemsCount = dispatchedOrdersCount;
        break;
      case COMPLETED:
        itemsCount = completedOrdersCount;
        break;
      case CANCELLED:
        itemsCount = cancelledOrdersCount;
        break;
      case REFUNDED:
        itemsCount = refundedOrdersCount;
        break;
      default:
        itemsCount = ordersCount;
        break;
    }
    return isSearchMode ? searchResultCount : itemsCount;
  }, [
    searchResult,
    activeTab,
    isSearchMode,
    displayedItems,
    in_progressOrdersCount,
    pendingOrdersCount,
    dispatchedOrdersCount,
    completedOrdersCount,
    cancelledOrdersCount,
    ordersCount,
    refundedOrdersCount,
  ]);

  const isLoading = useMemo(() => {
    return isSearchMode ? searchLoading : loading;
  }, [searchLoading, loading]);

  useEffect(() => scrollToTop(), [displayedItems]);

  return (
    <>
      <div className="h-full w-full min-h-[400px]">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          {!isRecent && (
            <div className="flex justify-between items-center w-full mb-3 gap-1">
              <div className="sm:min-w-[200px]">
                <DashboardFilterDropdown
                  placeholder="Filter by: "
                  options={dateFilters}
                  name="payout_filter"
                  onClick={(e) => {
                    if (e.value === "custom") {
                      setShowDateModal(true);
                      return;
                    }
                    setDateFilter(e);
                  }}
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

              <div className="min-w-[200px] max-w-[200px] flex justify-end">
                <DashboardFilterDropdown
                  align="items-end"
                  placeholder="Delivery by: "
                  options={deliveryHandlers}
                  name="delivery_by"
                  onClick={(e) => {
                    setDeliveryHandler(e);
                  }}
                  value={deliveryHandler?.label}
                />
              </div>
            </div>
          )}
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
                        : isRefundTab
                        ? setCurrentPageRefund(page)
                        : setCurrentPage(page)
                    }
                    currentPage={
                      isSearchMode
                        ? currentPageSearch
                        : isRefundTab
                        ? currentPageRefund
                        : currentPage
                    }
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
                              )} orders`}
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

      <OrderDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
        handleRefund={setCurrentTxnDetails}
      />
      <DateRangeModal
        active={showDateModal}
        defaultDate={{
          startDate: new Date(dateFilter.start_date),
          endDate: new Date(dateFilter.end_date),
          key: "selection",
        }}
        onApply={(date) =>
          setDateFilter({
            value: `${moment(date?.startDate).format("DD MMM")} - ${moment(
              date?.endDate
            ).format("DD MMM")}`,
            label: `${moment(date?.startDate).format("DD MMM")} - ${moment(
              date?.endDate
            ).format("DD MMM")}`,
            start_date: date?.startDate,
            end_date: date?.endDate,
          })
        }
        toggler={() => setShowDateModal(false)}
      />
    </>
  );
};

export default observer(Orders);
