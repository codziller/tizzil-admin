import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";

import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { numberWithCommas } from "utils/formatter";
import Amount from "components/General/Numbers/Amount";
import Tabs from "components/General/Tabs";
import BlogsStore from "../store";
import { Button } from "components/General/Button";
import useTableFilter from "hooks/useTableFilter";
import { flattenArrayToString } from "utils/functions";
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
const BlogPage = ({ isModal, handleBlogSelect, isSelected }) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const {
    searchBlogs,
    searchResult,
    searchResultCount,
    searchBlogLoading,
    getBlogs,
    blogs,
    loading,
    blogsCount,
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
      label: `Unpublished Blogs (${blogsCount || "-"})`,
    },
    {
      name: "archived_blogs",
      label: `Archived Blogs (${blogsArchivedCount || "-"})`,
    },
  ];
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [currentPageFilter, setCurrentPageFilter] = useState(1);
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);

  const defaultFilters = {
    brandIds: [],
    categoryIds: [],
  };
  const isUnpublished = activeTab === TABS[1]?.name;
  const isArchive = activeTab === TABS[2]?.name;

  const currentActivePage = isArchive ? currentPageArchived : currentPage;

  const setCurrentActivePage = (page) => {
    isArchive ? setCurrentPageArchived(page) : setCurrentPage(page);
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
    isArchive
      ? getArchivedBlogs({
          data: {
            page: currentPage,
            isPublished: !isUnpublished,
            brandIds: JSON.stringify([]),
            categoryIds: JSON.stringify([]),
          },
        })
      : getBlogs({
          data: {
            page: currentPage,
            isPublished: !isUnpublished,
            brandIds: JSON.stringify([]),
            categoryIds: JSON.stringify([]),
          },
        });
  };

  useEffect(() => {
    handleGetData();
  }, [currentPage, currentPageArchived, isArchive, isUnpublished]);
  useEffect(() => {
    if (isFilter) {
      handleOnFilter();
      return;
    }

    if (isSearchMode) {
      handleOnSearch();
    }
  }, [currentPageFilter, currentPageSearch]);

  const handleEdit = (row) => {
    if (isModal) {
      handleBlogSelect(row);
      return;
    }

    navigate(`/dashboard/blog/edit/${warehouse_id}/${row?.id}`);
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
    return isSearchMode ? searchResult : isArchive ? blogsArchived : blogs;
  }, [
    searchResult,
    blogs,
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
      : blogsCount;
  }, [searchResult, blogs, isSearchMode, blogsArchivedCount, isUnpublished]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchBlogLoading
      : isArchive
      ? loadingArchived
      : loading;
  }, [searchBlogLoading, loadingArchived, loading, isUnpublished]);

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
      <div className={classNames("h-full w-full", { "md:pr-4": !isModal })}>
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div
              className={classNames({
                "w-full": isModal,
                "w-full sm:w-[45%] sm:min-w-[300px]": !isModal,
              })}
            >
              <SearchBar
                placeholder={"Search blogs by name, email, phone number"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>

            <Button
              text="Add Blog"
              icon={<Plus className="stroke-current" />}
              className="hidden md:block"
              onClick={() => navigate(`/dashboard/blog/add/${warehouse_id}`)}
            />
          </div>

          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          {isLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {isSearchMode &&
                `Search results - ${numberWithCommas(searchResultCount)}`}
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(displayedBlogs) ? (
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
                    pageCount={displayedBlogsCount / pageCount}
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
                            ? "There are currently no archived blogs"
                            : "There are currently no blogs"}
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
    </>
  );
};

BlogPage.propTypes = {
  handleBlogSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default observer(BlogPage);
