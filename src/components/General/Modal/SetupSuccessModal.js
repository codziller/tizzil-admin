import React from "react";
import PropTypes from "prop-types";
import Portal from "../Portal";
import Modal from "./Modal/Modal";
import Button from "../Button/Button";
import setupSuccessImage from "assets/images/setup-success-image.png";

const SetupSuccessModal = ({
  isOpen,
  onClose,
  onExploreFeed,
  onBackToHome,
}) => {
  return (
    <Portal>
      <Modal
        active={isOpen}
        toggler={onClose}
        size="md"
        hasToggler={false}
        closeOnClickOutside={false}
        noPadding={true}
      >
        <div className="flex flex-col items-start z-[12]">
          {/* Success Image - No padding affects this */}
          <div className="h-[200px] w-full flex items-center justify-center mb-6">
            <img
              src={setupSuccessImage}
              alt="Setup Success"
              className="max-h-full max-w-full object-cover w-full"
            />
          </div>

          {/* Lower section with padding */}
          <div className="px-6 pb-8 w-full">
            {/* Title */}
            <span className="text-sm uppercase text-[#000000] mb-2 text-left">
              You're In.
            </span>

            {/* Message */}
            <p className="text-sm text-[#000000] mb-1 text-left">
              We got your submission.
              <br />
              Our team's reviewing it. If your drip's legit, you'll hear from us
              soon.
            </p>

            <p className="text-sm text-[#000000] mb-6 text-left">
              Until then—{" "}
              <span className="text-primary">
                cop drops, peep the feed, stay in the loop.
              </span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full">
              <Button
                text="Explore the Feed"
                fullWidth
                onClick={onExploreFeed}
              />
              <Button
                text="Back to Home"
                fullWidth
                isOutline
                onClick={onBackToHome}
              />
            </div>
          </div>
        </div>
      </Modal>
    </Portal>
  );
};

SetupSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExploreFeed: PropTypes.func.isRequired,
  onBackToHome: PropTypes.func.isRequired,
};

export default SetupSuccessModal;
