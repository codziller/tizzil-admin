import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount } from "utils/appConstant";
import PropTypes from "prop-types";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import TransactionDetailsModal from "./DetailsModal";
import MarketingStore from "../store";
import { observer } from "mobx-react-lite";
import { Button } from "components/General/Button";
import useWindowDimensions from "hooks/useWindowDimensions";
import { formatCapitalUnderscoreText } from "utils/appConstant";
import SearchBar from "components/General/Searchbar/SearchBar";
import Tabs from "components/General/Tabs";
import { isEmpty, lowerCase } from "lodash";
import classNames from "classnames";
import { numberWithCommas } from "utils/formatter";

const Discount = ({ isModal, handleDiscountSelect }) => {
  const { warehouse_id } = useParams();
  const navigate = useNavigate();
  const {
    loadingDiscounts,
    getDiscounts,
    discounts,
    discountsArchived,
    loadingArchivedDiscounts,
    getArchivedDiscounts,
    discountsArchivedCount,
    discountsCount,
  } = MarketingStore;
  const searchDiscountLoading = false;
  const TABS = [
    { name: "discounts", label: `Discounts (${discountsCount || "-"})` },
    {
      name: "archived",
      label: `Archived discounts (${discountsArchivedCount || "-"})`,
    },
  ];

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const [searchResult, setSearchResult] = useState([]);
  const searchResultCount = searchResult?.length;
  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;
  const isArchive = activeTab === TABS[1]?.name;
  useEffect(() => {
    getDiscounts({ data: { page: 1 } });
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }

    const result = discounts?.filter((item) =>
      lowerCase(item?.name).includes(lowerCase(searchQuery))
    );
    setSearchResult(result);
  };

  const handleGetData = () => {
    isArchive
      ? getArchivedDiscounts({ data: { page: currentPageArchived } })
      : getDiscounts({ data: { page: currentPage } });
  };

  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [currentPage, currentPageSearch, currentPageArchived, isArchive]);

  useEffect(() => {
    if (searchQuery?.length > 0 || !searchQuery) {
      handleSearch();
    }
  }, [searchInput]);

  const handleEdit = (row) => {
    if (isModal) {
      handleDiscountSelect(row);
      return;
    }

    navigate(
      `/dashboard/marketing/edit-discount/${warehouse_id}/mobile/${row?.id}`
    );
  };

  const columns = [
    {
      name: "Discount Name",
      minWidth: isMobile ? "50%" : "30%",
      selector: "name",
      sortable: true,
    },

    {
      name: "Discount Code",
      selector: "discountCode",
      sortable: true,
    },
    {
      name: "Discount Type",
      selector: (row) => (
        <span className="capitalize" onClick={() => handleEdit(row)}>
          {formatCapitalUnderscoreText(row?.discountType)}
        </span>
      ),
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
            {row?.archived ? "Unarchive" : "Archive"}
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

  const displayedDiscounts = useMemo(() => {
    return isSearchMode
      ? searchResult
      : isArchive
      ? discountsArchived
      : discounts;
  }, [searchResult, discounts, discountsArchived, isSearchMode, isArchive]);

  const displayedDiscountsCount = useMemo(() => {
    return isSearchMode
      ? searchResultCount
      : isArchive
      ? discountsArchivedCount
      : discountsCount;
  }, [searchResult, discounts, isSearchMode, discountsArchivedCount]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchDiscountLoading
      : isArchive
      ? isEmpty(discountsArchived) && loadingArchivedDiscounts
      : isEmpty(discounts) && loadingDiscounts;
  }, [searchDiscountLoading, loadingArchivedDiscounts, loadingDiscounts]);

  useEffect(() => scrollToTop(), [displayedDiscounts]);

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
        {isLoading ? (
          <CircleLoader blue />
        ) : (
          <>
            <div className="flex flex-col justify-start items-start gap-4 relative w-full">
              <div className="flex justify-between items-center w-full mb-3 gap-1">
                <div
                  className={classNames({
                    "w-full": isModal,
                    "w-full sm:w-[45%] sm:min-w-[300px]": !isModal,
                  })}
                >
                  <SearchBar
                    placeholder={"Search discounts"}
                    onChange={setSearchInput}
                    value={searchInput}
                    className="flex"
                  />
                </div>
                <Link
                  to={`/dashboard/marketing/add-discount/${warehouse_id}/mobile`}
                >
                  <Button
                    text="Add Discount"
                    icon={<Plus className="stroke-current" />}
                    className="hidden md:block"
                  />
                </Link>
              </div>

              <Tabs
                tabs={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {isLoading ? (
                <CircleLoader blue />
              ) : (
                <>
                  {isSearchMode &&
                    `Search results - ${numberWithCommas(searchResultCount)}`}
                  <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                    {!isEmpty(displayedDiscounts) ? (
                      <Table
                        data={displayedDiscounts}
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
                        pageCount={displayedDiscountsCount / pageCount}
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
                                ? "There are currently no archived discounts"
                                : "There are currently no discounts"}
                            </span>
                          }
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
    </div>
  );
};
Discount.propTypes = {
  handleDiscountSelect: PropTypes.func,
  isModal: PropTypes.bool,
};
export default observer(Discount);
