import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as TrashIcon } from "assets/icons/trash-box.svg";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import { ReactComponent as EmptyListIcon } from "assets/icons/empty-list-icon.svg";
import { ReactComponent as SearchBlackIcon } from "assets/icons/search-black.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-icon.svg";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import { Button } from "components/General/Button";
import TransactionDetailsModal from "./DetailsModal";
import AddUserModal from "./AddUserModal";
import UserDetailsModal from "./UserDetailsModal";
import UserFilterModal from "../../FilterModals/UserFilterModal";
import UsersStore from "../store";
import { pageCount } from "utils/appConstant";
import useWindowDimensions from "hooks/useWindowDimensions";

// Admin navigation items for permissions
const adminNavItems = [
  {
    id: "dashboard-overview",
    label: "Dashboard Overview",
    path: "/dashboard/home",
  },
  {
    id: "orders",
    label: "Orders",
    path: "/dashboard/orders",
  },
  {
    id: "brands",
    label: "Brands",
    path: "/dashboard/brands",
  },
  {
    id: "reviews",
    label: "Reviews",
    path: "/dashboard/reviews",
  },
  {
    id: "discover-users",
    label: "Discover Users",
    path: "/dashboard/discover-users",
  },
  {
    id: "payout",
    label: "Payout",
    path: "/dashboard/payout",
  },
  {
    id: "user-management",
    label: "User Management",
    path: "/dashboard/users",
  },
];


const USER_STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
];

const AdminUsers = () => {
  const {
    getUsers,
    users,
    loading,
    usersCount,
  } = UsersStore;

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filters, setFilters] = useState({
    brandId: "",
    createdAfter: "",
    createdBefore: "",
    hasOrders: "",
    isDeleted: "",
    isEmailConfirmed: "",
  });

  const searchQuery = searchInput?.trim();

  const loadUsers = () => {
    const params = {
      pageNumber: currentPage,
      searchQuery: searchQuery || undefined,
      brandId: filters.brandId || undefined,
      createdAfter: filters.createdAfter || undefined,
      createdBefore: filters.createdBefore || undefined,
      hasOrders: filters.hasOrders !== "" ? filters.hasOrders : undefined,
      isDeleted: filters.isDeleted !== "" ? filters.isDeleted : undefined,
      isEmailConfirmed: filters.isEmailConfirmed !== "" ? filters.isEmailConfirmed : undefined,
    };

    getUsers({ data: params });
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

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      setSearchInput("");
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery, filters]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  const displayedUsers = useMemo(() => {
    return users || [];
  }, [users]);

  const displayedUsersCount = useMemo(() => {
    return usersCount || 0;
  }, [usersCount]);

  const handleAddUser = (userData) => {
    console.log("Add user:", userData);
    // Here you would typically make an API call to create the user
    setShowAddUserModal(false);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleDeleteUser = (user) => {
    console.log("Delete user:", user.id);
    setCurrentTxnDetails({ ...user, modalType: "delete" });
  };

  const handleUserStatusChange = (user, newStatus) => {
    console.log("User status change:", user.id, newStatus);
    // Implement status change logic
  };

  const columns = [
    {
      name: "Users",
      className: "flex-[2]",
      selector: (user) => {
        const userId = user.id.toString().padStart(6, "0").slice(-6);
        return (
          <div className="flex flex-col">
            <span className="text-[14px] text-[#111827] font-medium">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-[14px] text-[#6D7280] mt-1">#{userId}</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Email",
      className: "flex-[2]",
      selector: (user) => (
        <span className="text-[14px] text-[#666666]">{user.email}</span>
      ),
      sortable: true,
    },
    {
      name: "Phone Number",
      className: "flex-[1]",
      selector: (user) => (
        <span className="text-[14px] text-[#666666]">{user.phoneNumber}</span>
      ),
      sortable: true,
    },
    {
      name: "Date Created",
      className: "flex-[1]",
      selector: (user) => (
        <span className="text-[14px] text-[#666666]">
          {moment(user.createdAt).format("DD/MM/YYYY")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Status",
      className: "flex-[1]",
      selector: (user) => (
        <div onClick={(e) => e.stopPropagation()}>
          <TableDropdown
            className={classNames({
              "text-green": user.status === "Active",
              "text-yellow": user.status === "Inactive",
              "text-red-deep": user.status === "Suspended",
            })}
            options={USER_STATUS_OPTIONS}
            content={user.status}
            handleClick={(option) => handleUserStatusChange(user, option)}
            isLoading={false}
          />
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

  useEffect(() => scrollToTop(), [displayedUsers]);

  return (
    <>
      <div className="min-h-[100px] h-fit w-full mb-20">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          {/* Title Section */}
          <div className="flex justify-between items-center w-full gap-4">
            <h1 className="text-[22px] font-bold text-[#111111]">Admin Users</h1>

            {displayedUsers.length > 0 && (
              <div className="flex items-center gap-5">
                {/* Search Section */}
                <div className="flex items-center gap-2">
                  {searchExpanded ? (
                    <div className="flex items-center gap-2 transition-all duration-300">
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search admin users..."
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
                      Filters {appliedFiltersCount > 0 && `(${appliedFiltersCount})`}
                    </span>
                  )}
                  <button
                    onClick={() => setShowFilterModal(true)}
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

                {/* Add User section */}
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowAddUserModal(true)}
                >
                  {!isMobile && (
                    <span className="text-[12px] text-[#111111] uppercase">
                      Add a user
                    </span>
                  )}
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="w-7 h-7 bg-[#690007] rounded-full flex items-center justify-center hover:bg-[#5a0006] transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <CircleLoader blue />
            </div>
          ) : displayedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <EmptyListIcon className="mb-8" />
              <h3 className="text-[16px] text-[#000000] font-medium mb-2">
                {searchQuery || appliedFiltersCount > 0
                  ? "No users found"
                  : "Nothing to see here"}
              </h3>
              <p className="text-[16px] text-[#777777] mb-8">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : appliedFiltersCount > 0
                  ? "Try adjusting your filters"
                  : "admin users"}
              </p>
              {!searchQuery && appliedFiltersCount === 0 && (
                <Button text="ADD A USER" onClick={() => setShowAddUserModal(true)} />
              )}
            </div>
          ) : (
            <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
              <Table
                data={displayedUsers}
                columns={columns}
                onRowClicked={handleUserClick}
                pointerOnHover
                isLoading={loading}
                pageCount={Math.ceil(displayedUsersCount / pageCount)}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                tableClassName="txn-section-table"
                noPadding
                useEnhancedTable={true}
                title="Admin Users"
                itemCount={displayedUsersCount}
                menuOptions={[
                  {
                    name: "Export Users",
                    onClick: () => console.log("Export users"),
                  },
                  {
                    name: "Add New User",
                    onClick: () => setShowAddUserModal(true),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />

      {/* Add User Modal */}
      <AddUserModal
        active={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
        adminNavItems={adminNavItems}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        active={showUserDetailsModal}
        user={selectedUser}
        onClose={() => {
          setShowUserDetailsModal(false);
          setSelectedUser(null);
        }}
        adminNavItems={adminNavItems}
      />

      {/* User Filter Modal */}
      <UserFilterModal
        active={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleFilterApply}
        currentFilters={filters}
      />
    </>
  );
};

AdminUsers.propTypes = {};

export default observer(AdminUsers);