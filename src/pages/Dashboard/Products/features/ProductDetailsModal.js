import React, { useState, useEffect } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import classNames from "classnames";

const ProductDetailsModal = ({ isOpen, onClose, product, productId }) => {
  const { getProduct, product: fetchedProduct, getProductLoading } = ProductsStore;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Use fetched product if available, otherwise use passed product
  const productData = fetchedProduct || product;

  useEffect(() => {
    if (isOpen && productId && !product) {
      // Fetch product details by ID if productId is provided and no product is passed
      getProduct({ data: { id: productId } });
    }
  }, [isOpen, productId, product]);

  // Show loading state while fetching product
  if (isOpen && getProductLoading) {
    return (
      <Modal
        active={isOpen}
        toggler={onClose}
        isSideModal={true}
        title="Loading..."
        size="xl"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#690007]"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </Modal>
    );
  }

  if (!productData) return null;

  const images = productData.imageUrls || [];
  const reviewCount = 3; // Sample review count

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      isSideModal={true}
      title="Product Details"
      size="xl"
    >
      <div className="w-full h-full flex flex-col">
        <div className="border-b border-gray-200">
          {/* Product Status */}
          <div className="mb-2 flex items-center gap-3">
            <span
              className={classNames("text-xs px-2 py-1 rounded", {
                "bg-green-100 text-[#22C55E]": productData.isActive,
                "bg-gray-100 text-gray-600": !productData.isActive,
              })}
            >
              {productData.isActive ? "Active" : "Inactive"}
            </span>
            {productData.ribbon && (
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">
                {productData.ribbon.replace('_', ' ')}
              </span>
            )}
            {!productData.isPublic && (
              <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-600">
                Private
              </span>
            )}
          </div>

          {/* Product Info */}
          <h3 className="text-[22px] text-[#111111] font-bold mb-2">
            {productData.name}
          </h3>
          <div className="flex items-center gap-5 mb-4">
            <span className="text-[14px] text-[#444444]">
              SKU: {productData.baseSku || 'N/A'}
            </span>
            <span className="text-[14px] text-[#444444]">
              Stock: {productData.currentStock || 0}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex text-[#690007]">{"★".repeat(5)}</div>
              <span className="text-[14px] text-[#6D7280]">
                ({reviewCount})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <p className="text-[17px] text-[#111827] font-bold">
              ₦{productData.basePrice?.toLocaleString() || '0'}
            </p>
            {productData.baseCostPrice && (
              <p className="text-[14px] text-[#6B7280]">
                Cost: ₦{productData.baseCostPrice.toLocaleString()}
              </p>
            )}
          </div>

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
                src={images[activeImageIndex] || images[0] || '/placeholder-image.png'}
                alt={productData.name}
                className="w-full h-[350px] object-cover rounded-lg"
              />
            </div>
            {images.length > 1 && (
              <div className="flex flex-col gap-3">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${productData.name} ${index + 1}`}
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
            )}
          </div>

          {/* Weight Info */}
          {productData.weight && (
            <div className="border-t border-b border-[#E5E7EB] py-5 mb-5">
              <div className="flex items-center gap-5 mb-2">
                <span className="text-[14px] text-[#111827] font-bold">
                  Weight:
                </span>
                <span className="text-[14px] text-[#4B5563]">
                  {productData.weight} {productData.weightType || 'grams'}
                </span>
              </div>
              {productData.lowInQuantityValue && (
                <p className="text-[12px] text-orange-600">
                  Low stock alert at: {productData.lowInQuantityValue} units
                </p>
              )}
            </div>
          )}

          {/* Product Details */}
          {productData.description && (
            <div className="mb-5">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                Description:
              </h4>
              <p className="text-[14px] text-[#4B5563]">
                {productData.description}
              </p>
            </div>
          )}

          {/* How to Use */}
          {productData.howToUse && (
            <div className="mb-5">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                How to Use:
              </h4>
              <p className="text-[14px] text-[#4B5563]">
                {productData.howToUse}
              </p>
            </div>
          )}

          {/* Ingredients */}
          {productData.productIngredients && (
            <div className="mb-5">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                Ingredients:
              </h4>
              <p className="text-[14px] text-[#4B5563]">
                {productData.productIngredients}
              </p>
            </div>
          )}

          {/* Categories */}
          {productData.categories && productData.categories.length > 0 && (
            <div className="mb-5">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                Categories:
              </h4>
              <div className="flex flex-wrap gap-2">
                {productData.categories.map((category) => (
                  <span
                    key={category.id}
                    className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {productData.tags && productData.tags.length > 0 && (
            <div className="mb-5">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                Tags:
              </h4>
              <div className="flex flex-wrap gap-2">
                {productData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {productData.productVariants && productData.productVariants.length > 0 && (
            <div className="mb-5">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                Variants:
              </h4>
              <div className="space-y-2">
                {productData.productVariants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{variant.variantName}</span>
                      <span className="text-xs text-gray-500">{variant.sku}</span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-600">
                      <span>₦{variant.salePrice?.toLocaleString()}</span>
                      <span>Stock: {variant.currentStock}</span>
                      {variant.isLowStock && <span className="text-orange-600">Low Stock</span>}
                      {variant.isOutOfStock && <span className="text-red-600">Out of Stock</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          {productData.productOptions && productData.productOptions.length > 0 && (
            <div className="mb-8">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                Options:
              </h4>
              <div className="space-y-2">
                {productData.productOptions.map((option) => (
                  <div key={option.id} className="p-2 border border-gray-200 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">{option.optionName}:</span>
                      <span className="text-xs text-gray-500">({option.optionType})</span>
                      {option.isRequired && (
                        <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {option.optionValues?.map((optionValue) => (
                        <div
                          key={optionValue.id}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700"
                        >
                          {optionValue.colorHex && (
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: optionValue.colorHex }}
                            />
                          )}
                          {optionValue.imageUrl && (
                            <img
                              src={optionValue.imageUrl}
                              alt={optionValue.value}
                              className="w-3 h-3 rounded"
                            />
                          )}
                          <span>
                            {optionValue.displayValue || optionValue.value}
                          </span>
                          {optionValue.measurement && (
                            <span className="text-gray-500">
                              ({optionValue.measurement} {optionValue.measurementUnit})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variant Options Details */}
          {productData.productVariants && productData.productVariants.some(v => v.variantOptions && v.variantOptions.length > 0) && (
            <div className="mb-8">
              <h4 className="text-[14px] text-[#111827] font-bold mb-4">
                Variant Option Combinations:
              </h4>
              <div className="space-y-3">
                {productData.productVariants
                  .filter(v => v.variantOptions && v.variantOptions.length > 0)
                  .map((variant) => (
                  <div key={variant.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{variant.variantName}</span>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                          ₦{variant.salePrice?.toLocaleString()}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Stock: {variant.currentStock}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.variantOptions.map((variantOption) => (
                        <div key={variantOption.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-50 border">
                          <span className="font-medium">{variantOption.productOption?.optionName}:</span>
                          <div className="flex items-center gap-1">
                            {variantOption.productOptionValue?.colorHex && (
                              <div
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: variantOption.productOptionValue.colorHex }}
                              />
                            )}
                            <span>
                              {variantOption.productOptionValue?.displayValue || variantOption.productOptionValue?.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {variant.inventory && (
                      <div className="mt-2 text-xs text-gray-600">
                        <div className="flex flex-wrap gap-3">
                          <span>Available: {variant.inventory.quantityAvailable}</span>
                          <span>On Hand: {variant.inventory.quantityOnHand}</span>
                          <span>Allocated: {variant.inventory.quantityAllocated}</span>
                          {variant.inventory.quantityInTransit > 0 && (
                            <span>In Transit: {variant.inventory.quantityInTransit}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default observer(ProductDetailsModal);
