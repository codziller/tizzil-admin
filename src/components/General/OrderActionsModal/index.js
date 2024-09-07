import React from "react";
import PropTypes from "prop-types";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";

const OrderActionsModal = ({
  handleDelete,
  handleEdit,
  handleResend,
  onClose,
}) => {
  return (
    <Modal size="sm" active toggler={onClose} noPadding>
      <ModalBody>
        <div className="flex flex-col w-full bg-white gap-5 p-6 mb-20 rounded-t-lg">
          <span
            className="cursor-pointer text-grey-text text-sm"
            onClick={() => {
              onClose();
              handleEdit();
            }}
          >
            Edit
          </span>
          <span
            className="cursor-pointer text-grey-text text-sm"
            onClick={() => {
              onClose();
              handleResend();
            }}
          >
            Resend
          </span>

          <span
            className="cursor-pointer text-grey-text text-sm"
            onClick={() => {
              onClose();
              handleDelete();
            }}
          >
            Delete
          </span>
        </div>
      </ModalBody>
    </Modal>
  );
};

OrderActionsModal.propTypes = {
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  handleResend: PropTypes.func,
  onClose: PropTypes.func,
};

export default OrderActionsModal;
