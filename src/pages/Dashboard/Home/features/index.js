import React, { useEffect, useState } from "react";

import moment from "moment";
import _, { isEmpty } from "lodash";

import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";

import { ReactComponent as OrdersIcon } from "assets/icons/orders-icon.svg";
import { ReactComponent as IncomeIcon } from "assets/icons/income-icon.svg";
import { ReactComponent as ProductsIcon } from "assets/icons/products-icon.svg";
import { ReactComponent as CustomersIcon } from "assets/icons/customers-icon.svg";
import OrdersPage from "pages/Dashboard/Orders/features";
import ProductsStore from "pages/Dashboard/Products/store";
import UsersStore from "pages/Dashboard/Users/store";
import EarningCard from "./EarningCard";
import TransactionDetailsModal from "./OrderDetailsModal";
import dateConstants from "utils/dateConstants";
// import EarningValueCard from "./EarningValueCard";
// import TransactionValueCard from "./TransactionValueCard";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import { observer } from "mobx-react-lite";
import { numberWithCommas } from "utils/formatter";
import { useParams } from "react-router-dom";
import AuthStore from "pages/OnBoarding/SignIn/store";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import HomeStore from "../store";
import ViewBrand from "pages/Dashboard/Brands/features/ViewBrand";
import EarningPieCard from "./EarningPieCard";
import BrandDashboard from "components/Dashboard/BrandDashboard/BrandDashboard";
import { getUserInfoFromStorage } from "utils/storage";
import AdminDashboard from "components/Dashboard/AdminDashboard/AdminDashboard";

export const dateFilters = [
  {
    value: "today",
    label: "Today",
    start_date: dateConstants?.today,
    end_date: dateConstants?.today,
  },
  {
    value: "yesterday",
    label: "Yesterday",
    start_date: dateConstants?.yesterday,
    end_date: dateConstants?.yesterday,
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

  {
    value: "custom",
    label: "Custom Date",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
];
const HomePage = () => {
  const { warehouse_id, brand_id } = useParams();
  const { warehouses, warehouse, getWarehouses } = WareHousesStore;

  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);

  const [showDateModal, setShowDateModal] = useState(false);
  const [searchInput] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouse);

  const { userIsGeneralAdmin, userIsBrandStaff } = AuthStore;
  const { getProductsCount } = ProductsStore;

  const { getUsers, loading: usersLoading } = UsersStore;
  const {
    getBrandHomePageStats,
    getAdminHomePageStats,
    adminHomePageStats,
    brandHomePageStats,
    loading: statLoading,
  } = HomeStore;

  const searchQuery = searchInput?.trim();

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  const userData = getUserInfoFromStorage();
  const user =
    userData?.user || JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.userRole?.name === "ADMIN";

  return (
    <>
      <div className="w-full h-full md:pr-4">
        {isAdmin ? <AdminDashboard /> : <BrandDashboard />}
      </div>
    </>
  );
};

export default observer(HomePage);
