import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import SearchBar from "components/General/Searchbar/SearchBar";
import OrderAccordion from "components/General/OrderAccordion";
import { ReactComponent as UserBoxIcon } from "assets/icons/user-box-icon.svg";

const OrderHistoryModal = ({
  isOpen,
  onClose,
  user,
  userOrderHistory = [],
  totalPrice = 0,
  totalOrders = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter order history based on search query
  const filteredOrderHistory = userOrderHistory.filter(
    ({ order, orderProduct }) => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      return (
        order.orderCode?.toLowerCase().includes(searchLower) ||
        orderProduct.product?.name?.toLowerCase().includes(searchLower) ||
        orderProduct.product?.brand?.brandName
          ?.toLowerCase()
          .includes(searchLower)
      );
    }
  );

  if (!isOpen) return null;

  return (
    <Modal active={isOpen} toggler={onClose} isSideModal={true}>
      <div className="w-full h-full flex flex-col">
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-[15px] uppercase text-[#000000] font-medium mb-6">
            Order History
          </h2>

          {/* User Info Row */}
          <div className="flex items-center mb-6">
            <UserBoxIcon className="w-6 h-6 mr-4" />
            <div>
              <h3 className="text-[15px] font-bold text-[#111111]">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-[14px] text-[#6D7280] mt-1">
                #{user?.id || user?.userId || "N/A"}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="p-6 border border-[#DDDDDD] rounded-lg flex">
            {/* Total Price */}
            <div className="flex-1">
              <p className="text-[14px] text-[#777777]">Total price</p>
              <p className="text-[16px] text-[#111111] font-medium mt-2">
                ₦{totalPrice.toLocaleString()}
              </p>
            </div>

            {/* Divider */}
            <div className="w-0.5 bg-[#E5E7EB] mx-6"></div>

            {/* Total Orders */}
            <div className="flex-1">
              <p className="text-[14px] text-[#777777]">Total orders</p>
              <p className="text-[16px] text-[#111111] font-medium mt-2">
                {totalOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* History Section */}
          <h3 className="text-[18px] font-bold text-[#111827] mb-3">History</h3>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search order history..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="border border-[#BBBBBB]"
            />
          </div>

          {/* Order History List */}
          <div className="space-y-4">
            {filteredOrderHistory.length > 0 ? (
              filteredOrderHistory.map(({ order, orderProduct }, index) => (
                <OrderAccordion
                  key={`${order.id}-${orderProduct.id}-${index}`}
                  order={order}
                  orderProduct={orderProduct}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#6D7280]">
                  {searchQuery
                    ? `No orders found matching "${searchQuery}"`
                    : "No order history available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

OrderHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  userOrderHistory: PropTypes.arrayOf(
    PropTypes.shape({
      order: PropTypes.object.isRequired,
      orderProduct: PropTypes.object.isRequired,
    })
  ),
  totalPrice: PropTypes.number,
  totalOrders: PropTypes.number,
};

export default OrderHistoryModal;
