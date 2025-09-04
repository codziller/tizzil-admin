import React, { useState } from "react";
import Button from "components/General/Button/Button";
import Toggle from "components/General/Toggle";

const NotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    newOrderAlerts: "email", // none, inapp, email
    lowStockWarnings: "inapp",
    collectionFeatured: "email",
    productPublished: "inapp",
    messageFromTeam: "email",
    systemNotifications: "inapp",
  });

  const notificationTypes = [
    {
      key: "newOrderAlerts",
      title: "New Order Alerts",
      subtitle: "Get notified instantly when someone buys from your store.",
    },
    {
      key: "lowStockWarnings",
      title: "Low Stock Warnings",
      subtitle: "Know when any product variant is running low.",
    },
    {
      key: "collectionFeatured",
      title: "Collection Featured by TIZZIL",
      subtitle:
        "Be alerted if your product or collection gets editorial placement.",
    },
    {
      key: "productPublished",
      title: "Product Published Confirmation",
      subtitle: "Get a heads-up once a product goes live.",
    },
    {
      key: "messageFromTeam",
      title: "Message from TIZZIL Team",
      subtitle:
        "Get notified when the platform team reaches out (collab, feedback, support).",
    },
    {
      key: "systemNotifications",
      title: "System Notifications",
      subtitle: "platform",
    },
  ];

  const handleNotificationChange = (key, type) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: type,
    }));
  };

  const handleSave = () => {
    console.log("Saving notification settings:", notificationSettings);
    // Handle save logic here
  };

  const handleCancel = () => {
    console.log("Cancelling notification changes");
    // Handle cancel logic here - could reset to original values
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-10">
        <h2
          style={{
            fontSize: "17px",
            fontWeight: "bold",
            color: "#050505",
            marginBottom: "6px",
          }}
        >
          Notifications
        </h2>
        <p style={{ fontSize: "14px", color: "#666666" }}>
          Please enter your current password to change your password.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: "40px" }}>
        {/* Notification Rows */}
        <div className="space-y-6 mb-9">
          {notificationTypes.map((notification, index) => (
            <div
              key={notification.key}
              className="flex flex-col md:flex-row md:items-start md:justify-between py-4 border-b border-gray-100 last:border-b-0"
            >
              {/* Left Column - Title and Subtitle */}
              <div className="flex-1 mb-4 md:mb-0 md:mr-8">
                <div
                  style={{
                    fontSize: "14px",
                    color: "#111111",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  {notification.title}
                </div>
                <div style={{ fontSize: "14px", color: "#666666" }}>
                  {notification.subtitle}
                </div>
              </div>

              {/* Right Column - Toggle Options */}
              <div className="flex flex-row gap-4 md:min-w-[200px]">
                <Toggle
                  label="None"
                  isOn={notificationSettings[notification.key] === "none"}
                  onToggle={() =>
                    handleNotificationChange(notification.key, "none")
                  }
                />
                <Toggle
                  label="In-app"
                  isOn={notificationSettings[notification.key] === "inapp"}
                  onToggle={() =>
                    handleNotificationChange(notification.key, "inapp")
                  }
                />
                <Toggle
                  label="Email"
                  isOn={notificationSettings[notification.key] === "email"}
                  onToggle={() =>
                    handleNotificationChange(notification.key, "email")
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 justify-end">
          <Button
            text="Cancel"
            isOutline
            onClick={handleCancel}
            textClass="text-sm font-medium"
            className="px-6 py-2"
          />
          <Button
            text="Save"
            onClick={handleSave}
            textClass="text-sm font-medium"
            className="px-6 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
