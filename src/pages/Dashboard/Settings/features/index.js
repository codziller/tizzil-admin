import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useParams, useLocation } from "react-router-dom";
import Tabs from "components/General/Tabs";
import BreadCrumbs from "components/General/BreadCrumbs";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import DeliverySettings from "./DeliverySettings";
import ReturnPolicySettings from "./ReturnPolicySettings";
import NotificationSettings from "./NotificationSettings";

import ProfileIcon from "assets/icons/settings-icons/profile-icon.svg";
import SecurityIcon from "assets/icons/settings-icons/security-icon.svg";
import DeliveryIcon from "assets/icons/settings-icons/delivery-icon.svg";
import ReturnIcon from "assets/icons/settings-icons/return-icon.svg";
import NotificationIcon from "assets/icons/settings-icons/notification-icon.svg";

const SettingsPage = () => {
  const { warehouse_id } = useParams();
  const location = useLocation();
  const currentTab =
    new URLSearchParams(location.search).get("tab") || "Profile";

  const TABS = [
    {
      name: "Profile",
      label: "Profile",
      icon: ProfileIcon,
    },
    {
      name: "Security",
      label: "Security",
      icon: SecurityIcon,
    },
    {
      name: "Delivery",
      label: "Delivery",
      icon: DeliveryIcon,
    },
    {
      name: "Return Policy",
      label: "Return Policy",
      icon: ReturnIcon,
    },
    {
      name: "Notifications",
      label: "Notifications",
      icon: NotificationIcon,
    },
  ];

  const [activeTab, setActiveTab] = useState(currentTab);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToTop();
  }, [activeTab]);

  useEffect(() => {
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [currentTab]);

  const breadcrumbLinks = [
    { name: "Settings", link: "/dashboard/settings" },
    { name: activeTab, link: null },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfileSettings />;
      case "Security":
        return <SecuritySettings />;
      case "Delivery":
        return <DeliverySettings />;
      case "Return Policy":
        return <ReturnPolicySettings />;
      case "Notifications":
        return <NotificationSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <>
      <div className="h-full w-full md:pr-4 md:px-4">
        <div className="flex flex-col justify-start items-start h-full w-full">
          {/* BreadCrumbs */}
          <BreadCrumbs links={breadcrumbLinks} />

          {/* Title */}
          <div style={{ marginTop: "20px" }}>
            <h1
              style={{ fontSize: "28px", fontWeight: "bold", color: "#111111" }}
            >
              Profile
            </h1>
          </div>

          {/* Main Content */}
          <div
            className="flex flex-col lg:flex-row w-full"
            style={{ marginTop: "28px" }}
          >
            {/* Left Section - Menu */}
            <div className="w-full lg:w-[200px] lg:pr-[10px] mb-6 lg:mb-0">
              <div
                style={{
                  fontSize: "12px",
                  color: "#AAAAAA",
                  marginBottom: "24px",
                }}
              >
                Menu
              </div>
              <Tabs
                tabs={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                orientation="column"
              />
            </div>

            {/* Right Section - Content */}
            <div className="flex-1" style={{ marginLeft: "36px" }}>
              {renderActiveTabContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SettingsPage;
