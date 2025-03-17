import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty, isEqual } from "lodash";
import { useNavigate, useParams } from "react-router";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";

import { NAIRA, PRODUCT_MODAL_TYPES, pageCount } from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as BulletIcon } from "assets/icons/bullet.svg";
import { ReactComponent as ShopIcon } from "assets/icons/shop.svg";
import { ReactComponent as LowStockIcon } from "assets/icons/low-stock.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as BrandIcon } from "assets/icons/brand-icon.svg";
import { ReactComponent as CategoryIcon } from "assets/icons/category-icon.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Refresh } from "assets/icons/refresh-2.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import DetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import classNames from "classnames";
import { numberWithCommas } from "utils/formatter";
import { flattenArrayToString } from "utils/functions";
import CheckBox from "components/General/Input/CheckBox";
import useTableFilter from "hooks/useTableFilter";
import useWarehouse from "hooks/useWarehouse";
import { COPY_ICON } from "assets/icons";
import { successToast } from "components/General/Toast/Toast";

const { PRODUCT_CATEGORY_OPTIONS, BRANDS } = PRODUCT_MODAL_TYPES;
export const dateFilters = [
  {
    value: "today",
    label: "Today",
    start_date: dateConstants?.today,
    end_date: dateConstants?.today,
  },
  {
    value: "this_week",
    label: "This Week",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
  {
    value: "all_time",
    label: "All Time",
    start_date: dateConstants?.firstDay,
    end_date: dateConstants?.today,
  },
];

export const alphabetSortFilter = [
  {
    label: "Ascending A-Z",
    value: "a-z",
  },
  {
    label: "Descending Z-A",
    value: "z-a",
  },
];
const ProductsPage = ({
  isModal,
  handleProductSelect,
  isSelected,
  modalDetails,
}) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const { warehouseIsCentral } = useWarehouse();
  const {
    getProducts,
    products,
    productsCount,
    loading,
    getArchivedProducts,
    loadingArchived,
    productsArchived,
    productsArchivedCount,
    searchProducts,
    searchResult,
    searchResultCount,
    searchProductLoading,
    resetSearch,
    productsPrivate,
    productsPrivateCount,
    getPrivateProducts,
    loadingPrivateProducts,

    getProductsByBrandsAndCategories,
    productsByBrandsAndCategories,
    productsByBrandsAndCategoriesCount,
    productsByBrandsAndCategoriesLoading,
  } = ProductsStore;

  const TABS = [
    { name: "products", label: `All Products (${productsCount || "-"})` },

    {
      name: "private",
      label: `Private (${productsPrivateCount || "-"})`,
    },
    {
      name: "archived",
      label: `Archived (${productsArchivedCount || "-"})`,
    },
  ];
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPagePrivate, setCurrentPagePrivate] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [currentPageFilter, setCurrentPageFilter] = useState(1);
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const isObjectOnChange = modalDetails?.isObjectOnChange;
  const defaultFilters = {
    brandIds: [],
    categoryIds: [],
  };

  const isPrivate = activeTab === TABS[1]?.name;
  const isArchive = activeTab === TABS[2]?.name;

  const currentActivePage = isArchive
    ? currentPageArchived
    : isPrivate
    ? currentPagePrivate
    : currentPage;

  const setCurrentActivePage = (page) => {
    isArchive
      ? setCurrentPageArchived(page)
      : isPrivate
      ? setCurrentPagePrivate(page)
      : setCurrentPage(page);
  };

  const {
    filterInput,
    setFilterInput,
    filterData,
    handleFilter,
    clearFilters,
    onRemoveFilter,
    searchData,
    searchInput,
    setSearchInput,
    handleSearch,
    clearSearch,
  } = useTableFilter({
    defaultFilters,
    currentPage: currentActivePage,
    setCurrentPage: setCurrentActivePage,
  });
  const searchQuery = searchInput?.trim();

  const filterInputEmpty =
    isEmpty(filterInput.brandIds) && isEmpty(filterInput.categoryIds);
  const filterDataEmpty =
    isEmpty(filterData.brandIds) && isEmpty(filterData.categoryIds);
  const isFilter = !filterDataEmpty && !filterInputEmpty;

  const searchInputEmpty = isEmpty(searchQuery);
  const searchDataEmpty = isEmpty(searchData?.trim());
  const isSearchMode = !searchDataEmpty && !searchInputEmpty;

  const handleOnFilter = () => {
    handleFilter();
    const payload = {
      brandIds: JSON.stringify(filterInput?.brandIds?.map(({ id }) => id)),
      categoryIds: JSON.stringify(
        filterInput?.categoryIds?.map(({ id }) => id)
      ),
      page: currentPageFilter,
    };
    clearSearch?.();
    getProductsByBrandsAndCategories({
      data: payload,
      onSuccess: () => {},
    });
  };
  const handleOnSearch = async () => {
    if (!searchQuery) {
      return;
    }

    handleSearch();
    const payload = { page: currentPageSearch, searchQuery };
    clearFilters?.();
    await searchProducts({ data: payload, warehouse_id });
  };

  useEffect(() => {
    if (isFilter) {
      handleOnFilter();
      return;
    }

    if (isSearchMode) {
      handleOnSearch();
    }
  }, [currentPageFilter, currentPageSearch]);

  useEffect(() => {
    if (!searchQuery) {
      resetSearch();
      clearSearch();
    }
  }, [searchQuery]);

  const handleGetData = () => {
    isArchive
      ? getArchivedProducts({
          data: { page: currentPageArchived },
          warehouse_id,
        })
      : isPrivate
      ? getPrivateProducts({
          data: { page: currentPagePrivate, isPrivate: true },
          warehouse_id,
        })
      : getProducts({ data: { page: currentPage }, warehouse_id });
  };

  useEffect(() => {
    handleGetData();
  }, [
    currentPage,
    currentPageArchived,
    isArchive,
    currentPagePrivate,
    isPrivate,
  ]);

  const handleEdit = (row) => {
    if (isModal) {
      handleProductSelect?.(row);
      return;
    }

    navigate(`/dashboard/products/edit/${warehouse_id}/${row?.id}`);
  };
  const columns = [
    isModal
      ? {
          name: "SKU",
          minWidth: "20px",
          maxWidth: isModal ? "100px" : isMobile ? "10%" : "70px",
          selector: (row) => (
            <div
              className="flex justify-start items-center gap-2"
              onClick={() => handleEdit(row)}
            >
              {isModal && (
                <div className="min-w-[25px] truncate max-w-[65px]">
                  <CheckBox
                    checked={isSelected(isObjectOnChange ? row : row?.id)}
                    square={!!modalDetails?.isMultipleProducts}
                  />
                </div>
              )}
            </div>
          ),
          sortable: false,
        }
      : {},
    {
      minWidth: "120px",
      maxWidth: "120px",
      selector: (row) => (
        <div
          className="flex justify-center items-center w-[90px] h-[80px] rounded-xl bg-red-light2 my-4"
          onClick={() => handleEdit(row)}
        >
          {row?.imageUrls?.[0] && (
            <img
              src={row?.imageUrls?.[0]}
              className="w-[55px] h-[55px] min-w-[55px] min-h-[55px] object-cover"
              alt={row?.name}
            />
          )}
        </div>
      ),
    },

    {
      minWidth: isMobile ? "40%" : "450px",
      maxWidth: isMobile ? "40%" : "450px",
      selector: (row) => {
        const productItem = row?.productOptions?.[0]?.choices?.find(
          (item) => item?.main
        );
        const quantity = productItem
          ? productItem?.variantQuantity
          : row?.quantity;
        return (
          <div
            className="flex flex-col justify-start items-start gap-3"
            onClick={() => handleEdit(row)}
          >
            <span className="whitespace-break-spaces font-800 text-base uppercase">
              {row.name}
            </span>

            <div className="flex flex-col gap-1">
              <div className="flex justify-start items-center gap-1">
                {row?.productOptions?.[0] ? (
                  <>
                    <span className="text-xs text-white bg-red-deep px-2 py-0.5 rounded">
                      {row?.productOptions?.[0]?.choices?.length} Variants
                    </span>
                    <BulletIcon />
                  </>
                ) : null}

                <ShopIcon />

                <span className="text-sm truncate max-w-[100px] text-red-deep ">
                  {row.brand?.brandName}
                </span>
                <BulletIcon />
                <span className="text-sm truncate max-w-[400px]">
                  {flattenArrayToString(row.categories)}
                </span>
                <BulletIcon />
                {Number(quantity) <= Number(row?.lowInQuantityValue) &&
                warehouseIsCentral ? (
                  <>
                    <BulletIcon />
                    <LowStockIcon />
                    <span>Low</span>
                  </>
                ) : null}
              </div>
              <button
                className="text-sm truncate max-w-[400px] flex gap-1 items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard
                    .writeText(row.cloudErpItemCode)
                    .then(() =>
                      successToast(
                        "Copied",
                        "copied item ERP code to clipboard"
                      )
                    );
                }}
              >
                <COPY_ICON />
                <span>ERP Code: </span>
                <span className="italic">{row.cloudErpItemCode}</span>
              </button>
            </div>
          </div>
        );
      },
    },

    {
      // minWidth: isMobile ? "110px" : "110px",
      selector: (row) => (
        <div className="flex justify-start items-center gap-3">
          <span
            onClick={() =>
              setCurrentTxnDetails({ ...row, modalType: "delete" })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-red-deep text-[11px] text-white "
          >
            {row?.archive ? "Unarchive" : "Archive"}
          </span>

          <span
            onClick={() => handleEdit(row)}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
          </span>
        </div>
      ),
      sortable: true,
    },
  ].filter((item) => item?.selector);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const displayedProducts = useMemo(() => {
    return isArchive
      ? productsArchived
      : isPrivate
      ? productsPrivate
      : products;
  }, [products, productsArchived, isArchive, isPrivate, productsPrivate]);

  const displayedProductsCount = useMemo(() => {
    return isArchive
      ? productsArchivedCount
      : isPrivate
      ? productsPrivateCount
      : productsCount;
  }, [
    products,
    productsArchivedCount,
    productsPrivateCount,
    isArchive,
    isPrivate,
  ]);

  const isLoading = useMemo(() => {
    return isArchive
      ? loadingArchived
      : isPrivate
      ? loadingPrivateProducts
      : loading;
  }, [searchProductLoading, loadingArchived, loadingPrivateProducts, loading]);

  useEffect(() => scrollToTop(), [displayedProducts, isLoading]);

  const handleChangeFilter = ({ prop, val }) => {
    setFilterInput({
      ...filterInput,
      [prop]: val,
    });
  };

  const handleRemoveFilter = (prop, id) => {
    let prevData = filterInput?.[prop];
    prevData = prevData?.filter((item) => item?.id !== id);
    handleChangeFilter({ prop, val: prevData });
  };

  return (
    <>
      <div className={classNames("h-full w-full", { "md:pr-4": !isModal })}>
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5 mt-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div className="flex justify-start items-center gap-1">
              <span className="font-700 text-xl">Products</span>
            </div>
            <div
              className={classNames({
                "w-full": isModal,
                "w-full sm:w-[45%] sm:min-w-[300px]": !isModal,
              })}
            >
              <SearchBar
                placeholder={"Search products"}
                onSearch={handleOnSearch}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>
            {!isModal && (
              <Link to={`/dashboard/products/add/${warehouse_id}`}>
                <Button
                  text="Add New Product"
                  icon={<Plus className="stroke-current" />}
                  className="hidden md:block"
                />
              </Link>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-start items-start gap-10 w-full h-full">
            {!isModal ? (
              <div className="flex flex-col justify-start items-start gap-6 h-fit box-shadow-4 rounded-xl min-w-[250px] max-w-[250px] pt-6 bg-white fixed z-10">
                <div className="flex flex-col justify-start items-start gap-4 w-full px-3 overflow-y-auto max-h-[400px]">
                  <span className="text-sm text-grey-text">Product Status</span>

                  <div className="grid grid-cols-2 gap-3 justify-between items-start w-full mb-4">
                    {TABS.map(({ name, label }) => {
                      const isActive = name === activeTab;
                      return (
                        <div
                          key={name}
                          onClick={() => setActiveTab(name)}
                          className={classNames(
                            "w-full px-2 py-1 text-center cursor-pointer whitespace-nowrap text-sm rounded-md border-[0.5px] transition-colors ease-in-out duration-300",
                            {
                              "border-red-deep text-red-deep bg-red-light2":
                                isActive,
                              "border-black text-black": !isActive,
                            }
                          )}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>

                  <span className="text-sm text-grey-text">Filter by:</span>

                  <div className="flex flex-col gap-3 justify-between items-start w-full mb-4">
                    <div
                      onClick={() =>
                        setCurrentTxnDetails({
                          modalType: BRANDS,
                          isObjectOnChange: true,
                          isMultipleBrands: true,
                          prop: "brandIds",
                        })
                      }
                      className={
                        "flex justify-center items-center gap-2 w-full px-2 py-1 text-center cursor-pointer whitespace-nowrap text-sm rounded-md border-[0.5px] transition-colors ease-in-out duration-300 border-black text-white bg-black hover:bg-blue-bright hover:border-blue-border"
                      }
                    >
                      <span>
                        <BrandIcon />
                      </span>
                      <span>Brands</span>
                    </div>
                    {!isEmpty(filterInput?.brandIds) ? (
                      <div className="w-full flex flex-wrap gap-3 mb-3">
                        {filterInput?.brandIds?.map((item) => {
                          return (
                            <div
                              className="flex justify-center items-center bg-red-light2 px-2 py-1 gap-2 text-sm"
                              key={item?.id}
                            >
                              <span>{item?.brandName}</span>
                              <span
                                onClick={() =>
                                  handleRemoveFilter("brandIds", item?.id)
                                }
                                className="flex justify-center items-center cursor-pointer rounded-full hover:bg-red-light4 transition-colors ease-in-out duration-300"
                              >
                                <Close className="scale-[0.5]" />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    <div
                      onClick={() =>
                        setCurrentTxnDetails({
                          modalType: PRODUCT_CATEGORY_OPTIONS,
                          isObjectOnChange: true,
                        })
                      }
                      className={
                        "flex justify-center items-center gap-2 w-full px-2 py-1 text-center cursor-pointer whitespace-nowrap text-sm rounded-md border-[0.5px] border-black transition-colors ease-in-out duration-300  text-white bg-black hover:bg-blue-bright hover:border-blue-border"
                      }
                    >
                      <span>
                        <CategoryIcon />
                      </span>
                      <span>Category</span>
                    </div>

                    {!isEmpty(filterInput?.categoryIds) ? (
                      <div className="w-full flex flex-wrap gap-3">
                        {filterInput?.categoryIds?.map((item) => {
                          return (
                            <div
                              className="flex justify-center items-center bg-red-light2 px-2 py-1 gap-2 text-sm"
                              key={item?.id}
                            >
                              <span>{item?.name}</span>
                              <span
                                onClick={() =>
                                  handleRemoveFilter("categoryIds", item?.id)
                                }
                                className="flex justify-center items-center cursor-pointer rounded-full hover:bg-red-light4 transition-colors ease-in-out duration-300"
                              >
                                <Close className="scale-[0.5]" />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <Button
                    text="Apply Filter"
                    onClick={() => handleOnFilter()}
                    innerClassName="border-[0.5px] border-black text-sm rounded-md !h-[36px]"
                    textClass="text-sm"
                    lightRedBg
                    fullWidth
                    isLoading={productsByBrandsAndCategoriesLoading}
                    isDisabled={
                      isEmpty(filterInput?.brandIds) &&
                      isEmpty(filterInput?.categoryIds)
                    }
                  />
                </div>

                <button
                  onClick={clearFilters}
                  className="flex justify-center items-center gap-2 p-4 text-black text-sm w-full bg-red-light2 hover:bg-red-light4 transition-colors ease-in-out duration-300 rounded-b-xl"
                >
                  <span>
                    <Refresh />
                  </span>
                  <span className="font-700">Reset Filters</span>
                </button>
              </div>
            ) : null}

            {isLoading ||
            productsByBrandsAndCategoriesLoading ||
            searchProductLoading ? (
              <div
                className={classNames(
                  "flex  h-full items-center justify-center min-h-[300px]",
                  {
                    "w-[calc(100%-270px)] ml-auto": !isModal,
                    "w-full": isModal,
                  }
                )}
              >
                <CircleLoader blue />
              </div>
            ) : (
              <div
                className={classNames(
                  "flex flex-col justify-start items-center h-full new-table overflow-x-auto",
                  {
                    "w-[calc(100%-270px)] ml-auto": !isModal,
                    "w-full": isModal,
                  }
                )}
              >
                {isFilter ? (
                  !isEmpty(productsByBrandsAndCategories) ? (
                    <>
                      <span className="font-700 mb-2">
                        Filter Result: {productsByBrandsAndCategoriesCount}
                      </span>
                      <Table
                        data={productsByBrandsAndCategories}
                        columns={
                          isModal
                            ? columns.slice(0, 3)
                            : width >= 640
                            ? columns
                            : columns.slice(0, 2)
                        }
                        onRowClicked={(e) => {
                          handleEdit(e);
                        }}
                        pointerOnHover
                        pageCount={
                          productsByBrandsAndCategoriesCount / pageCount
                        }
                        onPageChange={(page) => setCurrentPageFilter(page)}
                        currentPage={currentPageFilter}
                        tableClassName="txn-section-table"
                        noPadding
                        noTableHead
                      />
                    </>
                  ) : (
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>
                        There are no results for your filter parameters
                      </span>
                    </div>
                  )
                ) : isSearchMode ? (
                  !isEmpty(searchResult) ? (
                    <>
                      <span className="font-700 mb-2">
                        Search Result: {searchResultCount}
                      </span>
                      <Table
                        data={searchResult}
                        columns={
                          isModal
                            ? columns.slice(0, 3)
                            : width >= 640
                            ? columns
                            : columns.slice(0, 2)
                        }
                        onRowClicked={(e) => {
                          handleEdit(e);
                        }}
                        pointerOnHover
                        pageCount={searchResultCount / pageCount}
                        onPageChange={(page) => setCurrentPageSearch(page)}
                        currentPage={currentPageSearch}
                        tableClassName="txn-section-table"
                        noPadding
                        noTableHead
                      />
                    </>
                  ) : (
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>
                        {`There are no results for your search `}{" "}
                        <strong className="text-black">'{searchQuery}'</strong>
                      </span>
                    </div>
                  )
                ) : !isEmpty(displayedProducts) ? (
                  <Table
                    data={displayedProducts}
                    columns={
                      isModal
                        ? columns.slice(0, 3)
                        : width >= 640
                        ? columns
                        : columns.slice(0, 2)
                    }
                    onRowClicked={(e) => {
                      handleEdit(e);
                    }}
                    pointerOnHover
                    pageCount={displayedProductsCount / pageCount}
                    onPageChange={(page) => setCurrentActivePage(page)}
                    currentPage={currentActivePage}
                    tableClassName="txn-section-table"
                    noPadding
                    noTableHead
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      {
                        <span>
                          {isArchive
                            ? "There are currently no archived products"
                            : isPrivate
                            ? "There are currently no private products"
                            : "There are currently no products"}
                        </span>
                      }
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
        handleChange={handleChangeFilter}
        form={filterInput}
      />
    </>
  );
};
ProductsPage.propTypes = {
  handleProductSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};
export default observer(ProductsPage);
