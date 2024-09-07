import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as BigTrashBin } from "assets/icons/BigTrashBin/bigTrashBin.svg";
import Button from "components/General/Button/Button";
import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";

const DeleteHubItemModal = ({
  handleDelete,
  isDeleting,
  onClose,
  title,
  text,
  buttonText,
}) => {
  return (
    <Modal size="sm" active toggler={onClose} noPadding>
      <ModalBody>
        <div className="w-full text-center ">
          <div className="pt-[42px] px-[24px] pb-[24px]">
            <BigTrashBin className="block mx-auto mb-[24px]" />
            <p className="text-black mb-[16px]">{title}</p>
            <p className="text-grey-text text-sm">{text}</p>
          </div>

          <div className="flex justify-between items-center w-full border-t p-[24px] ">
            <div>
              <Button whiteBg text="Cancel" onClick={onClose} />
            </div>
            <div>
              <Button
                text={buttonText || "Delete"}
                redBg
                isLoading={isDeleting}
                isDisabled={isDeleting}
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

DeleteHubItemModal.propTypes = {
  handleDelete: PropTypes.func,
  isDeleting: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  text: PropTypes.string,
  buttonText: PropTypes.string,
};

export default DeleteHubItemModal;
