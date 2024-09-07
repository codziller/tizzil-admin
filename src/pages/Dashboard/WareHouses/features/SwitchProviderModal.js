import React from "react";
import PropTypes from "prop-types";
import Button from "components/General/Button/Button";
import { ReactComponent as Arrows } from "assets/icons/Arrow/Arrow_Left_Right.svg";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import Modal from "components/General/Modal/Modal/Modal";

export default function SwitchProviderModal({ onClose, active }) {
  return (
    <div>
      <Modal size="md" active={active} toggler={onClose}>
        <ModalBody>
          <div className="h-[305px] w-full flex-col justify-start items-start gap-6 inline-flex">
            <div className="w-6 h-6 relative" />
            <div className="flex-col justify-start w-full items-center gap-8 flex">
              <div className="flex-col justify-start items-center gap-4 flex">
                <div className="w-14 h-14 relative">
                  <div className="w-14 h-14 left-0 top-0 absolute bg-white rounded-full border border-indigo-200 flex items-center justify-center">
                    <Arrows className="stroke-current" />
                  </div>
                </div>
                <div className="flex-col justify-center items-center gap-0.5 flex">
                  <div className="text-black text-2xl font-medium leading-[35px]">
                    Switch Provider
                  </div>
                  <div className="text-center text-stone-400 text-sm font-normal leading-tight">
                    Are you sure you want to switch to this provider
                  </div>
                </div>
              </div>
              <div className="flex-col justify-start w-full items-start gap-2 flex">
                <div className="flex-col w-full justify-center items-center gap-2 flex">
                  <Button
                    // onClick={() => navigate("/warehouses")}
                    className="w-full"
                    text="Yes, Switch My Provider"
                  />
                </div>
                <div className="flex-col w-full justify-center items-center gap-2 flex">
                  <Button
                    onClick={onClose}
                    whiteBg
                    textClass="!text-black"
                    className="w-full"
                    text="No, Cancel"
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

SwitchProviderModal.propTypes = {
  onClose: PropTypes.func,
  active: PropTypes.bool,
};
