import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as WarningIcon } from "assets/icons/warning.svg";
import { ReactComponent as Trash } from "assets/icons/BigTrashBin/bigTrashBin.svg";
import Modal, { ModalBody, ModalFooter } from "./Modal";
import { Button } from "./Button";

const ConfirmationModal = ({
  contextItem,
  clearContextItem,
  successVariable,
  loadingVariable,
  resetSuccessVariable,
  confirmationText,
  getConfirmationText,
  isDeletion,
  headerText,
  action,
  goAheadText = "Add",
}) => {
  const [text, setText] = useState("");
  useEffect(() => {
    if (successVariable) {
      clearContextItem();
      if (resetSuccessVariable) {
        resetSuccessVariable();
      }
    }
  }, [successVariable]);

  useEffect(() => {
    if (contextItem) {
      if (confirmationText) {
        setText(confirmationText);
      } else {
        if (getConfirmationText) {
          setText(getConfirmationText(contextItem));
        }
      }
    }
  }, [confirmationText, getConfirmationText, contextItem]);

  const carryOutAction = () => {
    action(contextItem);
  };

  useEffect(() => {
    if (!contextItem) {
      setTimeout(() => {
        setText("");
      }, 500);
    }
  }, [contextItem]);

  return (
    <Modal
      noPadding
      size="sm"
      {...{ active: !!contextItem, toggler: clearContextItem }}
    >
      <ModalBody>
        <div className="flex flex-col space-y-6 item-center justify-center w-full p-6">
          <div className="flex items-center justify-center">
            {isDeletion ? <Trash /> : <WarningIcon />}
          </div>
          <div className="flex flex-col space-y-4 items-center justify-center">
            <p className="font-bold text-base text-black text-center">
              {headerText}
            </p>
            <p className="text-grey-text max-w-[436px] text-center text-sm">
              {text}
            </p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center pb-6 px-6 justify-between">
          <Button whiteBg text="Cancel" onClick={clearContextItem} />
          <Button
            text={isDeletion && !goAheadText ? "Delete" : goAheadText}
            redBg={isDeletion}
            isLoading={loadingVariable}
            onClick={carryOutAction}
          />
        </div>
      </ModalFooter>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  contextItem: PropTypes.any,
  clearContextItem: PropTypes.func,
  successVariable: PropTypes.any,
  resetSuccessVariable: PropTypes.func,
  headerText: PropTypes.string,
  confirmationText: PropTypes.string,
  getConfirmationText: PropTypes.func,
  isDeletion: PropTypes.bool,
  action: PropTypes.func,
  goAheadText: PropTypes.string,
  loadingVariable: PropTypes.bool,
};

export default ConfirmationModal;
