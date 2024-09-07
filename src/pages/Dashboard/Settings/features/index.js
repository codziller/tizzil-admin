import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useParams, useLocation } from "react-router-dom";
import Tabs from "components/General/Tabs";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import ProvidersList from "pages/Dashboard/WareHouses/features/ProvidersList";
import ExchangeRate from "./ExchangeRate";
const ExchangeRatePage = () => {
  const { warehousesCount } = WareHousesStore;
  const { warehouse_id } = useParams();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get("tab");
  const [modifier, setModifier] = useState("");
  const TABS = [
    {
      name: "warehouses",
      label: `Ware Houses ${warehousesCount}`,
    },

    {
      name: "exchangeRate",
      label: "Exchange Rate",
    },
  ];
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    setModifier("Houses");
  }, []);
  useEffect(() => {
    setModifier("Houses");
    scrollToTop();
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  return (
    <>
      <div className="h-full w-full md:pr-4 md:px-4">
        <div className="flex flex-col justify-start items-center h-full w-full mt-5">
          <Tabs
            baseUrl={`/dashboard/settings/${warehouse_id}/`}
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab === "warehouses" ? <ProvidersList /> : null}
          {activeTab === "exchangeRate" ? <ExchangeRate /> : null}
        </div>
      </div>
    </>
  );
};
export default ExchangeRatePage;
