import React from "react";
import PropTypes from "prop-types";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import Form from "./Form";
import DeleteDialog from "./DeleteDialog";

const DetailsModal = ({ active, toggler, details }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toggler();
  };
  return (
    <Modal
      size={details?.modalType === "delete" ? "sm" : "md"}
      active={active}
      toggler={toggler}
      modalClassName="overflow-y-auto overflow-x-hidden"
    >
      <form onSubmit={handleSubmit} className="w-full h-full">
        <ModalBody>
          <div className="w-full">
            {details?.modalType === "delete" ? (
              <DeleteDialog details={details} toggler={toggler} />
            ) : details?.modalType === "edit" ||
              details?.modalType === "add" ? (
              <Form details={details} toggler={toggler} />
            ) : null}
          </div>
        </ModalBody>
      </form>
    </Modal>
  );
};
DetailsModal.propTypes = {
  active: PropTypes.bool,
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default DetailsModal;
