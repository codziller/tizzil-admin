import React, { useState, useEffect } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import ImagePicker from "components/General/Input/ImagePicker";
import ImageSelection from "components/General/Input/ImageSelection";
import Select from "components/General/Input/Select";
import Input from "components/General/Input/Input";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import CategoriesStore from "../../Categories/store";
import { getUserInfoFromStorage } from "utils/storage";
import { successToast } from "components/General/Toast/Toast";
import classNames from "classnames";

const AddProductModal = ({ isOpen, onClose, productId = null, filters = {}, pageNumber = 1 }) => {
  const { createProductWithInventory, createProductLoading, getProduct, product, getProductLoading } = ProductsStore;
  const { getCategories, categories } = CategoriesStore;
  
  const [activeTab, setActiveTab] = useState("Basics");
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    baseCostPrice: 0,
    baseSku: "",
    categoryIds: [],
    imageUrls: [],
    initialStock: 0,
    weight: 0,
    weightType: "grams",
    isPrivate: false,
    metaTitle: "",
    metaDescription: "",
    howToUse: "",
    productIngredients: "",
    tags: [],
    options: [],
    variants: [],
    ribbon: null,
    exchangeRateSaleCurrency: null,
    lowInQuantityValue: ""
  });

  const userInfo = getUserInfoFromStorage();
  const brandId = userInfo?.brand?.id;

  const tabs = ["Basics", "Media & deets", "Fulfillment"];

  useEffect(() => {
    if (isOpen) {
      getCategories();
      if (productId) {
        // Load product for editing
        getProduct({ data: { id: productId } });
      }
    }
  }, [isOpen, productId]);

  useEffect(() => {
    if (product && productId) {
      // Populate form when editing
      setProductData({
        name: product.name || "",
        description: product.description || "",
        basePrice: product.basePrice || 0,
        baseCostPrice: product.baseCostPrice || 0,
        baseSku: product.baseSku || "",
        categoryIds: product.categories?.map(cat => cat.id) || [],
        imageUrls: product.imageUrls || [],
        initialStock: product.currentStock || 0,
        weight: product.weight || 0,
        weightType: product.weightType || "grams",
        isPrivate: !product.isPublic,
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
        howToUse: product.howToUse || "",
        productIngredients: product.productIngredients || "",
        tags: product.tags || [],
        options: product.productOptions || [],
        variants: product.productVariants || [],
        ribbon: product.ribbon || null,
        exchangeRateSaleCurrency: product.exchangeRateSaleCurrency || null,
        lowInQuantityValue: product.lowInQuantityValue || ""
      });
    }
  }, [product, productId]);

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleSubmit = async () => {
    if (!brandId) return;
    
    try {
      await createProductWithInventory({
        brandId,
        productData,
        filters,
        pageNumber,
        onSuccess: (createdProduct) => {
          onClose();
          // Reset form
          setProductData({
            name: "",
            description: "",
            basePrice: 0,
            baseCostPrice: 0,
            baseSku: "",
            categoryIds: [],
            imageUrls: [],
            initialStock: 0,
            weight: 0,
            weightType: "grams",
            isPrivate: false,
            metaTitle: "",
            metaDescription: "",
            howToUse: "",
            productIngredients: "",
            tags: [],
            options: [],
            variants: [],
            ribbon: null,
            exchangeRateSaleCurrency: null,
            lowInQuantityValue: ""
          });
          setActiveTab("Basics");
          
          // Show success toast with actions
          successToast(
            "Product Created Successfully",
            `${createdProduct.name} has been created and is now available in your inventory.`,
            8000,
            [
              {
                label: "Edit",
                variant: "outline",
                onClick: () => {
                  // Reopen modal in edit mode
                  // TODO: Implement edit functionality
                }
              },
              {
                label: "Duplicate",
                onClick: () => {
                  // TODO: Open duplicate modal
                }
              }
            ]
          );
        }
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Convert categories to options
  const categoryOptions = categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }));

  const selectedCategories = categoryOptions.filter(option => 
    productData.categoryIds.includes(option.value)
  );

  const ribbonOptions = [
    { label: "Best Seller", value: "BEST_SELLER" },
    { label: "New In", value: "NEW_IN" },
    { label: "Sale", value: "SALE" },
    { label: "Limited Edition", value: "LIMITED_EDITION" },
  ];

  const returnPolicyOptions = [
    { label: "7 Days", value: "7days" },
    { label: "14 Days", value: "14days" },
    { label: "30 Days", value: "30days" },
  ];

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      isSideModal={true}
      title="NEW PRODUCT"
      size="xl"
    >
      <div className="w-full h-full flex flex-col">
        <div className="border-b border-gray-200">
          {/* Tabs */}
          <div className="bg-[#EEEEEE] p-1 flex h-11">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={classNames(
                  "flex-1 px-4 py-2 text-xs uppercase font-medium transition-all",
                  {
                    "bg-white text-[#690007] shadow-md": activeTab === tab,
                    "text-[#050505]": activeTab !== tab,
                  }
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6">
          {/* Basics Tab */}
          {activeTab === "Basics" && (
            <div className="gap-y-2">
              <Input
                placeholder="Product Name"
                value={productData.name}
                onChangeFunc={(e) => handleInputChange("name", e.target.value)}
                fullWidth
              />

              <div className="mb-4">
                <label className="text-[14px] text-[#555555] block mb-2">
                  Product description
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Write your description here (max 140 chars)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                  maxLength={140}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {productData.description.length}/140 characters
                </div>
              </div>

              <Select
                placeholder="Categories"
                options={categoryOptions}
                value={selectedCategories}
                onChange={(selected) => {
                  const categoryIds = selected ? selected.map(cat => cat.value) : [];
                  handleInputChange("categoryIds", categoryIds);
                }}
                fullWidth
                isMulti
              />

              <div className="flex gap-3">
                <Input
                  placeholder="Base Price"
                  type="number"
                  value={productData.basePrice}
                  onChangeFunc={(e) =>
                    handleInputChange("basePrice", parseFloat(e.target.value) || 0)
                  }
                  className="flex-1"
                />
                <Input
                  placeholder="Cost Price"
                  type="number"
                  value={productData.baseCostPrice}
                  onChangeFunc={(e) =>
                    handleInputChange("baseCostPrice", parseFloat(e.target.value) || 0)
                  }
                  className="flex-1"
                />
              </div>

              <Input
                placeholder="SKU"
                value={productData.baseSku}
                onChangeFunc={(e) => handleInputChange("baseSku", e.target.value)}
                fullWidth
              />
            </div>
          )}

          {/* Media & deets Tab */}
          {activeTab === "Media & deets" && (
            <div className="flex flex-col justify-start gap-y-6">
              <ImagePicker
                label="Please upload at least 2, max 6"
                handleDrop={(files) => {
                  const urls = files.map(file => URL.createObjectURL(file));
                  handleInputChange("imageUrls", [...productData.imageUrls, ...urls]);
                }}
                images={productData.imageUrls}
                setImages={(imgs) => handleInputChange("imageUrls", imgs)}
                removeImage={(index) => {
                  const newUrls = productData.imageUrls.filter((_, i) => i !== index);
                  handleInputChange("imageUrls", newUrls);
                }}
                multiple
              />

              <Input
                placeholder="Initial Stock"
                type="number"
                value={productData.initialStock}
                onChangeFunc={(e) =>
                  handleInputChange("initialStock", parseInt(e.target.value) || 0)
                }
                fullWidth
              />

              <div className="mb-4">
                <label className="text-[14px] text-[#555555] block mb-2">
                  Meta Title
                </label>
                <Input
                  value={productData.metaTitle}
                  onChange={(e) =>
                    handleInputChange("metaTitle", e.target.value)
                  }
                  placeholder="Enter meta title"
                  fullWidth
                />
              </div>

              <div className="mb-4">
                <label className="text-[14px] text-[#555555] block mb-2">
                  Meta Description
                </label>
                <textarea
                  value={productData.metaDescription}
                  onChange={(e) =>
                    handleInputChange("metaDescription", e.target.value)
                  }
                  placeholder="Enter meta description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                />
              </div>

              <div className="mb-4">
                <label className="text-[14px] text-[#555555] block mb-2">
                  How to Use
                </label>
                <textarea
                  value={productData.howToUse}
                  onChange={(e) =>
                    handleInputChange("howToUse", e.target.value)
                  }
                  placeholder="Enter usage instructions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                />
              </div>

              <div className="mb-4">
                <label className="text-[14px] text-[#555555] block mb-2">
                  Product Ingredients
                </label>
                <textarea
                  value={productData.productIngredients}
                  onChange={(e) =>
                    handleInputChange("productIngredients", e.target.value)
                  }
                  placeholder="Enter product ingredients"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                />
              </div>

              <Select
                placeholder="Ribbon"
                options={ribbonOptions}
                value={ribbonOptions.find(option => option.value === productData.ribbon)}
                onChange={(selected) =>
                  handleInputChange("ribbon", selected?.value || null)
                }
                fullWidth
              />

              <Input
                placeholder="Low Stock Alert Quantity"
                type="number"
                value={productData.lowInQuantityValue}
                onChangeFunc={(e) =>
                  handleInputChange("lowInQuantityValue", e.target.value)
                }
                fullWidth
              />

              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={productData.isPrivate}
                  onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
                  className="w-4 h-4 text-[#690007] border-gray-300 rounded focus:ring-[#690007]"
                />
                <label htmlFor="isPrivate" className="text-sm text-gray-700">
                  Make this product private
                </label>
              </div>
            </div>
          )}

          {/* Fulfillment Tab */}
          {activeTab === "Fulfillment" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Weight"
                  type="number"
                  value={productData.weight}
                  onChangeFunc={(e) =>
                    handleInputChange("weight", parseFloat(e.target.value) || 0)
                  }
                  className="flex-1"
                />
                <Select
                  placeholder="Type"
                  options={[
                    { label: "grams", value: "grams" },
                    { label: "kg", value: "kg" },
                    { label: "lb", value: "lb" },
                  ]}
                  value={{ label: productData.weightType, value: productData.weightType }}
                  onChange={(selected) =>
                    handleInputChange("weightType", selected?.value || "grams")
                  }
                  className="w-32"
                />
              </div>

              <div className="mb-4">
                <label className="text-[14px] text-[#555555] block mb-2">
                  Tags (comma separated)
                </label>
                <Input
                  value={productData.tags.join(", ")}
                  onChangeFunc={(e) => {
                    const tagsArray = e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag);
                    handleInputChange("tags", tagsArray);
                  }}
                  placeholder="Enter tags separated by commas"
                  fullWidth
                />
              </div>

              <Input
                placeholder="Exchange Rate Sale Currency"
                type="number"
                value={productData.exchangeRateSaleCurrency}
                onChangeFunc={(e) =>
                  handleInputChange("exchangeRateSaleCurrency", parseFloat(e.target.value) || null)
                }
                fullWidth
              />
            </div>
          )}
        </div>

        <div className="w-full flex justify-end gap-3">
          {activeTab === "Media & deets" && (
            <>
              <Button
                text="CREATE VARIANT"
                onClick={() => setShowVariantModal(true)}
                outline
                size="sm"
              />
              <Button
                text="CREATE OPTION"
                onClick={() => setShowOptionModal(true)}
                outline
                size="sm"
              />
            </>
          )}
          <Button
            text={activeTab === "Fulfillment" ? "CREATE PRODUCT" : "CONTINUE"}
            onClick={activeTab === "Fulfillment" ? handleSubmit : handleNext}
            loading={createProductLoading}
          />
        </div>
      </div>

      {/* Variant Creation Submodal */}
      <Modal
        active={showVariantModal}
        toggler={() => setShowVariantModal(false)}
        isSideModal={true}
        isSubmodal={true}
        submodalDirection="right"
        zIndex={100000}
        title="CREATE VARIANT"
        size="lg"
      >
        <div className="flex flex-col gap-4 h-full">
          <Input
            placeholder="Variant Name"
            value=""
            onChangeFunc={() => {}}
            fullWidth
          />
          
          <Input
            placeholder="Price"
            type="number"
            value=""
            onChangeFunc={() => {}}
            fullWidth
          />
          
          <Input
            placeholder="Cost Price"
            type="number"
            value=""
            onChangeFunc={() => {}}
            fullWidth
          />
          
          <Input
            placeholder="SKU"
            value=""
            onChangeFunc={() => {}}
            fullWidth
          />
          
          <Input
            placeholder="Stock Quantity"
            type="number"
            value=""
            onChangeFunc={() => {}}
            fullWidth
          />
          
          <div className="flex gap-2 mt-auto">
            <Button
              text="CANCEL"
              onClick={() => setShowVariantModal(false)}
              outline
            />
            <Button
              text="CREATE VARIANT"
              onClick={() => {
                // TODO: Implement variant creation logic
                setShowVariantModal(false);
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Option Creation Submodal */}
      <Modal
        active={showOptionModal}
        toggler={() => setShowOptionModal(false)}
        isSideModal={true}
        isSubmodal={true}
        submodalDirection="right"
        zIndex={100000}
        title="CREATE OPTION"
        size="lg"
      >
        <div className="flex flex-col gap-4 h-full">
          <Input
            placeholder="Option Name (e.g., Color, Size)"
            value=""
            onChangeFunc={() => {}}
            fullWidth
          />
          
          <div className="mb-4">
            <label className="text-[14px] text-[#555555] block mb-2">
              Option Values (comma separated)
            </label>
            <Input
              placeholder="e.g., Red, Blue, Green or S, M, L, XL"
              value=""
              onChangeFunc={() => {}}
              fullWidth
            />
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="affectsPrice"
              className="w-4 h-4 text-[#690007] border-gray-300 rounded focus:ring-[#690007]"
            />
            <label htmlFor="affectsPrice" className="text-sm text-gray-700">
              This option affects pricing
            </label>
          </div>
          
          <div className="flex gap-2 mt-auto">
            <Button
              text="CANCEL"
              onClick={() => setShowOptionModal(false)}
              outline
            />
            <Button
              text="CREATE OPTION"
              onClick={() => {
                // TODO: Implement option creation logic
                setShowOptionModal(false);
              }}
            />
          </div>
        </div>
      </Modal>
    </Modal>
  );
};

export default AddProductModal;
