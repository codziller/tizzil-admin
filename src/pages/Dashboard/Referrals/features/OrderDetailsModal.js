import React from "react";

import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import TransactionDetails from "./OrderDetails";

const OrderDetailsModal = ({ active, toggler, transaction }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toggler();
  };
  return (
    <Modal
      isSideModal
      maxHeight="100vh"
      size="md"
      active={active}
      toggler={toggler}
    >
      <form onSubmit={handleSubmit} className="w-full h-full mb-10">
        <ModalBody>
          <div className="w-full">
            <TransactionDetails transaction={transaction} />
          </div>
        </ModalBody>
      </form>
    </Modal>
  );
};
OrderDetailsModal.propTypes = {
  active: PropTypes.bool,
  toggler: PropTypes.func,
  transaction: PropTypes.object,
};
export default OrderDetailsModal;
