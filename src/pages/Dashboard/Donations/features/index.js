import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import qs from "query-string";
import { useNavigate } from "react-router";

import useTableFilter from "hooks/useTableFilter";
import ActiveFilter from "components/General/ActiveFilter";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { ReactComponent as Filter } from "assets/icons/Filter/filter.svg";
import { pageCount } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as IncomeIcon } from "assets/icons/income-icon.svg";

import useWindowDimensions from "hooks/useWindowDimensions";

import { paramsObjectToQueryString } from "utils/request";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import DonationsStore from "../store";
import { observer } from "mobx-react-lite";
import { dateFilters } from "pages/Dashboard/Home/features";
import Amount from "components/General/Numbers/Amount";
import EarningCard from "pages/Dashboard/Home/features/EarningCard";
import { numberWithCommas } from "utils/formatter";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import cleanPayload from "utils/cleanPayload";

const DonationsPage = () => {
  const {
    getDonationTransactions,
    getDonationWallet,
    donationWallet,
    loading,
    donationTransactionsCount,
    donationTransactionsLoading,
    donationTransactions,
  } = DonationsStore;

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [showDateModal, setShowDateModal] = useState(false);
  useEffect(() => {
    getDonationWallet();
  }, []);

  const handleGetData = () => {
    const endDate = moment(dateFilter.end_date)
      .add(1, "day")
      .format("YYYY-MM-DD");
    const datePayload = {
      startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
      endDate,
    };
    cleanPayload(datePayload);

    getDonationTransactions({
      data: { page: currentPage, ...datePayload },
    });
  };

  useEffect(() => {
    handleGetData();
  }, [currentPage, dateFilter]);

  const columns = [
    {
      name: "User",
      minWidth: isMobile ? "50%" : "30%",
      selector: (row) => (
        <div className="py-4 mt-[5px] mb-[5px] flex-col justify-start items-start gap-1 flex">
          <div className="text-black text-sm font-medium font-700">
            {row?.userName}
          </div>
          <div className="text-grey text-sm font-normal">{row?.userEmail}</div>
        </div>
      ),
      sortable: false,
    },

    {
      name: "Amount",
      selector: (row) => <Amount value={row?.amount} />,
      sortable: true,
    },

    {
      name: "Phone Number",
      selector: (row) => (
        <span onClick={() => handleEdit(row)}>{row?.userPhoneNumber}</span>
      ),
      sortable: false,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.createdAt).format("MMM Do, YYYY"),
      sortable: true,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [donationTransactions]);

  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 smlg:grid-cols-4 gap-4 justify-between items-start w-full mb-5">
            <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Donation Balance"
              value={numberWithCommas(donationWallet?.balance) || "-"}
              isLoading={loading}
              isAmount
              isDecimal
            />
          </div>

          {donationTransactionsLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
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
                        )} - ${moment(dateFilter.end_date).format(
                          "MMM Do, YYYY"
                        )}`}
                  </div>
                </div>
                {donationTransactions?.length > 0 ? (
                  <Table
                    data={donationTransactions}
                    columns={width >= 640 ? columns : columns.slice(0, 2)}
                    onRowClicked={(e) => {
                      setCurrentTxnDetails({ ...e, modalType: "edit" });
                    }}
                    pointerOnHover
                    pageCount={donationTransactionsCount / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>There are no donations currently </span>
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

export default observer(DonationsPage);
