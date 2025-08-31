import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import qs from "query-string";
import { useNavigate, useParams } from "react-router";

import useTableFilter from "hooks/useTableFilter";
import ActiveFilter from "components/General/ActiveFilter";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";

import { pageCount } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";

import useWindowDimensions from "hooks/useWindowDimensions";

import { paramsObjectToQueryString } from "utils/request";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import AffiliateMarketersStore from "../store";
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
];
const AffiliateMarketersPage = () => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const defaultFilters = {
    start_date: "",
    end_date: "",
    tx_verb: "",
    fiat_wallet_id: "",
    coin_wallet_id: "",
    account_status: "",
  };
  const {
    getAffiliateMarketers,
    affiliateMarketers,
    affiliateMarketersCount,
    loading,
  } = AffiliateMarketersStore;

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getAffiliateMarketers({ data: { page: currentPage } });
  }, [currentPage]);

  const params = qs.parse(location.hash?.substring(1));

  const searchQuery = searchInput?.trim();

  const { filterData, onRemoveFilter } = useTableFilter({
    defaultFilters,
    currentPage,
    setCurrentPage,
    params,
  });


  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  const handleEdit = (e) => {
    navigate(`/dashboard/affiliate-marketers/edit/${warehouse_id}/${e?.id}`);
  };
  const columns = [
    {
      name: "User",
      minWidth: isMobile ? "50%" : "30%",
      selector: (row) => (
        <div
          onClick={() => handleEdit(row)}
          className="py-4 mt-[5px] mb-[5px] flex-col justify-start items-start gap-1 flex"
        >
          <div className="text-black text-sm font-medium font-700">
            {row?.user?.firstName} {row?.user?.lastName}
          </div>
          <div className="text-grey text-sm font-normal">
            {row?.user?.email}
          </div>
        </div>
      ),
      sortable: false,
    },

    {
      name: "Phone Number",
      selector: (row) => (
        <span onClick={() => handleEdit(row)}>{row?.user?.phoneNumber}</span>
      ),
      sortable: false,
    },
    {
      name: "Expiry Date",
      selector: (row) => (
        <span onClick={() => handleEdit(row)}>
          {row?.discountExpiryTime
            ? moment(row?.discountExpiryTime).fromNow()
            : "No Exipry"}
        </span>
      ),
      sortable: false,
    },

    {
      name: "Discount Code",
      selector: "discountCode",
      sortable: true,
    },

    {
      name: "Actions",
      minWidth: isMobile ? "50%" : "25%",
      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          <span
            onClick={() =>
              setCurrentTxnDetails({ ...row, modalType: "delete" })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-white text-[11px] text-black border-[1px] border-grey-bordercolor "
          >
            Settle
          </span>

          <span
            onClick={() => handleEdit(row)}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
          </span>
        </div>
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

  useEffect(() => scrollToTop(), [affiliateMarketers]);

  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search affiliate marketers"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>
            <Link to={`/dashboard/affiliate-marketers/add/${warehouse_id}`}>
              <Button
                text="Add Affiliate Marketer"
                icon={<Plus className="stroke-current" />}
                className="hidden md:block"
              />
            </Link>
          </div>

          {loading ? (
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
                {affiliateMarketers?.length > 0 ? (
                  <Table
                    data={
                      affiliateMarketers?.length
                        ? affiliateMarketers.slice(0, pageCount)
                        : []
                    }
                    columns={width >= 640 ? columns : columns.slice(0, 3)}
                    onRowClicked={(e) => handleEdit(e)}
                    pointerOnHover
                    isLoading={loading}
                    pageCount={affiliateMarketersCount / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>You have no affiliate marketers currently</span>
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

export default observer(AffiliateMarketersPage);
