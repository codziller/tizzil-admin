import React from "react";
import PropTypes from "prop-types";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import DeleteDialog from "./DeleteDialog";

const DetailsModal = ({ active, toggler, details }) => {
  const renderModalBody = () => {
    switch (details?.modalType) {
      case "delete":
        return <DeleteDialog details={details} toggler={toggler} />;

      default:
        return null;
    }
  };
  return (
    <Modal
      size={details?.modalType === "delete" ? "sm" : details?.size || "md"}
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
