import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import { Link, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount, promos } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import { Button } from "components/General/Button";
import GiftCardsStore from "../store";
import { observer } from "mobx-react-lite";
import { ReactComponent as IncomeIcon } from "assets/icons/income-icon.svg";
import dateConstants from "utils/dateConstants";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import EarningCard from "pages/Dashboard/Home/features/EarningCard";

export const dateFilters = [
  {
    value: "today",
    label: "Today",
    start_date: dateConstants?.today,
    end_date: dateConstants?.today,
  },
  {
    value: "yesterday",
    label: "Yesterday",
    start_date: dateConstants?.yesterday,
    end_date: dateConstants?.yesterday,
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

const GiftCardsPage = () => {
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const { warehouse_id } = useParams();

  const searching = "";

  const {
    getGiftCards,
    giftCards,
    loading,
    giftCardStats,
    giftCardStatsLoading,
    getGiftCardStats,
  } = GiftCardsStore;

  useEffect(() => {
    getGiftCards({ data: { page: currentPage } });
  }, [currentPage]);

  useEffect(() => {
    console.log({ giftCards });
  }, [giftCards]);

  const columns = [
    {
      name: "Card Design",
      selector: (row) => (
        <div className="capitalize py-2">
          <img
            src={row?.cardDesign}
            alt=""
            className="w-[195px] h-[112.5px] max-[768px]:w-[148.5px] max-[768px]:h-[80.5px] object-cover rounded"
          />
        </div>
      ),
      sortable: false,
    },
    {
      name: "Category",
      selector: (row) => (
        <span className="capitalize">
          {row?.cardCategory?.replace("_", " ")?.toLowerCase()}
        </span>
      ),
      sortable: false,
    },
    {
      name: "ID",
      selector: "id",
      sortable: false,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.createdAt).fromNow(),
      sortable: false,
    },

    {
      name: "Actions",

      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          <span
            onClick={() =>
              setCurrentTxnDetails({ ...row, modalType: "delete" })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-red-deep text-[11px] text-white "
          >
            Delete
          </span>
        </div>
      ),
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [promos]);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);

  useEffect(() => {
    const endDate = moment(dateFilter.end_date)
      .add(1, "day")
      .format("YYYY-MM-DD");

    getGiftCardStats({
      data: {
        endDate,
        startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
      },
    });
  }, [dateFilter]);

  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5">
          <div className="flex items-center w-fit mb-3 gap-1">
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

            <div className="flex justify-start items-center w-full truncate text-base">
              {dateFilter.value === "today"
                ? moment(dateFilter.start_date).format("MMM Do, YYYY")
                : `${moment(dateFilter.start_date).format(
                    "MMM Do, YYYY"
                  )} - ${moment(dateFilter.end_date).format("MMM Do, YYYY")}`}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 smlg:grid-cols-4 gap-4 justify-between items-start w-full mb-2">
            <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Total Amount"
              value={giftCardStats?.totalAmount}
              isLoading={giftCardStatsLoading}
              isAmount
            />
            <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Total Created"
              value={giftCardStats?.totalCreated}
              isLoading={giftCardStatsLoading}
            />
            <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Total Top-up Amount"
              value={giftCardStats?.totalTopUpAmount}
              isLoading={giftCardStatsLoading}
              isAmount
            />
            <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Total Top-ups"
              value={giftCardStats?.totalTopUps}
              isLoading={giftCardStatsLoading}
            />
            {/* <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Average Initial Amount"
              value={giftCardStats?.avgInitialAmount}
              isLoading={giftCardStatsLoading}
              isAmount
            /> */}
            <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Average Top-up Amount"
              value={giftCardStats?.avgTopUpAmount}
              isLoading={giftCardStatsLoading}
              isAmount
            />
          </div>
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            {/* <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search gift cards"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div> */}
            <div></div>
            <Link to={`/dashboard/gift-cards/add-gift-cards/${warehouse_id}`}>
              <Button
                text="Add New Gift Card Design"
                icon={<Plus className="stroke-current" />}
                className="hidden md:block"
              />
            </Link>
          </div>

          {loading ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {giftCards?.length > 0 ? (
                  <Table
                    data={
                      giftCards?.length ? giftCards.slice(0, pageCount) : []
                    }
                    columns={width >= 640 ? columns : columns.slice(0, 2)}
                    onRowClicked={(e) => {
                      setCurrentTxnDetails({ ...e, modalType: "delete" });
                    }}
                    pointerOnHover
                    isLoading={loading}
                    pageCount={giftCards?.length / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>No gift cards</span>
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
    </>
  );
};

export default observer(GiftCardsPage);
