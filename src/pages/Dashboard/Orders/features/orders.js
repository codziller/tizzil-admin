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
import OrdersStore from "../store";
import OrderDetailsModal from "./OrderDetailsModal";
import SearchBar from "components/General/Searchbar/SearchBar";

const Orders = ({ isRecent = false }) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const { getOrders, loading, ordersCount, orders } = OrdersStore;

  // State for the new design
  const [selectedDateFilter, setSelectedDateFilter] = useState({
    label: "Today",
    value: "today",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  // Sample orders data - replace with actual API data
  const sampleOrders = [
    {
      id: 1,
      orderCode: "ORD-2024-001",
      calculatedOrder: {
        user: {
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "+1234567890",
        },
        totalAmount: 15000,
      },
      calculatedOrderProducts: [
        {
          product: {
            brand: {
              brandName: "Nike",
            },
          },
          user: {
            firstName: "Nike",
            lastName: "Store",
          },
        },
      ],
      updatedAt: new Date(),
      orderStatus: "PENDING",
      deliveryMethod: "Local",
    },
    {
      id: 2,
      orderCode: "ORD-2024-002",
      calculatedOrder: {
        user: {
          firstName: "Jane",
          lastName: "Smith",
          phoneNumber: "+0987654321",
        },
        totalAmount: 25000,
      },
      calculatedOrderProducts: [
        {
          product: {
            brand: {
              brandName: "Adidas",
            },
          },
          user: {
            firstName: "Adidas",
            lastName: "Official",
          },
        },
      ],
      updatedAt: new Date(),
      orderStatus: "COMPLETED",
      deliveryMethod: "International",
    },
  ];

  const displayOrders = orders.length > 0 ? orders : sampleOrders;

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
      name: "Order ID",
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
            {order.calculatedOrder?.user?.firstName}{" "}
            {order.calculatedOrder?.user?.lastName}
          </span>
          <span className="text-[12.5px] text-[#6D7280] mt-1">
            {order.calculatedOrder?.user?.phoneNumber}
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
            {order.calculatedOrderProducts?.[0]?.user?.firstName}{" "}
            {order.calculatedOrderProducts?.[0]?.user?.lastName}
          </span>
          <span className="text-[14.2px] text-[#666666] mt-1 underline cursor-pointer hover:text-[#690007]">
            {order.calculatedOrderProducts?.[0]?.product?.brand?.brandName}
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
          ₦{order.calculatedOrder?.totalAmount?.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Order Date",
      minWidth: "15%",
      selector: (order) => (
        <span className="text-[14.2px] text-[#666666]">
          {moment(order.updatedAt).format("DD/MM/YYYY HH:mm")}
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
                order?.orderStatus === "PENDING" ||
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

  const handleDeliveryMethodFilter = (method) => {
    console.log("Filter by delivery method:", method);
    // Implement delivery method filtering logic here
  };

  const handleOrderStatusChange = (order, newStatus) => {
    console.log("Order status change:", order.orderCode, newStatus);
    // Implement confirmation modal and status update logic
  };

  const handleRowClick = (order) => {
    // Navigate to order details page or open order details
    navigate(`/dashboard/orders/${order.id}`);
    // setCurrentTxnDetails({
    //   ...order,
    //   modalType: "details",
    //   isSideModal: true,
    // });
  };

  useEffect(() => {
    // Fetch orders on component mount and when filters change
    if (warehouse_id) {
      getOrders({
        data: {
          page: currentPage,
          warehouseId: warehouse_id,
        },
      });
    }
  }, [currentPage, selectedDateFilter, warehouse_id]);

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
        <div className="flex items-center justify-between w-full gap-4">
          <h1 className="text-[22px] font-bold text-[#111111]">Orders</h1>

          <div className="flex items-center justify-between gap-4">
            <SearchBar
              placeholder={"Search orders"}
              onChange={setSearchInput}
              value={searchInput}
              className="flex !w-[250px]"
            />
            <DateFilter
              selectedOption={selectedDateFilter}
              onOptionChange={setSelectedDateFilter}
              placeholder="Filter by date"
              className="w-auto"
            />
          </div>
        </div>

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
    </div>
  );
};

Orders.propTypes = {
  isRecent: PropTypes.bool,
};

export default observer(Orders);
