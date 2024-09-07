import React from "react";
import PropTypes from "prop-types";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import Form from "./Form";
import DeleteDialog from "./DeleteDialog";
import {
  INVENTORY_MODAL_TYPES,
  PRODUCT_MODAL_TYPES,
  PRODUCT_REQUEST_STATUSES,
} from "utils/appConstant";
import CostPriceHistory from "./CostPriceHistory";
import RequestProductForm from "./RequestProductForm";
import QuantityLeft from "./QuantityLeft";
import EditInventoryForm from "./EditInventoryForm";
import DownloadCsv from "./DownloadCsv";

const { COST_PRICE_HISTORY, REQUEST_PRODUCT, DOWNLOAD_CSV } =
  INVENTORY_MODAL_TYPES;
const { INPROGRESS, CANCELLED, COMPLETED } = PRODUCT_REQUEST_STATUSES;
const { PRODUCT_VARIANT } = PRODUCT_MODAL_TYPES;
const DetailsModal = ({ active, toggler, details }) => {
  const renderModalBody = () => {
    switch (details?.modalType) {
      case CANCELLED:
        return <DeleteDialog details={details} toggler={toggler} />;
      case INPROGRESS:
        return <DeleteDialog details={details} toggler={toggler} />;
      case COMPLETED:
        return <DeleteDialog details={details} toggler={toggler} />;
      case "view":
        return <DeleteDialog details={details} toggler={toggler} />;
      case "edit":
        return <Form details={details} toggler={toggler} />;
      case COST_PRICE_HISTORY:
        return <QuantityLeft details={details} toggler={toggler} />;
      case REQUEST_PRODUCT:
        return <RequestProductForm details={details} toggler={toggler} />;
      case PRODUCT_VARIANT:
        return <EditInventoryForm details={details} toggler={toggler} />;

      case DOWNLOAD_CSV:
        return <DownloadCsv details={details} toggler={toggler} />;
      default:
        return null;
    }
  };
  return (
    <Modal
      size={
        details?.modalType === PRODUCT_VARIANT
          ? "xl"
          : details?.modalSize || "md"
      }
      active={active}
      toggler={toggler}
      modalClassName="overflow-y-auto overflow-x-hidden"
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
