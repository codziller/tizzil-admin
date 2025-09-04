import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "components/General/Button/Button";
import { observer } from "mobx-react-lite";

const AccountSetupFive = ({
  formData,
  onSubmit,
  isLoading,
  onBack,
  hideTitle = false,
}) => {
  const [confirmOwnership, setConfirmOwnership] = useState(false);

  const handleSubmit = () => {
    if (confirmOwnership) {
      onSubmit();
    }
  };

  return (
    <div className="w-full">
      {!hideTitle && (
        <h3 className="text-xl font-bold text-[#111111] mb-2">
          Ready to Drop?
        </h3>
      )}
      <p className="text-sm text-[#6B7280] mb-8">
        Submit your brand to join the lineup. We review every entry. If it's
        heat, we'll be in touch.
      </p>

      <div className="flex flex-col space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            text="Submit for Review"
            fullWidth
            isLoading={isLoading}
            isDisabled={!confirmOwnership}
            onClick={handleSubmit}
          />

          <div className="mt-2 w-full">
            <Button text="BACK" fullWidth isOutline onClick={onBack} />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="confirmOwnership"
            checked={confirmOwnership}
            onChange={(e) => setConfirmOwnership(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label
            htmlFor="confirmOwnership"
            className="text-sm text-[#374151] cursor-pointer"
          >
            I confirm I own the rights to all images and designs submitted.
          </label>
        </div>
      </div>
    </div>
  );
};

AccountSetupFive.propTypes = {
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  onBack: PropTypes.func,
  hideTitle: PropTypes.bool,
};

export default observer(AccountSetupFive);
