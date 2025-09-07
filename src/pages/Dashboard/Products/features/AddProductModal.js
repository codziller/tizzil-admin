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
import { HexColorPicker } from "react-colorful";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdAdd, MdDelete, MdDragIndicator } from "react-icons/md";

const AddProductModal = ({ isOpen, onClose, productId = null, filters = {}, pageNumber = 1 }) => {
  const { createProductWithInventory, createProductLoading, getProduct, product, getProductLoading } = ProductsStore;
  const { getCategories, categories } = CategoriesStore;
  
  const [activeTab, setActiveTab] = useState("Basics");
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  
  // Comprehensive state for options management
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState({
    name: "",
    type: "TEXT",
    values: [{ value: "", displayValue: "", colorHex: "" }]
  });
  
  // Comprehensive state for variants management
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    name: "",
    sku: "",
    initialStock: 0,
    optionValues: [{ optionName: "", optionValue: "" }]
  });
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
        options: product.productOptions ? product.productOptions.map(option => ({
          id: option.id,
          name: option.optionName,
          type: option.optionType,
          displayOrder: option.displayOrder,
          isRequired: option.isRequired,
          values: option.optionValues ? option.optionValues.map(value => ({
            id: value.id,
            value: value.value,
            displayValue: value.displayValue,
            colorHex: value.colorHex,
            imageUrl: value.imageUrl,
            measurement: value.measurement,
            measurementUnit: value.measurementUnit,
            displayOrder: value.displayOrder,
            isActive: value.isActive
          })) : []
        })) : [],
        variants: product.productVariants ? product.productVariants.map(variant => ({
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
          variantOptions: variant.variantOptions
        })) : [],
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

  // Options management functions
  const addOptionValue = () => {
    setCurrentOption(prev => ({
      ...prev,
      values: [...prev.values, { value: "", displayValue: "", colorHex: "" }]
    }));
  };

  const removeOptionValue = (index) => {
    setCurrentOption(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const updateOptionValue = (index, field, value) => {
    setCurrentOption(prev => ({
      ...prev,
      values: prev.values.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const onOptionDragEnd = (result) => {
    if (!result.destination) return;
    
    const newValues = Array.from(currentOption.values);
    const [reorderedValue] = newValues.splice(result.source.index, 1);
    newValues.splice(result.destination.index, 0, reorderedValue);
    
    setCurrentOption(prev => ({ ...prev, values: newValues }));
  };

  const saveCurrentOption = () => {
    if (!currentOption.name || currentOption.values.length === 0) return;
    
    const optionWithDisplayOrder = {
      ...currentOption,
      displayOrder: options.length + 1,
      values: currentOption.values.map((value, index) => ({
        ...value,
        displayOrder: index + 1
      }))
    };
    
    setOptions(prev => [...prev, optionWithDisplayOrder]);
    setCurrentOption({
      name: "",
      type: "TEXT", 
      values: [{ value: "", displayValue: "", colorHex: "" }]
    });
  };

  // Variants management functions
  const addOptionValueToVariant = () => {
    setCurrentVariant(prev => ({
      ...prev,
      optionValues: [...prev.optionValues, { optionName: "", optionValue: "" }]
    }));
  };

  const removeOptionValueFromVariant = (index) => {
    setCurrentVariant(prev => ({
      ...prev,
      optionValues: prev.optionValues.filter((_, i) => i !== index)
    }));
  };

  const updateVariantOptionValue = (index, field, value) => {
    setCurrentVariant(prev => ({
      ...prev,
      optionValues: prev.optionValues.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const saveCurrentVariant = () => {
    if (!currentVariant.name) return;
    
    setVariants(prev => [...prev, currentVariant]);
    setCurrentVariant({
      name: "",
      sku: "",
      initialStock: 0,
      optionValues: [{ optionName: "", optionValue: "" }]
    });
  };

  const addNewVariant = () => {
    setCurrentVariant({
      name: "",
      sku: "",
      initialStock: 0,
      optionValues: [{ optionName: "", optionValue: "" }]
    });
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
      footer={
        <div className="flex justify-end gap-3">
          {activeTab === "Media & deets" && !showVariantModal && !showOptionModal && (
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
      }
      submodal={
        showOptionModal
          ? {
              active: true,
              title: "OPTIONS",
              size: "xl",
              toggler: () => setShowOptionModal(false),
              footer: (
                <div className="flex gap-3">
                  <Button
                    text="CANCEL"
                    onClick={() => setShowOptionModal(false)}
                    outline
                  />
                  <Button
                    text="ADD OPTION"
                    onClick={() => {
                      saveCurrentOption();
                    }}
                    disabled={!currentOption.name || currentOption.values.some(v => !v.value)}
                  />
                </div>
              ),
              children: (
                <div className="flex flex-col gap-6">
                  {/* Created Options Preview */}
                  {options.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Created Options ({options.length})</h4>
                      <div className="space-y-2">
                        {options.map((option, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{option.name}</span>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{option.type}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {option.values.map((value, vIndex) => (
                                <div key={vIndex} className="flex items-center gap-1 text-xs px-2 py-1 bg-white rounded border">
                                  {value.colorHex && (
                                    <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: value.colorHex }} />
                                  )}
                                  {value.displayValue || value.value}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Option Form */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Add New Option</h4>
                    
                    <div className="flex gap-3">
                      <Input
                        placeholder="Option Name (e.g., Color, Size)"
                        value={currentOption.name}
                        onChangeFunc={(e) => setCurrentOption(prev => ({ ...prev, name: e.target.value }))}
                        className="flex-1"
                      />
                      <Select
                        placeholder="Type"
                        value={{ label: currentOption.type, value: currentOption.type }}
                        onChange={(selected) => setCurrentOption(prev => ({ ...prev, type: selected.value }))}
                        options={[
                          { label: "TEXT", value: "TEXT" },
                          { label: "COLOR", value: "COLOR" }
                        ]}
                        className="w-32"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Option Values</label>
                        <Button
                          text="Add Value"
                          onClick={addOptionValue}
                          size="sm"
                          outline
                          icon={<MdAdd />}
                        />
                      </div>

                      <DragDropContext onDragEnd={onOptionDragEnd}>
                        <Droppable droppableId="option-values">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                              {currentOption.values.map((value, index) => (
                                <Draggable key={`value-${index}`} draggableId={`value-${index}`} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                                    >
                                      <div {...provided.dragHandleProps} className="text-gray-400 cursor-move">
                                        <MdDragIndicator />
                                      </div>
                                      
                                      <Input
                                        placeholder="Value"
                                        value={value.value}
                                        onChangeFunc={(e) => updateOptionValue(index, "value", e.target.value)}
                                        className="flex-1"
                                      />
                                      
                                      {currentOption.type === "COLOR" && (
                                        <div className="flex items-center gap-2">
                                          <div 
                                            className="w-8 h-8 rounded border cursor-pointer"
                                            style={{ backgroundColor: value.colorHex || "#ffffff" }}
                                            onClick={() => {
                                              // Toggle color picker (implement with state if needed)
                                            }}
                                          />
                                          <HexColorPicker
                                            color={value.colorHex || "#ffffff"}
                                            onChange={(color) => updateOptionValue(index, "colorHex", color)}
                                            style={{ width: "150px", height: "100px" }}
                                          />
                                        </div>
                                      )}
                                      
                                      {currentOption.values.length > 1 && (
                                        <button
                                          onClick={() => removeOptionValue(index)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <MdDelete />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                </div>
              )
            }
          : showVariantModal
          ? {
              active: true,
              title: "VARIANTS",
              size: "xl",
              toggler: () => setShowVariantModal(false),
              footer: (
                <div className="flex gap-3">
                  <Button
                    text="CANCEL"
                    onClick={() => setShowVariantModal(false)}
                    outline
                  />
                  <Button
                    text="ADD VARIANT"
                    onClick={() => {
                      saveCurrentVariant();
                    }}
                    disabled={!currentVariant.name}
                  />
                </div>
              ),
              children: (
                <div className="flex flex-col gap-6">
                  {/* Created Variants Preview */}
                  {variants.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Created Variants ({variants.length})</h4>
                      <div className="space-y-2">
                        {variants.map((variant, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{variant.name}</span>
                              <div className="flex gap-2">
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Stock: {variant.initialStock}</span>
                                {variant.sku && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{variant.sku}</span>}
                              </div>
                            </div>
                            {variant.optionValues.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {variant.optionValues.map((optionValue, ovIndex) => (
                                  <span key={ovIndex} className="text-xs px-2 py-1 bg-white rounded border">
                                    {optionValue.optionName}: {optionValue.optionValue}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Variant Form */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Add New Variant</h4>
                      <Button
                        text="Add Variant Section"
                        onClick={addNewVariant}
                        size="sm"
                        outline
                      />
                    </div>
                    
                    <Input
                      placeholder="Variant Name"
                      value={currentVariant.name}
                      onChangeFunc={(e) => setCurrentVariant(prev => ({ ...prev, name: e.target.value }))}
                      fullWidth
                    />
                    
                    <div className="flex gap-3">
                      <Input
                        placeholder="SKU (optional)"
                        value={currentVariant.sku}
                        onChangeFunc={(e) => setCurrentVariant(prev => ({ ...prev, sku: e.target.value }))}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Initial Stock"
                        type="number"
                        value={currentVariant.initialStock}
                        onChangeFunc={(e) => setCurrentVariant(prev => ({ ...prev, initialStock: parseInt(e.target.value) || 0 }))}
                        className="flex-1"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Option Values</label>
                        <Button
                          text="Add Option Value"
                          onClick={addOptionValueToVariant}
                          size="sm"
                          outline
                          icon={<MdAdd />}
                        />
                      </div>

                      <div className="space-y-2">
                        {currentVariant.optionValues.map((optionValue, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                            <Input
                              placeholder="Option Name"
                              value={optionValue.optionName}
                              onChangeFunc={(e) => updateVariantOptionValue(index, "optionName", e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Option Value"
                              value={optionValue.optionValue}
                              onChangeFunc={(e) => updateVariantOptionValue(index, "optionValue", e.target.value)}
                              className="flex-1"
                            />
                            {currentVariant.optionValues.length > 1 && (
                              <button
                                onClick={() => removeOptionValueFromVariant(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <MdDelete />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
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

        {/* Preview Cards for Created Options and Variants */}
        {activeTab === "Media & deets" && (options.length > 0 || variants.length > 0) && (
          <div className="mt-6 space-y-4">
            {/* Options Preview Cards */}
            {options.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Product Options ({options.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.map((option, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-blue-900">{option.name}</h5>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{option.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value, vIndex) => (
                          <div key={vIndex} className="flex items-center gap-2 text-sm px-2 py-1 bg-white rounded-md border border-blue-200">
                            {value.colorHex && (
                              <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: value.colorHex }} />
                            )}
                            <span className="text-gray-700">{value.displayValue || value.value}</span>
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
                <h4 className="text-sm font-medium text-gray-900 mb-3">Product Variants ({variants.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {variants.map((variant, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-green-900">{variant.name}</h5>
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
                          {variant.optionValues.map((optionValue, ovIndex) => (
                            <span key={ovIndex} className="text-sm px-2 py-1 bg-white rounded-md border border-green-200 text-gray-700">
                              <span className="font-medium">{optionValue.optionName}:</span> {optionValue.optionValue}
                            </span>
                          ))}
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

export default AddProductModal;
