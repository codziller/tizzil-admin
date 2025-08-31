import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal/Modal";
import Button from "../Button/Button";
import { BsCheckCircleFill } from "react-icons/bs";

const SetupSuccessModal = ({ 
  isOpen, 
  onClose, 
  onExploreFeed, 
  onBackToHome 
}) => {
  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      size="md"
      hasToggler={false}
      closeOnClickOutside={false}
    >
      <div className="flex flex-col items-center text-center px-6 py-8">
        {/* Success Image/Icon */}
        <div className="h-[200px] w-full flex items-center justify-center mb-6">
          <BsCheckCircleFill className="text-green-500" size={120} />
        </div>
        
        {/* Title */}
        <h2 className="text-sm font-medium text-[#000000] mb-2">
          You're In.
        </h2>
        
        {/* Message */}
        <p className="text-sm text-[#000000] mb-1">
          We got your submission.<br/>
          Our team's reviewing it. If your drip's legit, you'll hear from us soon.
        </p>
        
        <p className="text-sm text-[#000000] mb-6">
          Until then—{' '}
          <span className="text-primary">cop drops, peep the feed, stay in the loop.</span>
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-[280px]">
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
    </Modal>
  );
};

SetupSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExploreFeed: PropTypes.func.isRequired,
  onBackToHome: PropTypes.func.isRequired,
};

export default SetupSuccessModal;