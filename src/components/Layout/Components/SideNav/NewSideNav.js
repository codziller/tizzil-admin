import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdClear, MdMoreVert } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { 
  BsDashboard,
  BsBox,
  BsPeople,
  BsShop,
  BsWallet,
  BsGear,
  BsClipboardData,
  BsStar,
  BsCreditCard2Back
} from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { ReactComponent as TizziLogo } from "assets/logos/logo.svg";
import { ReactComponent as CollapseIcon } from "assets/icons/collapse-icon.svg";
import { ReactComponent as SearchIcon } from "assets/icons/search-normal.svg";
import { ReactComponent as SearchCommandIcon } from "assets/icons/search-command-icon.svg";
import avatarSample from "assets/images/avatar-sample.png";

const NewSideNav = ({ isCollapsed, toggleSidenav }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Get user data from localStorage (mock data for now)
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    userRole: { name: "ADMIN" }, // or "BRAND"
    profilePhoto: null,
    brand: {
      logoUrl: null
    }
  };

  const isAdmin = user?.userRole?.name === "ADMIN";

  // Navigation items for brands
  const brandNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BsDashboard,
      path: "/dashboard/home"
    },
    {
      id: "products",
      label: "Products",
      icon: BsBox,
      path: "/dashboard/products",
      subItems: [
        { label: "All Products", path: "/dashboard/products" },
        { label: "Categories", path: "/dashboard/categories" },
        { label: "Collections", path: "/dashboard/collections" }
      ]
    },
    {
      id: "orders",
      label: "Orders",
      icon: BsClipboardData,
      path: "/dashboard/orders"
    },
    {
      id: "customers",
      label: "Customers",
      icon: BsPeople,
      path: "/dashboard/customers"
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: BsWallet,
      path: "/dashboard/wallet"
    },
    {
      id: "settings",
      label: "Settings",
      icon: BsGear,
      path: "/dashboard/settings"
    }
  ];

  // Navigation items for admin
  const adminNavItems = [
    {
      id: "dashboard-overview",
      label: "Dashboard Overview",
      icon: BsDashboard,
      path: "/dashboard/home"
    },
    {
      id: "orders",
      label: "Orders",
      icon: BsClipboardData,
      path: "/dashboard/orders"
    },
    {
      id: "brands",
      label: "Brands",
      icon: BsShop,
      path: "/dashboard/brands"
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: BsStar,
      path: "/dashboard/reviews"
    },
    {
      id: "discover-users",
      label: "Discover Users",
      icon: BsPeople,
      path: "/dashboard/users"
    },
    {
      id: "payout",
      label: "Payout",
      icon: BsCreditCard2Back,
      path: "/dashboard/payout"
    },
    {
      id: "user-management",
      label: "User Management",
      icon: BsGear,
      path: "/dashboard/user-management"
    }
  ];

  const navItems = isAdmin ? adminNavItems : brandNavItems;

  // Filter navigation items based on search
  const filteredNavItems = useMemo(() => {
    if (!searchTerm) return navItems;
    
    return navItems.filter(item => {
      const matchesLabel = item.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubItems = item.subItems?.some(subItem => 
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
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <div className="h-full bg-[#444444] text-[#FBF0DC] flex flex-col">
      {/* Header with Logo and Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <TizziLogo className="w-[91px] h-[24px]" />
          <button
            onClick={toggleSidenav}
            className="p-1 hover:bg-gray-600 rounded transition-colors"
          >
            <CollapseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4">
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

      {/* Navigation Items */}
      <div className="flex-1 px-4 pb-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.has(item.id);
          const isItemActive = isActive(item.path);

          return (
            <div key={item.id} className="mb-1">
              {hasSubItems ? (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isItemActive
                      ? 'bg-[#FBF0DC] text-primary shadow-sm'
                      : 'hover:bg-gray-600 text-[#FBF0DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-[18px] h-[18px]" />
                    <span>{item.label}</span>
                  </div>
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isItemActive
                      ? 'bg-[#FBF0DC] text-primary shadow-sm'
                      : 'hover:bg-gray-600 text-[#FBF0DC]'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
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
                          ? 'bg-[#FBF0DC] text-primary shadow-sm'
                          : 'hover:bg-gray-600 text-[#FBF0DC]'
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
      <div className="p-4 border-t border-gray-600">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user.brand?.logoUrl || user.profilePhoto || avatarSample}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-[#FBF0DC] opacity-64 truncate">
              {user.email}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="p-2 rounded-full hover:bg-gray-600 transition-colors"
            >
              <MdMoreVert className="w-4 h-4 text-white" />
            </button>
            
            {/* User Dropdown */}
            {showUserDropdown && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
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
  );
};

export default NewSideNav;