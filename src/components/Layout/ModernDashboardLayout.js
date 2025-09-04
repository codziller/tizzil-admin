import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { ReactComponent as CaretUp } from "assets/icons/caret-up-white.svg";
import { ReactComponent as NotificationIcon } from "assets/icons/notification-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import Loading from "components/General/CircleLoader/CircleLoader";
import Toast from "../General/Toast/Toast";
import ModernSideNav from "./Components/SideNav/ModernSideNav";
import Hamburger from "./Components/hamburger";

const ModernDashboardLayout = ({ children }) => {
  const topRef = useRef(null);
  const location = useLocation();
  const [sidenavCollapsed, setSidenavCollapsed] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const layoutLoading = false;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollTop = (event) => {
    const scrollTop = event?.target?.scrollTop || 0;
    if (scrollTop >= 150) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    topRef.current.scrollIntoView();
  };

  const toggleSidenav = () => {
    setSidenavCollapsed(!sidenavCollapsed);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    const emoji = hour < 12 ? "🌤️" : hour < 17 ? "☀️" : "🌙";
    const greeting =
      hour < 12
        ? "Good morning"
        : hour < 17
        ? "Good afternoon"
        : "Good evening";
    return { greeting, emoji };
  };

  const { greeting, emoji } = getGreeting();
  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const quickActions = [
    { label: "Add Product", action: () => console.log("Add Product") },
    { label: "Create Order", action: () => console.log("Create Order") },
    {
      label: "Manage Inventory",
      action: () => console.log("Manage Inventory"),
    },
    { label: "View Reports", action: () => console.log("View Reports") },
  ];

  return (
    <div className="w-screen flex flex-grow flex-col h-full min-h-screen bg-[#111111]">
      <Toast />

      {/* Main Layout Container - Fixed height */}
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar - Fixed position, own scroll */}
        <div className="hidden lg:block">
          <ModernSideNav
            isCollapsed={sidenavCollapsed}
            toggleSidenav={toggleSidenav}
          />
        </div>

        {/* Mobile Sidebar - Modal style with backdrop */}
        <div className="lg:hidden">
          <ModernSideNav
            isCollapsed={false}
            toggleSidenav={() => setSidenavOpen(false)}
            withBackDrop
            sidenavOpen={sidenavOpen}
            setSidenavOpen={setSidenavOpen}
          />
        </div>

        {/* Main Content Area - Separate scrolling */}
        <div className="flex-1 flex flex-col">
          {/* Header - Fixed position */}
          <header
            className={classNames(
              "!bg-[#F6F7F1] rounded-t-2xl mx-4 bg-transparent border-none px-6 py-4 flex justify-between items-center h-[80px] flex-shrink-0 z-10",
              "shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.04)] shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
            )}
          >
            {/* Left side - Hamburger (mobile) and Greeting */}
            <div className="flex items-center gap-4">
              {/* Mobile Hamburger */}
              <div className="lg:hidden">
                <Hamburger
                  click={() => setSidenavOpen(!sidenavOpen)}
                  className={sidenavOpen ? "ham_crossed" : ""}
                />
              </div>
              <span className="text-sm text-[#111111]">
                {greeting} {emoji} {timeString}
              </span>
            </div>

            {/* Right side - Notifications and Quick Actions */}
            <div className="flex items-center gap-5">
              {/* Notification Icon */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <NotificationIcon className="w-5 h-5" />
              </button>

              {/* Divider */}
              <DividerIcon className="w-[1px] h-4" />

              {/* Quick Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="flex items-center gap-2 text-sm text-primary hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <span>Quick Actions</span>
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showQuickActions ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showQuickActions && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          action.action();
                          setShowQuickActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content - Scrollable independently */}
          <main
            className={classNames(
              "flex-1 bg-[#F6F7F1] mx-4 mb-4 p-6 overflow-y-auto overflow-x-hidden"
            )}
            onScroll={handleScrollTop}
          >
            <div ref={topRef} />

            {layoutLoading ? (
              <div className="flex items-center justify-center h-full w-full">
                <Loading />
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={classNames(
          "fixed cursor-pointer h-[65.33px] flex items-center justify-center w-[65.33px] rounded-[50%] bg-primary bottom-[130px] right-[10.67px] transition-all duration-500 ease",
          {
            "z-[-9] opacity-0 ": !showScrollTop,
            "z-[200] opacity-100": showScrollTop,
          }
        )}
      >
        <CaretUp className="stroke-white" />
      </button>

      {/* Click outside to close dropdown */}
      {showQuickActions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowQuickActions(false)}
        />
      )}
    </div>
  );
};

ModernDashboardLayout.propTypes = {
  children: PropTypes.any,
};

export default ModernDashboardLayout;
