import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty } from "lodash";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import moment from "moment";

import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as TrashIcon } from "assets/icons/trash-box.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import { numberWithCommas } from "utils/formatter";
import Tabs from "components/General/Tabs";
import ProductsStore from "pages/Dashboard/Products/store";
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
// Demo reviews data
const sampleReviews = [
  {
    id: 1,
    orderCode: "ORD-2024-001",
    user: {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+1234567890",
    },
    productName: "Nike Air Max",
    rating: 5,
    review: "Excellent product! Great quality and fast delivery.",
    createdAt: new Date("2024-03-01"),
  },
  {
    id: 2,
    orderCode: "ORD-2024-002",
    user: {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "+0987654321",
    },
    productName: "Adidas Ultraboost",
    rating: 4,
    review: "Good shoes, comfortable and stylish. Recommended!",
    createdAt: new Date("2024-02-28"),
  },
  {
    id: 3,
    orderCode: "ORD-2024-003",
    user: {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      phoneNumber: "+1122334455",
    },
    productName: "Puma RS-X",
    rating: 3,
    review: "Average quality, but the design is nice.",
    createdAt: new Date("2024-02-25"),
  },
  {
    id: 4,
    orderCode: "ORD-2024-004",
    user: {
      id: 4,
      firstName: "Sarah",
      lastName: "Williams",
      phoneNumber: "+5566778899",
    },
    productName: "Converse Chuck Taylor",
    rating: 5,
    review: "Love these classic sneakers! Perfect fit and great price.",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: 5,
    orderCode: "ORD-2024-005",
    user: {
      id: 5,
      firstName: "David",
      lastName: "Brown",
      phoneNumber: "+9988776655",
    },
    productName: "Vans Old Skool",
    rating: 2,
    review: "Not what I expected. Quality could be better.",
    createdAt: new Date("2024-02-15"),
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
    }
  };

  const handleView = (row) => {
    setCurrentTxnDetails({ ...row, modalType: "details", isSideModal: true });
  };
  const columns = [
    {
      name: "Order Code",
      minWidth: "10%",
      selector: (review) => (
        <span className="text-[14px] text-[#666666]">{review.orderCode}</span>
      ),
      sortable: true,
    },
    {
      name: "Customers",
      minWidth: "15%",
      selector: (review) => {
        const userId = review.user.id.toString().padStart(6, "0").slice(-6);
        return (
          <div className="flex flex-col">
            <span className="text-[15px] text-[#111827] font-medium">
              {review.user.firstName} {review.user.lastName}
            </span>
            <span className="text-[14px] text-[#6D7280] mt-1">#{userId}</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Product",
      minWidth: "18%",
      selector: (review) => (
        <span className="text-[14px] text-[#666666]">{review.productName}</span>
      ),
      sortable: true,
    },
    {
      name: "Ratings",
      minWidth: "10%",
      selector: (review) => renderStars(review.rating),
      sortable: true,
    },
    // {
    //   name: "Review",
    //   minWidth: "20%",
    //   selector: (review) => (
    //     <span className="text-[14px] text-[#666666] line-clamp-2 text-ellipsis">
    //       {review.review}
    //     </span>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Date",
      minWidth: "10%",
      selector: (review) => (
        <span className="text-[14px] text-[#666666]">
          {moment(review.createdAt).format("DD/MM/YYYY")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      minWidth: "5%",
      selector: (review) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteReview(review);
          }}
          className="flex items-center cursor-pointer text-[14px] text-[#666666] hover:text-red-600 transition-colors"
        >
          <TrashIcon className="w-4 h-4 mr-[7px]" />
          Delete
        </div>
      ),
      sortable: false,
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            className="cursor-pointer"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={star <= rating ? "#690007" : "none"}
              stroke="#690007"
              strokeWidth={star <= rating ? "0" : "1"}
            />
          </svg>
        ))}
      </div>
    );
  };

  const handleDeleteReview = (review) => {
    console.log("Delete review:", review.id);
    setCurrentTxnDetails({ ...review, modalType: "delete" });
  };

  const handleRowClick = (review) => {
    handleView(review);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const displayedReviews = useMemo(() => {
    const baseReviews = reviews.length > 0 ? reviews : sampleReviews;
    return isSearchMode ? searchResult : isArchive ? [] : baseReviews;
  }, [searchResult, reviews, isSearchMode, isArchive]);

  const displayedReviewsCount = useMemo(() => {
    const baseCount = reviewsCount > 0 ? reviewsCount : sampleReviews.length;
    return isSearchMode ? searchResultCount : isArchive ? [] : baseCount;
  }, [searchResult, reviews, isSearchMode, reviewsCount]);

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
      <div
        className={classNames("min-h-[100px] h-fit  w-full mb-20", {
          "md:pr-4": !isModal,
        })}
      >
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          {/* <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} /> */}
          {isLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {isSearchMode &&
                `Search results - ${numberWithCommas(searchResultCount)}`}
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(displayedReviews) ? (
                  <Table
                    data={displayedReviews}
                    columns={columns}
                    onRowClicked={handleRowClick}
                    pointerOnHover
                    isLoading={reviewsLoading}
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
                    title="Reviews"
                    itemCount={displayedReviewsCount}
                    menuOptions={[
                      {
                        name: "Export Reviews",
                        onClick: () => console.log("Export reviews"),
                      },
                      {
                        name: "Filter Reviews",
                        onClick: () => console.log("Filter reviews"),
                      },
                    ]}
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
