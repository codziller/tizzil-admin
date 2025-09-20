import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal/Modal/Modal";
import { Button } from "../Button";
import CircleLoader from "../CircleLoader/CircleLoader";
import Textarea from "../Textarea/Textarea";
import BrandsStore from "../../../pages/Dashboard/Brands/store";
import { observer } from "mobx-react-lite";

const BrandDetailModal = ({ active, brand, toggler, currentFilters = {} }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const {
    getBrand,
    getBrandLoading,
    approveBrandRegistration,
    rejectBrandRegistration,
    approveBrandLoading,
    rejectBrandLoading,
  } = BrandsStore;
  const [brandData, setBrandData] = useState(null);

  useEffect(() => {
    // Only fetch brand details for approved brands (those with id, not registrationId)
    if (active && brand?.id && !brand?.registrationId) {
      getBrand({ data: { brandId: brand.id } }).then(() => {
        setBrandData(BrandsStore.brand);
      });
    }
  }, [active, brand?.id]);

  // For pending brands, use the original data. For approved brands, use fetched data if available
  const currentBrand = brand?.registrationId ? brand : brandData || brand;
  const isPendingBrand = !!brand?.registrationId;

  if (!currentBrand) return null;

  const handleApprove = () => {
    setActionType("APPROVE");
    setShowConfirmModal(true);
  };

  const handleReject = () => {
    setActionType("REJECT");
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    const onSuccess = () => {
      setShowConfirmModal(false);
      setRejectionReason("");
      toggler();
    };

    if (actionType === "APPROVE") {
      approveBrandRegistration({
        registrationId: currentBrand.registrationId,
        onSuccess,
        filters: currentFilters,
      });
    } else if (actionType === "REJECT") {
      if (!rejectionReason.trim()) {
        return; // Don't proceed if no rejection reason
      }
      rejectBrandRegistration({
        registrationId: currentBrand.registrationId,
        rejectionReason: rejectionReason.trim(),
        onSuccess,
        filters: currentFilters,
      });
    }
  };

  return (
    <>
      <Modal
        active={active}
        toggler={toggler}
        isSideModal={true}
        title="BRAND DETAILS"
        size="xl"
        footer={
          isPendingBrand ? (
            <div className="flex justify-end gap-3">
              <Button
                text="REJECT"
                isOutline
                onClick={handleReject}
                className="flex-1"
                isDisabled={approveBrandLoading || rejectBrandLoading}
              />
              <Button
                text="APPROVE"
                onClick={handleApprove}
                className="flex-1"
                isDisabled={approveBrandLoading || rejectBrandLoading}
              />
            </div>
          ) : null
        }
      >
        {getBrandLoading ? (
          <div className="flex justify-center items-center py-16">
            <CircleLoader blue />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Banner Section */}
            <div className="relative h-[124px] w-full rounded-2xl overflow-hidden">
              <img
                src={
                  isPendingBrand
                    ? "https://via.placeholder.com/400x124"
                    : currentBrand.imageUrls?.[0] ||
                      "https://via.placeholder.com/400x124"
                }
                alt="Brand banner"
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40" />

              {/* Brand info overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-4">
                <img
                  src={
                    isPendingBrand
                      ? "https://via.placeholder.com/48x48"
                      : currentBrand.logoUrl ||
                        "https://via.placeholder.com/48x48"
                  }
                  alt={`${currentBrand.brandName} logo`}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold text-base">
                    {currentBrand.brandName}
                  </span>
                  <span className="text-white text-sm">
                    {isPendingBrand
                      ? currentBrand.ownerEmail
                      : currentBrand.owner?.email ||
                        `Since ${currentBrand.yearsInBusiness} years`}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="bg-white border border-[#DDDDDD] p-5 rounded flex">
              {isPendingBrand ? (
                <>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-[#777777] mb-1">
                      Total Products
                    </div>
                    <div className="text-base font-bold text-[#111111]">
                      {currentBrand.totalProducts || 0}
                    </div>
                  </div>
                  <div className="w-0.5 bg-[#E5E7EB] mx-4" />
                  <div className="flex-1 text-center">
                    <div className="text-sm text-[#777777] mb-1">
                      Monthly Orders Est.
                    </div>
                    <div className="text-base font-bold text-[#111111]">
                      {currentBrand.estimatedMonthlyOrders || 0}
                    </div>
                  </div>
                  <div className="w-0.5 bg-[#E5E7EB] mx-4" />
                  <div className="flex-1 text-center">
                    <div className="text-sm text-[#777777] mb-1">
                      Years in Business
                    </div>
                    <div className="text-base font-bold text-[#111111]">
                      {currentBrand.businessInfo?.yearsInBusiness || "N/A"}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-[#777777] mb-1">
                      Years in Business
                    </div>
                    <div className="text-base font-bold text-[#111111]">
                      {currentBrand.yearsInBusiness || 0}
                    </div>
                  </div>
                  <div className="w-0.5 bg-[#E5E7EB] mx-4" />
                  <div className="flex-1 text-center">
                    <div className="text-sm text-[#777777] mb-1">Status</div>
                    <div className="text-base font-bold text-[#111111]">
                      {currentBrand.status || "N/A"}
                    </div>
                  </div>
                  <div className="w-0.5 bg-[#E5E7EB] mx-4" />
                  <div className="flex-1 text-center">
                    <div className="text-sm text-[#777777] mb-1">
                      Monthly Orders
                    </div>
                    <div className="text-base font-bold text-[#111111]">
                      {currentBrand.estimatedMonthlyOrders || 0}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Details Section */}
            <div>
              <h3 className="text-[#111827] text-[17px] font-bold mb-5">
                Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                  <span className="text-base text-[#4B5563]">Owner</span>
                  <span className="text-base text-[#444444]">
                    {isPendingBrand
                      ? currentBrand.ownerName
                      : currentBrand.owner
                      ? `${currentBrand.owner.firstName} ${currentBrand.owner.lastName}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                  <span className="text-base text-[#4B5563]">Email</span>
                  <span className="text-base text-[#444444]">
                    {isPendingBrand
                      ? currentBrand.ownerEmail
                      : currentBrand.owner?.email || "N/A"}
                  </span>
                </div>
                {!isPendingBrand && (
                  <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                    <span className="text-base text-[#4B5563]">Phone</span>
                    <span className="text-base text-[#444444]">
                      {currentBrand.owner?.phoneNumber || "N/A"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                  <span className="text-base text-[#4B5563]">Address</span>
                  <span className="text-base text-[#444444] text-right break-words max-w-[60%]">
                    {isPendingBrand
                      ? currentBrand.addressInfo
                        ? [
                            currentBrand.addressInfo.addressLine1,
                            currentBrand.addressInfo.city,
                            currentBrand.addressInfo.state,
                            currentBrand.addressInfo.country,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : "N/A"
                      : [
                          currentBrand.addressLine1,
                          currentBrand.addressLine2,
                          currentBrand.city,
                          currentBrand.state,
                          currentBrand.country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                  <span className="text-base text-[#4B5563]">
                    Business Registration
                  </span>
                  <span className="text-base text-[#444444]">
                    {isPendingBrand
                      ? currentBrand.businessInfo?.registrationNumber || "N/A"
                      : currentBrand.businessRegistrationNumber || "N/A"}
                  </span>
                </div>
                {isPendingBrand && currentBrand.businessInfo?.taxId && (
                  <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                    <span className="text-base text-[#4B5563]">Tax ID</span>
                    <span className="text-base text-[#444444]">
                      {currentBrand.businessInfo.taxId}
                    </span>
                  </div>
                )}
                {!isPendingBrand && (
                  <div className="flex flex-col gap-3 py-2 border-b border-[#BBBBBB80]">
                    <span className="text-base text-[#4B5563]">
                      Description
                    </span>
                    <span className="text-base text-[#444444]">
                      {currentBrand.description ||
                        currentBrand.shortText ||
                        "No description available"}
                    </span>
                  </div>
                )}
                {!isPendingBrand && (
                  <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                    <span className="text-base text-[#4B5563]">
                      Delivery Settings
                    </span>
                    <span className="text-base text-[#444444]">
                      Domestic: ₦{currentBrand.domesticDeliveryFee || "0"}
                      {currentBrand.shouldHandleDomesticDelivery
                        ? " (Self-handled)"
                        : " (External)"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                  <span className="text-base text-[#4B5563]">
                    Product Import Method
                  </span>
                  <span className="text-base text-[#444444]">
                    {currentBrand.productImportMethod || "N/A"}
                  </span>
                </div>
                {isPendingBrand && (
                  <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                    <span className="text-base text-[#4B5563]">
                      Shopify Integration
                    </span>
                    <span className="text-base text-[#444444]">
                      {currentBrand.hasShopifyIntegration ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Integration Section - Only for approved brands */}
            {!isPendingBrand && (
              <div>
                <h3 className="text-base text-[#4B5563] mb-[18px]">
                  Integration
                </h3>
                <div className="space-y-1">
                  {currentBrand.shopifyStoreUrl && (
                    <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80] gap-2">
                      <div className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"
                            fill="#4B5563"
                          />
                        </svg>
                        <span className="text-base text-[#4B5563]">
                          Shopify Store URL
                        </span>
                      </div>
                      <span className="text-base text-[#444444] text-right break-all">
                        {currentBrand.shopifyStoreUrl}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        active={showConfirmModal}
        toggler={() => setShowConfirmModal(false)}
        title={`${actionType} BRAND`}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              text="CANCEL"
              isOutline
              onClick={() => {
                setShowConfirmModal(false);
                setRejectionReason("");
              }}
              className="flex-1"
              isDisabled={approveBrandLoading || rejectBrandLoading}
            />
            <Button
              text={`YES, ${actionType}`}
              onClick={confirmAction}
              className="flex-1"
              isLoading={
                actionType === "APPROVE"
                  ? approveBrandLoading
                  : rejectBrandLoading
              }
              isDisabled={
                (actionType === "REJECT" && !rejectionReason.trim()) ||
                approveBrandLoading ||
                rejectBrandLoading
              }
            />
          </div>
        }
      >
        <div className="py-4">
          <p className="text-base text-[#111827] mb-4">
            Are you sure you want to {actionType.toLowerCase()} this brand?
          </p>

          {actionType === "REJECT" && (
            <div className="mt-4">
              <Textarea
                label="Rejection Reason"
                placeholder="Please provide a reason for rejecting this brand..."
                value={rejectionReason}
                onChangeFunc={(e) => setRejectionReason(e)}
                required
                rows={4}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

BrandDetailModal.propTypes = {
  active: PropTypes.bool.isRequired,
  brand: PropTypes.object,
  toggler: PropTypes.func.isRequired,
  currentFilters: PropTypes.object,
};

export default observer(BrandDetailModal);
