import React, { useEffect, useState } from "react";
import _, { isEmpty } from "lodash";
import { useNavigate, useParams } from "react-router";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";

import { ReactComponent as SearchBlackIcon } from "assets/icons/search-black.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import { ReactComponent as EmptyListIcon } from "assets/icons/empty-list-icon.svg";
import { ReactComponent as EditTiny } from "assets/icons/edit-tiny.svg";
import { ReactComponent as EyeTiny } from "assets/icons/eye-tiny.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import CategoriesStore from "../../Categories/store";
import classNames from "classnames";
import ProductCard from "components/General/ProductCard";
import ProductFilterModal from "components/General/FilterModals/ProductFilterModal";
import Pagination from "components/General/Pagination";
import { getUserInfoFromStorage } from "utils/storage";

import AddProductModal from "./AddProductModal";
import ProductDetailsModal from "./ProductDetailsModal";

const ProductsPage = ({
  isModal,
  handleProductSelect,
  isSelected,
  modalDetails,
}) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const {
    getProductsWithInventory,
    getProduct,
    products,
    productsCount,
    loading,
    getProductLoading,
  } = ProductsStore;
  const { getCategories, categories } = CategoriesStore;

  const { width, isMobile } = useWindowDimensions();
  const [displayProducts, setDisplayProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(0);
  const [activeProductTab, setActiveProductTab] = useState("All Products");
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categoryIds: [],
    sortBy: "",
    fromDate: "",
    toDate: "",
    status: "",
  });

  // Get user info for brandId
  const userInfo = getUserInfoFromStorage();
  const brandId = userInfo?.brand?.id;

  const productTabs = ["All Products", "In stock"];

  // Load products with current filters
  const loadProducts = () => {
    if (!brandId) return;

    const params = {
      brandIds: [brandId],
      pageNumber: currentPage.toString(),
      searchQuery: searchQuery || undefined,
      sortBy: filters.sortBy || undefined,
      categoryIds:
        filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
      inStockOnly: activeProductTab === "In stock" ? true : undefined,
    };

    getProductsWithInventory(params);
  };

  useEffect(() => {
    // Load categories on component mount
    getCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [brandId, currentPage, activeProductTab, filters, searchQuery]);

  useEffect(() => {
    // Update display products when products change
    if (products) {
      setDisplayProducts(products);
    }
  }, [products]);

  const handleProductTabClick = (tab) => {
    setActiveProductTab(tab);
    setCurrentPage(1);
  };

  const handleSearchToggle = () => {
    if (searchExpanded) {
      // If search is currently expanded, we're closing it, so clear the query
      setSearchQuery("");
    }
    setSearchExpanded(!searchExpanded);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterApply = (newFilters) => {
    setFilters({
      categoryIds: newFilters.categoryIds || [],
      sortBy: newFilters.sortBy || "",
      fromDate: newFilters.fromDate || "",
      toDate: newFilters.toDate || "",
      status: newFilters.status || "",
    });
    setCurrentPage(1);

    // Count applied filters
    const filterCount = Object.values(newFilters).filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    }).length;
    setAppliedFilters(filterCount);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProductCardClick = (product) => {
    setSelectedProduct(product);
    // Load full product details
    getProduct({ data: { id: product.id } });
    setShowProductDetailsModal(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    // Load full product details for editing
    getProduct({ data: { id: product.id } });
    setShowEditProductModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    // Load full product details
    getProduct({ data: { id: product.id } });
    setShowProductDetailsModal(true);
  };

  // Define menu options for ProductCard
  const productMenuOptions = [
    {
      icon: EditTiny,
      label: "Edit Product",
      onClick: handleEditProduct,
    },
    {
      icon: EyeTiny,
      label: "View Product",
      onClick: handleViewProduct,
    },
  ];

  // Calculate pagination
  const pageSize = 12; // Assuming 12 products per page
  const totalPages = Math.ceil(productsCount / pageSize);

  return (
    <>
      <div
        className={classNames("min-h-[100px] h-fit  w-full mb-20", {
          "md:pr-4": !isModal,
        })}
      >
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5 mt-5">
          {/* Title Section */}
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-[22px] font-bold text-[#111111]">Products</h1>

              <p className="text-base text-[#666666]">
                Manage your product catalog
              </p>
            </div>

            <div className="flex items-center gap-5">
              {/* Search Section */}
              <div className="flex items-center gap-2">
                {searchExpanded ? (
                  <div className="flex items-center gap-2 transition-all duration-300">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search products..."
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
                      autoFocus
                    />
                    <button
                      onClick={handleSearchToggle}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12 4L4 12M4 4l8 8"
                          stroke="#111111"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    {!isMobile && (
                      <span className="text-[14px] text-[#111111]">Search</span>
                    )}
                    <button
                      onClick={handleSearchToggle}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <SearchBlackIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <DividerIcon />

              {/* Filters Section */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setFilterModalOpen(true)}
              >
                {!isMobile && (
                  <span className="text-[14px] text-[#111111]">
                    Filters {appliedFilters > 0 && `(${appliedFilters})`}
                  </span>
                )}
                <button
                  onClick={() => setFilterModalOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FilterIcon
                    className={classNames("w-4 h-4", {
                      "fill-[#690007]": appliedFilters > 0,
                      "fill-[#111111]": appliedFilters === 0,
                    })}
                  />
                </button>
              </div>

              <DividerIcon />

              {/* Add Product Button */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowNewProductModal(true)}
              >
                {!isMobile && (
                  <span className="text-[12px] text-[#111111] uppercase">
                    Add a product
                  </span>
                )}
                <button
                  onClick={() => setShowNewProductModal(true)}
                  className="w-7 h-7 bg-[#690007] rounded-full flex items-center justify-center hover:bg-[#5a0006] transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="flex gap-5">
            {productTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleProductTabClick(tab)}
                className={classNames("text-[14px] transition-colors", {
                  "text-[#690007]": activeProductTab === tab,
                  "text-[#AAAAAA]": activeProductTab !== tab,
                })}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Section */}
          {loading || isLoading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <CircleLoader blue />
            </div>
          ) : isEmpty(displayProducts) ? (
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <EmptyListIcon className="mb-8" />
              <h3 className="text-[16px] text-[#000000] font-medium mb-2">
                No products found
              </h3>
              <p className="text-[16px] text-[#777777]">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div
              className={classNames(
                "grid gap-5 w-full",
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductCardClick}
                  hasMenu={true}
                  menuOptions={productMenuOptions}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isEmpty(displayProducts) && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                pageCount={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
        categories={categories}
      />

      <AddProductModal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
      />

      <AddProductModal
        isOpen={showEditProductModal}
        onClose={() => setShowEditProductModal(false)}
        product={productToEdit}
        isEdit={true}
      />

      <ProductDetailsModal
        isOpen={showProductDetailsModal}
        onClose={() => setShowProductDetailsModal(false)}
        product={selectedProduct}
        loading={getProductLoading}
      />
    </>
  );
};

ProductsPage.propTypes = {
  handleProductSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.func,
  modalDetails: PropTypes.object,
};

export default observer(ProductsPage);
