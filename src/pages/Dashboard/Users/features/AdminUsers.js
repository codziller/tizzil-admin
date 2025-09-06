import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as TrashIcon } from "assets/icons/trash-box.svg";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import TransactionDetailsModal from "./DetailsModal";
import AddUserModal from "./AddUserModal";
import UserDetailsModal from "./UserDetailsModal";
import UsersStore from "../store";
import { pageCount } from "utils/appConstant";

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

// Sample admin users data
const sampleAdminUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Admin",
    email: "john.admin@tizzil.com",
    phoneNumber: "+1234567890",
    createdAt: new Date("2024-01-15"),
    permissions: ["dashboard-overview", "orders", "brands"],
    status: "Active",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Manager",
    email: "jane.manager@tizzil.com",
    phoneNumber: "+0987654321",
    createdAt: new Date("2024-02-10"),
    permissions: ["orders", "brands", "reviews"],
    status: "Active",
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Support",
    email: "mike.support@tizzil.com",
    phoneNumber: "+1122334455",
    createdAt: new Date("2024-03-05"),
    permissions: ["discover-users", "user-management"],
    status: "Inactive",
  },
];

const USER_STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
];

const AdminUsers = () => {
  const {
    users,
    loading,
    usersCount,
  } = UsersStore;

  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const searchQuery = searchInput?.trim();

  const displayedUsers = useMemo(() => {
    let baseUsers = users.length > 0 ? users : sampleAdminUsers;
    
    if (searchQuery) {
      baseUsers = baseUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return baseUsers;
  }, [users, searchQuery]);

  const displayedUsersCount = useMemo(() => {
    return usersCount > 0 ? usersCount : sampleAdminUsers.length;
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

            <div className="flex items-center justify-between gap-4">
              <SearchBar
                placeholder={"Search admin users"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex !w-[250px]"
              />
              <Button
                text="Add User"
                icon={<Plus className="stroke-current" />}
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2"
              />
            </div>
          </div>

          {loading ? (
            <CircleLoader blue />
          ) : (
            <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
              {displayedUsers.length > 0 ? (
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
              ) : (
                <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                  <SearchIcon className="stroke-current" />
                  <span>
                    {searchQuery
                      ? `There are no results for your search '${searchQuery}'`
                      : "There are currently no admin users"}
                  </span>
                </div>
              )}
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
    </>
  );
};

AdminUsers.propTypes = {};

export default observer(AdminUsers);