import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";

import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as SearchBlackIcon } from "assets/icons/search-black.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { numberWithCommas } from "utils/formatter";
import Tabs from "components/General/Tabs";
import BlogsStore from "../store";
import { Button } from "components/General/Button";
import useTableFilter from "hooks/useTableFilter";
import { isTodayOrBeforeToday } from "utils/date";
import moment from "moment";

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
const BlogPage = ({ isModal, handleBlogSelect }) => {
  const navigate = useNavigate();
  const {
    searchBlogs,
    searchResult,
    searchResultCount,
    searchBlogLoading,
    getBlogs,
    blogs,
    loading,
    blogsCount,
    getUnpublishedBlogs,
    blogsUnpublished,
    loadingUnpublished,
    blogsUnpublishedCount,
    getArchivedBlogs,
    loadingArchived,
    blogsArchived,
    blogsArchivedCount,
  } = BlogsStore;

  const TABS = [
    {
      name: "published_blogs",
      label: `Published Blogs (${blogsCount || "-"})`,
    },
    {
      name: "unpublished_blogs",
      label: `Unpublished Blogs (${blogsUnpublishedCount || "-"})`,
    },
    {
      name: "archived_blogs",
      label: `Archived Blogs (${blogsArchivedCount || "-"})`,
    },
  ];
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageUnpublished, setCurrentPageUnpublished] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [currentPageFilter, setCurrentPageFilter] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const defaultFilters = {
    brandIds: [],
    categoryIds: [],
  };
  const isUnpublished = activeTab === 1;
  const isArchive = activeTab === 2;

  const currentActivePage = isArchive
    ? currentPageArchived
    : isUnpublished
    ? currentPageUnpublished
    : currentPage;

  const setCurrentActivePage = (page) => {
    if (isArchive) {
      setCurrentPageArchived(page);
    } else if (isUnpublished) {
      setCurrentPageUnpublished(page);
    } else {
      setCurrentPage(page);
    }
  };
  const {
    filterInput,
    setFilterInput,
    filterData,
    handleFilter,
    clearFilters,
    onRemoveFilter,
    searchData,
    searchInput,
    setSearchInput,
    handleSearch,
    clearSearch,
  } = useTableFilter({
    defaultFilters,
    currentPage: currentActivePage,
    setCurrentPage: setCurrentActivePage,
  });

  const searchQuery = searchInput?.trim();

  const filterInputEmpty =
    isEmpty(filterInput.brandIds) && isEmpty(filterInput.categoryIds);
  const filterDataEmpty =
    isEmpty(filterData.brandIds) && isEmpty(filterData.categoryIds);
  const isFilter = !filterDataEmpty && !filterInputEmpty;

  const searchInputEmpty = isEmpty(searchQuery);
  const searchDataEmpty = isEmpty(searchData?.trim());
  const isSearchMode = !searchDataEmpty && !searchInputEmpty;

  const handleOnFilter = () => {
    handleFilter();
    const payload = {
      brandIds: JSON.stringify(filterInput?.brandIds?.map(({ id }) => id)),
      categoryIds: JSON.stringify(
        filterInput?.categoryIds?.map(({ id }) => id)
      ),
      page: currentPageFilter,
      isPublished: !isUnpublished,
    };
    clearSearch?.();
    getBlogs({
      data: payload,
      onSuccess: () => {},
    });
  };
  const handleOnSearch = async () => {
    if (!searchQuery) {
      return;
    }
    handleSearch();
    const payload = { page: currentPageSearch, searchQuery };
    clearFilters?.();
    await searchBlogs({ data: payload });
  };

  const handleGetData = () => {
    if (isArchive) {
      getArchivedBlogs({
        data: {
          page: currentPageArchived,
          isPublished: !isUnpublished,
          brandIds: JSON.stringify([]),
          categoryIds: JSON.stringify([]),
        },
      });
    } else if (isUnpublished) {
      getUnpublishedBlogs({
        data: {
          page: currentPageUnpublished,
          isPublished: false,
          brandIds: JSON.stringify([]),
          categoryIds: JSON.stringify([]),
        },
      });
    } else {
      getBlogs({
        data: {
          page: currentPage,
          isPublished: true,
          brandIds: JSON.stringify([]),
          categoryIds: JSON.stringify([]),
        },
      });
    }
  };

  useEffect(() => {
    handleGetData();
  }, [currentPage, currentPageUnpublished, currentPageArchived, isArchive, isUnpublished]);
  useEffect(() => {
    if (isFilter) {
      handleOnFilter();
      return;
    }

    if (isSearchMode) {
      handleOnSearch();
    }
  }, [currentPageFilter, currentPageSearch]);

  const handleSearchToggle = () => {
    if (searchExpanded) {
      // If search is currently expanded, we're closing it, so clear the query
      setSearchInput("");
    }
    setSearchExpanded(!searchExpanded);
  };

  const handleTabChange = (tab, index) => {
    setActiveTab(index);
  };

  const getPublishedCount = () => {
    return blogsCount || 0;
  };

  const getUnpublishedCount = () => {
    return blogsUnpublishedCount || 0;
  };

  const getArchivedCount = () => {
    return blogsArchivedCount || 0;
  };

  const handleEdit = (row) => {
    if (isModal) {
      handleBlogSelect(row);
      return;
    }

    navigate(`/dashboard/blog/edit/${row?.id}`);
  };
  const columns = [
    {
      name: "Title",
      minWidth: "20%",
      maxWidth: "20%",
      selector: (row) => (
        <div
          onClick={() => handleEdit(row)}
          className="flex-col justify-start items-start gap-1 flex"
        >
          <span className="truncate text-base">{row.title}</span>
        </div>
      ),
      sortable: false,
    },

    {
      name: "Publish Date",
      selector: (row) => (
        <div
          onClick={() => handleEdit(row)}
          className="flex-col justify-start items-start gap-1 flex"
        >
          <span className="text-sm truncate max-w-[300px]">
            {moment(row?.publishDate).format("D, MMMM. YYYY")}
          </span>
        </div>
      ),
      sortable: false,
    },
    {
      name: "Author",
      selector: (row) => (
        <span onClick={() => handleEdit(row)}>{row?.authorsName}</span>
      ),
      sortable: false,
    },

    {
      name: "Status",

      selector: (row) => {
        const isPublished = isTodayOrBeforeToday(row?.publishDate);
        const isArchived = row?.archive;
        return (
          <div
            className={classNames(
              "flex justify-center items-center px-3 py-2 rounded-3xl",
              {
                "bg-[#E01E1F] text-white": isArchived,
                "bg-[#35BA83] text-white": !isArchived && isPublished,
                "bg-[#FFCC00]": !isArchived && !isPublished,
              }
            )}
          >
            <span>
              {isArchived
                ? "Archived"
                : isPublished
                ? "Published"
                : "To be published"}
            </span>
          </div>
        );
      },
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
            className=" cursor-pointer px-4 py-1 rounded-full bg-red-deep text-[11px] text-white "
          >
            {row?.archive ? "Unarchive" : "Archive"}
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const displayedBlogs = useMemo(() => {
    return isSearchMode
      ? searchResult
      : isArchive
      ? blogsArchived
      : isUnpublished
      ? blogsUnpublished
      : blogs;
  }, [
    searchResult,
    blogs,
    blogsUnpublished,
    blogsArchived,
    isSearchMode,
    isArchive,
    isUnpublished,
  ]);

  const displayedBlogsCount = useMemo(() => {
    return isSearchMode
      ? searchResultCount
      : isArchive
      ? blogsArchivedCount
      : isUnpublished
      ? blogsUnpublishedCount
      : blogsCount;
  }, [
    searchResult,
    blogs,
    isSearchMode,
    blogsArchivedCount,
    blogsUnpublishedCount,
    isUnpublished,
  ]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchBlogLoading
      : isArchive
      ? loadingArchived
      : isUnpublished
      ? loadingUnpublished
      : loading;
  }, [
    searchBlogLoading,
    loadingArchived,
    loadingUnpublished,
    loading,
    isUnpublished,
  ]);

  useEffect(() => scrollToTop(), [displayedBlogs, isLoading]);

  const handleChangeFilter = ({ prop, val }) => {
    setFilterInput({
      ...filterInput,
      [prop]: val,
    });
  };
  const handleRemoveFilter = (prop, id) => {
    let prevData = filterInput?.[prop];
    prevData = prevData?.filter((item) => item?.id !== id);
    handleChangeFilter({ prop, val: prevData });
  };
  return (
    <>
      <div
        className={classNames("min-h-[100px] h-fit  w-full mb-20", {
          "md:pr-4": !isModal,
        })}
      >
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5 mt-5">
          {/* Title Section */}
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-[22px] font-bold text-[#111111]">Blogs</h1>
              <p className="text-base text-[#666666]">
                Manage your blog content
              </p>
            </div>

            <div className="flex items-center gap-5">
              {/* Search Section */}
              <div className="flex items-center gap-2">
                {searchExpanded ? (
                  <div className="flex items-center gap-2 transition-all duration-300">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search blogs..."
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
                      autoFocus
                    />
                    <button
                      onClick={handleSearchToggle}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12 4L4 12M4 4l8 8"
                          stroke="#111111"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    {!isMobile && (
                      <span className="text-[14px] text-[#111111]">Search</span>
                    )}
                    <button
                      onClick={handleSearchToggle}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <SearchBlackIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <DividerIcon />

              {/* Add Blog Button */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(`/dashboard/blog/add`)}
              >
                {!isMobile && (
                  <span className="text-[12px] text-[#111111] uppercase">
                    Add a blog
                  </span>
                )}
                <button
                  onClick={() => navigate(`/dashboard/blog/add`)}
                  className="w-7 h-7 bg-[#690007] rounded-full flex items-center justify-center hover:bg-[#5a0006] transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}

          {isSearchMode &&
            `Search results - ${numberWithCommas(searchResultCount)}`}
          <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
            <Table
              data={displayedBlogs}
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
              isLoading={isLoading}
              pageCount={displayedBlogsCount / pageCount}
              onPageChange={(page) =>
                isSearchMode
                  ? setCurrentPageSearch(page)
                  : isArchive
                  ? setCurrentPageArchived(page)
                  : isUnpublished
                  ? setCurrentPageUnpublished(page)
                  : setCurrentPage(page)
              }
              currentPage={
                isSearchMode
                  ? currentPageSearch
                  : isArchive
                  ? currentPageArchived
                  : isUnpublished
                  ? currentPageUnpublished
                  : currentPage
              }
              tableClassName="txn-section-table"
              noPadding
              useEnhancedTable={true}
              titleTabs={[
                { title: "Published Blogs", itemCount: getPublishedCount() },
                {
                  title: "Unpublished Blogs",
                  itemCount: getUnpublishedCount(),
                },
                { title: "Archived Blogs", itemCount: getArchivedCount() },
              ]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              title="Blogs"
              itemCount={displayedBlogsCount}
              emptyStateMessage={
                isSearchMode && isEmpty(searchResult)
                  ? `There are no results for your search '${searchQuery}'`
                  : isArchive
                  ? "There are currently no archived blogs"
                  : isUnpublished
                  ? "There are currently no unpublished blogs"
                  : "There are currently no published blogs"
              }
            />
          </div>
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

BlogPage.propTypes = {
  handleBlogSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default observer(BlogPage);
