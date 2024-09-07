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

  useEffect(() => {
    getWarehouses({ data: { page: 1 } });
    getProductsCount({ data: { page: 1 } });
    userIsGeneralAdmin && getUsers({ data: { page: 1 } });
  }, []);
  useEffect(() => {
    if (warehouse) {
      setSelectedWarehouse(warehouse);
    }
  }, [warehouse]);

  useEffect(() => {
    const endDate = moment(dateFilter.end_date)
      .add(1, "day")
      .format("YYYY-MM-DD");
    if (userIsBrandStaff || brand_id) {
      getBrandHomePageStats({
        data: {
          endDate,
          id: brand_id || warehouse_id,
          startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
        },
      });
      return;
    }

    getAdminHomePageStats({
      data: {
        endDate,
        startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
        warehouseId:
          selectedWarehouse?.value === "all"
            ? ""
            : selectedWarehouse?.id || warehouse_id,
      },
    });
  }, [userIsBrandStaff, dateFilter, warehouse_id, brand_id, selectedWarehouse]);

  const searchQuery = searchInput?.trim();

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  const homepageStats =
    userIsBrandStaff || brand_id ? brandHomePageStats : adminHomePageStats;
  return (
    <>
      <div className="w-full h-full md:pr-4">
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-fit mb-3 gap-1">
            <div className="w-full sm:w-[200px]">
              <DashboardFilterDropdown
                placeholder="Filter by: "
                options={dateFilters}
                name="payout_filter"
                onClick={(e) => {
                  if (e.value === "custom") {
                    setShowDateModal(true);
                    return;
                  }
                  setDateFilter(e);
                }}
                value={dateFilter?.label}
              />
            </div>

            <div className="flex justify-start items-center w-full truncate text-base">
              {dateFilter.value === "today"
                ? moment(dateFilter.start_date).format("MMM Do, YYYY")
                : `${moment(dateFilter.start_date).format(
                    "MMM Do, YYYY"
                  )} - ${moment(dateFilter.end_date).format("MMM Do, YYYY")}`}
            </div>

            {userIsGeneralAdmin ? (
              <div className="min-w-[200px] max-w-[200px] flex justify-end">
                <DashboardFilterDropdown
                  align="items-end"
                  placeholder="Warehouse"
                  options={[
                    ...warehouses,
                    { label: "All Warehouses", value: "all" },
                  ]}
                  name="delivery_by"
                  onClick={(e) => {
                    setSelectedWarehouse(e);
                  }}
                  value={selectedWarehouse?.label}
                />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 smlg:grid-cols-4 gap-4 justify-between items-start w-full mb-2">
            <EarningCard
              icon={<OrdersIcon className="scale-[0.8]" />}
              title="Orders"
              value={homepageStats?.totalOrders}
              link={
                !userIsGeneralAdmin ? "#" : `/dashboard/orders/${warehouse_id}`
              }
              isLoading={statLoading}
            />
            {userIsGeneralAdmin && !brand_id && (
              <EarningCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Income"
                value={homepageStats?.totalRevenue}
                link={
                  !userIsGeneralAdmin
                    ? "#"
                    : `/dashboard/orders/${warehouse_id}`
                }
                isLoading={statLoading}
                isAmount
              />
            )}

            <EarningCard
              icon={<IncomeIcon className="scale-[0.8]" />}
              title="Gross Revenue"
              value={homepageStats?.totalGrossRevenue}
              link={
                !userIsGeneralAdmin ? "#" : `/dashboard/orders/${warehouse_id}`
              }
              isLoading={statLoading}
              isAmount
            />
            {userIsGeneralAdmin && !brand_id && (
              <EarningCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Average Order Value"
                value={homepageStats?.averageOrderValue}
                link={
                  !userIsGeneralAdmin
                    ? "#"
                    : `/dashboard/orders/${warehouse_id}`
                }
                isLoading={statLoading}
                isAmount
              />
            )}

            {userIsGeneralAdmin && !brand_id && (
              <EarningCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Delivery Revenue"
                value={homepageStats?.totalDeliveryRevenue}
                link={
                  !userIsGeneralAdmin
                    ? "#"
                    : `/dashboard/orders/${warehouse_id}`
                }
                isLoading={statLoading}
                isAmount
              />
            )}
            <EarningCard
              icon={<ProductsIcon className="scale-[0.8]" />}
              title="Total Products Created"
              value={numberWithCommas(homepageStats?.totalProducts)}
              link={
                !userIsGeneralAdmin
                  ? "#"
                  : `/dashboard/products/${warehouse_id}`
              }
              isLoading={statLoading}
            />
            {userIsGeneralAdmin && !brand_id && (
              <EarningCard
                icon={<CustomersIcon className="scale-[0.8]" />}
                title="Total number of New Users"
                value={numberWithCommas(homepageStats?.totalUsers)}
                link={
                  !userIsGeneralAdmin ? "#" : `/dashboard/users/${warehouse_id}`
                }
                isLoading={statLoading}
              />
            )}

            {userIsGeneralAdmin && !brand_id && (
              <EarningCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Total Cost Price Sold"
                value={homepageStats?.totalCostPriceSold}
                link={
                  !userIsGeneralAdmin
                    ? "#"
                    : `/dashboard/orders/${warehouse_id}`
                }
                isLoading={statLoading}
                isAmount
              />
            )}
            {userIsGeneralAdmin && !brand_id && (
              <EarningCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Number of Products Sold"
                value={homepageStats?.totalQuantitySold}
                link={
                  !userIsGeneralAdmin
                    ? "#"
                    : `/dashboard/orders/${warehouse_id}`
                }
                isLoading={statLoading}
                isAmount={false}
              />
            )}
            {userIsGeneralAdmin && !brand_id && (
              <EarningCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Total Amount Donated"
                value={homepageStats?.totalDonatedAmount}
                link={
                  !userIsGeneralAdmin
                    ? "#"
                    : `/dashboard/orders/${warehouse_id}`
                }
                isLoading={statLoading}
                isAmount
              />
            )}
            {userIsGeneralAdmin && !brand_id && (
              <EarningCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Total Number of Users that have donated"
                value={homepageStats?.totalUniqueDonors}
                link={
                  !userIsGeneralAdmin
                    ? "#"
                    : `/dashboard/orders/${warehouse_id}`
                }
                isLoading={statLoading}
                isAmount={false}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-start gap-4 w-full mb-2">
            {userIsGeneralAdmin && !brand_id && (
              <EarningPieCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Total Revenue by Order Source"
                data={homepageStats?.revenueByOrderSource ?? []}
                dataKey="total_revenue"
                nameKey="order_source"
                link={"#"}
                isLoading={statLoading}
              />
            )}
            {userIsGeneralAdmin && !brand_id && (
              <EarningPieCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Total Revenue by Payment Method"
                data={homepageStats?.revenueByPaymentMethod ?? []}
                dataKey="total_revenue"
                nameKey="payment_method"
                link={"#"}
                isLoading={statLoading}
              />
            )}
            {userIsGeneralAdmin && !brand_id && (
              <EarningPieCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Number of orders by Payment Method"
                data={homepageStats?.orderCountByPaymentMethod ?? []}
                dataKey="count"
                nameKey="payment_method"
                link={"#"}
                isLoading={statLoading}
                isQuantity
              />
            )}
            {userIsGeneralAdmin && !brand_id && (
              <EarningPieCard
                icon={<IncomeIcon className="scale-[0.8]" />}
                title="Delivery revenue per Logistics Handler"
                data={homepageStats?.totalDeliveryRevenueByHandler ?? []}
                dataKey="total_delivery_revenue"
                nameKey="delivery_handler"
                link={"#"}
                isLoading={statLoading}
              />
            )}
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-between items-start w-full mb-2">
            <EarningValueCard />

            <TransactionValueCard />
          </div> */}

          {!brand_id ? (
            <div className="w-full flex flex-col bg-white p-6 min-h-[500px]">
              {userIsGeneralAdmin ? (
                <OrdersPage isRecent />
              ) : (
                <ViewBrand isBrandStaff />
              )}
            </div>
          ) : null}
        </div>
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        transaction={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />

      <DateRangeModal
        active={showDateModal}
        defaultDate={{
          startDate: new Date(dateFilter.start_date),
          endDate: new Date(dateFilter.end_date),
          key: "selection",
        }}
        onApply={(date) =>
          setDateFilter({
            value: `${moment(date?.startDate).format("DD MMM")} - ${moment(
              date?.endDate
            ).format("DD MMM")}`,
            label: `${moment(date?.startDate).format("DD MMM")} - ${moment(
              date?.endDate
            ).format("DD MMM")}`,
            start_date: date?.startDate,
            end_date: date?.endDate,
          })
        }
        toggler={() => setShowDateModal(false)}
      />
    </>
  );
};

export default observer(HomePage);
