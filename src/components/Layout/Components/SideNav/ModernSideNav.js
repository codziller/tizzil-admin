import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { MdClear, MdMoreVert } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { ReactComponent as DashboardIcon } from "assets/icons/new-dashboard-icons/dashboard-icon.svg";
import { ReactComponent as ProductsIcon } from "assets/icons/new-dashboard-icons/products-icon.svg";
import { ReactComponent as OrdersIcon } from "assets/icons/new-dashboard-icons/orders-icon.svg";
import { ReactComponent as CustomersIcon } from "assets/icons/new-dashboard-icons/customers-icon.svg";
import { ReactComponent as WalletIcon } from "assets/icons/new-dashboard-icons/wallets-icon.svg";
import { ReactComponent as SettingsIcon } from "assets/icons/new-dashboard-icons/settings-icon.svg";
import { ReactComponent as BrandsIcon } from "assets/icons/new-dashboard-icons/brands-icon.svg";
import { ReactComponent as ReviewsIcon } from "assets/icons/new-dashboard-icons/reviews-icon.svg";
import { ReactComponent as DiscoverUsersIcon } from "assets/icons/new-dashboard-icons/discover-users-icon.svg";
import { ReactComponent as PayoutIcon } from "assets/icons/new-dashboard-icons/payout-icon.svg";
import { ReactComponent as UserManagementIcon } from "assets/icons/new-dashboard-icons/user-management-icon.svg";

import { FiChevronDown } from "react-icons/fi";
import { ReactComponent as TizziLogo } from "assets/logos/logo.svg";
import { ReactComponent as CollapseIcon } from "assets/icons/collapse-icon.svg";
import { ReactComponent as SearchIcon } from "assets/icons/search-normal.svg";
import { ReactComponent as SearchCommandIcon } from "assets/icons/search-command-icon.svg";
import avatarSample from "assets/images/avatar-sample.png";
import { getUserInfoFromStorage } from "utils/storage";
import BackDrop from "components/Layout/BackDrop";

const ModernSideNav = ({
  isCollapsed,
  toggleSidenav,
  withBackDrop,
  sidenavOpen,
  setSidenavOpen,
}) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Get user data from localStorage
  const userData = getUserInfoFromStorage();
  const user =
    userData?.user || JSON.parse(localStorage.getItem("user") || "{}");
  const brand =
    userData?.brand || JSON.parse(localStorage.getItem("brand") || "{}");

  const isAdmin = user?.userRole?.name === "ADMIN";

  // Navigation items for brands
  const brandNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      path: "/dashboard/home",
    },
    {
      id: "products",
      label: "Products",
      icon: ProductsIcon,
      path: "/dashboard/products",
      subItems: [
        { label: "All Products", path: "/dashboard/products/all" },
        { label: "Categories", path: "/dashboard/products/categories" },
        { label: "Collections", path: "/dashboard/products/collections" },
      ],
    },
    {
      id: "orders",
      label: "Orders",
      icon: OrdersIcon,
      path: "/dashboard/orders",
    },
    {
      id: "customers",
      label: "Customers",
      icon: CustomersIcon,
      path: "/dashboard/customers",
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: WalletIcon,
      path: "/dashboard/wallet",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: ReviewsIcon,
      path: "/dashboard/reviews",
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      path: "/dashboard/settings",
    },
  ];

  // Navigation items for admin
  const adminNavItems = [
    {
      id: "dashboard-overview",
      label: "Dashboard Overview",
      icon: DashboardIcon,
      path: "/dashboard/home",
    },
    {
      id: "orders",
      label: "Orders",
      icon: OrdersIcon,
      path: "/dashboard/orders",
    },
    {
      id: "brands",
      label: "Brands",
      icon: BrandsIcon,
      path: "/dashboard/brands",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: ReviewsIcon,
      path: "/dashboard/reviews",
    },
    {
      id: "discover-users",
      label: "Discover Users",
      icon: DiscoverUsersIcon,
      path: "/dashboard/users",
    },
    {
      id: "payout",
      label: "Payout",
      icon: PayoutIcon,
      path: "/dashboard/payout",
    },
    {
      id: "user-management",
      label: "User Management",
      icon: UserManagementIcon,
      path: "/dashboard/user-management",
    },
  ];

  const navItems = isAdmin ? adminNavItems : brandNavItems;

  // Filter navigation items based on search
  const filteredNavItems = useMemo(() => {
    if (!searchTerm) return navItems;

    return navItems.filter((item) => {
      const matchesLabel = item.label
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSubItems = item.subItems?.some((subItem) =>
        subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesLabel || matchesSubItems;
    });
  }, [navItems, searchTerm]);

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isMainItemActive = (item) => {
    // If the item has sub items, check if any sub item is active
    if (item.subItems && item.subItems.length > 0) {
      const isSubItemActive = item.subItems.some((subItem) =>
        isActive(subItem.path)
      );
      // If a sub item is active, don't apply active style to main item
      if (isSubItemActive) {
        return false;
      }
    }
    // Apply active style to main item only if it's active and no sub items are active
    return isActive(item.path);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  if (isCollapsed) {
    return (
      <div className="w-16 h-screen bg-[#111111] text-[#FBF0DC] flex flex-col items-center py-4 overflow-y-auto overflow-x-hidden">
        <button
          onClick={toggleSidenav}
          className="p-2 hover:bg-gray-600 rounded mb-4"
        >
          <CollapseIcon className="w-5 h-5" />
        </button>
        {/* Collapsed nav items */}
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`p-3 rounded-lg mb-2 transition-colors ${
                isActive(item.path)
                  ? "bg-[#FBF0DC] text-primary sidenav-active"
                  : "hover:bg-gray-600"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {withBackDrop && (
        <BackDrop
          active={sidenavOpen}
          onClick={() => setSidenavOpen(!sidenavOpen)}
          className="z-[9996]"
        />
      )}
      <div
        className={classNames(
          "w-[210px] h-screen bg-[#111111] text-[#FBF0DC] flex flex-col overflow-hidden transition-transform duration-150 ease-in-out",
          {
            "translate-x-0": sidenavOpen || !withBackDrop,
            "-translate-x-64": !sidenavOpen && withBackDrop,
            "fixed z-[9997]": withBackDrop,
          }
        )}
      >
        {/* Header with Logo and Collapse Button */}
        <div className="flex items-center justify-between p-4">
          <TizziLogo className="w-[91px] h-[24px]" />
          <button
            onClick={toggleSidenav}
            className="p-1 hover:bg-gray-600 rounded transition-colors"
          >
            <CollapseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 pb-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#444444] border border-gray-600 rounded-lg pl-10 pr-10 py-2 text-sm placeholder-[#FBF0DC] focus:outline-none focus:border-primary"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-[#FBF0DC] hover:text-white"
                >
                  <MdClear className="w-4 h-4" />
                </button>
              ) : (
                <SearchCommandIcon className="w-8 h-4" />
              )}
            </div>
          </div>
        </div>

        {/* Navigation Items - Scrollable */}
        <div className="flex-1 px-3 overflow-y-auto overflow-x-hidden">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems.has(item.id);
            const isItemActive = isMainItemActive(item);

            return (
              <div key={item.id} className="mb-1">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isItemActive
                        ? "bg-[#FBF0DC] sidenav-active text-primary shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06)]"
                        : "text-[#FBF0DC] hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-[18px] h-[18px] ${
                          isItemActive ? "text-primary" : "text-[#FBF0DC]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isItemActive
                        ? "bg-[#FBF0DC] sidenav-active text-primary shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06)]"
                        : "text-[#FBF0DC] hover:bg-gray-600"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] ${
                        isItemActive ? "text-primary" : "text-[#FBF0DC]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                )}

                {/* Sub Items */}
                {hasSubItems && isExpanded && (
                  <div className="mt-1 ml-6">
                    {item.subItems.map((subItem, index) => (
                      <Link
                        key={index}
                        to={subItem.path}
                        className={`block py-2.5 px-3 text-sm rounded-lg transition-colors ${
                          isActive(subItem.path)
                            ? "bg-[#FBF0DC] text-primary shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06)]"
                            : "text-[#FBF0DC] hover:bg-gray-600"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Details Section */}
        <div className="p-4 border-t border-gray-600 mb-10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={brand?.logoUrl || user?.profilePhoto || avatarSample}
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-white opacity-64 truncate">
                {user?.email}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="p-2 rounded-full hover:bg-gray-600 hover:bg-opacity-50 transition-colors"
              >
                <MdMoreVert className="w-4 h-4 text-white" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <BiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ModernSideNav.propTypes = {
  isCollapsed: PropTypes.bool,
  toggleSidenav: PropTypes.func,
  withBackDrop: PropTypes.bool,
  sidenavOpen: PropTypes.bool,
  setSidenavOpen: PropTypes.func,
};

export default ModernSideNav;
