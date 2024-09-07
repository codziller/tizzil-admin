import React from "react";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Delete } from "assets/icons/delete-span.svg";
import Button from "components/General/Button/Button";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ProductsStore from "pages/Dashboard/Products/store";
import { PRODUCT_REQUEST_STATUSES } from "utils/appConstant";
import { DetailBlock } from "pages/Dashboard/Orders/features/OrderDetails";
import classNames from "classnames";
import moment from "moment";

const { INPROGRESS, CANCELLED, PENDING, COMPLETED } = PRODUCT_REQUEST_STATUSES;
const DeleteDialog = ({ details, toggler }) => {
  const { warehouse_id } = useParams();
  const {
    updateProductTransferRequestStatus,
    updateProductTransferRequestStatusLoading,
  } = ProductsStore;
  const {
    modalType,
    destinationWarehouse,
    productTransferRequestProductQuantities,
    status,
    createdAt,
    pageStatus,
    currentPage,
    cancelledBy,
    cancelledTime,
    acceptedBy,
    completedBy,
    completedTime,
    code,
  } = details;
  const handleOnSubmit = () => {
    const payload = {
      productTransferRequestId: details?.id,
      status: modalType,
      warehouseId: warehouse_id,
    };
    updateProductTransferRequestStatus({
      data: payload,
      onSuccess: () => toggler(),
      pageStatus: pageStatus?.value,
      currentPage,
      message:
        modalType === INPROGRESS
          ? "Product request has been accepted. Request status is now INPROGRESS"
          : modalType === CANCELLED
          ? "Product request has been cancelled. Request status is now CANCELLED"
          : modalType === COMPLETED
          ? "Product request has been completed. Request status is now COMPLETED"
          : "",
    });
  };

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
        {modalType === INPROGRESS
          ? "Accept Product Request"
          : modalType === CANCELLED
          ? "Cancel Product Request"
          : "Product Request Details"}
      </p>

      <p className="mb-3 text-sm text-grey-text text-center">
        Request Details - <span className="text-black">{code}</span>
      </p>

      <div className="flex justify-between items-center w-full border-y border-grey-bordercolor py-[18px]">
        <DetailBlock
          title="Destination Warehouse"
          value={destinationWarehouse?.name}
        />
      </div>
      <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
        <DetailBlock
          title="Requested products"
          value={
            <div>
              {`${productTransferRequestProductQuantities[0]?.product?.name} `}{" "}
              {
                <span className="text-red-deep">
                  x{productTransferRequestProductQuantities[0]?.quantity}
                </span>
              }
            </div>
          }
        />
      </div>

      <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
        <DetailBlock
          title="Request Status"
          value={
            <span
              className={classNames({
                "text-yellow": status === "INPROGRESS" || status === "PENDING",
                "text-green": status === "COMPLETED",
                "text-red-deep": status === "CANCELLED",
              })}
            >
              {status}
            </span>
          }
        />
        <DetailBlock
          title="Request Date"
          value={<span>{moment(createdAt).format("MMM Do, YYYY hh:mma")}</span>}
        />
      </div>

      {status === CANCELLED && cancelledBy && (
        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock
            title="Cancelled By"
            value={`${cancelledBy?.firstName} ${cancelledBy?.lastName}`}
          />

          {cancelledTime && (
            <DetailBlock
              title="Cancelled Time"
              value={
                <span>
                  {moment(cancelledTime).format("MMM Do, YYYY hh:mma")}
                </span>
              }
            />
          )}
        </div>
      )}

      {status === INPROGRESS && acceptedBy && (
        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock
            title="Accepted By"
            value={`${acceptedBy?.firstName} ${acceptedBy?.lastName}`}
          />
        </div>
      )}

      {status === COMPLETED && completedBy && (
        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock
            title="Completed By"
            value={`${completedBy?.firstName} ${completedBy?.lastName}`}
          />

          {completedTime && (
            <DetailBlock
              title="Completed Time"
              value={
                <span>
                  {moment(completedTime).format("MMM Do, YYYY hh:mma")}
                </span>
              }
            />
          )}
        </div>
      )}
      {(modalType === INPROGRESS ||
        modalType === CANCELLED ||
        modalType === COMPLETED) && (
        <Button
          onClick={handleOnSubmit}
          isLoading={updateProductTransferRequestStatusLoading}
          type="submit"
          text={
            modalType === INPROGRESS
              ? "Accept Product Request"
              : modalType === CANCELLED
              ? "Cancel Product Request"
              : modalType === COMPLETED
              ? "Complete Product Request"
              : ""
          }
          className="mb-2"
          fullWidth
        />
      )}

      <Button
        onClick={() => toggler?.()}
        isDisabled={updateProductTransferRequestStatusLoading}
        text="Cancel"
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
