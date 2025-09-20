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
import CategoriesStore from "../../Categories/store";
import classNames from "classnames";
import { sampleProducts } from "utils/sampleData";
import { getUserInfoFromStorage } from "utils/storage";
import ProductCard from "components/General/ProductCard";
import CategoryFilterModal from "components/General/FilterModals/CategoryFilterModal";
import AddCategoryModal from "./AddCategoryModal";
import AddProductToCategoryModal from "./AddProductToCategoryModal";
import { ReactComponent as EditTiny } from "assets/icons/edit-tiny.svg";

const ProductCategoriesPage = ({
  isModal,
  handleProductSelect,
  isSelected,
  modalDetails,
}) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const { getProducts, products, productsCount, loading } = ProductsStore;
  const { getCategories, categories, loadingCategories } = CategoriesStore;

  // Get user info
  const userInfo = getUserInfoFromStorage();
  const user =
    userInfo?.user || JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.userRole?.name === "ADMIN";
  const brandId = userInfo?.brand?.id;

  const { width, isMobile } = useWindowDimensions();
  const [displayCategories, setDisplayCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(0);
  const [activeProductTab, setActiveProductTab] = useState("All Products");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddProductToCategoryModal, setShowAddProductToCategoryModal] = useState(false);
  const [selectedCategoryForProducts, setSelectedCategoryForProducts] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      await getCategories();
      setDisplayCategories(categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Update display categories when store data changes
    setDisplayCategories(categories);
  }, [categories]);

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

  const handleCategoryCardClick = (category) => {
    setSelectedCategory(category);
    setShowAddCategoryModal(true);
  };

  const handleAddCategoryClick = () => {
    setSelectedCategory(null);
    setShowAddCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowAddCategoryModal(false);
    setSelectedCategory(null);
  };

  const handleAddProductToCategoryClick = (category) => {
    setSelectedCategoryForProducts(category);
    setShowAddProductToCategoryModal(true);
  };

  const handleCloseAddProductToCategoryModal = () => {
    setShowAddProductToCategoryModal(false);
    setSelectedCategoryForProducts(null);
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
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-[22px] font-bold text-[#111111]">
                Categories on TIZZIL
              </h1>

              <p className="text-base text-[#666666]">
                See where your brand fits—and where it could show up.
              </p>
            </div>

            {!isEmpty(displayCategories) && (
              <div className="flex items-center gap-5">
                {/* Search Section */}
                <div className="flex items-center gap-2">
                  {searchExpanded ? (
                    <div className="flex items-center gap-2 transition-all duration-300">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search categories..."
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

                {/* Add category section */}
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleAddCategoryClick}
                >
                  {!isMobile && (
                    <span className="text-[12px] text-[#111111] uppercase">
                      Add a category
                    </span>
                  )}
                  <button
                    onClick={handleAddCategoryClick}
                    className="w-7 h-7 bg-[#690007] rounded-full flex items-center justify-center hover:bg-[#5a0006] transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          {isLoading || loadingCategories ? (
            <div className="flex justify-center items-center h-64 w-full">
              <CircleLoader blue />
            </div>
          ) : isEmpty(displayCategories) ? (
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <EmptyListIcon className="mb-8" />
              <h3 className="text-[16px] text-[#000000] font-medium mb-2">
                Nothing to see here
              </h3>
              <p className="text-[16px] text-[#777777] mb-8">categories</p>
              <Button text="ADD A CATEGORY" onClick={handleAddCategoryClick} />
            </div>
          ) : (
            <div
              className={classNames(
                "grid gap-5 w-full",
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {displayCategories.map((category) => (
                <ProductCard
                  key={category.id}
                  product={category}
                  onClick={handleCategoryCardClick}
                  onAddCategoryClick={(item) => {}}
                  onViewItemsClick={handleCategoryCardClick}
                  isCategory
                  hasMenu
                  menuOptions={[
                    {
                      icon: EditTiny,
                      label: "Add to category",
                      onClick: handleAddProductToCategoryClick,
                    },
                    {
                      icon: EditTiny,
                      label: "Edit category",
                      onClick: handleCategoryCardClick,
                    },
                  ]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
      />

      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={handleCloseCategoryModal}
        category={selectedCategory}
      />

      <AddProductToCategoryModal
        isOpen={showAddProductToCategoryModal}
        onClose={handleCloseAddProductToCategoryModal}
        category={selectedCategoryForProducts}
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

export default observer(ProductCategoriesPage);
