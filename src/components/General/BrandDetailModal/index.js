import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import { Button } from "../Button";

const BrandDetailModal = ({ active, brand, toggler }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");

  if (!brand) return null;

  const handleApprove = () => {
    setActionType("APPROVE");
    setShowConfirmModal(true);
  };

  const handleReject = () => {
    setActionType("REJECT");
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    console.log(`${actionType} brand:`, brand.brandName);
    // Here you would typically make an API call to update the brand status
    setShowConfirmModal(false);
    toggler();
  };

  return (
    <>
      <Modal active={active} toggler={toggler} isSideModal modalTitle="Brand Details">
        <div className="flex flex-col gap-6">
          {/* Banner Section */}
          <div className="relative h-[124px] w-full rounded-2xl overflow-hidden">
            <img 
              src={brand.imageUrls?.[0] || "https://via.placeholder.com/400x124"} 
              alt="Brand banner"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            
            {/* Brand info overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
              <img 
                src={brand.logoUrl || "https://via.placeholder.com/48x48"} 
                alt={`${brand.brandName} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex flex-col gap-1">
                <span className="text-white font-bold text-base">{brand.brandName}</span>
                <span className="text-white text-sm">
                  {brand.email || `Since ${brand.yearsInBusiness} years`}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="bg-white border border-[#DDDDDD] p-5 rounded flex">
            <div className="flex-1 text-center">
              <div className="text-sm text-[#777777] mb-1">Total orders</div>
              <div className="text-base font-bold text-[#111111]">{brand.totalOrders || 0}</div>
            </div>
            <div className="w-0.5 bg-[#E5E7EB] mx-4" />
            <div className="flex-1 text-center">
              <div className="text-sm text-[#777777] mb-1">Total Revenue</div>
              <div className="text-base font-bold text-[#111111]">₦{(brand.totalRevenue || 0).toLocaleString()}</div>
            </div>
            <div className="w-0.5 bg-[#E5E7EB] mx-4" />
            <div className="flex-1 text-center">
              <div className="text-sm text-[#777777] mb-1">Wallet Balance</div>
              <div className="text-base font-bold text-[#111111]">₦{(brand.walletBalance || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <h3 className="text-[#111827] text-[17px] font-bold mb-5">Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                <span className="text-base text-[#4B5563]">Product Category</span>
                <span className="text-base text-[#444444]">{brand.productCategory || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                <span className="text-base text-[#4B5563]">Address</span>
                <span className="text-base text-[#444444] text-right break-words max-w-[60%]">{brand.address || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80]">
                <span className="text-base text-[#4B5563]">Country/City</span>
                <span className="text-base text-[#444444]">{brand.country || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-3 py-2 border-b border-[#BBBBBB80]">
                <span className="text-base text-[#4B5563]">Brand Bio</span>
                <span className="text-base text-[#444444]">{brand.brandBio || "No bio available"}</span>
              </div>
            </div>
          </div>

          {/* Socials Section */}
          <div>
            <h3 className="text-base text-[#4B5563] mb-[18px]">Socials</h3>
            <div className="space-y-1">
              {brand.instagram && (
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80] gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#4B5563"/>
                    </svg>
                    <span className="text-base text-[#4B5563]">Instagram</span>
                  </div>
                  <span className="text-base text-[#444444] text-right break-all">{brand.instagram}</span>
                </div>
              )}
              {brand.tiktok && (
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80] gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#4B5563"/>
                    </svg>
                    <span className="text-base text-[#4B5563]">Tiktok</span>
                  </div>
                  <span className="text-base text-[#444444] text-right break-all">{brand.tiktok}</span>
                </div>
              )}
              {brand.website && (
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80] gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#4B5563"/>
                    </svg>
                    <span className="text-base text-[#4B5563]">Website</span>
                  </div>
                  <span className="text-base text-[#444444] text-right break-all">{brand.website}</span>
                </div>
              )}
              {brand.shopifyStoreUrl && (
                <div className="flex justify-between items-center py-2 border-b border-[#BBBBBB80] gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#4B5563"/>
                    </svg>
                    <span className="text-base text-[#4B5563]">Shopify Store Url</span>
                  </div>
                  <span className="text-base text-[#444444] text-right break-all">{brand.shopifyStoreUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions - Only show for pending brands */}
          {brand.status === "UNDER_REVIEW" && (
            <div className="mt-6 space-y-4">
              <p className="text-base text-[#000000]">
                Have you reviewed this brand? If yes you can proceed to approve or otherwise.
              </p>
              <div className="flex gap-4">
                <Button
                  text="APPROVE"
                  onClick={handleApprove}
                  className="flex-1"
                />
                <Button
                  text="REJECT"
                  onClick={handleReject}
                  isOutline
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal 
        active={showConfirmModal} 
        toggler={() => setShowConfirmModal(false)}
        modalTitle={`${actionType} Brand`}
      >
        <div className="text-center space-y-4">
          <p className="text-base text-[#111827]">
            Are you sure you want to {actionType.toLowerCase()} this brand?
          </p>
          <div className="flex gap-4">
            <Button
              text="Cancel"
              onClick={() => setShowConfirmModal(false)}
              isOutline
              className="flex-1"
            />
            <Button
              text={`Yes, ${actionType}`}
              onClick={confirmAction}
              className="flex-1"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

BrandDetailModal.propTypes = {
  active: PropTypes.bool.isRequired,
  brand: PropTypes.object,
  toggler: PropTypes.func.isRequired,
};

export default BrandDetailModal;