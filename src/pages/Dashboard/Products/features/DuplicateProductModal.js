import React, { useState, useEffect } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import CategoriesStore from "../../Categories/store";
import { getUserInfoFromStorage } from "utils/storage";
import { successToast } from "components/General/Toast/Toast";
import classNames from "classnames";

const DuplicateProductModal = ({ isOpen, onClose, productToDuplicate, filters = {}, pageNumber = 1 }) => {
  const { createProductWithInventory, createProductLoading } = ProductsStore;
  const { getCategories, categories } = CategoriesStore;
  
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

  useEffect(() => {
    if (isOpen) {
      getCategories();
      if (productToDuplicate) {
        // Populate form with product to duplicate, but modify name and SKU
        setProductData({
          name: `${productToDuplicate.name} (Copy)`,
          description: productToDuplicate.description || "",
          basePrice: productToDuplicate.basePrice || 0,
          baseCostPrice: productToDuplicate.baseCostPrice || 0,
          baseSku: `${productToDuplicate.baseSku || ""}-copy`,
          categoryIds: productToDuplicate.categories?.map(cat => cat.id) || [],
          imageUrls: productToDuplicate.imageUrls || [],
          initialStock: 0, // Reset stock to 0 for duplicated product
          weight: productToDuplicate.weight || 0,
          weightType: productToDuplicate.weightType || "grams",
          isPrivate: !productToDuplicate.isPublic,
          metaTitle: productToDuplicate.metaTitle || "",
          metaDescription: productToDuplicate.metaDescription || "",
          howToUse: productToDuplicate.howToUse || "",
          productIngredients: productToDuplicate.productIngredients || "",
          tags: productToDuplicate.tags || [],
          options: productToDuplicate.productOptions || [],
          variants: productToDuplicate.productVariants || [],
          ribbon: productToDuplicate.ribbon || null,
          exchangeRateSaleCurrency: productToDuplicate.exchangeRateSaleCurrency || null,
          lowInQuantityValue: productToDuplicate.lowInQuantityValue || ""
        });
      }
    }
  }, [isOpen, productToDuplicate]);

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
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
          
          // Show success toast with actions
          successToast(
            "Product Duplicated Successfully",
            `${createdProduct.name} has been created as a duplicate and is now available in your inventory.`,
            8000,
            [
              {
                label: "Edit",
                variant: "outline",
                onClick: () => {
                  // TODO: Implement edit functionality
                }
              },
              {
                label: "View",
                onClick: () => {
                  // TODO: Open product details modal
                }
              }
            ]
          );
        }
      });
    } catch (error) {
      console.error("Error duplicating product:", error);
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

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      isSideModal={true}
      title="DUPLICATE PRODUCT"
      size="xl"
    >
      <div className="w-full h-full flex flex-col">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Duplicating: <span className="font-semibold">{productToDuplicate?.name}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Review and modify the details below before creating the duplicate.
          </p>
        </div>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
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

          <Input
            placeholder="Initial Stock"
            type="number"
            value={productData.initialStock}
            onChangeFunc={(e) =>
              handleInputChange("initialStock", parseInt(e.target.value) || 0)
            }
            fullWidth
          />

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

          <Select
            placeholder="Ribbon"
            options={ribbonOptions}
            value={ribbonOptions.find(option => option.value === productData.ribbon)}
            onChange={(selected) =>
              handleInputChange("ribbon", selected?.value || null)
            }
            fullWidth
          />

          <div className="flex items-center gap-3">
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

        <div className="w-full flex justify-end gap-3 mt-6">
          <Button
            text="CANCEL"
            onClick={onClose}
            outline
          />
          <Button
            text="DUPLICATE PRODUCT"
            onClick={handleSubmit}
            loading={createProductLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default observer(DuplicateProductModal);