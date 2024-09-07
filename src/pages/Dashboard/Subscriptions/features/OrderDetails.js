import React, { useEffect } from "react";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import OrdersStore from "../store";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { transactionAmount } from "utils/transactions";
import classNames from "classnames";
import { Link, useParams } from "react-router-dom";
export const DetailBlock = ({ title, value, values, valueClassName }) => {
  const { warehouse_id } = useParams();

  return (
    <div
      className={`flex flex-col justify-center items-start w-full gap-2 px-4`}
    >
      <h6 className="text-base">{title}</h6>
      {value && (
        <p className={classNames("text-grey-label text-sm", valueClassName)}>
          {value}
        </p>
      )}
      {values?.map((item, i) => {
        const selectedChoice = item?.productOption?.choices?.find(
          (_, index) => index === item?.productOptionChoiceIndex
        );
        return (
          <Link
            to={`/dashboard/products/view/${warehouse_id}/${item?.product?.id}`}
            className="flex justify-start items-center gap-2 w-full underline"
            rel="noreferrer"
            target="_blank"
          >
            <img
              src={
                selectedChoice?.imageUrls?.[0] || item?.product?.imageUrls?.[0]
              }
              className="w-[45px] h-[45px] min-w-[45px] min-h-[45px]"
              alt={item?.product?.name}
            />
            <div key={i} className="flex flex-col  text-sm gap-1">
              <span className="text-grey-label">
                {item?.product?.name}{" "}
                <span className="text-red">x{item?.quantity}</span>
              </span>

              {item?.productOption?.name ? (
                <span className="text-grey">
                  {item?.productOption?.name}:
                  <span className="text-black">
                    {selectedChoice?.variantName}
                  </span>
                </span>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
const OrderDetails = ({ details }) => {
  const { getOrder, getOrderLoading, order } = OrdersStore;

  useEffect(() => {
    getOrder({ data: { id: details?.id } });
  }, [order?.id]);

  const orderSource = order?.orderSource;
  const orderIsInStore =
    orderSource === "FACEBOOK" ||
    orderSource === "INSTAGRAM" ||
    orderSource === "STORE" ||
    orderSource === "WHATSAPP";

  const userName = orderIsInStore
    ? `${order?.guestFirstName || "N/A"} 
${order?.guestLastName || ""}`
    : `${order?.calculatedOrder?.user?.firstName} 
    ${order?.calculatedOrder?.user?.lastName}`;

  const userEmail = orderIsInStore
    ? `${order?.guestEmail || "N/A"}`
    : `${order?.calculatedOrder?.user?.email}`;
  const userPhoneNumber = orderIsInStore
    ? `${order?.guestPhoneNumber || "N/A"}`
    : `${order?.calculatedOrder?.user?.phoneNumber}`;

  const deliveryAddress = orderIsInStore
    ? `${order?.guestAddress || "N/A"}`
    : `${order?.calculatedOrder?.address?.addressText}`;
  const deliveryFee = orderIsInStore
    ? `${order?.guestDeliveryFee || "N/A"}`
    : `${order?.calculatedOrder?.deliveryFee}`;

  const deliveryMethod = order?.deliveryMethod;
  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4">
      <h3 className="text-lg mb-5">
        Order Details -{" "}
        {!getOrderLoading ? (
          <span
            className={classNames({
              "text-grey-text3": !orderSource,
              "text-blue-bright":
                orderSource === "WEB" || orderSource === "APP",
              "text-blue-textHover": orderSource === "STORE",
              "text-green": orderSource === "WHATSAPP",
              "text-red-deep": orderSource === "INSTAGRAM",
            })}
          >
            {orderSource ? `${orderSource} ORDER` : `Order Source Unspecified`}
          </span>
        ) : null}
      </h3>

      {getOrderLoading ? (
        <div className="w-full flex justify-center items-center min-h-36">
          <CircleLoader blue />
        </div>
      ) : (
        <div className="flex flex-col justify-start items-start w-full border border-grey-bordercolor rounded">
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Customer" value={userName} />

            <DetailBlock
              title="Gender"
              value={`${
                !orderIsInStore ? order?.calculatedOrder?.user?.gender : "N/A"
              }`}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Email" value={userEmail} />

            <DetailBlock title="Phone" value={userPhoneNumber} />
          </div>
          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Order Code" value={order?.orderCode} />
            <DetailBlock
              title="Order Date"
              value={moment(order?.updatedAt).format("MMM Do, YYYY hh:mma")}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Order Status"
              value={order?.orderStatus}
              valueClassName={classNames({
                "text-yellow":
                  order?.orderStatus === "IN_PROGRESS" ||
                  order?.orderStatus === "PENDING" ||
                  order?.orderStatus === "DISPATCHED",
                "text-green": order?.orderStatus === "COMPLETED",
                "text-red-deep": order?.orderStatus === "CANCELLED",
              })}
            />

            <DetailBlock
              title="Payment Status"
              value={order?.paid ? "Paid" : "Unpaid"}
              valueClassName={classNames({
                "text-green": order?.paid,
                "text-red": !order?.paid,
              })}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Order Items"
              values={order?.calculatedOrder?.calculatedOrderProducts}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Payment Method" value={order?.paymentMethod} />
            <DetailBlock title="Delivery Method" value={deliveryMethod} />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Delivery Address" value={deliveryAddress} />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock title="Delivery Fee" value={deliveryFee} />

            <DetailBlock
              title="Service Charge"
              value={order?.calculatedOrder?.serviceCharge}
            />
          </div>
          <div className="flex justify-between items-center w-full py-[18px]">
            <DetailBlock title="Order Total" value={transactionAmount(order)} />
          </div>
        </div>
      )}
    </div>
  );
};

DetailBlock.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};
OrderDetails.propTypes = {
  details: PropTypes.object,
};
export default observer(OrderDetails);
