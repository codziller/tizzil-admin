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

  const renderModalBody = () => {
    switch (details?.modalType) {
      case "delete":
        return <DeleteDialog details={details} toggler={toggler} />;
      case "edit":
        return <Form details={details} toggler={toggler} />;
      default:
        return null;
    }
  };
  return (
    <Modal
      size={details?.modalSize || "md"}
      active={active}
      toggler={toggler}
      modalClassName="overflow-y-auto overflow-x-hidden"
    >
      <form onSubmit={handleSubmit} className="w-full h-full">
        <ModalBody>
          <div className="w-full">{active && renderModalBody()}</div>
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
