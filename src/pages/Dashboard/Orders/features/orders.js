import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import moment from "moment";
import classNames from "classnames";

import DateFilter from "components/General/DateFilter";
import Table from "components/General/Table";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import { ORDER_STATUS_OPTIONS } from "utils/appConstant";
import { ReactComponent as MoreIcon } from "assets/icons/more-table-icon.svg";
import { ReactComponent as SearchBlackIcon } from "assets/icons/search-black.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import OrdersStore from "../store";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderFilterModal from "components/General/FilterModals/OrderFilterModal";
import useWindowDimensions from "hooks/useWindowDimensions";
import { getUserInfoFromStorage } from "utils/storage";

const Orders = ({ isRecent = false, hideTitle = false }) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const {
    getOrders,
    getBrandOrdersWithFlavorCloud,
    loading,
    ordersCount,
    orders,
  } = OrdersStore;
  const { isMobile } = useWindowDimensions();

  // Get user info for brandId
  const userInfo = getUserInfoFromStorage();
  const brandId = userInfo?.brand?.id;

  // State for the new design
  const [selectedDateFilter, setSelectedDateFilter] = useState({
    label: "Today",
    value: "today",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    userId: "",
  });

  const displayOrders = orders;

  // Table configuration
  const tableMenuOptions = [
    {
      name: "Export Orders",
      onClick: () => console.log("Export orders clicked"),
    },
    {
      name: "Bulk Actions",
      onClick: () => console.log("Bulk actions clicked"),
    },
  ];

  const deliveryMethods = ["Local", "International", "Tizzil"];

  const columns = [
    {
      name: "Order Code",
      minWidth: "15%",
      selector: (order) => (
        <span className="text-[12.7px] text-[#6D7280]">{order.orderCode}</span>
      ),
      sortable: true,
    },
    {
      name: "Customers",
      minWidth: "15%",
      selector: (order) => (
        <div className="flex flex-col">
          <span className="text-[14.3px] text-[#111827] font-medium">
            {order.user?.firstName || order.guestFirstName}{" "}
            {order.user?.lastName || order.guestLastName}
          </span>
          <span className="text-[12.5px] text-[#6D7280] mt-1">
            {order.user?.phoneNumber || order.guestPhoneNumber}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Brand Name",
      minWidth: "15%",
      selector: (order) => (
        <div className="flex flex-col">
          <span className="text-[14.3px] text-[#111827] font-medium">
            {order.brand?.brandName}
          </span>
          <span className="text-[14.2px] text-[#666666] mt-1 underline cursor-pointer hover:text-[#690007]">
            Brand Order
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Total Amount",
      minWidth: "15%",
      selector: (order) => (
        <span className="text-[14.2px] text-[#666666]">
          ₦{order.totalAmount?.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Order Date",
      minWidth: "15%",
      selector: (order) => (
        <span className="text-[14.2px] text-[#666666]">
          {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Order Status",
      minWidth: "15%",
      selector: (order) => (
        <div onClick={(e) => e.stopPropagation()}>
          <TableDropdown
            className={classNames({
              "text-yellow":
                order?.orderStatus === "IN_PROGRESS" ||
                order?.orderStatus === "PROCESSING" ||
                order?.orderStatus === "DISPATCHED",
              "text-green": order?.orderStatus === "COMPLETED",
              "text-red-deep": order?.orderStatus === "CANCELLED",
            })}
            options={ORDER_STATUS_OPTIONS}
            content={order.orderStatus}
            handleClick={(option) => handleOrderStatusChange(order, option)}
            isLoading={false}
          />
        </div>
      ),
      sortable: true,
    },
    {
      name: "",
      maxWidth: "30px",
      selector: (order) => (
        <div onClick={(e) => e.stopPropagation()}>
          <MoreIcon />
        </div>
      ),
      sortable: true,
    },
  ];

  const handleSearchToggle = () => {
    if (searchExpanded) {
      setSearchQuery("");
    }
    setSearchExpanded(!searchExpanded);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterApply = (filterData) => {
    setFilters(filterData);
    setAppliedFilters(Object.values(filterData).filter(Boolean).length);
  };

  const handleOrderStatusChange = (order, newStatus) => {
    console.log("Order status change:", order.orderCode, newStatus);
    // Implement confirmation modal and status update logic
  };

  const handleRowClick = (order) => {
    navigate(`/dashboard/orders/${order.orderCode}`);
  };

  // Load orders
  const loadOrders = () => {
    // Check if user is admin
    const userData = getUserInfoFromStorage();
    const user =
      userData?.user || JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user?.userRole?.name === "ADMIN";

    if (isAdmin) {
      // Admin users use the existing getOrders method - can work without brandId
      const input = {
        pageNumber: currentPage,
        status: filters.status || undefined,
        userId: filters.userId || undefined,
      };

      // Pass brandId through filters if available
      if (brandId) {
        input.brandId = brandId;
      }

      getOrders({ input });
    } else {
      // Brand users use getBrandOrdersWithFlavorCloud - require brandId
      if (!brandId) return;

      getBrandOrdersWithFlavorCloud({
        brandId,
        pageNumber: currentPage,
        pageSize: 50,
        status: filters.status || undefined,
      });
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentPage, filters, brandId]);

  if (isRecent) {
    // Return simplified version for recent orders view
    return (
      <div className="w-full">
        <p className="font-bold text-start w-full pl-3 mt-5 mb-4">
          Recent Orders
        </p>
        <Table
          data={displayOrders.slice(0, 5)}
          columns={columns.slice(0, 4)} // Show fewer columns
          onRowClicked={handleRowClick}
          pointerOnHover
          isLoading={loading}
          tableClassName="txn-section-table"
          noPadding
          title="Recent Orders"
          itemCount={5}
          menuOptions={[
            {
              name: "View All Orders",
              onClick: () => console.log("View all orders"),
            },
            {
              name: "Export Recent",
              onClick: () => console.log("Export recent orders"),
            },
          ]}
        />

        <OrderDetailsModal
          active={!!currentTxnDetails}
          details={currentTxnDetails}
          toggler={() => setCurrentTxnDetails(null)}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-5">
        {/* Title Section */}
        {!hideTitle && (
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-[22px] font-bold text-[#111111]">Orders</h1>
              <p className="text-base text-[#666666]">
                Manage your orders and track fulfillment
              </p>
            </div>

            <div className="flex items-center gap-5">
              {/* Search Section */}
              <div className="flex items-center gap-2">
                {searchExpanded ? (
                  <div className="flex items-center gap-2 transition-all duration-300">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search orders..."
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
                      autoFocus
                    />
                    <button
                      onClick={handleSearchToggle}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12 4L4 12M4 4l8 8"
                          stroke="#111111"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    {!isMobile && (
                      <span className="text-[14px] text-[#111111]">Search</span>
                    )}
                    <button
                      onClick={handleSearchToggle}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <SearchBlackIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <DividerIcon />

              {/* Filters Section */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setFilterModalOpen(true)}
              >
                {!isMobile && (
                  <span className="text-[14px] text-[#111111]">
                    Filters {appliedFilters > 0 && `(${appliedFilters})`}
                  </span>
                )}
                <button
                  onClick={() => setFilterModalOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FilterIcon
                    className={classNames("w-4 h-4", {
                      "fill-[#690007]": appliedFilters > 0,
                      "fill-[#111111]": appliedFilters === 0,
                    })}
                  />
                </button>
              </div>

              <DividerIcon />

              {/* Date Filter (replacing Add Product button) */}
              <DateFilter
                selectedOption={selectedDateFilter}
                onOptionChange={setSelectedDateFilter}
                placeholder="Filter by date"
                className="w-auto"
              />
            </div>
          </div>
        )}

        {/* Enhanced Table */}
        <div className="mt-6">
          <Table
            data={displayOrders}
            columns={columns}
            onRowClicked={handleRowClick}
            pointerOnHover
            isLoading={loading}
            pageCount={Math.ceil(ordersCount / 20)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            tableClassName="txn-section-table"
            noPadding
            title="All Orders"
            itemCount={displayOrders.length}
            menuOptions={tableMenuOptions}
          />
        </div>
      </div>

      <OrderDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />

      <OrderFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
        users={[]} // TODO: Load users for filter
      />
    </div>
  );
};

Orders.propTypes = {
  isRecent: PropTypes.bool,
  hideTitle: PropTypes.bool,
};

export default observer(Orders);
