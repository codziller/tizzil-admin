import React, { useEffect, useState } from "react";

import moment from "moment";
import _, { isEmpty, lowerCase } from "lodash";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { transactionAmount } from "utils/transactions";

import useWindowDimensions from "hooks/useWindowDimensions";

import TransactionDetailsModal from "./OrderDetailsModal";
import dateConstants from "utils/dateConstants";
import OrdersStore from "../store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import SearchBar from "components/General/Searchbar/SearchBar";
import classNames from "classnames";
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
const BrandOrders = ({ isModal, isRecent }) => {
  const { brandOrders, getBrandOrders, brandOrdersLoading, brandOrdersCount } =
    OrdersStore;
  const { warehouse_id } = useParams();

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [searchInput, setSearchInput] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);

  useEffect(() => {
    getBrandOrders({
      data: {
        page: currentPage,
        id: warehouse_id,
        endDate: moment(dateFilter.end_date).format("YYYY-MM-DD"),
        startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
      },
    });
  }, [currentPage, warehouse_id, dateFilter]);

  const searchQuery = searchInput?.trim();

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
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
        <span
          className={classNames({
            "text-yellow":
              row?.orderStatus === "IN_PROGRESS" ||
              row?.orderStatus === "PENDING" ||
              row?.orderStatus === "DISPATCHED",
            "text-green": row?.orderStatus === "COMPLETED",
            "text-red-deep": row?.orderStatus === "CANCELLED",
          })}
          onClick={() => handleView(row)}
        >
          {row?.orderStatus}
        </span>
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

  return (
    <>
      <div className="h-full w-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5 mb-14">
          <div className="flex justify-between items-center w-full mb-3 gap-1 p-6">
            <div className="flex justify-start items-center w-fit">
              <div className="w-full sm:w-[200px]">
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
              <div className="flex justify-start items-center w-fit truncate text-base">
                {dateFilter.value === "today"
                  ? moment(dateFilter.start_date).format("MMM Do, YYYY")
                  : `${moment(dateFilter.start_date).format(
                      "MMM Do, YYYY"
                    )} - ${moment(dateFilter.end_date).format("MMM Do, YYYY")}`}
              </div>
            </div>

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

          {brandOrdersLoading && isEmpty(brandOrders) ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {brandOrders?.length > 0 ? (
                  <Table
                    data={brandOrders}
                    columns={
                      isModal
                        ? columns.slice(0, 2)
                        : width >= 640
                        ? columns
                        : columns.slice(0, 2)
                    }
                    onRowClicked={(e) => handleView(e)}
                    pointerOnHover
                    isLoading={brandOrdersLoading}
                    pageCount={brandOrdersCount / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span className="">
                        There are no orders for {lowerCase(dateFilter?.label)}{" "}
                      </span>
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
BrandOrders.propTypes = {
  isModal: PropTypes.bool,
  isRecent: PropTypes.bool,
};
export default observer(BrandOrders);
