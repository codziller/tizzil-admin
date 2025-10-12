import React, { useState, useEffect } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import CategoriesStore from "../../Categories/store";
import { getUserInfoFromStorage } from "utils/storage";
import { successToast, errorToast } from "components/General/Toast/Toast";
import { uploadImagesToCloud } from "utils/uploadImagesToCloud";
import classNames from "classnames";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import OptionModal from "./OptionModal";
import VariantModal from "./VariantModal";
import BasicTab from "./BasicTab";
import MediaDeetsTab from "./MediaDeetsTab";
import FulfillmentTab from "./FulfillmentTab";

const AddProductModal = ({
  isOpen,
  onClose,
  productId = null,
  filters = {},
  pageNumber = 1,
  product: editProduct = null,
  isEdit = false,
}) => {
  const {
    createProductWithInventory,
    updateProduct,
    createProductLoading,
    getProduct,
    product,
    getProductLoading,
  } = ProductsStore;
  const { getCategories, categories } = CategoriesStore;

  const [activeTab, setActiveTab] = useState("Basics");
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);

  // Store actual file objects for uploading later
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  // Comprehensive state for options management
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState({
    name: "",
    type: "TEXT",
    values: [{ value: "", displayValue: "", colorHex: "" }],
  });

  // Comprehensive state for variants management
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    name: "",
    sku: "",
    initialStock: 0,
    optionValues: [{ optionName: "", optionValue: "" }],
  });
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    basePrice: "",
    baseCostPrice: "",
    baseSku: "",
    categoryIds: [],
    imageUrls: [],
    initialStock: 0,
    weight: "",
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
    lowInQuantityValue: "",
  });

  const userInfo = getUserInfoFromStorage();
  console.log("userInfo: ", userInfo);
  const brandId = userInfo?.brand?.id;
  console.log("brandId: ", brandId);
  const tabs = ["Basics", "Media & deets", "Fulfillment"];

  useEffect(() => {
    if (isOpen) {
      getCategories();
      if (productId) {
        // Load product for editing (legacy)
        getProduct({ data: { id: productId } });
      } else if (isEdit && editProduct?.id) {
        // Load product for editing (new prop-based approach)
        getProduct({ data: { id: editProduct.id } });
      }
    } else {
      // Clean up when modal is closed
      imagePreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      setImageFiles([]);
      setImagePreviewUrls([]);
      // Reset form data
      setProductData({
        name: "",
        description: "",
        basePrice: "",
        baseCostPrice: "",
        baseSku: "",
        categoryIds: [],
        imageUrls: [],
        initialStock: 0,
        weight: "",
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
        lowInQuantityValue: "",
      });
      setActiveTab("Basics");
    }
  }, [isOpen, productId, isEdit, editProduct]);

  useEffect(() => {
    if (product && (productId || (isEdit && editProduct?.id))) {
      // Populate form when editing
      setProductData({
        name: product.name || "",
        description: product.description || "",
        basePrice: product.basePrice || 0,
        baseCostPrice: product.baseCostPrice || 0,
        baseSku: product.baseSku || "",
        categoryIds: product.categories?.map((cat) => cat.id) || [],
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
        options: product.productOptions
          ? product.productOptions.map((option) => ({
              id: option.id,
              name: option.optionName,
              type: option.optionType,
              displayOrder: option.displayOrder,
              isRequired: option.isRequired,
              values: option.optionValues
                ? option.optionValues.map((value) => ({
                    id: value.id,
                    value: value.value,
                    displayValue: value.displayValue,
                    colorHex: value.colorHex,
                    imageUrl: value.imageUrl,
                    measurement: value.measurement,
                    measurementUnit: value.measurementUnit,
                    displayOrder: value.displayOrder,
                    isActive: value.isActive,
                  }))
                : [],
            }))
          : [],
        variants: product.productVariants
          ? product.productVariants.map((variant) => ({
              id: variant.id,
              name: variant.variantName,
              sku: variant.sku,
              barcode: variant.barcode,
              salePrice: variant.salePrice,
              costPrice: variant.costPrice,
              currentStock: variant.currentStock,
              weight: variant.weight,
              weightType: variant.weightType,
              description: variant.description,
              imageUrls: variant.imageUrls,
              videoUrls: variant.videoUrls,
              isDefault: variant.isDefault,
              isActive: variant.isActive,
              visibility: variant.visibility,
              compareAtPrice: variant.compareAtPrice,
              inventory: variant.inventory,
              variantOptions: variant.variantOptions,
            }))
          : [],
        ribbon: product.ribbon || null,
        exchangeRateSaleCurrency: product.exchangeRateSaleCurrency || null,
        lowInQuantityValue: product.lowInQuantityValue || "",
      });
    }
  }, [product, productId, isEdit, editProduct]);

  // Cleanup effect for when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any remaining object URLs
      imagePreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageDrop = (files) => {
    if (!files || files.length === 0) return;

    // Create preview URLs for the new files
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    // Store the actual files for uploading later
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // Get combined list of all images for display
  const getAllImages = () => {
    return [...(productData.imageUrls || []), ...imagePreviewUrls];
  };

  const handleImageRemove = (index) => {
    const allImages = getAllImages();
    const existingUrlsCount = productData.imageUrls?.length || 0;

    if (index < existingUrlsCount) {
      // Removing an existing URL
      const newUrls = productData.imageUrls.filter((_, i) => i !== index);
      handleInputChange("imageUrls", newUrls);
    } else {
      // Removing a preview URL (new file)
      const previewIndex = index - existingUrlsCount;

      // Revoke the object URL to free memory
      if (imagePreviewUrls[previewIndex]) {
        URL.revokeObjectURL(imagePreviewUrls[previewIndex]);
      }

      // Remove from both arrays
      setImageFiles((prev) => prev.filter((_, i) => i !== previewIndex));
      setImagePreviewUrls((prev) => prev.filter((_, i) => i !== previewIndex));
    }
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Options management functions
  const addOptionValue = () => {
    setCurrentOption((prev) => ({
      ...prev,
      values: [...prev.values, { value: "", displayValue: "", colorHex: "" }],
    }));
  };

  const removeOptionValue = (index) => {
    setCurrentOption((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const updateOptionValue = (index, field, value) => {
    setCurrentOption((prev) => ({
      ...prev,
      values: prev.values.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const onOptionDragEnd = (result) => {
    if (!result.destination) return;

    const newValues = Array.from(currentOption.values);
    const [reorderedValue] = newValues.splice(result.source.index, 1);
    newValues.splice(result.destination.index, 0, reorderedValue);

    setCurrentOption((prev) => ({ ...prev, values: newValues }));
  };

  const saveCurrentOption = () => {
    if (!currentOption.name || currentOption.values.length === 0) return;

    const optionWithDisplayOrder = {
      ...currentOption,
      displayOrder: options.length + 1,
      values: currentOption.values.map((value, index) => ({
        ...value,
        displayOrder: index + 1,
      })),
    };

    setOptions((prev) => [...prev, optionWithDisplayOrder]);
    setCurrentOption({
      name: "",
      type: "TEXT",
      values: [{ value: "", displayValue: "", colorHex: "" }],
    });
  };

  const removeOption = (indexToRemove) => {
    setOptions((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeVariant = (indexToRemove) => {
    setVariants((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleEditOptionFromCard = (index) => {
    const optionToEdit = options[index];
    setCurrentOption(optionToEdit);
    setEditingOptionIndex(index);
    setShowOptionModal(true);
  };

  const handleEditVariantFromCard = (index) => {
    const variantToEdit = variants[index];
    setCurrentVariant(variantToEdit);
    setEditingVariantIndex(index);
    setShowVariantModal(true);
  };

  // Variants management functions
  const addOptionValueToVariant = () => {
    setCurrentVariant((prev) => ({
      ...prev,
      optionValues: [...prev.optionValues, { optionName: "", optionValue: "" }],
    }));
  };

  const removeOptionValueFromVariant = (index) => {
    setCurrentVariant((prev) => ({
      ...prev,
      optionValues: prev.optionValues.filter((_, i) => i !== index),
    }));
  };

  const updateVariantOptionValue = (index, field, value) => {
    setCurrentVariant((prev) => ({
      ...prev,
      optionValues: prev.optionValues.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const saveCurrentVariant = () => {
    if (!currentVariant.name) return;

    setVariants((prev) => [...prev, currentVariant]);
    setCurrentVariant({
      name: "",
      sku: "",
      initialStock: 0,
      optionValues: [{ optionName: "", optionValue: "" }],
    });
  };

  const addNewVariant = () => {
    setCurrentVariant({
      name: "",
      sku: "",
      initialStock: 0,
      optionValues: [{ optionName: "", optionValue: "" }],
    });
  };

  const handleSubmit = async () => {
    if (!brandId) return;

    setIsUploadingImages(true);

    try {
      let finalImageUrls = [...(productData.imageUrls || [])];

      // Upload new image files if any
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadImagesToCloud(imageFiles);
        if (uploadedUrls && uploadedUrls.length > 0) {
          finalImageUrls = [...finalImageUrls, ...uploadedUrls];
          successToast(
            "Images uploaded successfully",
            `${uploadedUrls.length} new image(s) uploaded to cloud`
          );
        } else {
          errorToast("Upload failed", "Some images failed to upload");
          setIsUploadingImages(false);
          return;
        }
      }

      // Include options, variants, and uploaded images in productData before submission
      const submissionData = {
        ...productData,
        imageUrls: finalImageUrls,
        options: options,
        variants: variants,
        tags: productData.tags.filter((tag) => tag.trim() !== ""),
      };

      if (isEdit && (editProduct?.id || productId)) {
        // Update existing product
        const updateData = {
          id: editProduct?.id || productId,
          ...submissionData,
        };

        await updateProduct({
          brandId,
          updateData,
          filters,
          pageNumber,
          onSuccess: (updatedProduct) => {
            onClose();

            // Clean up object URLs
            imagePreviewUrls.forEach((url) => {
              if (url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
              }
            });

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
              lowInQuantityValue: "",
            });
            setOptions([]);
            setVariants([]);
            setImageFiles([]);
            setImagePreviewUrls([]);
            setActiveTab("Basics");

            // Show success toast
            successToast(
              "Product Updated Successfully",
              `${updatedProduct.name} has been updated successfully.`
            );
          },
        });
      } else {
        // Create new product
        await createProductWithInventory({
          brandId,
          productData: submissionData,
          filters,
          pageNumber,
          onSuccess: (createdProduct) => {
            onClose();

            // Clean up object URLs
            imagePreviewUrls.forEach((url) => {
              if (url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
              }
            });

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
              lowInQuantityValue: "",
            });
            setOptions([]);
            setVariants([]);
            setImageFiles([]);
            setImagePreviewUrls([]);
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
                  },
                },
                {
                  label: "Duplicate",
                  onClick: () => {
                    // TODO: Open duplicate modal
                  },
                },
              ],
              { maxWidth: "100%", width: "100%" }
            );
          },
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      errorToast(
        "Error",
        `Failed to ${isEdit ? "update" : "create"} product. Please try again.`
      );
    } finally {
      setIsUploadingImages(false);
    }
  };

  // Convert categories to options
  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const selectedCategories = categoryOptions.filter((option) =>
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
      title={isEdit ? "EDIT PRODUCT" : "NEW PRODUCT"}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          {activeTab === "Media & deets" &&
            !showVariantModal &&
            !showOptionModal && (
              <>
                {options.length > 0 && (
                  <Button
                    text="CREATE VARIANT"
                    onClick={() => setShowVariantModal(true)}
                    isOutline
                    size="sm"
                  />
                )}
                <Button
                  text="CREATE OPTION"
                  onClick={() => setShowOptionModal(true)}
                  isOutline
                  size="sm"
                />
              </>
            )}
          <Button
            text={
              activeTab === "Fulfillment"
                ? isUploadingImages
                  ? "UPLOADING IMAGES..."
                  : isEdit
                  ? "UPDATE PRODUCT"
                  : "CREATE PRODUCT"
                : "CONTINUE"
            }
            onClick={activeTab === "Fulfillment" ? handleSubmit : handleNext}
            isLoading={createProductLoading || isUploadingImages}
          />
        </div>
      }
      submodal={
        showOptionModal
          ? OptionModal({
              isOpen: showOptionModal,
              onClose: () => setShowOptionModal(false),
              options,
              setOptions,
              currentOption,
              setCurrentOption,
              addOptionValue,
              removeOptionValue,
              updateOptionValue,
              onOptionDragEnd,
              saveCurrentOption,
              editingOptionIndex,
              setEditingOptionIndex,
            })
          : showVariantModal
          ? VariantModal({
              isOpen: showVariantModal,
              onClose: () => setShowVariantModal(false),
              variants,
              setVariants,
              currentVariant,
              setCurrentVariant,
              addOptionValueToVariant,
              removeOptionValueFromVariant,
              updateVariantOptionValue,
              saveCurrentVariant,
              addNewVariant,
              options,
              editingVariantIndex,
              setEditingVariantIndex,
            })
          : null
      }
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
            <BasicTab
              productData={productData}
              handleInputChange={handleInputChange}
              categoryOptions={categoryOptions}
              selectedCategories={selectedCategories}
            />
          )}

          {/* Media & deets Tab */}
          {activeTab === "Media & deets" && (
            <MediaDeetsTab
              productData={productData}
              handleInputChange={handleInputChange}
              isUploadingImages={isUploadingImages}
              getAllImages={getAllImages}
              handleImageDrop={handleImageDrop}
              handleImageRemove={handleImageRemove}
              ribbonOptions={ribbonOptions}
            />
          )}

          {/* Fulfillment Tab */}
          {activeTab === "Fulfillment" && (
            <FulfillmentTab
              productData={productData}
              handleInputChange={handleInputChange}
            />
          )}
        </div>

        {/* Preview Cards for Created Options and Variants */}
        {activeTab === "Media & deets" &&
          (options.length > 0 || variants.length > 0) && (
            <div className="mt-6 space-y-4">
              {/* Options Preview Cards */}
              {options.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Product Options ({options.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                      >
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => handleEditOptionFromCard(index)}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            title="Edit option"
                          >
                            <MdEdit size={14} />
                          </button>
                          <button
                            onClick={() => removeOption(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete option"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mb-2 pr-16">
                          <h5 className="font-medium text-blue-900">
                            {option.name}
                          </h5>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {option.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value, vIndex) => (
                            <div
                              key={vIndex}
                              className="flex items-center gap-2 text-sm px-2 py-1 bg-white rounded-md border border-blue-200"
                            >
                              {value.colorHex && (
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: value.colorHex }}
                                />
                              )}
                              <span className="text-gray-700">
                                {value.displayValue || value.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants Preview Cards */}
              {variants.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Product Variants ({variants.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className="relative p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                      >
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => handleEditVariantFromCard(index)}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            title="Edit variant"
                          >
                            <MdEdit size={14} />
                          </button>
                          <button
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete variant"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mb-2 pr-16">
                          <h5 className="font-medium text-green-900">
                            {variant.name}
                          </h5>
                          <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              Stock: {variant.initialStock}
                            </span>
                            {variant.sku && (
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {variant.sku}
                              </span>
                            )}
                          </div>
                        </div>
                        {variant.optionValues.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {variant.optionValues.map(
                              (optionValue, ovIndex) => (
                                <span
                                  key={ovIndex}
                                  className="text-sm px-2 py-1 bg-white rounded-md border border-green-200 text-gray-700"
                                >
                                  <span className="font-medium">
                                    {optionValue.optionName}:
                                  </span>{" "}
                                  {optionValue.optionValue}
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </Modal>
  );
};

export default observer(AddProductModal);
