import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import OrdersStore from "../store";

const DeleteDialog = ({ details, toggler }) => {
  const { updateOrderStatus, updateOrderStatusLoading, getOrder, order } =
    OrdersStore;
  const [availableProducts, setavailableProducts] = useState(null);

  const orderProducts = order?.calculatedOrder?.calculatedOrderProducts;

  useEffect(() => {
    getOrder({ data: { id: details?.id } });
  }, [order?.id]);

  useEffect(() => {
    setavailableProducts(orderProducts);
  }, [order]);
  const handleOnSubmit = () => {
    const payload = { id: details?.id, status: details?.value };
    updateOrderStatus({
      data: payload,
      onSuccess: () => {
        toggler();
      },
    });
  };
  // const isComplete = details?.label === "COMPLETED";

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
        {" "}
        Set order '{details?.orderCode}' as '{details?.label}'
      </p>

      <p className="mb-3 text-sm text-grey text-center font-600">
        Are you sure you want to carry out this action?
      </p>

      {/* <p className="mb-3 text-sm text-grey text-center font-600">
        {isComplete
          ? "Select Products that are Not Available for Refund"
          : "Are you sure you want to carry out this action?"}
      </p> */}

      {/* {getOrderLoading && isComplete ? (
        <div className="w-full flex justify-center items-center min-h-36">
          <CircleLoader blue />
        </div>
      ) : (
        <>
          {isComplete ? (
            <div className="w-full flex flex-col overflow-y-auto max-h-[300px]">
              {orderProducts?.map((item, i) => {
                const selectedChoice = item?.productOption?.choices?.find(
                  (_, index) => index === item?.productOptionChoiceIndex
                );
                return (
                  <div
                    key={i}
                    className="flex justify-start items-center gap-2 w-full"
                  >
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
                );
              })}
            </div>
          ) : null}
        </>
      )} */}

      <Button
        onClick={handleOnSubmit}
        isLoading={updateOrderStatusLoading}
        type="submit"
        text={`Yes, set as ${details?.label}`}
        className="mb-2"
        fullWidth
      />

      <Button
        onClick={() => toggler?.()}
        isDisabled={updateOrderStatusLoading}
        text="No, Cancel"
        className="mb-5"
        fullWidth
        whiteBg
      />
    </div>
  );
};

DeleteDialog.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(DeleteDialog);
