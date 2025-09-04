import React, { useState } from "react";
import Modal from "components/General/Modal/Modal/Modal";

import { Button } from "components/General/Button";
import classNames from "classnames";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!product) return null;

  const images = product.imageUrls || [];
  const reviewCount = 3; // Sample review count

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      isSideModal={true}
      title="Preview"
      size="xl"
    >
      <div className="w-full h-full flex flex-col">
        <div className="border-b border-gray-200">
          {/* Product Status */}
          <div className="mb-2">
            <span
              className={classNames("text-xs px-2 py-1 rounded", {
                "bg-green-100 text-[#22C55E]": product.status === "Active",
                "bg-gray-100 text-gray-600": product.status !== "Active",
              })}
            >
              {product.status || "Active"}
            </span>
          </div>

          {/* Product Info */}
          <h3 className="text-[22px] text-[#111111] font-bold mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-5 mb-4">
            <span className="text-[14px] text-[#444444]">
              Item {product.code}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex text-[#690007]">{"★".repeat(5)}</div>
              <span className="text-[14px] text-[#6D7280]">
                ({reviewCount})
              </span>
            </div>
          </div>

          <p className="text-[17px] text-[#111827] font-bold mb-5">
            {product.salePrice}
          </p>

          {/* Order Notification */}
          <div className="flex items-center justify-between p-4 border-t border-b border-[#690007] mb-5">
            <div className="flex items-center gap-5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15h-2v-2h2v2zm0-4h-2V6h2v5z"
                  fill="#F59E0B"
                />
              </svg>
              <div>
                <span className="text-[14px] text-gray-700 font-medium">
                  3 Orders{" "}
                </span>
                <span className="text-[14px] text-gray-500">to fulfil</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 12l4-4-4-4"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Image Gallery */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-[350px] object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-3">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={classNames(
                    "w-[60px] h-[60px] object-cover rounded-lg cursor-pointer",
                    {
                      "border-3 border-[#690007]": activeImageIndex === index,
                      "border border-gray-200": activeImageIndex !== index,
                    }
                  )}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="border-t border-b border-[#E5E7EB] py-5 mb-5">
            <div className="flex items-center gap-5 mb-5">
              <span className="text-[14px] text-[#111827] font-bold">
                Delivery:
              </span>
              <span className="text-[12px] text-[#22C55E] bg-green-100 px-2 py-1 rounded">
                Confident
              </span>
            </div>
            <p className="text-[14px] text-[#4B5563]">Between 1 to 2 days</p>
          </div>

          {/* Product Details */}
          <div className="mb-5">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Product details:
            </h4>
            <p className="text-[14px] text-[#4B5563]">
              {product.productDescription}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">
              Features:
            </h4>
            <p className="text-[14px] text-[#4B5563]">
              {product.productfeatures}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between gap-3">
            <Button
              text="Delete product"
              isOutline
              onClick={() => setShowDeleteModal(true)}
              className="flex-1"
            />
            <Button text="Move to drafts" isOutline className="flex-1" />
            <Button text="Edit product" className="flex-1" />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal active={showDeleteModal} toggler={() => setShowDeleteModal(false)}>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold mb-4">Delete Product</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <Button
              text="Cancel"
              isOutline
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            />
            <Button
              text="Delete"
              onClick={() => {
                setShowDeleteModal(false);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>
      </Modal>
    </Modal>
  );
};

export default ProductDetailsModal;
