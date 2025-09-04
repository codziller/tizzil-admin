import React, { useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import moment from "moment";

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
import { numberWithCommas } from "utils/formatter";
import Amount from "components/General/Numbers/Amount";
import Tabs from "components/General/Tabs";
import UsersStore from "../store";
import { Button } from "components/General/Button";

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
// Demo user data
const sampleUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phoneNumber: "+1234567890",
    createdAt: new Date("2024-01-15"),
    status: "Active",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    phoneNumber: "+0987654321",
    createdAt: new Date("2024-02-10"),
    status: "Inactive",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@email.com",
    phoneNumber: "+1122334455",
    createdAt: new Date("2024-03-05"),
    status: "Active",
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@email.com",
    phoneNumber: "+5566778899",
    createdAt: new Date("2024-02-28"),
    status: "Suspended",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@email.com",
    phoneNumber: "+9988776655",
    createdAt: new Date("2024-01-22"),
    status: "Active",
  },
];

const USER_STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
];

const UsersPage = ({ isModal, handleUserSelect, isSelected }) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const {
    searchUsers,
    searchResult,
    searchResultCount,
    searchUserLoading,
    getUsers,
    users,
    loading,
    usersCount,
    getArchivedUsers,
    loadingArchived,
    usersArchived,
    usersArchivedCount,
  } = UsersStore;

  const TABS = [
    { name: "users", label: `Users (${usersCount || "-"})` },
    {
      name: "archived",
      label: `Archived users (${usersArchivedCount || "-"})`,
    },
  ];
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;
  const isArchive = activeTab === TABS[1]?.name;

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const payload = { page: currentPage, searchQuery };
    await searchUsers({ data: payload });
  };

  const handleGetData = () => {
    isArchive
      ? getArchivedUsers({ data: { page: currentPageArchived } })
      : getUsers({ data: { page: currentPage } });
  };

  useEffect(() => {
    // isSearchMode ? handleSearch() : handleGetData();
  }, [currentPage, currentPageSearch, currentPageArchived, isArchive]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      // handleSearch();
    }
  }, [searchInput]);

  const handleEdit = (row) => {
    if (isModal) {
      handleUserSelect(row);
      return;
    }

    navigate(`/dashboard/users/edit/${warehouse_id}/${row?.id}`);
  };
  const columns = [
    {
      name: "Users",
      minWidth: "25%",
      selector: (user) => {
        const userId = user.id.toString().padStart(6, "0").slice(-6);
        return (
          <div className="flex flex-col">
            <span className="text-[15px] text-[#111827] font-medium">
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
      minWidth: "20%",
      selector: (user) => (
        <span className="text-[14px] text-[#666666]">{user.email}</span>
      ),
      sortable: true,
    },
    {
      name: "Phone Number",
      minWidth: "15%",
      selector: (user) => (
        <span className="text-[14px] text-[#666666]">{user.phoneNumber}</span>
      ),
      sortable: true,
    },
    {
      name: "Date Created",
      minWidth: "15%",
      selector: (user) => (
        <span className="text-[14px] text-[#666666]">
          {moment(user.createdAt).format("DD/MM/YYYY")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Status",
      minWidth: "15%",
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
            isDisabled
          />
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      minWidth: "10%",
      selector: (user) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteUser(user);
          }}
          className="flex items-center cursor-pointer text-[14px] text-[#666666] hover:text-red-600 transition-colors"
        >
          <TrashIcon className="mr-[7px]" />
          Delete
        </div>
      ),
      sortable: false,
    },
  ];

  const handleDeleteUser = (user) => {
    console.log("Delete user:", user.id);
    setCurrentTxnDetails({ ...user, modalType: "delete" });
  };

  const handleUserStatusChange = (user, newStatus) => {
    console.log("User status change:", user.id, newStatus);
    // Implement status change logic
  };

  const handleRowClick = (user) => {
    handleEdit(user);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const displayedUsers = useMemo(() => {
    const baseUsers = users.length > 0 ? users : sampleUsers;
    return isSearchMode ? searchResult : isArchive ? usersArchived : baseUsers;
  }, [searchResult, users, usersArchived, isSearchMode, isArchive]);

  const displayedUsersCount = useMemo(() => {
    const baseCount = usersCount > 0 ? usersCount : sampleUsers.length;
    return isSearchMode
      ? searchResultCount
      : isArchive
      ? usersArchivedCount
      : baseCount;
  }, [searchResult, users, isSearchMode, usersArchivedCount]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchUserLoading
      : isArchive
      ? isEmpty(usersArchived) && loadingArchived
      : isEmpty(users) && loading;
  }, [searchUserLoading, loadingArchived, loading]);

  useEffect(() => scrollToTop(), [displayedUsers]);

  return (
    <>
      <div
        className={classNames("min-h-[100px] h-fit  w-full mb-20", {
          "md:pr-4": !isModal,
        })}
      >
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div
              className={classNames({
                "w-full": isModal,
                "w-full sm:w-[45%] sm:min-w-[300px]": !isModal,
              })}
            >
              <SearchBar
                placeholder={"Search users by name, email, phone number"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>

            <Button
              text="Add User"
              icon={<Plus className="stroke-current" />}
              className="hidden md:block"
              onClick={() => navigate(`/dashboard/users/add/${warehouse_id}`)}
            />
          </div>

          {/* <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} /> */}
          {isLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              {isSearchMode &&
                `Search results - ${numberWithCommas(searchResultCount)}`}
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(displayedUsers) ? (
                  <Table
                    data={displayedUsers}
                    columns={columns}
                    onRowClicked={handleRowClick}
                    pointerOnHover
                    isLoading={loading}
                    pageCount={displayedUsersCount / pageCount}
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
                    title="Users"
                    itemCount={displayedUsersCount}
                    menuOptions={[
                      {
                        name: "Export Users",
                        onClick: () => console.log("Export users"),
                      },
                      {
                        name: "Add New User",
                        onClick: () =>
                          navigate(`/dashboard/users/add/${warehouse_id}`),
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
                            ? "There are currently no archived users"
                            : "There are currently no users"}
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

UsersPage.propTypes = {
  handleUserSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default observer(UsersPage);
