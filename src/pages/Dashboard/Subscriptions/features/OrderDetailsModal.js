import React from "react";

import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import TransactionDetails from "./OrderDetails";

const OrderDetailsModal = ({ active, toggler, details }) => {
  const renderModalBody = () => {
    switch (details?.modalType) {
      case "details":
        return <TransactionDetails details={details} toggler={toggler} />;

      default:
        return null;
    }
  };
  return (
    <Modal
      isSideModal={details?.isSideModal}
      maxHeight="100vh"
      size="md"
      active={active}
      toggler={toggler}
      closeOnClickOutside
    >
      <div className="w-full h-full mb-10">
        <ModalBody>
          <div className="w-full">{active && renderModalBody()}</div>
        </ModalBody>
      </div>
    </Modal>
  );
};
OrderDetailsModal.propTypes = {
  active: PropTypes.bool,
  toggler: PropTypes.func,
  transaction: PropTypes.object,
};
export default OrderDetailsModal;
