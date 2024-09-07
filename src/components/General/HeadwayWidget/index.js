import React, { useEffect } from "react";
import { ReactComponent as Notification } from "assets/icons/Notification/Notification.svg";

export default function HeadwayWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://cdn.headwayapp.co/widget.js";
    document.head.appendChild(script);
    const HW_config = {
      selector: ".app-update-badge",
      account: "xWa0oJ",
    };
    script.onload = function () {
      window.Headway.init(HW_config);
    };
  }, []);
  return (
    <div className="h-8 w-20 hidden md:block !my-0 app-update-badge">
      <Notification className="w-full h-full" />
    </div>
  );
}
