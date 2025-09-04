import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import { ReactComponent as ChevronDown } from "assets/icons/chevron-down.svg";

const OrderAccordion = ({ orderProduct, order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Get selected choice for product option
  const selectedChoice = orderProduct?.productOption?.choices?.find(
    (_, index) => index === orderProduct?.productOptionChoiceIndex
  );

  // Generate product identifier
  const productIdentifier = orderProduct?.productOption?.name
    ? `${orderProduct.productOption.name}: ${
        selectedChoice?.variantName || "N/A"
      }`
    : `Prod ID: ${
        orderProduct?.product?.id?.toString().substring(0, 5) || "N/A"
      }`;

  // Format delivery status
  const getDeliveryStatusColor = (status) => {
    if (status === "Delivered") return "text-[#18B368]";
    if (status === "Cancelled") return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="border border-[#DDDDDD] rounded bg-white p-4 mb-3">
      {/* Top Section - Always Visible */}
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleExpanded}
      >
        {/* Product Image */}
        <div className="w-14 h-14 mr-4 flex-shrink-0">
          <img
            src={
              selectedChoice?.imageUrls?.[0] ||
              orderProduct?.product?.imageUrls?.[0] ||
              "https://via.placeholder.com/56x56"
            }
            alt={orderProduct?.product?.name || "Product"}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Details - Full Width */}
        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            {/* Row 1: Product Name & Cost Price */}
            <div className="flex justify-between items-start">
              <span className="text-[15px] font-bold text-[#111827] truncate mr-2">
                {orderProduct?.product?.name || "Unknown Product"}
              </span>
              <span className="text-[15px] font-bold text-[#111827] whitespace-nowrap">
                ₦{orderProduct?.salePrice?.toLocaleString() || "0"}
              </span>
            </div>

            {/* Row 2: Product Option & Order Code */}
            <div className="flex justify-between items-start">
              <span className="text-[15px] text-[#4B5563] truncate mr-2 max-w-[50%]">
                {productIdentifier}
              </span>
              <span className="text-[15px] text-[#4B5563] whitespace-nowrap">
                Order Code: {order?.orderCode || "N/A"}
              </span>
            </div>

            {/* Row 3: Brand Name & Quantity */}
            <div className="flex justify-between items-start">
              <span className="text-[15px] text-[#4B5563] truncate mr-2 max-w-[50%]">
                {orderProduct?.product?.brand?.brandName || "Unknown Brand"}
              </span>
              <span className="text-[15px] text-[#4B5563] whitespace-nowrap">
                Qty: {orderProduct?.quantity || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Chevron Icon */}
        <div className="ml-4 flex-shrink-0">
          <ChevronDown
            className={classNames(
              "w-5 h-5 text-gray-600 transition-transform duration-200",
              {
                "rotate-180": isExpanded,
              }
            )}
          />
        </div>
      </div>

      {/* Bottom Section - Expandable */}
      {isExpanded && (
        <div className="mt-8 space-y-2.5">
          {/* Delivery Provider */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#4B5563]">
              Delivery provider
            </span>
            <span className="text-[15px] text-[#111111]">
              {order?.calculatedOrder?.topshipShipmentRate?.mode || "N/A"}
            </span>
          </div>

          {/* Delivery Status */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#4B5563]">Delivery status</span>
            <span
              className={classNames(
                "text-[15px] font-medium",
                getDeliveryStatusColor(order?.deliveryStatus || "Pending")
              )}
            >
              {order?.deliveryStatus || "Pending"}
            </span>
          </div>

          {/* Date Ordered */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#4B5563]">Date ordered</span>
            <span className="text-[15px] text-[#111111]">
              {moment(order?.createdAt || order?.updatedAt).format(
                "MMM DD, YYYY"
              )}
            </span>
          </div>

          {/* Delivered On */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#4B5563]">Delivered on</span>
            <span className="text-[15px] text-[#111111]">
              {order?.deliveredAt
                ? moment(order.deliveredAt).format("MMM DD, YYYY")
                : "Not delivered"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

OrderAccordion.propTypes = {
  orderProduct: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    product: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      imageUrls: PropTypes.arrayOf(PropTypes.string),
      brand: PropTypes.shape({
        brandName: PropTypes.string,
      }),
    }),
    productOption: PropTypes.shape({
      name: PropTypes.string,
      choices: PropTypes.array,
    }),
    productOptionChoiceIndex: PropTypes.number,
    quantity: PropTypes.number,
    salePrice: PropTypes.number,
  }).isRequired,
  order: PropTypes.shape({
    orderCode: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    updatedAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    deliveredAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    deliveryStatus: PropTypes.string,
    calculatedOrder: PropTypes.shape({
      topshipShipmentRate: PropTypes.shape({
        mode: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default OrderAccordion;
