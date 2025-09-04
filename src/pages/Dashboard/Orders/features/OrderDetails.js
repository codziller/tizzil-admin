import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import OrdersStore from "../store";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { transactionAmount } from "utils/transactions";
import classNames from "classnames";
import { Link, useParams } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import { TbCopy } from "react-icons/tb";
import { successToast } from "components/General/Toast/Toast";
import { NAIRA } from "utils/appConstant";
import { numberWithCommas } from "utils/formatter";
import Accordion from "components/General/Accordion";

export const DetailBlock = ({ title, value, values, valueClassName }) => {
  const { warehouse_id } = useParams();

  return (
    <div
      className={classNames(
        `flex flex-col justify-center items-start w-full gap-6 px-4`,
        { "max-w-[50%]": !values }
      )}
    >
      <h6 className="text-base">{title}</h6>
      {value && (
        <p
          className={classNames(
            "text-grey-label text-sm truncate",
            valueClassName
          )}
        >
          {value}
        </p>
      )}
      {/* order  Products */}
      {values?.map((item, i) => {
        const selectedChoice = item?.productOption?.choices?.find(
          (_, index) => index === item?.productOptionChoiceIndex
        );
        return (
          <>
            <Link
              to={`/dashboard/inventory/edit/${warehouse_id}/${item?.product?.id}`}
              className="flex justify-start items-center gap-2 w-full underline"
              rel="noreferrer"
              target="_blank"
            >
              <img
                src={
                  selectedChoice?.imageUrls?.[0] ||
                  item?.product?.imageUrls?.[0]
                }
                className="w-[45px] h-[45px] min-w-[45px] min-h-[45px]"
                alt={item?.product?.name}
              />
              <div key={i} className="flex flex-col  text-base gap-1">
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

                <span className="text-grey-label">
                  {NAIRA}
                  {numberWithCommas(parseFloat(item?.salePrice))}
                </span>
              </div>
            </Link>
            <div>
              <h4 className="text-sm">
                <span className="font-bold">ERP Warehouse:</span>{" "}
                <span className="text-grey"></span>
                {item?.erpWarehouseNames?.join(", ")}
              </h4>
            </div>
            {/* <Accordion
              data={{
                title: "Cost Price Details",
                body: (
                  <div className="flex flex-col gap-1 justify-start items-start">
                    {item?.costPrices?.map((cp, ind, itms) => (
                      <div
                        className={classNames(
                          "flex flex-col justify-start items-start pb-1 text-sm",
                          {
                            "border-b-[0.5px] border-grey-blue":
                              ind !== itms?.length - 1,
                          }
                        )}
                        key={ind}
                      >
                        <span>
                          Cost price used: {NAIRA_ABBR}{" "}
                          {numberWithCommas(cp?.costPrice)}
                        </span>
                        <span>
                          Quantity bought:{" "}
                          {numberWithCommas(cp?.quantityBought)}
                        </span>
                        <span>
                          Quantity left: {numberWithCommas(cp?.quantityLeft)}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              }}
            /> */}
          </>
        );
      })}
    </div>
  );
};
const OrderDetails = ({ details, handleRefund }) => {
  const { warehouse_id } = useParams();
  const { getOrder, getOrderLoading, order } = OrdersStore;
  const isRefundTab = details?.isRefundTab;
  useEffect(() => {
    getOrder({
      data: { id: details?.orderId || details?.id },
      isRefund: isRefundTab,
    });
  }, [order?.id]);

  const orderSource = order?.orderSource;
  const orderIsInStore =
    orderSource === "FACEBOOK" ||
    orderSource === "INSTAGRAM" ||
    orderSource === "STORE" ||
    orderSource === "WHATSAPP";

  const userName = orderIsInStore
    ? `${order?.guestFirstName || order?.calculatedOrder?.user?.firstName} ${
        order?.guestLastName || order?.calculatedOrder?.user?.lastName
      }`
    : `${
        order?.calculatedOrder?.address?.firstName ||
        order?.guestFirstName ||
        order?.calculatedOrder?.user?.firstName
      } ${
        order?.calculatedOrder?.address?.lastName ||
        order?.guestLastName ||
        order?.calculatedOrder?.user?.lastName
      }`;

  const userEmail = `${
    order?.guestEmail || order?.calculatedOrder?.user?.email
  }`;
  const userPhoneNumber = orderIsInStore
    ? `${order?.guestPhoneNumber || order?.calculatedOrder?.user?.phoneNumber}`
    : `${
        order?.calculatedOrder?.address?.phoneNumber ||
        order?.guestPhoneNumber ||
        order?.calculatedOrder?.user?.phoneNumber
      }`;

  const deliveryAddress = `${
    order?.guestAddress || order?.calculatedOrder?.address?.addressText
  }`;
  const deliveryFee = `${
    order?.guestDeliveryFee || order?.calculatedOrder?.deliveryFee
  }`;

  const deliveryMethod = order?.deliveryMethod;
  const checkDiscountCodeResult =
    order?.calculatedOrder?.checkDiscountCodeResult;

  const showCopySuccess = () => successToast("Copied!");
  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4">
      {!getOrderLoading ? (
        <div className="flex justify-between items-center gap-3 mb-5">
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="flex justify-start items-center gap-1 text-lg">
              <CopyToClipboard text={order?.orderCode} onCopy={showCopySuccess}>
                <span className="flex justify-center items-center gap-0.5 cursor-pointer uppercase">
                  {order?.orderCode} <TbCopy />
                </span>
              </CopyToClipboard>
              -
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
                {orderSource
                  ? `${orderSource} ORDER`
                  : `Order Source Unspecified`}
              </span>
            </h3>

            <h3 className="text-sm text-red-deep uppercase">
              {order?.calculatedOrder?.warehouse?.name}
            </h3>
          </div>
          {order?.orderStatus === "CANCELLED" ? null : isRefundTab ? (
            <span className="font-600 text-xs text-grey-text">
              Refunded Items
            </span>
          ) : (
            <span
              onClick={() => {
                handleRefund({ ...order, modalType: "refund" });
              }}
              className="font-600 cursor-pointer px-4 py-1 rounded-full bg-white text-[11px] text-black border-[1px] border-black "
            >
              Refund Item
            </span>
          )}
        </div>
      ) : null}

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
            <DetailBlock
              title="Delivery Fee"
              value={numberWithCommas(deliveryFee)}
            />

            <DetailBlock
              title="Service Charge"
              value={numberWithCommas(order?.calculatedOrder?.serviceCharge)}
            />
          </div>

          <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
            <DetailBlock
              title="Logistics Partner"
              value={order?.calculatedOrder?.topshipShipmentRate?.mode}
            />

            <a
              href={order?.calculatedOrder?.trackingUrl || "#"}
              rel="noreferrer"
              target="_blank"
            >
              <DetailBlock
                title="Tracking URL"
                value={order?.calculatedOrder?.trackingUrl || "N/A"}
                valueClassName="max-w-[98%] truncate"
              />
            </a>
          </div>
          {checkDiscountCodeResult?.status ? (
            <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
              <DetailBlock
                title="Discount Type"
                value={checkDiscountCodeResult?.discountType}
              />

              {/* <Link
                to={`/dashboard/marketing/edit-discount/${warehouse_id}/mobile/${discountId}`}
                className="flex justify-start items-center gap-2 w-full underline"
                rel="noreferrer"
                target="_blank"
              > */}
              <DetailBlock
                title="Discount Code"
                value={checkDiscountCodeResult.discountCode}
              />
              {/* </Link> */}
            </div>
          ) : null}
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
  handleRefund: PropTypes.func,
};
export default observer(OrderDetails);
