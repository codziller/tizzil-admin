import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import Form from "./Form";
import DeleteDialog from "./DeleteDialog";
import { Button } from "components/General/Button";
import { CLOSE_ICON, COPY_ICON } from "assets/icons";
import apis from "services/giftCards";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import moment from "moment";
import { NAIRA } from "utils/appConstant";

const DetailsModal = ({ active, toggler, details }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toggler();
  };
  const [activeGiftCard, setActiveGiftCard] = useState("");
  const [giftCardLoading, setGiftCardLoading] = useState(false);

  const fetchActiveGiftCard = async () => {
    try {
      setGiftCardLoading(true);
      const response = await apis.verifyGiftCard({ code: details?.code });
      if (response) {
        setActiveGiftCard(response?.verifyGiftCard);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setGiftCardLoading(false);
    }
  };

  useEffect(() => {
    console.log(details);
    details?.code && fetchActiveGiftCard();
  }, [details?.code]);

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
            {details?.modalType === "view" ? (
              <div className="pb-10">
                <div className="flex justify-between">
                  <h4 className="text-[24px] leading-[32px] font-bold text-black text-center">
                    Gift Card Details
                  </h4>
                  <button
                    className="text-bblack text-sm font-semibold underline flex gap-2 items-center"
                    onClick={() => toggler?.()}
                  >
                    <CLOSE_ICON />
                    Cancel
                  </button>
                </div>
                {giftCardLoading ? (
                  <div className="w-full flex justify-center py-5">
                    <CircleLoader blue />
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm leading-[18px] font-semibold text-black-text">
                        Receiver’s Info
                      </h5>
                      <p className="text-sm leading-[20px] text-black font-bold">
                        {activeGiftCard?.receiverName}{" "}
                        {activeGiftCard?.receiverEmail
                          ? `(${activeGiftCard?.receiverEmail})`
                          : ""}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm leading-[18px] font-semibold text-black-text">
                        Date Created
                      </h5>
                      <p className="text-sm leading-[20px] text-black font-bold">
                        {moment(activeGiftCard?.createdAt).format(
                          "MMM Do, YYYY hh:mma"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm leading-[18px] font-semibold text-black-text">
                        Initial Amount
                      </h5>
                      <p className="text-sm leading-[20px] text-black font-bold">
                        {NAIRA}
                        {Number(activeGiftCard?.initialAmount).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm leading-[18px] font-semibold text-black-text">
                        Balance
                      </h5>
                      <p className="text-sm leading-[20px] text-black font-bold">
                        {NAIRA}
                        {Number(
                          activeGiftCard?.currentBalance
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm leading-[18px] font-semibold text-black-text">
                        Custom Message
                      </h5>
                      <p className="text-sm leading-[20px] text-black font-bold">
                        {activeGiftCard?.message || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm leading-[18px] font-semibold text-black-text">
                        Code
                      </h5>
                      <button
                        className="text-sm leading-[20px] text-black font-bold flex gap-2 items-center"
                        onClick={() =>
                          navigator.clipboard
                            .writeText(details?.code)
                            .then(() =>
                              successToast("Gift card code copied successfully")
                            )
                        }
                      >
                        {details?.code}
                        <COPY_ICON />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : details?.modalType === "delete" ? (
              <DeleteDialog details={details} toggler={toggler} />
            ) : details?.modalType === "edit" ? (
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
