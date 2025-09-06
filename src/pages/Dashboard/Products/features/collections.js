import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty, isEqual } from "lodash";
import { useNavigate, useParams } from "react-router";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";

import { NAIRA, PRODUCT_MODAL_TYPES, pageCount } from "utils/appConstant";
import { ReactComponent as SearchBlackIcon } from "assets/icons/search-black.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import { ReactComponent as EmptyListIcon } from "assets/icons/empty-list-icon.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import classNames from "classnames";
import { sampleProducts } from "utils/sampleData";
import Modal from "components/General/Modal/Modal/Modal";
import AddCollectionModal from "./AddCollectionModal";
import ProductDetailsModal from "./ProductDetailsModal";

const ProductCard = ({
  product,
  hasMenu = false,
  hasDescription = false,
  isCollection = false,
  isCategory = false,
  onAddCategoryClick,
  onViewItemsClick,
  onClick,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { isMobile } = useWindowDimensions();

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleCardClick = () => {
    onClick?.(product);
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div
          className="w-full h-[220px] bg-[#EFF0EB] bg-cover bg-center"
          style={{
            backgroundImage: product.imageUrls?.[0]
              ? `url(${product.imageUrls[0]})`
              : "none",
          }}
        >
          {product.imageUrls?.[0] && (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {hasMenu && (
          <div className="absolute top-2 right-2">
            <div
              className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleMenuClick}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 4a1 1 0 100-2 1 1 0 000 2zM8 9a1 1 0 100-2 1 1 0 000 2zM9 13a1 1 0 11-2 0 1 1 0 012 0z"
                  fill="#111111"
                />
              </svg>
            </div>

            {showMenu && (
              <div className="absolute top-10 right-0 w-[200px] bg-white shadow-lg rounded-md border z-10">
                {isCategory && (
                  <>
                    <div
                      className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center"
                      onClick={() => onAddCategoryClick?.(product)}
                    >
                      <svg
                        width="16"
                        height="16"
                        className="mr-2"
                        fill="#111111"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a1 1 0 100-2 1 1 0 000 2zM8 9a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                      <span className="text-sm">Add to category</span>
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center"
                      onClick={() => onViewItemsClick?.(product)}
                    >
                      <svg
                        width="16"
                        height="16"
                        className="mr-2"
                        fill="#111111"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                      <span className="text-sm">View my items</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="p-2"
        style={{ background: "#FBF0DC03", backdropFilter: "blur(4px)" }}
      >
        <h3 className="text-[#690007] text-[14px] font-semibold uppercase truncate">
          {product.name}
        </h3>

        <div className="mt-1.5">
          {hasDescription ? (
            <p className="text-[#777777] text-sm line-clamp-2">
              {product.productDescription}
            </p>
          ) : (
            <p className="text-[#690007] text-sm font-medium">
              {product.salePrice}
            </p>
          )}
        </div>

        {(isCollection || isCategory) && (
          <div className="mt-3.5 flex justify-between items-center text-sm">
            <div>
              <span className="text-[#777777]">Status: </span>
              <span className="text-[#690007]">Live</span>
            </div>
            <div>
              {isCollection ? (
                <>
                  <span className="text-[#777777]">Products: </span>
                  <span className="text-[#690007]">
                    {product.numberOfProducts || 10}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#777777]">You: </span>
                  <span className="text-[#690007]">
                    {product.numberOfProducts || 10}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {isCategory && (
          <div className="mt-2">
            <p className="text-sm">
              <span className="text-[#777777]"># of Live Products: </span>
              <span className="text-[#690007]">
                {product.numberOfProducts || 230}
              </span>
            </p>
            <div className="flex mt-2">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="w-[22px] h-[22px] rounded-full bg-gray-200 border border-white -ml-2.5 first:ml-0"
                  style={{
                    backgroundImage: product.imageUrls?.[0]
                      ? `url(${product.imageUrls[0]})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    onApply({ fromDate, toDate, category, status });
    onClose();
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setCategory("");
    setStatus("");
  };

  return (
    <Modal active={isOpen} toggler={onClose}>
      <div className="w-full max-w-md mx-auto bg-white rounded-lg p-4">
        <h3 className="text-[#111827] text-base font-bold mb-6">Filter</h3>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">
                Date created
              </span>
              <button className="text-[#690007] text-sm font-bold">
                Reset
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                placeholder="From"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="date"
                placeholder="To"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">Category</span>
              <button className="text-[#690007] text-sm font-bold">
                Reset
              </button>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select category</option>
              <option value="clothing">Clothing</option>
              <option value="footwear">Footwear</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">Status</span>
              <button className="text-[#690007] text-sm font-bold">
                Reset
              </button>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between gap-5 mt-9">
          <Button
            text="Reset all"
            isOutline
            onClick={handleReset}
            className="flex-1"
          />
          <Button
            text="Apply filters"
            onClick={handleApply}
            className="flex-1"
          />
        </div>
      </div>
    </Modal>
  );
};

const ProductCategoriesPage = ({
  isModal,
  handleProductSelect,
  isSelected,
  modalDetails,
}) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const { getProducts, products, productsCount, loading } = ProductsStore;

  const { width, isMobile } = useWindowDimensions();
  const [displayProducts, setDisplayProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(0);
  const [activeProductTab, setActiveProductTab] = useState("All Collections");
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productTabs = [
    "All Collections",
    "Concrete Heat",
    "Glow Season",
    "Rooted Threads",
    "Soft Flex",
    "Ballon ballonies",
  ];

  useEffect(() => {
    // Initialize with sample data or fetch real data
    if (isEmpty(products)) {
      setDisplayProducts(sampleProducts);
    } else {
      setDisplayProducts(products);
    }
  }, [products]);

  const handleProductTabClick = (tab) => {
    setActiveProductTab(tab);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // For now, just use sample data for all tabs
      setDisplayProducts(sampleProducts);
      setIsLoading(false);
    }, 1000);
  };

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      setSearchQuery("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterApply = (filters) => {
    setAppliedFilters(Object.values(filters).filter(Boolean).length);
  };

  const handleProductCardClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetailsModal(true);
  };

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
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#111111]">
                Your Collections
              </h1>
              <span className="text-[14px] text-[#6D7280]">
                {displayProducts.length} TOTAL
              </span>
            </div>

            {!isEmpty(displayProducts) && (
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
                        <span className="text-[14px] text-[#111111]">
                          Search
                        </span>
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

                {/* Add Collection Button */}
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowNewProductModal(true)}
                >
                  {!isMobile && (
                    <span className="text-[12px] text-[#111111] uppercase">
                      ADD A NEW COLLECTION
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
            )}
          </div>

          {/* Product Tabs */}
          {!isEmpty(displayProducts) && (
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
          )}

          {/* Content Section */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <CircleLoader blue />
            </div>
          ) : isEmpty(displayProducts) ? (
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <EmptyListIcon className="mb-8" />
              <h3 className="text-[16px] text-[#000000] font-medium mb-2">
                Nothing to see here
              </h3>
              <p className="text-[16px] text-[#777777] mb-8">products</p>
              <Button
                text="ADD A NEW COLLECTION"
                onClick={() => setShowNewProductModal(true)}
              />
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
                  isCollection
                  hasMenu
                  hasDescription
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
      />

      <AddCollectionModal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
      />

      <ProductDetailsModal
        isOpen={showProductDetailsModal}
        onClose={() => setShowProductDetailsModal(false)}
        product={selectedProduct}
      />
    </>
  );
};

ProductCategoriesPage.propTypes = {
  handleProductSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.func,
  modalDetails: PropTypes.object,
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  hasMenu: PropTypes.bool,
  hasDescription: PropTypes.bool,
  isCollection: PropTypes.bool,
  isCategory: PropTypes.bool,
  onAddCategoryClick: PropTypes.func,
  onViewItemsClick: PropTypes.func,
  onClick: PropTypes.func,
};

FilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default observer(ProductCategoriesPage);
