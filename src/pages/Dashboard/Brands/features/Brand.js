import React, { useState } from "react";
import classNames from "classnames";
import Tabs from "components/General/Tabs";
import HomePage from "pages/Dashboard/Home/features";
import ViewBrand from "./ViewBrand";

const BrandDetails = ({}) => {
  const TABS = [
    { name: "salesData", label: `Sales data history` },
    {
      name: "overview",
      label: `Brand Overview`,
    },
  ];
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const isOverview = activeTab === "overview";

  return (
    <>
      <div className={classNames("h-full w-full")}>
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

          {isOverview ? <HomePage /> : <ViewBrand />}
        </div>
      </div>
    </>
  );
};

export default BrandDetails;
