import React, { useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import moment from "moment";
import { ReactComponent as SearchBlackIcon } from "assets/icons/search-black.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as ExportIcon } from "assets/icons/export-icon.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import { pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as TrashIcon } from "assets/icons/trash-box.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { numberWithCommas, formatCurrency } from "utils/formatter";
import Amount from "components/General/Numbers/Amount";
import Tabs from "components/General/Tabs";
import UsersStore from "../store";
import { Button } from "components/General/Button";
import { getUserInfoFromStorage } from "utils/storage";
import CustomerFilterModal from "../../FilterModals/CustomerFilterModal";
import CustomerDetailsModal from "./CustomerDetailsModal";

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

const UsersPage = ({ isModal, handleUserSelect, isSelected }) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const {
    getMyBrandCustomers,
    brandCustomers,
    getMyBrandCustomersLoading,
  } = UsersStore;

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    customerType: "",
    dateFrom: "",
    dateTo: "",
    minTotalSpent: "",
    maxTotalSpent: "",
    minOrderCount: "",
    sortDirection: "",
    sortOrder: "",
  });

  const searchQuery = searchInput?.trim();
  const userInfo = getUserInfoFromStorage();
  const brandId = userInfo?.brand?.id;

  const loadCustomers = () => {
    if (!brandId) return;

    const params = {
      brandId,
      pageNumber: currentPage,
      pageSize: 50,
      searchQuery: searchQuery || undefined,
      customerType: filters.customerType || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      minTotalSpent: filters.minTotalSpent ? parseFloat(filters.minTotalSpent) : undefined,
      maxTotalSpent: filters.maxTotalSpent ? parseFloat(filters.maxTotalSpent) : undefined,
      minOrderCount: filters.minOrderCount ? parseFloat(filters.minOrderCount) : undefined,
      sortDirection: filters.sortDirection || undefined,
      sortOrder: filters.sortOrder || undefined,
      includeOrderStats: true,
    };

    getMyBrandCustomers({ data: params });
  };

  const handleTabChange = (tab, index) => {
    setActiveTab(index);
  };

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      setSearchInput("");
    }
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);

    // Count applied filters
    const filterCount = Object.values(newFilters).filter(value =>
      value !== "" && value !== null && value !== undefined
    ).length;
    setAppliedFiltersCount(filterCount);
  };

  useEffect(() => {
    loadCustomers();
  }, [brandId, currentPage, searchQuery, filters]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  const handleCustomerClick = (customer) => {
    if (isModal) {
      handleUserSelect(customer);
      return;
    }
    setSelectedCustomer(customer);
    setShowCustomerDetailsModal(true);
  };

  const guestCustomerColumns = [
    {
      name: "Guest Customer",
      minWidth: "25%",
      selector: (customer) => (
        <div className="flex flex-col">
          <span className="text-[15px] text-[#111827] font-medium">
            {customer.guestFirstName || 'N/A'} {customer.guestLastName || ''}
          </span>
          <span className="text-[14px] text-[#6D7280] mt-1">{customer.guestEmail}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Phone Number",
      minWidth: "15%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666]">{customer.guestPhoneNumber || 'N/A'}</span>
      ),
      sortable: true,
    },
    {
      name: "Total Orders",
      minWidth: "12%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666]">{customer.totalOrders}</span>
      ),
      sortable: true,
    },
    {
      name: "Total Spent",
      minWidth: "15%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666] font-medium">
          {formatCurrency(customer.totalSpent || 0)}
        </span>
      ),
      sortable: true,
    },
    {
      name: "First Order",
      minWidth: "15%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666]">
          {moment(customer.firstOrderDate).format("DD/MM/YYYY")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Last Order",
      minWidth: "15%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666]">
          {moment(customer.lastOrderDate).format("DD/MM/YYYY")}
        </span>
      ),
      sortable: true,
    },
  ];

  const registeredCustomerColumns = [
    {
      name: "Registered Customer",
      minWidth: "25%",
      selector: (customer) => (
        <div className="flex flex-col">
          <span className="text-[15px] text-[#111827] font-medium">
            {customer.firstName} {customer.lastName}
          </span>
          <span className="text-[14px] text-[#6D7280] mt-1">{customer.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Phone Number",
      minWidth: "15%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666]">{customer.phoneNumber || 'N/A'}</span>
      ),
      sortable: true,
    },
    {
      name: "Total Orders",
      minWidth: "12%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666]">{customer.totalOrders}</span>
      ),
      sortable: true,
    },
    {
      name: "Total Spent",
      minWidth: "15%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666] font-medium">
          {formatCurrency(customer.totalSpent || 0)}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Joined Date",
      minWidth: "15%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666]">
          {moment(customer.createdAt).format("DD/MM/YYYY")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Last Order",
      minWidth: "15%",
      selector: (customer) => (
        <span className="text-[14px] text-[#666666]">
          {moment(customer.lastOrderDate).format("DD/MM/YYYY")}
        </span>
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

  const getGuestCustomersCount = () => {
    return brandCustomers.totalGuestCustomers || 0;
  };

  const getRegisteredCustomersCount = () => {
    return brandCustomers.totalRegisteredCustomers || 0;
  };

  const getDisplayedCustomers = () => {
    if (activeTab === 0) {
      return brandCustomers.registeredCustomers || [];
    } else {
      return brandCustomers.guestCustomers || [];
    }
  };

  const getDisplayedColumns = () => {
    if (activeTab === 0) {
      return registeredCustomerColumns;
    } else {
      return guestCustomerColumns;
    }
  };

  const getTotalCustomersForCurrentTab = () => {
    if (activeTab === 0) {
      return getRegisteredCustomersCount();
    } else {
      return getGuestCustomersCount();
    }
  };

  useEffect(() => scrollToTop(), [brandCustomers]);

  return (
    <>
      <div
        className={classNames("min-h-[100px] h-fit  w-full mb-20", {
          "md:pr-4": !isModal,
        })}
      >
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          {/* Title Section */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#111111]">
                Customers
              </h1>
              <span className="text-[14px] text-[#6D7280]">
                {brandCustomers.totalCustomers || 0} TOTAL
              </span>
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
                      placeholder="Search customers..."
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
                onClick={() => setFilterModalOpen(true)}
              >
                {!isMobile && (
                  <span className="text-[14px] text-[#111111]">
                    Filters {appliedFiltersCount > 0 && `(${appliedFiltersCount})`}
                  </span>
                )}
                <button
                  onClick={() => setFilterModalOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FilterIcon
                    className={classNames("w-4 h-4", {
                      "fill-[#690007]": appliedFiltersCount > 0,
                      "fill-[#111111]": appliedFiltersCount === 0,
                    })}
                  />
                </button>
              </div>

              <DividerIcon />

              {/* Export Section */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => console.log("Export customers")}
              >
                {!isMobile && (
                  <span className="text-[14px] text-[#111111]">
                    Export
                  </span>
                )}
                <button
                  onClick={() => console.log("Export customers")}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ExportIcon className="w-4 h-4 fill-[#111111]" />
                </button>
              </div>
            </div>
          </div>

          {getMyBrandCustomersLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {searchQuery && brandCustomers.searchResultsCount !== undefined &&
                `Search results - ${numberWithCommas(brandCustomers.searchResultsCount)}`}
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(getDisplayedCustomers()) ? (
                  <Table
                    data={getDisplayedCustomers()}
                    columns={getDisplayedColumns()}
                    onRowClicked={handleCustomerClick}
                    pointerOnHover
                    isLoading={getMyBrandCustomersLoading}
                    pageCount={Math.ceil(getTotalCustomersForCurrentTab() / 50)}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                    useEnhancedTable={true}
                    titleTabs={[
                      { title: "Registered Customers", itemCount: getRegisteredCustomersCount() },
                      { title: "Guest Customers", itemCount: getGuestCustomersCount() }
                    ]}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    title="Customers"
                    itemCount={getTotalCustomersForCurrentTab()}
                    menuOptions={[
                      {
                        name: "Export Customers",
                        onClick: () => console.log("Export customers"),
                      },
                    ]}
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>
                        {searchQuery && isEmpty(getDisplayedCustomers())
                          ? `There are no results for your search '${searchQuery}'`
                          : activeTab === 0
                          ? "There are currently no registered customers"
                          : "There are currently no guest customers"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <CustomerFilterModal
        active={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApplyFilters={handleFilterApply}
        currentFilters={filters}
      />

      <CustomerDetailsModal
        active={showCustomerDetailsModal}
        customer={selectedCustomer}
        onClose={() => {
          setShowCustomerDetailsModal(false);
          setSelectedCustomer(null);
        }}
      />

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
    </>
  );
};

UsersPage.propTypes = {
  handleUserSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default observer(UsersPage);
