import React, { useState, useEffect, useCallback } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import ImageSelection from "components/General/Input/ImageSelection";
import Select from "components/General/Input/Select";
import Input from "components/General/Input/Input";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import CategoriesStore from "../../Categories/store";
import ProductsStore from "../store";
import { getUserInfoFromStorage } from "utils/storage";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";

const AddCollectionModal = observer(
  ({ isOpen, onClose, collection = null }) => {
    const {
      createCollection,
      updateCollection,
      createCollectionLoading,
      updateCollectionLoading,
    } = CategoriesStore;
    const { getProductsWithInventory, products: allProducts } = ProductsStore;

    const [collectionData, setCollectionData] = useState({
      name: "",
      description: "",
      imageUrl: "",
      productIds: [],
      selectedProducts: [], // Store full product objects
    });

    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const isEditMode = !!collection;
    const userInfo = getUserInfoFromStorage();
    const brandId = userInfo?.brand?.id;

    useEffect(() => {
      if (isEditMode && collection) {
        const selectedProducts = (collection.productIds || []).map(
          (productId) => {
            const product = collection.products?.find(
              (p) => p.id === productId
            );
            if (product) {
              return {
                label: product.name,
                value: productId,
                ...product,
              };
            }
            return {
              label: `Product ${productId}`,
              value: productId,
              id: productId,
              name: `Product ${productId}`,
              isActive: false,
              inventory: { quantityAvailable: 0 },
              imageUrls: [],
            };
          }
        );

        setCollectionData({
          name: collection.name || "",
          description: collection.description || "",
          imageUrl: collection.imageUrl || "",
          productIds: collection.productIds || [],
          selectedProducts: selectedProducts,
        });
      } else {
        setCollectionData({
          name: "",
          description: "",
          imageUrl: "",
          productIds: [],
          selectedProducts: [],
        });
      }
    }, [collection, isEditMode, isOpen]);

    const handleInputChange = (field, value) => {
      setCollectionData((prev) => ({ ...prev, [field]: value }));
    };

    const customOptionRenderer = (product) => (
      <div className="flex items-center justify-between w-full gap-1.5">
        <span className="text-sm">{product.name}</span>
        <div className="flex items-center gap-2.5 text-xs">
          <span>
            Status:{" "}
            <span
              className={product.isActive ? "text-green-600" : "text-red-600"}
            >
              {product.isActive ? "Live" : "Inactive"}
            </span>
          </span>
          <span>Stock: {product.inventory?.quantityAvailable || 0}</span>
        </div>
      </div>
    );

    const customSelectedOptionRenderer = (product, onRemove) => (
      <div className="flex items-center gap-2.5 border border-[#BBBBBB] h-11 px-4">
        {product.imageUrls?.[0] && (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-10 h-10 object-cover rounded"
          />
        )}
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm">{product.name}</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="text-[#6B7280] hover:text-[#374151] focus:outline-none"
          >
            ×
          </button>
        </div>
      </div>
    );

    const loadProductOptions = useCallback(
      async (inputValue) => {
        if (!brandId) return [];

        try {
          const params = {
            brandIds: [brandId],
            pageNumber: "1",
            searchQuery: inputValue || undefined,
          };

          const response = await getProductsWithInventory(params);
          const products = response || allProducts;

          return products.map((product) => ({
            label: product.name,
            value: product.id,
            ...product, // Include full product data for custom rendering
          }));
        } catch (error) {
          console.error("Error loading products:", error);
          return [];
        }
      },
      [brandId, getProductsWithInventory]
    );

    const handleSubmit = async () => {
      if (!collectionData.name.trim() || !brandId) return;

      let finalImageUrl = collectionData.imageUrl;

      // Upload image if it's a file object
      if (
        collectionData.imageUrl &&
        typeof collectionData.imageUrl === "object"
      ) {
        try {
          setIsUploadingImage(true);
          finalImageUrl = await uploadImageToCloud(collectionData.imageUrl);
          if (!finalImageUrl) {
            return; // Upload failed, don't proceed
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      const data = {
        createCollectionInput: {
          name: collectionData.name,
          description: collectionData.description,
          imageUrl: finalImageUrl || "",
          brandId: brandId,
          productIds: collectionData.productIds,
        },
      };

      if (isEditMode) {
        const updateData = {
          updateCollectionInput: {
            id: collection.id,
            name: collectionData.name,
            description: collectionData.description,
            imageUrl: finalImageUrl || "",
            brandId: brandId,
            productIds: collectionData.productIds,
          },
        };
        await updateCollection({
          data: updateData,
          onSuccess: () => {
            onClose();
            setCollectionData({
              name: "",
              description: "",
              imageUrl: "",
              productIds: [],
            });
          },
        });
      } else {
        await createCollection({
          data,
          onSuccess: () => {
            onClose();
            setCollectionData({
              name: "",
              description: "",
              imageUrl: "",
              productIds: [],
            });
          },
        });
      }
    };

    // Use the stored selectedProducts from state
    const selectedProducts = collectionData.selectedProducts;

    const isLoading =
      isUploadingImage || createCollectionLoading || updateCollectionLoading;

    return (
      <Modal
        active={isOpen}
        toggler={onClose}
        isSideModal={true}
        title={isEditMode ? "EDIT COLLECTION" : "CREATE A NEW COLLECTION"}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              isOutline
              text="CANCEL"
              onClick={onClose}
              isDisabled={isLoading}
            />
            <Button
              text={isEditMode ? "UPDATE COLLECTION" : "CREATE COLLECTION"}
              onClick={handleSubmit}
              isDisabled={!collectionData.name.trim() || isLoading}
              isLoading={isLoading}
            />
          </div>
        }
      >
        <div className="w-full h-full flex flex-col">
          <div className="py-6">
            <div className="gap-y-2">
              <Input
                placeholder="Collection Name"
                value={collectionData.name}
                onChangeFunc={(val) => handleInputChange("name", val)}
                fullWidth
              />

              <div className="mb-4">
                <label className="text-[14px] text-[#555555] block mb-2">
                  Collection description
                </label>
                <textarea
                  value={collectionData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Write your description here (max 140 chars)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                  maxLength={140}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {collectionData.description.length}/140 characters
                </div>
              </div>

              <ImageSelection
                label="Upload Banner (JPG, 1200x600px)"
                value={collectionData.imageUrl}
                onChange={(file) => handleInputChange("imageUrl", file)}
                accept="image/*"
                className="mb-4"
              />

              <Select
                label="Choose Products"
                placeholder="Search and select products..."
                loadOptions={loadProductOptions}
                value={selectedProducts}
                onChange={(selected) => {
                  const productIds = selected
                    ? selected.map((product) => product.value)
                    : [];
                  setCollectionData((prev) => ({
                    ...prev,
                    productIds: productIds,
                    selectedProducts: selected || [],
                  }));
                }}
                fullWidth
                isMulti
                async
                customOption={customOptionRenderer}
                customSelectedOption={customSelectedOptionRenderer}
                showSelectedOutside={true}
                selectedPosition="above"
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
);

export default AddCollectionModal;
