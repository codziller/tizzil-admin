import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Button from "components/General/Button/Button";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import OrdersStore from "../store";
import Input from "components/General/Input/Input";
import { successToast } from "components/General/Toast/Toast";

const RefundModal = ({ details, toggler }) => {
  const {
    getOrderLoading,
    refundItemInOrder,
    refundItemInOrderLoading,
    getOrder,
    order,
  } = OrdersStore;
  const [availableProducts, setAvailableProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  const orderProducts = order?.calculatedOrder?.calculatedOrderProducts;
  useEffect(() => {
    getOrder({ data: { id: details?.id } });
  }, [order?.id]);

  useEffect(() => {
    setAvailableProducts(orderProducts?.map((item) => ({ ...item, qty: 1 })));
  }, [order]);
  const handleChange = (prop, val, item) => {
    if (Number(val) > Number(item?.quantity)) {
      return;
    }
    const newObj = { ...item, [prop]: val };

    const newAvailableProducts = availableProducts?.map((_) =>
      _?.id === item?.id ? newObj : _
    );
    setAvailableProducts(newAvailableProducts);
  };
  const handleOnSubmit = async () => {
    setLoading(true);
    try {
      const allRequests = availableProducts?.map((item) =>
        refundItemInOrder({
          data: {
            calculatedProductId: item?.id,
            orderCode: order?.orderCode,
            quantity: Number(item?.qty),
          },
        })
      );
      await Promise.all(allRequests);
      successToast(
        "Operation Successful!",
        "Order items updated Successfully."
      );
      toggler();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const isCancelled = details?.label === "CANCELLED";

  return (
    <div className="flex flex-col justify-center items-center gap-y-2 w-full h-full pb-4 overflow-y-auto">
      {details?.link ? (
        <Link to={details?.link} className="scale-90 mb-2 mr-auto">
          <ArrowBack />
        </Link>
      ) : (
        <button onClick={() => toggler?.()} className="scale-90 mb-5 mr-auto">
          <Close />
        </button>
      )}

      <p className="font-600 text-xl ">
        Refund Order Items - '{details?.orderCode?.toUpperCase()}' '
      </p>
      <p className="mb-3 text-sm text-grey text-center font-600">
        Please adjust the quantity for refund using the counters below.
      </p>
      {getOrderLoading ? (
        <div className="w-full flex justify-center items-center min-h-36">
          <CircleLoader blue />
        </div>
      ) : (
        <>
          {!isCancelled ? (
            <div className="w-full flex flex-col overflow-y-auto max-h-[300px]">
              {availableProducts?.map((item, i) => {
                const selectedChoice = item?.productOption?.choices?.find(
                  (_, index) => index === item?.productOptionChoiceIndex
                );
                return (
                  <div
                    key={i}
                    className="flex flex-col justify-start items-center gap-2 w-full border-b-1/2 border-b-grey-border"
                  >
                    <div className="flex justify-start items-center gap-2 w-full">
                      <div className="flex justify-center items-center w-[60px] h-[60px] rounded-lg bg-red-light2 my-2">
                        <img
                          src={
                            selectedChoice?.imageUrls?.[0] ||
                            item?.product?.imageUrls?.[0]
                          }
                          className="w-[45px] h-[45px] min-w-[45px] min-h-[45px] object-cover"
                          alt={item?.product?.name}
                        />
                      </div>
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
                    </div>
                    <Input
                      value={item?.qty}
                      onChangeFunc={(val) => handleChange("qty", val, item)}
                      placeholder="Quantity"
                      type="number"
                      isCounter
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      )}

      <Button
        onClick={handleOnSubmit}
        isLoading={loading}
        type="submit"
        text="Confirm Refund"
        className="mb-2"
        fullWidth
      />
    </div>
  );
};

RefundModal.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(RefundModal);
