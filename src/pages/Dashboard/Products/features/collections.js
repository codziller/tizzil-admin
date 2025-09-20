import React, { useEffect, useState } from "react";
import _, { isEmpty } from "lodash";
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
import ProductCard from "components/General/ProductCard";
import CollectionFilterModal from "components/General/FilterModals/CollectionFilterModal";
import AddCollectionModal from "./AddCollectionModal";
import ProductDetailsModal from "./ProductDetailsModal";
import AddProductToCollectionModal from "./AddProductToCollectionModal";
import { ReactComponent as EditTiny } from "assets/icons/edit-tiny.svg";
import Pagination from "components/General/Pagination";
import { getUserInfoFromStorage } from "utils/storage";

const ProductCollectionsPage = ({
  isModal,
  handleProductSelect,
  isSelected,
  modalDetails,
}) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const { getProducts, products, productsCount, loading } = ProductsStore;
  const {
    getCollections,
    getActiveCollections,
    getInactiveCollections,
    getCollectionsByBrand,
    getActiveCollectionsByBrand,
    collections,
    activeCollections,
    inactiveCollections,
    collectionsByBrand,
    activeCollectionsByBrand,
    loadingCollections,
    loadingActiveCollections,
    loadingInactiveCollections,
    loadingCollectionsByBrand,
    loadingActiveCollectionsByBrand,
  } = CategoriesStore;

  // Get user info for admin check and brandId
  const userInfo = getUserInfoFromStorage();
  const user =
    userInfo?.user || JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.userRole?.name === "ADMIN";
  const brandId = userInfo?.brand?.id;

  const { width, isMobile } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(0);
  const [activeCollectionTab, setActiveCollectionTab] =
    useState("All Collections");
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddProductToCollectionModal, setShowAddProductToCollectionModal] = useState(false);
  const [selectedCollectionForProducts, setSelectedCollectionForProducts] = useState(null);

  const collectionTabs = [
    "All Collections",
    "Active Collections",
    "Inactive Collections",
  ];

  const pageSize = 12; // Collections per page

  // Computed values that automatically update when store data changes
  const displayCollections = (() => {
    if (activeCollectionTab === "All Collections") {
      return isAdmin ? collections : collectionsByBrand;
    } else if (activeCollectionTab === "Active Collections") {
      return isAdmin ? activeCollections : activeCollectionsByBrand;
    } else if (activeCollectionTab === "Inactive Collections") {
      if (isAdmin) {
        return inactiveCollections;
      } else {
        return collectionsByBrand.filter((c) => !c.isActive);
      }
    }
    return [];
  })();

  const totalCollections = displayCollections.length;
  const totalPages = Math.ceil(totalCollections / pageSize);

  console.log("displayCollections: ", displayCollections);
  console.log("collectionsByBrand: ", collectionsByBrand);
  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    if (!brandId && !isAdmin) return;

    setIsLoading(true);
    try {
      if (activeCollectionTab === "All Collections") {
        if (isAdmin) {
          await getCollections();
        } else {
          await getCollectionsByBrand({ brandId });
        }
      } else if (activeCollectionTab === "Active Collections") {
        if (isAdmin) {
          await getActiveCollections();
        } else {
          await getActiveCollectionsByBrand({ brandId });
        }
      } else if (activeCollectionTab === "Inactive Collections") {
        if (isAdmin) {
          await getInactiveCollections();
        } else {
          await getCollectionsByBrand({ brandId });
        }
      }
    } catch (error) {
      console.error("Error loading collections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load collections when tab changes or component mounts
  useEffect(() => {
    loadCollections();
  }, [activeCollectionTab, brandId, isAdmin]);

  const handleCollectionTabClick = (tab) => {
    setActiveCollectionTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
  };

  const handleFilterApply = (filters) => {
    setAppliedFilters(Object.values(filters).filter(Boolean).length);
  };

  const handleCollectionCardClick = (collection) => {
    setSelectedCollection(collection);
    setShowNewCollectionModal(true);
  };

  const handleAddProductToCollectionClick = (collection) => {
    setSelectedCollectionForProducts(collection);
    setShowAddProductToCollectionModal(true);
  };

  const handleCloseAddProductToCollectionModal = () => {
    setShowAddProductToCollectionModal(false);
    setSelectedCollectionForProducts(null);
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
                Collections
              </h1>

              <p className="text-base text-[#666666]">
                Organize your products into collections.
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
                      placeholder="Search collections..."
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

              {/* Add Collection Button */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowNewCollectionModal(true)}
              >
                {!isMobile && (
                  <span className="text-[12px] text-[#111111] uppercase">
                    Add a collection
                  </span>
                )}
                <button
                  onClick={() => setShowNewCollectionModal(true)}
                  className="w-7 h-7 bg-[#690007] rounded-full flex items-center justify-center hover:bg-[#5a0006] transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Collection Tabs */}
          <div className="flex gap-5">
            {collectionTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleCollectionTabClick(tab)}
                className={classNames("text-[14px] transition-colors", {
                  "text-[#690007]": activeCollectionTab === tab,
                  "text-[#AAAAAA]": activeCollectionTab !== tab,
                })}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Section */}
          {isLoading ||
          loadingActiveCollections ||
          loadingInactiveCollections ||
          loadingCollectionsByBrand ||
          loadingActiveCollectionsByBrand ? (
            <div className="flex justify-center items-center h-64 w-full">
              <CircleLoader blue />
            </div>
          ) : isEmpty(displayCollections) ? (
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <EmptyListIcon className="mb-8" />
              <h3 className="text-[16px] text-[#000000] font-medium mb-2">
                No collections found
              </h3>
              <p className="text-[16px] text-[#777777]">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div
                className={classNames(
                  "grid gap-5 w-full",
                  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {displayCollections
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((collection) => (
                    <ProductCard
                      key={collection.id}
                      product={collection}
                      onClick={handleCollectionCardClick}
                      isCollection={true}
                      hasMenu={true}
                      menuOptions={[
                        {
                          icon: EditTiny,
                          label: "Add to collection",
                          onClick: handleAddProductToCollectionClick,
                        },
                        {
                          icon: EditTiny,
                          label: "Edit Collection",
                          onClick: handleCollectionCardClick,
                        },
                      ]}
                    />
                  ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    pageCount={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CollectionFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
      />

      <AddCollectionModal
        isOpen={showNewCollectionModal}
        onClose={() => {
          setShowNewCollectionModal(false);
          setSelectedCollection(null);
        }}
        collection={selectedCollection}
      />

      <AddProductToCollectionModal
        isOpen={showAddProductToCollectionModal}
        onClose={handleCloseAddProductToCollectionModal}
        collection={selectedCollectionForProducts}
      />

      <ProductDetailsModal
        isOpen={showProductDetailsModal}
        onClose={() => setShowProductDetailsModal(false)}
        product={selectedCollection}
      />
    </>
  );
};

ProductCollectionsPage.propTypes = {
  handleProductSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.func,
  modalDetails: PropTypes.object,
};

export default observer(ProductCollectionsPage);
