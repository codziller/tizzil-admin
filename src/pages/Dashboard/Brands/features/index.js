import React, { useEffect, useMemo, useState } from "react";

import moment from "moment";
import _, { isEmpty, lowerCase } from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import Table from "components/General/Table";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import { ReactComponent as EmptyListIcon } from "assets/icons/empty-list-icon.svg";
import { ReactComponent as SearchBlackIcon } from "assets/icons/search-black.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-icon.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import CheckBox from "components/General/Input/CheckBox";
import BrandsStore from "../store";
import TransactionDetailsModal from "./DetailsModal";
import BrandDetailModal from "components/General/BrandDetailModal";
import BrandFilterModal from "components/General/FilterModals/BrandFilterModal";
import { convertToJs } from "utils/functions";
import AuthStore from "pages/OnBoarding/SignIn/store";
import { pageCount } from "utils/appConstant";
import { formatCurrency } from "utils/formatter";
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
const BrandsPage = ({
  isModal,
  handleBrandSelect,
  modalDetails,
  isSelected,
}) => {
  const navigate = useNavigate();
  const {
    brands,
    getBrands,
    getBrandsAwaitingApproval,
    loading,
    pendingBrandsLoading,
    brandsCount,
    pendingBrands,
    pendingBrandsCount,
  } = BrandsStore;
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [pendingSearchInput, setPendingSearchInput] = useState("");
  const [displayedItems, setDisplayedItems] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [pendingAppliedFiltersCount, setPendingAppliedFiltersCount] =
    useState(0);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: "",
    city: "",
    country: "",
    state: "",
  });
  const [pendingFilters, setPendingFilters] = useState({
    city: "",
    country: "",
    endDate: "",
    hasShopifyIntegration: undefined,
    maxEstimatedMonthlyOrders: "",
    maxYearsInBusiness: "",
    minEstimatedMonthlyOrders: "",
    minYearsInBusiness: "",
    productImportMethod: "",
    startDate: "",
    state: "",
  });

  const isObjectOnChange = modalDetails?.isObjectOnChange;

  const searchQuery = searchInput?.trim();
  const pendingSearchQuery = pendingSearchInput?.trim();

  const loadApprovedBrands = () => {
    const params = {
      page: currentPage,
      searchQuery: searchQuery || undefined,
      categoryId: filters.categoryId || undefined,
      city: filters.city || undefined,
      country: filters.country || undefined,
      state: filters.state || undefined,
    };
    getBrands({ data: params });
  };

  const loadPendingBrands = () => {
    const params = {
      page: pendingCurrentPage,
      searchQuery: pendingSearchQuery || undefined,
      city: pendingFilters.city || undefined,
      country: pendingFilters.country || undefined,
      endDate: pendingFilters.endDate || undefined,
      hasShopifyIntegration: pendingFilters.hasShopifyIntegration,
      maxEstimatedMonthlyOrders:
        pendingFilters.maxEstimatedMonthlyOrders || undefined,
      maxYearsInBusiness: pendingFilters.maxYearsInBusiness || undefined,
      minEstimatedMonthlyOrders:
        pendingFilters.minEstimatedMonthlyOrders || undefined,
      minYearsInBusiness: pendingFilters.minYearsInBusiness || undefined,
      productImportMethod: pendingFilters.productImportMethod || undefined,
      startDate: pendingFilters.startDate || undefined,
      state: pendingFilters.state || undefined,
    };
    getBrandsAwaitingApproval({ data: params });
  };

  const loadBrands = () => {
    if (activeTab === 0) {
      loadApprovedBrands();
    } else if (activeTab === 1) {
      loadPendingBrands();
    }
  };

  const handleFilterApply = (newFilters) => {
    if (activeTab === 0) {
      // Approved brands filters
      setFilters(newFilters);
      setCurrentPage(1);
      const filterCount = Object.values(newFilters).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
      setAppliedFiltersCount(filterCount);
    } else {
      // Pending brands filters
      setPendingFilters(newFilters);
      setPendingCurrentPage(1);
      const filterCount = Object.values(newFilters).filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value !== false
      ).length;
      setPendingAppliedFiltersCount(filterCount);
    }
  };

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      if (activeTab === 0) {
        setSearchInput("");
      } else {
        setPendingSearchInput("");
      }
    }
  };

  // Load approved brands when their pagination, search, or filters change (includes initial load)
  useEffect(() => {
    loadApprovedBrands();
  }, [
    currentPage,
    searchQuery,
    filters.categoryId,
    filters.city,
    filters.country,
    filters.state,
  ]);

  // Load pending brands when their pagination, search, or filters change (includes initial load)
  useEffect(() => {
    loadPendingBrands();
  }, [
    pendingCurrentPage,
    pendingSearchQuery,
    pendingFilters.city,
    pendingFilters.country,
    pendingFilters.endDate,
    pendingFilters.hasShopifyIntegration,
    pendingFilters.maxEstimatedMonthlyOrders,
    pendingFilters.maxYearsInBusiness,
    pendingFilters.minEstimatedMonthlyOrders,
    pendingFilters.minYearsInBusiness,
    pendingFilters.productImportMethod,
    pendingFilters.startDate,
    pendingFilters.state,
  ]);

  // Reset approved brands page when search changes
  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  // Reset pending brands page when search changes
  useEffect(() => {
    if (pendingSearchQuery?.length > 1 || !pendingSearchQuery) {
      setPendingCurrentPage(1);
    }
  }, [pendingSearchInput]);

  const { warehouse_id } = useParams();

  const displayedBrands = useMemo(() => {
    return activeTab === 0 ? brands || [] : pendingBrands || [];
  }, [brands, pendingBrands, activeTab]);

  const displayedBrandsCount = useMemo(() => {
    return activeTab === 0 ? brandsCount || 0 : pendingBrandsCount || 0;
  }, [brandsCount, pendingBrandsCount, activeTab]);

  const handleEdit = (row) => {
    if (isModal) {
      handleBrandSelect?.(row);
      return;
    }
    setCurrentTxnDetails({ ...row, currentPage, modalType: "edit" });
  };

  const handleView = (row) => {
    if (isModal) {
      handleBrandSelect?.(row);
      return;
    } else {
      setSelectedBrand(row);
      setShowBrandModal(true);
    }
  };

  const handleTabChange = (tab, index) => {
    setActiveTab(index);
  };

  // Approved brands columns
  const approvedBrandsColumns = [
    {
      name: "Brand Logo",
      className: "flex-[0.5]",
      selector: (row) => (
        <img
          className="object-cover w-[45px] h-[45px] rounded-lg"
          src={row?.logoUrl || "https://via.placeholder.com/45x45"}
          alt={row?.brandName}
        />
      ),
      sortable: false,
    },
    {
      name: "Brand Name",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">{row?.brandName}</span>
      ),
      sortable: true,
    },
    {
      name: "No. of orders",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">
          {row?.totalOrders || 0}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Revenue",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">
          {formatCurrency(row?.totalRevenue || 0, true)}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Wallet Balance",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">
          {formatCurrency(row?.walletBalance || 0, true)}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Product Category",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#690007] uppercase font-medium">
          {row?.productCategory || "N/A"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "AOV",
      className: "flex-[1]",
      selector: (row) => {
        const aov =
          row?.totalOrders > 0 ? row?.totalRevenue / row?.totalOrders : 0;
        return (
          <span className="text-[14px] text-[#666666]">
            {formatCurrency(aov, true)}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "",
      className: "flex-[0.5]",
      selector: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 5.83333C10.4583 5.83333 10.8333 5.45833 10.8333 5C10.8333 4.54167 10.4583 4.16667 10 4.16667C9.54167 4.16667 9.16667 4.54167 9.16667 5C9.16667 5.45833 9.54167 5.83333 10 5.83333ZM10 10.8333C10.4583 10.8333 10.8333 10.4583 10.8333 10C10.8333 9.54167 10.4583 9.16667 10 9.16667C9.54167 9.16667 9.16667 9.54167 9.16667 10C9.16667 10.4583 9.54167 10.8333 10 10.8333ZM10 15.8333C10.4583 15.8333 10.8333 15.4583 10.8333 15C10.8333 14.5417 10.4583 14.1667 10 14.1667C9.54167 14.1667 9.16667 14.5417 9.16667 15C9.16667 15.4583 9.54167 15.8333 10 15.8333Z"
              fill="#666666"
            />
          </svg>
        </div>
      ),
      sortable: false,
    },
  ];

  // Pending brands columns
  const pendingBrandsColumns = [
    {
      name: "Brand Name",
      className: "flex-[1.5]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">{row?.brandName}</span>
      ),
      sortable: true,
    },
    {
      name: "Owner",
      className: "flex-[1.5]",
      selector: (row) => (
        <div className="flex flex-col">
          <span className="text-[14px] text-[#111827] font-medium">
            {row?.ownerName}
          </span>
          <span className="text-[12px] text-[#6D7280]">{row?.ownerEmail}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Location",
      className: "flex-[1.5]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">
          {row?.addressInfo
            ? `${row.addressInfo.city}, ${row.addressInfo.state}`
            : "N/A"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Total Products",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">
          {row?.totalProducts || 0}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Monthly Orders Est.",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">
          {row?.estimatedMonthlyOrders || 0}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Submitted",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">
          {moment(row?.submittedAt).format("DD/MM/YYYY")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "",
      className: "flex-[0.5]",
      selector: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 5.83333C10.4583 5.83333 10.8333 5.45833 10.8333 5C10.8333 4.54167 10.4583 4.16667 10 4.16667C9.54167 4.16667 9.16667 4.54167 9.16667 5C9.16667 5.45833 9.54167 5.83333 10 5.83333ZM10 10.8333C10.4583 10.8333 10.8333 10.4583 10.8333 10C10.8333 9.54167 10.4583 9.16667 10 9.16667C9.54167 9.16667 9.16667 9.54167 9.16667 10C9.16667 10.4583 9.54167 10.8333 10 10.8333ZM10 15.8333C10.4583 15.8333 10.8333 15.4583 10.8333 15C10.8333 14.5417 10.4583 14.1667 10 14.1667C9.54167 14.1667 9.16667 14.5417 9.16667 15C9.16667 15.4583 9.54167 15.8333 10 15.8333Z"
              fill="#666666"
            />
          </svg>
        </div>
      ),
      sortable: false,
    },
  ];

  const columns =
    activeTab === 0 ? approvedBrandsColumns : pendingBrandsColumns;

  const getApprovedBrandsCount = () => {
    return brandsCount || 0;
  };

  const getPendingBrandsCount = () => {
    return pendingBrandsCount || 0;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [displayedBrands]);

  return (
    <>
      <div className="min-h-[100px] h-fit w-full mb-20">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          {/* Title Section */}
          <div className="flex justify-between items-center w-full gap-4">
            <h1 className="text-[22px] font-bold text-[#111111]">Brands</h1>

            {displayedBrands.length > 0 && (
              <div className="flex items-center gap-5">
                {/* Search Section */}
                <div className="flex items-center gap-2">
                  {searchExpanded ? (
                    <div className="flex items-center gap-2 transition-all duration-300">
                      <input
                        type="text"
                        value={
                          activeTab === 0 ? searchInput : pendingSearchInput
                        }
                        onChange={(e) => {
                          if (activeTab === 0) {
                            setSearchInput(e.target.value);
                          } else {
                            setPendingSearchInput(e.target.value);
                          }
                        }}
                        placeholder={`Search ${
                          activeTab === 0 ? "approved" : "pending"
                        } brands...`}
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
                        <span className="text-[14px] text-[#111111]">
                          Search
                        </span>
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

                {/* Filters Section */}
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowFilterModal(true)}
                >
                  {!isMobile && (
                    <span className="text-[14px] text-[#111111]">
                      Filters{" "}
                      {activeTab === 0
                        ? appliedFiltersCount > 0 && `(${appliedFiltersCount})`
                        : pendingAppliedFiltersCount > 0 &&
                          `(${pendingAppliedFiltersCount})`}
                    </span>
                  )}
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FilterIcon
                      className={classNames("w-4 h-4", {
                        "fill-[#690007]":
                          activeTab === 0
                            ? appliedFiltersCount > 0
                            : pendingAppliedFiltersCount > 0,
                        "fill-[#111111]":
                          activeTab === 0
                            ? appliedFiltersCount === 0
                            : pendingAppliedFiltersCount === 0,
                      })}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
            <Table
              data={displayedBrands}
              columns={columns}
              onRowClicked={handleView}
              pointerOnHover
              isLoading={loading || pendingBrandsLoading}
              pageCount={Math.ceil(displayedBrandsCount / pageCount)}
              onPageChange={
                activeTab === 0 ? setCurrentPage : setPendingCurrentPage
              }
              currentPage={activeTab === 0 ? currentPage : pendingCurrentPage}
              tableClassName="txn-section-table"
              noPadding
              useEnhancedTable={true}
              title="Brands"
              itemCount={displayedBrandsCount}
              titleTabs={[
                {
                  title: "Approved Brands",
                  itemCount: getApprovedBrandsCount(),
                },
                {
                  title: "Pending Brands",
                  itemCount: getPendingBrandsCount(),
                },
              ]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              menuOptions={[
                {
                  name: "Export Brands",
                  onClick: () => console.log("Export brands"),
                },
              ]}
              emptyStateComponent={
                displayedBrands.length === 0 &&
                !(loading || pendingBrandsLoading) ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <EmptyListIcon className="mb-4" />
                    <h3 className="text-[16px] text-[#000000] font-medium mb-2">
                      {(activeTab === 0 ? searchQuery : pendingSearchQuery) ||
                      (activeTab === 0
                        ? appliedFiltersCount
                        : pendingAppliedFiltersCount) > 0
                        ? `No ${
                            activeTab === 0 ? "approved" : "pending"
                          } brands found`
                        : `No ${
                            activeTab === 0 ? "approved" : "pending"
                          } brands yet`}
                    </h3>
                    <p className="text-[14px] text-[#777777] mb-6 text-center max-w-md">
                      {activeTab === 0
                        ? searchQuery
                        : pendingSearchQuery
                        ? `No results found for "${
                            activeTab === 0 ? searchQuery : pendingSearchQuery
                          }" in ${
                            activeTab === 0 ? "approved" : "pending"
                          } brands`
                        : (activeTab === 0
                            ? appliedFiltersCount
                            : pendingAppliedFiltersCount) > 0
                        ? `Try adjusting your filters or switch to ${
                            activeTab === 0 ? "pending" : "approved"
                          } brands tab`
                        : activeTab === 0
                        ? "No approved brands available. Check the pending brands tab for brands awaiting approval."
                        : "No pending brands available. New brand registrations will appear here for review."}
                    </p>
                    {/* {!(activeTab === 0 ? searchQuery : pendingSearchQuery) &&
                      (activeTab === 0
                        ? appliedFiltersCount
                        : pendingAppliedFiltersCount) === 0 &&
                      !isModal &&
                      activeTab === 0 && (
                        <Button
                          text="ADD A BRAND"
                          onClick={() =>
                            setCurrentTxnDetails({
                              modalType: "add",
                              isAdd: true,
                            })
                          }
                        />
                      )} */}
                  </div>
                ) : null
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

      <BrandDetailModal
        active={showBrandModal}
        brand={selectedBrand}
        toggler={() => {
          setShowBrandModal(false);
          setSelectedBrand(null);
        }}
        currentFilters={activeTab === 1 ? pendingFilters : {}}
      />

      {/* Brand Filter Modal */}
      <BrandFilterModal
        active={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleFilterApply}
        currentFilters={activeTab === 0 ? filters : pendingFilters}
        activeTab={activeTab}
      />
    </>
  );
};
BrandsPage.propTypes = {
  handleBrandSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
  modalDetails: PropTypes.object,
};
export default observer(BrandsPage);
