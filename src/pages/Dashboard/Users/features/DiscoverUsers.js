import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import SearchBar from "components/General/Searchbar/SearchBar";
import UserCard from "components/General/Cards/UserCard";
import useWindowDimensions from "hooks/useWindowDimensions";

const DiscoverUsers = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { isMobile } = useWindowDimensions();

  // Sample users data
  const sampleUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      description: "Fashion enthusiast and style blogger",
      location: "Lagos, Nigeria",
      status: "PENDING",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
      description: "Influencer specializing in lifestyle and beauty content",
      location: "Abuja, Nigeria",
      status: "PENDING",
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
      description: "Tech reviewer and gadget expert",
      location: "Port Harcourt, Nigeria",
      status: "PENDING",
    },
    {
      id: 4,
      firstName: "Sarah",
      lastName: "Wilson",
      profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
      description: "Travel blogger and adventure seeker",
      location: "Ibadan, Nigeria",
      status: "PENDING",
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Brown",
      profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
      description: "Fitness trainer and wellness coach",
      location: "Kano, Nigeria",
      status: "PENDING",
    },
    {
      id: 6,
      firstName: "Emily",
      lastName: "Davis",
      profileImage: "https://randomuser.me/api/portraits/women/6.jpg",
      description: "Food blogger and culinary expert",
      location: "Enugu, Nigeria",
      status: "PENDING",
    },
  ];

  // Filter users based on search input
  const searchQuery = useMemo(() => {
    return searchInput?.trim();
  }, [searchInput]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(sampleUsers);
      return;
    }
    const searchResult = sampleUsers.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(searchResult);
  }, [searchQuery]);

  const handleApprove = (user) => {
    console.log("Approve user:", user);
    // Here you would typically make an API call to approve the user
    // For now, we'll just log it
  };

  const handleReject = (user) => {
    console.log("Reject user:", user);
    // Here you would typically make an API call to reject the user
    // For now, we'll just log it
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-[22px] font-bold text-[#111111]">
            Discover Users
          </h1>

          <div className="w-full lg:w-auto">
            <SearchBar
              placeholder="Search users..."
              onChange={setSearchInput}
              value={searchInput}
              className="w-full lg:w-[300px]"
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="w-full">
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <SearchIcon className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchQuery
                  ? `No users match "${searchQuery}". Try adjusting your search criteria.`
                  : "There are no users to discover at the moment."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

DiscoverUsers.propTypes = {};

export default observer(DiscoverUsers);
