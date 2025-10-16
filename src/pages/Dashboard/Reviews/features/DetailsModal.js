import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import classNames from "classnames";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import DeleteDialog from "./DeleteDialog";
import { Button } from "components/General/Button";

const DetailsModal = ({ active, toggler, details }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="cursor-pointer"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={star <= rating ? "#690007" : "none"}
              stroke="#690007"
              strokeWidth={star <= rating ? "0" : "1"}
            />
          </svg>
        ))}
      </div>
    );
  };

  const renderReviewDetails = () => {
    if (!details) return null;

    return (
      <div className="w-full h-full flex flex-col">
        <div className="border-b border-gray-200">
          {/* Rating Display */}
          <div className="mb-4 flex items-center gap-3">
            {renderStars(details.rating)}
            <span className="text-sm text-gray-600">
              {details.rating} out of 5 stars
            </span>
          </div>

          {/* Review Title */}
          <h3 className="text-[22px] text-[#111111] font-bold mb-2">
            Review Details
          </h3>

          {/* Order and Product Info */}
          <div className="flex items-center gap-5 mb-4">
            {details.orderCode && (
              <span className="text-[14px] text-[#444444]">
                Order: {details.orderCode}
              </span>
            )}
            {details.productName && (
              <span className="text-[14px] text-[#444444]">
                Product: {details.productName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-5">
            <p className="text-[17px] text-[#111827] font-bold">
              {details.user?.firstName} {details.user?.lastName}
            </p>
            {details.user?.phoneNumber && (
              <p className="text-[14px] text-[#6B7280]">
                {details.user.phoneNumber}
              </p>
            )}
          </div>

          {/* Review Date */}
          <div className="flex items-center justify-between p-4 border-t border-b border-[#690007] mb-5">
            <div className="flex items-center gap-5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15h-2v-2h2v2zm0-4h-2V6h2v5z"
                  fill="#F59E0B"
                />
              </svg>
              <div>
                <span className="text-[14px] text-gray-700 font-medium">
                  Reviewed on: {moment(details.createdAt).format("MMM DD, YYYY")}
                </span>
                <br />
                {details.updatedAt && (
                  <span className="text-[14px] text-gray-500">
                    Updated: {moment(details.updatedAt).format("MMM DD, YYYY")}
                  </span>
                )}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 12l4-4-4-4"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Review Content */}
          <div className="mb-6">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Review:
            </h4>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-[14px] text-gray-700 whitespace-pre-wrap">
                {details.review}
              </p>
            </div>
          </div>

          {/* Review Information */}
          <div className="mb-6">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Review Information:
            </h4>
            <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
              {details.id && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Review ID:</span>
                  <span className="text-sm text-gray-600 font-mono">{details.id}</span>
                </div>
              )}
              {details.orderCode && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Order Code:</span>
                  <span className="text-sm text-gray-600">{details.orderCode}</span>
                </div>
              )}
              {details.productName && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Product Name:</span>
                  <span className="text-sm text-gray-600">{details.productName}</span>
                </div>
              )}
              {details.productVariantId && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Variant ID:</span>
                  <span className="text-sm text-gray-600 font-mono">{details.productVariantId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Rating:</span>
                <span className="text-sm text-gray-600">{details.rating} / 5</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Customer Information:
            </h4>
            <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
              {details.user?.id && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Customer ID:</span>
                  <span className="text-sm text-gray-600 font-mono">{details.user.id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Name:</span>
                <span className="text-sm text-gray-600">
                  {details.user?.firstName} {details.user?.lastName}
                </span>
              </div>
              {details.user?.email && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Email:</span>
                  <span className="text-sm text-gray-600">{details.user.email}</span>
                </div>
              )}
              {details.user?.phoneNumber && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Phone:</span>
                  <span className="text-sm text-gray-600">{details.user.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="mb-8">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Timeline:
            </h4>
            <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Created:</span>
                <span className="text-sm text-gray-600">
                  {moment(details.createdAt).format("MMM DD, YYYY hh:mm A")}
                </span>
              </div>
              {details.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Last Updated:</span>
                  <span className="text-sm text-gray-600">
                    {moment(details.updatedAt).format("MMM DD, YYYY hh:mm A")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Days Since Review:</span>
                <span className="text-sm text-gray-600">
                  {moment().diff(moment(details.createdAt), 'days')} days ago
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between gap-3">
            {details.orderId && (
              <Button
                text="View Order"
                isOutline
                onClick={() => console.log("View order", details.orderId)}
                className="flex-1"
              />
            )}
            {details.productId && (
              <Button
                text="View Product"
                isOutline
                onClick={() => console.log("View product", details.productId)}
                className="flex-1"
              />
            )}
            <Button
              text="Close"
              onClick={toggler}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderModalBody = () => {
    switch (details?.modalType) {
      case "delete":
        return <DeleteDialog details={details} toggler={toggler} />;
      case "details":
        return renderReviewDetails();
      default:
        return null;
    }
  };

  return (
    <Modal
      size={details?.modalType === "delete" ? "sm" : details?.size || "xl"}
      active={active}
      toggler={toggler}
      modalClassName="overflow-y-auto overflow-x-hidden"
      isSideModal={details?.modalType === "details" || details?.isSideModal}
      title={details?.modalType === "details" ? "Review Details" : undefined}
    >
      <div className="w-full h-full">
        <ModalBody>
          <div className="w-full">{active && renderModalBody()}</div>
        </ModalBody>
      </div>
    </Modal>
  );
};
DetailsModal.propTypes = {
  active: PropTypes.bool,
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default DetailsModal;
