import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty } from "lodash";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";

import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as ProfileUser } from "assets/icons/profile-2user.svg";
import { ReactComponent as IconBox } from "assets/icons/icon-box.svg";
import { ReactComponent as CardCoin } from "assets/icons/card-coin.svg";
import { ReactComponent as Star } from "assets/icons/star.svg";
import { ReactComponent as MessageIcon } from "assets/icons/message-question.svg";
import { ReactComponent as DangerIcon } from "assets/icons/danger.svg";
import { ReactComponent as LastUpdatedIcon } from "assets/icons/maximize-circle.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import { numberWithCommas } from "utils/formatter";
import Amount from "components/General/Numbers/Amount";
import Tabs from "components/General/Tabs";
import ProductsStore from "pages/Dashboard/Products/store";
import { convertToJs } from "utils/functions";
import AppRating from "components/General/Rating";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import OrderDetailsModal from "pages/Dashboard/Orders/features/OrderDetailsModal";

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
const ReviewsPage = ({ isModal, handleUserSelect }) => {
  const { getReviews, reviews, reviewsLoading, reviewsCount } = ProductsStore;

  const searchResult = [];
  const searchResultCount = 0;
  const searchUserLoading = false;
  const TABS = [{ name: "reviews", label: `Reviews (${reviewsCount || "-"})` }];
  const { width, isMobile } = useWindowDimensions();
  const { warehouse_id } = useParams();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [searchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;
  const isArchive = activeTab === TABS?.[1]?.name;

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
  };

  const handleGetData = () => {
    getReviews({ data: { page: currentPage } });
  };

  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [currentPage, currentPageSearch, currentPageArchived, isArchive]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      handleSearch();
    }
  }, [searchInput]);

  const handleEdit = (row) => {
    if (isModal) {
      handleUserSelect(row);
      return;
    }
  };

  const handleView = (row) => {
    setCurrentTxnDetails({ ...row, modalType: "details", isSideModal: true });
  };
  const columns = [
    {
      name: (
        <div className="flex justify-center items-center gap-1">
          <ProfileUser />
          <span className="font-700 text-sm">Customer&apos;s Name</span>
        </div>
      ),
      minWidth: isMobile ? "35%" : "15%",
      selector: (row) => (
        <Link
          onClick={() => handleEdit(row)}
          className="py-4 mt-[5px] mb-[5px] flex-col justify-start items-start gap-1 flex underline"
          to={`/dashboard/users/edit/${warehouse_id}/${row?.user?.id}`}
        >
          <div className="text-black text-sm font-medium font-700 capitalize whitespace-break-spaces">
            {row?.user?.firstName} {row?.user?.lastName}
          </div>
          <div className="text-grey text-sm font-normal">
            {row?.user?.phoneNumber}
          </div>
        </Link>
      ),
      sortable: false,
    },

    {
      minWidth: isMobile ? "35%" : "20%",
      name: (
        <div className="flex justify-center items-center gap-1">
          <IconBox />
          <span className="font-700 text-sm">Product</span>
        </div>
      ),
      selector: (row) => (
        <Link
          className="whitespace-break-spaces text-sm underline"
          to={`/dashboard/products/edit/${warehouse_id}/${row?.productId}`}
        >
          {row.productName}
        </Link>
      ),
      sortable: false,
    },
    {
      maxWidth: "140px",
      name: (
        <div className="flex justify-center items-center gap-1">
          <CardCoin />
          <span className="font-700 text-sm">Order Code</span>
        </div>
      ),
      selector: (row) => (
        <span
          className="font-700 text-base underline cursor-pointer"
          onClick={() => handleView(row)}
        >
          {row.orderCode}
        </span>
      ),
      sortable: false,
    },

    {
      maxWidth: "120px",
      name: (
        <div className="flex justify-center items-center gap-1">
          <Star />
          <span className="font-700 text-sm">Rating</span>
        </div>
      ),
      selector: (row) => (
        <span className="">
          <AppRating initialRating={row?.rating} readonly />
        </span>
      ),
      sortable: false,
    },

    {
      minWidth: isMobile ? "35%" : "20%",
      name: (
        <div className="flex justify-center items-center gap-1">
          <MessageIcon />
          <span className="font-700 text-sm">Review</span>
        </div>
      ),
      selector: (row) => (
        <span className="whitespace-break-spaces text-sm">{row.review}</span>
      ),
      sortable: false,
    },

    {
      maxWidth: "150px",
      name: (
        <div className="flex justify-center items-center gap-1">
          <LastUpdatedIcon />
          <span className="font-700 text-sm">Date</span>
        </div>
      ),
      selector: (row) => (
        <span className="whitespace-break-spaces text-sm">
          {moment(row.createdAt).format("MMM Do, YYYY hh:mma")}
        </span>
      ),
      sortable: false,
    },
    {
      name: (
        <div className="flex justify-center items-center gap-1">
          <DangerIcon />
          <span className="font-700 text-sm">Action</span>
        </div>
      ),
      maxWidth: "100px",
      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          <span
            onClick={() =>
              setCurrentTxnDetails({ ...row, modalType: "delete" })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-red-deep text-[11px] text-white "
          >
            {row?.isDeleted ? "Unarchive" : "Delete"}
          </span>
        </div>
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

  const displayedReviews = useMemo(() => {
    return isSearchMode ? searchResult : isArchive ? [] : reviews;
  }, [searchResult, reviews, isSearchMode, isArchive]);

  const displayedReviewsCount = useMemo(() => {
    return isSearchMode ? searchResultCount : isArchive ? [] : reviewsCount;
  }, [searchResult, reviews, isSearchMode]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchUserLoading
      : isArchive
      ? false
      : isEmpty(reviews) && reviewsLoading;
  }, [searchUserLoading, reviewsLoading]);

  useEffect(() => scrollToTop(), [displayedReviews]);

  return (
    <>
      <div className={classNames("h-full w-full", { "md:pr-4": !isModal })}>
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          {isLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {isSearchMode &&
                `Search results - ${numberWithCommas(searchResultCount)}`}
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full new-table">
                {!isEmpty(displayedReviews) ? (
                  <Table
                    data={displayedReviews}
                    columns={
                      isModal
                        ? columns.slice(0, 2)
                        : width >= 640
                        ? columns
                        : columns.slice(0, 2)
                    }
                    onRowClicked={(e) => {
                      handleEdit(e);
                    }}
                    pointerOnHover
                    pageCount={displayedReviewsCount / pageCount}
                    onPageChange={(page) =>
                      isSearchMode
                        ? setCurrentPageSearch(page)
                        : isArchive
                        ? setCurrentPageArchived(page)
                        : setCurrentPage(page)
                    }
                    currentPage={
                      isSearchMode
                        ? currentPageSearch
                        : isArchive
                        ? currentPageArchived
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
                            : isArchive
                            ? "There are currently no archived reviews"
                            : "There are currently no reviews"}
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
        active={currentTxnDetails?.modalType === "delete"}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
      <OrderDetailsModal
        active={currentTxnDetails?.modalType === "details"}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
    </>
  );
};

ReviewsPage.propTypes = {
  handleUserSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default observer(ReviewsPage);
