import React from "react";
import PropTypes from "prop-types";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import Form from "./Form";
import DeleteDialog from "./DeleteDialog";
import { PRODUCT_MODAL_TYPES } from "utils/appConstant";
import ProductCategories from "pages/Dashboard/Products/features/ProductCategories";

const { PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const DetailsModal = ({ active, toggler, details, handleChange, form }) => {
  const renderModalBody = () => {
    switch (details?.modalType) {
      case "delete":
        return <DeleteDialog details={details} toggler={toggler} />;
      case "edit":
        return <Form details={details} toggler={toggler} />;
      case "add":
        return <Form details={details} toggler={toggler} />;
      case PRODUCT_CATEGORY_OPTIONS:
        return (
          <ProductCategories
            details={details}
            toggler={toggler}
            handleChange={handleChange}
            form={form}
            type={details?.modalTitle}
            isSingle={details?.isSingleCategory}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Modal
      size={details?.modalSize || "md"}
      isSideModal={details?.isSideModal}
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
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default DetailsModal;
