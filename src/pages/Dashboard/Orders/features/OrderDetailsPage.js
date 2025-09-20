import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import moment from "moment";
import classNames from "classnames";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiChevronRight,
  FiMapPin,
} from "react-icons/fi";

import BreadCrumbs from "components/General/BreadCrumbs";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import GoogleMap from "components/General/GoogleMap";
import OrderHistoryModal from "components/General/OrderHistoryModal";
import { ORDER_STATUS_OPTIONS } from "utils/appConstant";
import { ReactComponent as Warning2Icon } from "assets/icons/warning-2.svg";
import { ReactComponent as LocationIcon } from "assets/icons/location-icon.svg";
import { ReactComponent as OrderHistoryIcon } from "assets/icons/order-history-icon.svg";
import OrdersStore from "../store";

const OrderDetailsPage = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const { getOrder, order, getOrderLoading } = OrdersStore;

  const [showStatusChangeConfirmation, setShowStatusChangeConfirmation] =
    useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);

  // Sample order data for development
  const sampleOrder = {
    id: orderCode,
    orderCode: "ORD-2024-001",
    orderStatus: "PENDING",
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phoneNumber: "+1234567890",
    },
    totalAmount: 45000,
    deliveryFee: 3000,
    calculatedOrder: {
      user: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
      },
      totalAmount: 45000,
      serviceCharge: 2000,
      deliveryFee: 3000,
      address: {
        addressText: "123 Main Street, Lagos, Nigeria",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
      },
      calculatedOrderProducts: [
        {
          id: 1,
          product: {
            name: "Nike Air Max 270",
            imageUrls: ["https://via.placeholder.com/70x70"],
          },
          productVariant: {
            variantName: "US 9",
          },
          quantity: 2,
          salePrice: 20000,
        },
        {
          id: 2,
          product: {
            name: "Adidas Ultra Boost",
            imageUrls: ["https://via.placeholder.com/70x70"],
          },
          productVariant: {
            variantName: "Black",
          },
          quantity: 1,
          salePrice: 25000,
        },
      ],
    },
    brand: {
      brandName: "Nike",
    },
  };

  const displayOrder = order || sampleOrder;

  // Sample order history data for the user
  const sampleOrderHistory = [
    {
      order: {
        id: 1,
        orderCode: "ORD-2024-001",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        deliveredAt: new Date("2024-01-18"),
        deliveryStatus: "Delivered",
        calculatedOrder: {
          topshipShipmentRate: { mode: "Express Delivery" },
        },
      },
      orderProduct: {
        id: 1,
        product: {
          id: "prod-001",
          name: "Nike Air Max 270",
          imageUrls: ["https://via.placeholder.com/56x56"],
          brand: { brandName: "Nike" },
        },
        productOption: {
          name: "Size",
          choices: [{ variantName: "US 9" }],
        },
        productOptionChoiceIndex: 0,
        quantity: 1,
        salePrice: 25000,
      },
    },
    {
      order: {
        id: 2,
        orderCode: "ORD-2024-002",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        deliveryStatus: "In Transit",
        calculatedOrder: {
          topshipShipmentRate: { mode: "Standard Delivery" },
        },
      },
      orderProduct: {
        id: 2,
        product: {
          id: "prod-002",
          name: "Adidas Ultra Boost",
          imageUrls: ["https://via.placeholder.com/56x56"],
          brand: { brandName: "Adidas" },
        },
        productOption: {
          name: "Color",
          choices: [{ variantName: "Black" }],
        },
        productOptionChoiceIndex: 0,
        quantity: 2,
        salePrice: 30000,
      },
    },
  ];

  const userOrderHistoryData = {
    user: displayOrder.user || displayOrder.calculatedOrder?.user,
    orderHistory: sampleOrderHistory,
    totalPrice: sampleOrderHistory.reduce(
      (total, { orderProduct }) =>
        total + orderProduct.salePrice * orderProduct.quantity,
      0
    ),
    totalOrders: sampleOrderHistory.length,
  };

  useEffect(() => {
    if (orderCode) {
      getOrder({ orderCode });
    }
  }, [orderCode]);

  const handleStatusChange = (newStatus) => {
    setPendingStatusChange(newStatus);
    setShowStatusChangeConfirmation(true);
  };

  const confirmStatusChange = () => {
    console.log("Status changed to:", pendingStatusChange.label);
    // Implement actual status change logic here
    setShowStatusChangeConfirmation(false);
    setPendingStatusChange(null);
  };

  const calculateSubtotal = () => {
    const products = displayOrder.calculatedOrder?.calculatedOrderProducts || displayOrder.calculatedOrderProducts || [];
    return products.reduce((total, product) => {
      return total + (product.salePrice || 0) * (product.quantity || 0);
    }, 0);
  };

  const breadcrumbLinks = [
    { name: "Orders", link: "/dashboard/orders" },
    { name: "Order Details" },
  ];

  const DefaultUserIcon = () => (
    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
      <FiUser className="w-4 h-4 text-gray-600" />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <BreadCrumbs links={breadcrumbLinks} />

      {/* Order Header */}
      <div className="flex items-center justify-between w-full mt-6 mb-4">
        <h1 className="text-[22px] font-bold text-[#111111]">
          Order #{displayOrder.orderCode}
        </h1>

        <TableDropdown
          className={classNames({
            "text-yellow":
              displayOrder?.orderStatus === "IN_PROGRESS" ||
              displayOrder?.orderStatus === "PENDING" ||
              displayOrder?.orderStatus === "DISPATCHED",
            "text-green": displayOrder?.orderStatus === "COMPLETED",
            "text-red-deep": displayOrder?.orderStatus === "CANCELLED",
          })}
          options={ORDER_STATUS_OPTIONS}
          content={displayOrder.orderStatus}
          handleClick={handleStatusChange}
          isLoading={getOrderLoading}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-7 mt-4">
        {/* Left Section */}
        <div className="flex-1">
          {/* Order Details Header */}
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-[17px] text-[#111111]">Order details</h2>
            <span className="text-gray-400">
              ({(displayOrder.calculatedOrder?.calculatedOrderProducts || displayOrder.calculatedOrderProducts || []).length})
            </span>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            {(displayOrder.calculatedOrder?.calculatedOrderProducts || displayOrder.calculatedOrderProducts)?.map((product, index) => (
              <div
                key={product.id}
                className={classNames("flex items-center py-5 px-4", {
                  "border-b border-[#DDDDDD]":
                    index < (displayOrder.calculatedOrder?.calculatedOrderProducts || displayOrder.calculatedOrderProducts || []).length - 1,
                })}
              >
                {/* Product Image */}
                <div className="w-[70px] h-[70px] mr-4">
                  <img
                    src={
                      product.product?.imageUrls?.[0] ||
                      product.productVariant?.imageUrls?.[0] ||
                      "https://via.placeholder.com/70x70"
                    }
                    alt={product.product?.name || "Product"}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Product Details - 45% width */}
                <div className="flex-[0.45] mr-4">
                  <h3 className="text-[15px] font-bold text-[#690007] mb-1.5">
                    {product.product?.name}
                  </h3>
                  {product.productVariant?.variantName && (
                    <p className="text-[14px] text-[#777777]">
                      Variant: {product.productVariant.variantName}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex-[0.2] mr-4">
                  <span className="text-[15px] text-[#777777]">
                    {product.quantity}
                  </span>
                </div>

                {/* Price */}
                <div className="flex-[0.25]">
                  <span className="text-[15px] font-bold text-[#690007]">
                    ₦{product.salePrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Amount Details */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#888888]">Subtotal</span>
              <span className="text-[14px] text-[#111111] ml-25">
                ₦{calculateSubtotal().toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#888888]">Shipping fee</span>
              <span className="text-[14px] text-[#111111] ml-25">
                ₦{(displayOrder.deliveryFee || displayOrder.calculatedOrder?.deliveryFee || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#888888]">Service charge</span>
              <span className="text-[14px] text-[#111111] ml-25">
                ₦{(displayOrder.calculatedOrder?.serviceCharge || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#888888]">Total</span>
              <span className="text-[14px] text-[#111111] ml-25">
                ₦{(displayOrder.totalAmount || displayOrder.calculatedOrder?.totalAmount || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center mt-7 pt-4 border-t">
              <span className="text-[14px] font-bold text-[#111111]">
                Amount to be paid
              </span>
              <span className="text-[14px] font-bold text-[#111111] ml-25">
                ₦{(displayOrder.totalAmount || displayOrder.calculatedOrder?.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[332px] bg-white rounded-lg p-6">
          {/* Customer Section */}
          <h3 className="text-[16px] text-[#111111] mb-6">Customer</h3>

          <div className="flex items-center mb-7">
            <div className="w-8 h-8 mr-5">
              {(displayOrder.user || displayOrder.calculatedOrder?.user)?.profileImageUrl ? (
                <img
                  src={(displayOrder.user || displayOrder.calculatedOrder?.user).profileImageUrl}
                  alt="User"
                  className="w-full h-full rounded-full border border-[#02152B14]"
                />
              ) : (
                <DefaultUserIcon />
              )}
            </div>
            <div>
              <p className="text-[14px] text-[#111111] font-medium">
                {(displayOrder.user || displayOrder.calculatedOrder?.user)?.firstName || displayOrder.guestFirstName}{" "}
                {(displayOrder.user || displayOrder.calculatedOrder?.user)?.lastName || displayOrder.guestLastName}
              </p>
              <p className="text-[12px] text-[#888888] mt-1">
                {(displayOrder.user || displayOrder.calculatedOrder?.user)?.email || displayOrder.guestEmail}
              </p>
            </div>
          </div>

          {/* Order History Section */}
          <div
            className="flex items-center justify-between p-4 border-t border-b border-[#690007] mb-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowOrderHistoryModal(true)}
          >
            <div className="flex items-center">
              <OrderHistoryIcon className="w-5 h-5 mr-5" />
              <span className="text-[12px] text-[#111111]">Order History</span>
            </div>
            <FiChevronRight className="w-[18px] h-[18px] text-[#690007]" />
          </div>

          {/* Brand Details */}
          <h4 className="text-[12px] text-[#111111] mb-6">Brand Details</h4>

          <div className="space-y-4 mb-5">
            {/* Brand Name */}
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center mr-3">
                <FiUser className="w-4 h-4 text-[#690007]" />
              </div>
              <div>
                <p className="text-[12px] text-[#888888]">Brand Name</p>
                <p className="text-[12px] text-[#111111] mt-1">
                  {displayOrder.brand?.brandName}
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-[#EEEEEE] my-6"></div>

          {/* Shipping Address */}
          <h4 className="text-[12px] text-[#111111] mb-4">Shipping Address</h4>

          {/* Google Map */}
          <GoogleMap
            lat={(displayOrder.calculatedOrder?.address?.addressLat || 6.5244)}
            lng={(displayOrder.calculatedOrder?.address?.addressLng || 3.3792)}
            height="200px"
            width="100%"
            className="mb-3.5"
            address={displayOrder.calculatedOrder?.address?.addressText || displayOrder.guestAddress}
          />

          <div className="flex items-start mb-3.5">
            <div className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center mr-3">
              <LocationIcon className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-[12px] text-[#111111]">
                {displayOrder.calculatedOrder?.address?.addressText || displayOrder.guestAddress}
              </p>
              <p className="text-[12px] text-[#888888] mt-1">
                {displayOrder.calculatedOrder?.address?.country}
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-[#EEEEEE] my-5"></div>

          {/* Billing Address */}
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-[12px] text-[#111111]">Billing Address</h4>
            <div className="flex items-center">
              <span className="text-[12px] text-[#690007]">Edit info</span>
              <FiChevronRight className="w-2 h-2 text-[#690007] ml-2" />
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center mr-3">
              <LocationIcon className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-[12px] text-[#111111]">
                {displayOrder.calculatedOrder?.address?.addressText || displayOrder.guestAddress}
              </p>
              <p className="text-[12px] text-[#888888] mt-1">
                {displayOrder.calculatedOrder?.address?.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {showStatusChangeConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h3 className="text-lg font-bold mb-4">Confirm Status Change</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change the order status to "
              {pendingStatusChange?.label}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowStatusChangeConfirmation(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-[#690007] text-white rounded-md hover:bg-[#5a0006]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={showOrderHistoryModal}
        onClose={() => setShowOrderHistoryModal(false)}
        user={userOrderHistoryData.user}
        userOrderHistory={userOrderHistoryData.orderHistory}
        totalPrice={userOrderHistoryData.totalPrice}
        totalOrders={userOrderHistoryData.totalOrders}
      />
    </div>
  );
};

OrderDetailsPage.propTypes = {
  // No props for now, but leaving this for future expansion
};

export default observer(OrderDetailsPage);
