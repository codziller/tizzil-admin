import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import ProductsStore from "../store";
import Form from "./Form";
import DeleteDialog from "./DeleteDialog";
import {
  DISCOUNT_TYPES,
  MEDIA_MODAL_TYPES,
  PRODUCT_MODAL_TYPES,
} from "utils/appConstant";
import { observer } from "mobx-react-lite";
import Brands from "./Brands";
import Products from "./Products";
import ProductCategories from "pages/Dashboard/Products/features/ProductCategories";

const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;
const { PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const { BUY_X_GET_Y_FREE } = DISCOUNT_TYPES;
const DetailsModal = ({ active, toggler, details, handleChange, form }) => {
  const { product_id } = useParams();
  const { getProductLoading } = ProductsStore;

  const renderModalBody = () => {
    switch (details?.modalType) {
      case "delete":
        return <DeleteDialog details={details} toggler={toggler} />;
      case "edit":
        if (product_id) {
          return getProductLoading ? (
            <div>Loading</div>
          ) : (
            <Form details={details} toggler={toggler} />
          );
        } else {
          return <Form details={details} toggler={toggler} />;
        }

      case BRAND:
        return (
          <Brands
            details={details}
            toggler={toggler}
            handleChange={handleChange}
            form={form}
          />
        );

      case PRODUCT:
        return (
          <Products
            details={details}
            toggler={toggler}
            handleChange={handleChange}
            form={form}
          />
        );

      case BUY_X_GET_Y_FREE:
        return (
          <Products
            details={details}
            toggler={toggler}
            handleChange={handleChange}
            form={form}
          />
        );

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
      size={details?.modalSize || "xl"}
      active={active}
      toggler={toggler}
      modalClassName="overflow-y-auto overflow-x-hidden"
      closeOnClickOutside
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
export default observer(DetailsModal);
