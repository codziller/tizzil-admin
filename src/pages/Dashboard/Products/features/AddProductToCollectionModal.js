import React, { useState, useEffect } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import { Button } from "components/General/Button";
import classNames from "classnames";
import SearchBar from "components/General/Searchbar/SearchBar";
import ProductCard from "components/General/ProductCard";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import CategoriesStore from "../../Categories/store";
import { getUserInfoFromStorage } from "utils/storage";
import { successToast, errorToast } from "components/General/Toast/Toast";
import CircleLoader from "components/General/CircleLoader/CircleLoader";

const AddProductToCollectionModal = ({ isOpen, onClose, collection }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [initialCollectionProducts, setInitialCollectionProducts] = useState([]);
  const [initialCollectionProductObjects, setInitialCollectionProductObjects] = useState([]);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get dependencies from stores
  const { getProductsWithInventory, products, loading } = ProductsStore;
  const {
    addMultipleProductsToCollection,
    removeMultipleProductsFromCollection,
    addMultipleProductsToCollectionLoading,
    removeMultipleProductsFromCollectionLoading,
  } = CategoriesStore;

  // Get user info
  const userInfo = getUserInfoFromStorage();
  const brandId = userInfo?.brand?.id;

  // Load products when modal opens
  useEffect(() => {
    if (isOpen && collection && brandId) {
      loadProducts();
      loadCollectionProducts();
    }
  }, [isOpen, collection, brandId]);

  const loadProducts = async () => {
    if (!brandId) return;

    const params = {
      brandIds: [brandId],
      pageNumber: "1",
      searchQuery: searchInput || undefined,
    };

    await getProductsWithInventory(params);
  };

  const loadCollectionProducts = async () => {
    if (!brandId || !collection?.id) return;

    setIsLoading(true);
    try {
      const params = {
        brandIds: [brandId],
        collectionIds: [collection.id],
        pageNumber: "1",
      };

      // Use isSearch=true to get products without overwriting the main store
      const collectionProducts = await getProductsWithInventory(params, true);
      // Products in this collection are the ones we should pre-select
      const collectionProductIds = (collectionProducts || []).map(p => p.id);
      setInitialCollectionProducts(collectionProductIds);
      setInitialCollectionProductObjects(collectionProducts || []);
      setSelectedProducts(collectionProductIds);
    } catch (error) {
      console.error("Error loading collection products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search handling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        loadProducts();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleProductSelection = (productId, isSelected) => {
    setSelectedProducts(prev => {
      if (isSelected) {
        // Only add if not already present to avoid duplicates
        return prev.includes(productId) ? prev : [...prev, productId];
      } else {
        return prev.filter(id => id !== productId);
      }
    });
  };

  const handleSaveSelection = async () => {
    if (!collection?.id || !brandId) return;

    try {
      const currentSelected = new Set(selectedProducts);
      const initialSelected = new Set(initialCollectionProducts);

      // Products to add (selected now but weren't initially)
      const toAdd = [...new Set(selectedProducts.filter(id => !initialSelected.has(id)))];

      // Products to remove (were initially selected but not selected now)
      const toRemove = [...new Set(initialCollectionProducts.filter(id => !currentSelected.has(id)))];

      // Add products if any
      if (toAdd.length > 0) {
        await addMultipleProductsToCollection({
          data: {
            collectionId: collection.id,
            productIds: toAdd,
          },
          noAlert: true,
        });
      }

      // Remove products if any
      if (toRemove.length > 0) {
        await removeMultipleProductsFromCollection({
          data: {
            collectionId: collection.id,
            productIds: toRemove,
          },
          noAlert: true,
        });
      }

      if (toAdd.length > 0 || toRemove.length > 0) {
        successToast(
          "Products Updated Successfully",
          `${toAdd.length} products added, ${toRemove.length} products removed from ${collection.name}.`
        );
      } else {
        successToast("No Changes", "No changes were made to the collection.");
      }

      onClose();
    } catch (error) {
      console.error("Error saving selection:", error);
      errorToast("Error", "Failed to update collection products. Please try again.");
    }
  };

  const filteredProducts = (products || []).filter(product =>
    product.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const isProductSelected = (productId) => selectedProducts.includes(productId);

  return (
    <>
      <Modal
        active={isOpen}
        toggler={onClose}
        isSideModal={true}
        title={`ADD PRODUCTS TO ${collection?.name?.toUpperCase()}`}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button isOutline text="CANCEL" onClick={onClose} />
            <Button
              text="SAVE SELECTION"
              onClick={handleSaveSelection}
              isLoading={addMultipleProductsToCollectionLoading || removeMultipleProductsFromCollectionLoading}
            />
          </div>
        }
        submodal={
          showViewAllModal
            ? {
                active: showViewAllModal,
                title: `ALL PRODUCTS IN ${collection?.name?.toUpperCase()}`,
                toggler: () => setShowViewAllModal(false),
                size: "xl",
                footer: (
                  <div className="flex justify-end">
                    <Button text="CLOSE" onClick={() => setShowViewAllModal(false)} />
                  </div>
                ),
                children: (
                  <div className="w-full h-full flex flex-col pb-6 gap-6">
                    <div
                      className={classNames(
                        "grid gap-5 w-full",
                        "grid-cols-1 sm:grid-cols-2"
                      )}
                    >
                      {initialCollectionProductObjects.map((product) => {
                        if (!product) return null;

                        return (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isSelect={true}
                            selected={true}
                            onSelectionChange={() => {}} // Read-only in view all modal
                          />
                        );
                      })}
                    </div>
                  </div>
                ),
              }
            : null
        }
      >
        <div className="w-full h-full flex flex-col pb-6 gap-6">
          {/* Product count and view all */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {initialCollectionProducts.length} products in this collection
            </span>
            <button
              onClick={() => setShowViewAllModal(true)}
              className="text-sm text-[#690007] underline hover:no-underline"
            >
              view all
            </button>
          </div>

          <SearchBar
            placeholder={"Search your existing products"}
            onChange={setSearchInput}
            value={searchInput}
            className="flex"
          />

          {isLoading || loading ? (
            <div className="flex justify-center items-center h-64">
              <CircleLoader blue />
            </div>
          ) : (
            <div
              className={classNames(
                "grid gap-5 w-full",
                "grid-cols-1 sm:grid-cols-2"
              )}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelect={true}
                  selected={isProductSelected(product.id)}
                  onSelectionChange={(selected) =>
                    handleProductSelection(product.id, selected)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default observer(AddProductToCollectionModal);