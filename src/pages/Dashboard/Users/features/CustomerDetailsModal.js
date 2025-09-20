import React, { useState } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import classNames from "classnames";
import moment from "moment";

const CustomerDetailsModal = ({ active, onClose, customer }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!customer) return null;

  const isGuestCustomer = customer.isGuestCustomer || customer.guestEmail;

  return (
    <Modal
      active={active}
      toggler={onClose}
      isSideModal={true}
      title="Customer Details"
      size="xl"
    >
      <div className="w-full h-full flex flex-col">
        <div className="border-b border-gray-200">
          {/* Customer Status */}
          <div className="mb-2 flex items-center gap-3">
            <span
              className={classNames("text-xs px-2 py-1 rounded", {
                "bg-blue-100 text-blue-600": isGuestCustomer,
                "bg-green-100 text-green-600": !isGuestCustomer,
              })}
            >
              {isGuestCustomer ? "Guest Customer" : "Registered Customer"}
            </span>
            {customer.similarityScore && (
              <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-600">
                Similarity: {Math.round(customer.similarityScore * 100)}%
              </span>
            )}
          </div>

          {/* Customer Info */}
          <h3 className="text-[22px] text-[#111111] font-bold mb-2">
            {isGuestCustomer
              ? `${customer.guestFirstName || 'Guest'} ${customer.guestLastName || 'Customer'}`
              : `${customer.firstName} ${customer.lastName}`
            }
          </h3>
          <div className="flex items-center gap-5 mb-4">
            <span className="text-[14px] text-[#444444]">
              Email: {isGuestCustomer ? customer.guestEmail : customer.email}
            </span>
            {(customer.phoneNumber || customer.guestPhoneNumber) && (
              <span className="text-[14px] text-[#444444]">
                Phone: {customer.phoneNumber || customer.guestPhoneNumber}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-5">
            <p className="text-[17px] text-[#111827] font-bold">
              Total Spent: ₦{customer.totalSpent?.toLocaleString() || '0'}
            </p>
            <p className="text-[14px] text-[#6B7280]">
              Total Orders: {customer.totalOrders || 0}
            </p>
          </div>

          {/* Order Dates */}
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
                  First Order: {moment(customer.firstOrderDate).format("DD/MM/YYYY")}
                </span>
                <br />
                <span className="text-[14px] text-gray-500">
                  Last Order: {moment(customer.lastOrderDate).format("DD/MM/YYYY")}
                </span>
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
          {/* Customer Statistics */}
          <div className="mb-6">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Customer Statistics:
            </h4>
            <div className="grid grid-cols-2 gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <span className="text-xs font-medium text-gray-700">Total Orders:</span>
                <p className="text-sm text-gray-600 font-bold">{customer.totalOrders || 0}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-700">Total Spent:</span>
                <p className="text-sm text-gray-600 font-bold">₦{customer.totalSpent?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-700">Average Order Value:</span>
                <p className="text-sm text-gray-600 font-bold">
                  ₦{customer.totalOrders > 0
                    ? Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()
                    : '0'
                  }
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-700">Customer Since:</span>
                <p className="text-sm text-gray-600">
                  {moment(customer.firstOrderDate).format("MMM DD, YYYY")}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Type Information */}
          <div className="mb-6">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Customer Information:
            </h4>
            <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Customer Type:</span>
                <span className="text-sm text-gray-600">
                  {isGuestCustomer ? "Guest Customer" : "Registered Customer"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Email:</span>
                <span className="text-sm text-gray-600">
                  {isGuestCustomer ? customer.guestEmail : customer.email}
                </span>
              </div>
              {(customer.phoneNumber || customer.guestPhoneNumber) && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Phone:</span>
                  <span className="text-sm text-gray-600">
                    {customer.phoneNumber || customer.guestPhoneNumber}
                  </span>
                </div>
              )}
              {customer.similarityScore && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">Similarity Score:</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(customer.similarityScore * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order History Summary */}
          <div className="mb-6">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Order History Summary:
            </h4>
            <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">First Order Date:</span>
                <span className="text-sm text-gray-600">
                  {moment(customer.firstOrderDate).format("MMM DD, YYYY")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Last Order Date:</span>
                <span className="text-sm text-gray-600">
                  {moment(customer.lastOrderDate).format("MMM DD, YYYY")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Days Since Last Order:</span>
                <span className="text-sm text-gray-600">
                  {moment().diff(moment(customer.lastOrderDate), 'days')} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-700">Customer Lifetime:</span>
                <span className="text-sm text-gray-600">
                  {moment().diff(moment(customer.firstOrderDate), 'days')} days
                </span>
              </div>
            </div>
          </div>

          {/* Registered Customer Additional Information */}
          {!isGuestCustomer && (
            <div className="mb-8">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                Account Information:
              </h4>
              <div className="grid grid-cols-2 gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                {customer.id && (
                  <div>
                    <span className="text-xs font-medium text-gray-700">Customer ID:</span>
                    <p className="text-sm text-gray-600 font-mono">{customer.id}</p>
                  </div>
                )}
                {customer.createdAt && (
                  <div>
                    <span className="text-xs font-medium text-gray-700">Account Created:</span>
                    <p className="text-sm text-gray-600">
                      {moment(customer.createdAt).format("MMM DD, YYYY")}
                    </p>
                  </div>
                )}
                {customer.updatedAt && (
                  <div>
                    <span className="text-xs font-medium text-gray-700">Last Updated:</span>
                    <p className="text-sm text-gray-600">
                      {moment(customer.updatedAt).format("MMM DD, YYYY")}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-gray-700">Status:</span>
                  <p className="text-sm text-gray-600">
                    {customer.isDeleted ? 'Deleted' : 'Active'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between gap-3">
            <Button
              text="View Orders"
              isOutline
              onClick={() => console.log("View customer orders", customer)}
              className="flex-1"
            />
            <Button
              text="Contact Customer"
              isOutline
              onClick={() => console.log("Contact customer", customer)}
              className="flex-1"
            />
            <Button
              text="Close"
              onClick={onClose}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal active={showDeleteModal} toggler={() => setShowDeleteModal(false)}>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold mb-4">Delete Customer</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this customer? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <Button
              text="Cancel"
              isOutline
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            />
            <Button
              text="Delete"
              onClick={() => {
                setShowDeleteModal(false);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>
      </Modal>
    </Modal>
  );
};

export default observer(CustomerDetailsModal);