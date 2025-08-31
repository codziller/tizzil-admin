import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "components/General/Button/Button";
import { observer } from "mobx-react-lite";

const AccountSetupFive = ({ formData, onSubmit, isLoading, onBack }) => {
  const [confirmOwnership, setConfirmOwnership] = useState(false);

  const handleSubmit = () => {
    if (confirmOwnership) {
      onSubmit();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-[#111111] mb-2">Ready to Drop?</h3>
      <p className="text-sm text-[#6B7280] mb-8">
        Submit your brand to join the lineup. We review every entry. If it's heat, we'll be in touch.
      </p>
      
      <div className="flex flex-col space-y-6">
        {/* Review Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-[#111111] mb-3">Review Your Information</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Brand Name:</span> {formData?.brandName || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData?.brandEmail || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Address:</span> {formData?.addressLine1 || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Country:</span> {formData?.country || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">City:</span> {formData?.city || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Category:</span> {formData?.productCategory || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Logo:</span> {formData?.logo ? 'Uploaded' : 'Not uploaded'}
            </div>
            <div>
              <span className="font-medium">Banner:</span> {formData?.banner ? 'Uploaded' : 'Not uploaded'}
            </div>
            {formData?.instagramUrl && (
              <div>
                <span className="font-medium">Instagram:</span> {formData.instagramUrl}
              </div>
            )}
            {formData?.tiktokUrl && (
              <div>
                <span className="font-medium">TikTok:</span> {formData.tiktokUrl}
              </div>
            )}
            {formData?.websiteUrl && (
              <div>
                <span className="font-medium">Website:</span> {formData.websiteUrl}
              </div>
            )}
          </div>
        </div>

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
            <Button
              text="BACK"
              fullWidth
              isOutline
              onClick={onBack}
            />
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
          <label htmlFor="confirmOwnership" className="text-sm text-[#374151] cursor-pointer">
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
};

export default observer(AccountSetupFive);