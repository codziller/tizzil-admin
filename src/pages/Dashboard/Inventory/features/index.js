import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty } from "lodash";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";

import {
  INVENTORY_MODAL_TYPES,
  PRODUCT_REQUEST_STATUSES,
  pageCount,
} from "utils/appConstant";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as BulletIcon } from "assets/icons/bullet.svg";
import { ReactComponent as ShopIcon } from "assets/icons/shop.svg";
import { ReactComponent as LowStockIcon } from "assets/icons/low-stock.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { observer } from "mobx-react-lite";
import ProductsStore from "pages/Dashboard/Products/store";
import classNames from "classnames";
import Tabs from "components/General/Tabs";
import { numberWithCommas } from "utils/formatter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "components/General/Button";
import CheckBox from "components/General/Input/CheckBox";
import Input from "components/General/Input/Input";
import { flattenArrayToString } from "utils/functions";
import ProductTransferRequests from "./ProductTransferRequests";
import ProductRequests from "./ProductRequests";
import { toJS } from "mobx";
import Amount from "components/General/Numbers/Amount";
import moment from "moment";
import useWarehouse from "hooks/useWarehouse";
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
const { REQUEST_PRODUCT, DOWNLOAD_CSV } = INVENTORY_MODAL_TYPES;
const { PENDING, INPROGRESS } = PRODUCT_REQUEST_STATUSES;
const InventoryPage = ({ isModal, handleProductSelect, isSelected }) => {
  const { warehouse_id } = useParams();
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
    getProductsLowInQuantity,
    productsLowInQuantity,
    productsLowInQuantityCount,
    productsLowInQuantityLoading,
  } = ProductsStore;

  const TABS = [
    { name: "products", label: `Products (${productsCount || "-"})` },

    {
      name: "lowInStock",
      label: `Low in Stock Products (${productsLowInQuantityCount || "-"})`,
    },

    {
      name: "archived",
      label: `Archived products (${productsArchivedCount || "-"})`,
    },
  ];
  const navigate = useNavigate();
  const { warehouseIsCentral } = useWarehouse();
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [currentPageLowQty, setCurrentPageLowQty] = useState(1);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  const [requestMode, setRequestMode] = useState(false);
  const [requestProducts, setRequestProducts] = useState([]);
  const searchQuery = searchInput?.trim();
  const isSearchMode = searchQuery?.length > 1;
  const isArchive = activeTab === "archived";
  const isLowQty = activeTab === "lowInStock";

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const payload = { page: currentPage, searchQuery };
    await searchProducts({ data: payload, warehouse_id });
  };

  const handleGetData = () => {
    isArchive
      ? getArchivedProducts({
          data: { page: currentPageArchived },
          warehouse_id,
        })
      : isLowQty
      ? getProductsLowInQuantity({
          data: {
            page: currentPageLowQty,
          },
        })
      : getProducts({ data: { page: currentPage }, warehouse_id });
  };

  useEffect(() => {
    isSearchMode ? handleSearch() : handleGetData();
  }, [
    currentPage,
    currentPageSearch,
    currentPageArchived,
    currentPageLowQty,
    isArchive,
    isLowQty,
  ]);

  useEffect(() => {
    if (searchQuery?.length > 1 || !searchQuery) {
      handleSearch();
    }
  }, [searchInput]);

  const handleRequestProductsChange = (row) => {
    const newRequestProductsArray = requestProducts?.map((item) => {
      if (item?.productId === row.productId) {
        return row;
      } else {
        return item;
      }
    });

    setRequestProducts(newRequestProductsArray);
  };

  const handleRequestProductsUpdate = (row) => {
    let newRequestProductsArray = requestProducts;
    if (
      newRequestProductsArray?.find(
        (item) => item?.productId === row?.productId
      )
    ) {
      newRequestProductsArray = newRequestProductsArray.filter(
        (item) => item?.productId !== row?.productId
      );
    } else {
      newRequestProductsArray = [...newRequestProductsArray, row];
    }

    setRequestProducts(newRequestProductsArray);
  };
  const handleEdit = (row) => {
    if (isModal) {
      handleProductSelect(row);
      return;
    }

    if (requestMode) {
      handleRequestProductsUpdate({
        productId: row?.id,
        quantity: 1,
      });
      return;
    }

    navigate(`/dashboard/inventory/edit/${warehouse_id}/${row?.id}`);
  };

  const columns = [
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
      minWidth: isMobile ? "40%" : "500px",
      maxWidth: isMobile ? "40%" : "500px",
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
              <ShopIcon />

              <span className="text-sm truncate max-w-[200px]">
                {flattenArrayToString(row.categories)}
              </span>

              {warehouseIsCentral ? (
                <>
                  <BulletIcon />

                  <span className="text-sm truncate">
                    {Number(quantity) < 1 ? "Out of Stock" : "In Stock"} :{" "}
                    <span className="font-600">
                      {" "}
                      {numberWithCommas(quantity)}
                    </span>
                  </span>
                  {Number(quantity) <= Number(row?.lowInQuantityValue) ? (
                    <>
                      <BulletIcon />
                      <LowStockIcon />
                      <span>Low</span>
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        );
      },
    },

    {
      minWidth: "160px",
      maxWidth: "160px",
      selector: (row) => {
        const productItem = row?.productOptions?.[0]?.choices?.find(
          (item) => item?.main
        );
        return (
          <div
            onClick={() => handleEdit(row)}
            className="flex flex-col justify-start items-start gap-3 pl-6 border-l-[2px] border-grey-bordercolor"
          >
            <span className="truncate font-800 text-base uppercase">
              Cost Price
            </span>
            <Amount
              value={
                productItem ? productItem?.variantCostPrice : row?.costPrice
              }
              className="text-sm"
            />
          </div>
        );
      },
      sortable: true,
    },

    {
      minWidth: "140px",
      maxWidth: "140px",
      selector: (row) => (
        <div
          onClick={() => handleEdit(row)}
          className="flex flex-col justify-start items-start gap-3"
        >
          <span className="truncate font-800 text-base uppercase">
            Last Updated
          </span>
          <span className="text-sm">
            {moment(row.updatedAt).format("MMM Do, YYYY")}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      minWidth: "60px",
      selector: (row) => (
        <div className="flex justify-start items-center gap-3">
          <span
            onClick={() => handleEdit(row)}
            className="font-600 cursor-pointer px-4 py-1 rounded-full bg-white text-[11px] text-black border-[1px] border-black "
          >
            Edit
          </span>
        </div>
      ),
      sortable: true,
    },
  ].filter((item) => item);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const displayedProducts = useMemo(() => {
    return isSearchMode
      ? searchResult
      : isArchive
      ? productsArchived
      : isLowQty
      ? productsLowInQuantity
      : products;
  }, [
    searchResult,
    products,
    productsArchived,
    productsLowInQuantity,
    isSearchMode,
    isArchive,
    isLowQty,
  ]);

  const displayedProductsCount = useMemo(() => {
    return isSearchMode
      ? searchResultCount
      : isArchive
      ? productsArchivedCount
      : isLowQty
      ? productsLowInQuantityCount
      : productsCount;
  }, [
    searchResult,
    products,
    isSearchMode,
    productsArchivedCount,
    productsLowInQuantityCount,
    isArchive,
    isLowQty,
    activeTab,
  ]);

  const isLoading = useMemo(() => {
    return isSearchMode
      ? searchProductLoading
      : isArchive
      ? isEmpty(productsArchived) && loadingArchived
      : isLowQty
      ? isEmpty(productsLowInQuantity) && productsLowInQuantityLoading
      : isEmpty(products) && loading;
  }, [
    searchProductLoading,
    loadingArchived,
    productsLowInQuantityLoading,
    loading,
  ]);

  useEffect(() => scrollToTop(), [displayedProducts]);

  return (
    <>
      <div
        className={classNames("min-h-[100px] h-fit  w-full mb-20", {
          "md:pr-4": !isModal,
        })}
      >
        <div className="flex flex-col justify-start items-center h-full w-full">
          <div className="flex justify-between items-center w-full mb-6 gap-1">
            <div
              className={classNames({
                "w-full": isModal,
                "w-full sm:w-[45%] sm:min-w-[300px]": !isModal,
              })}
            >
              <SearchBar
                placeholder={"Search for a product"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />

              {/* <Button
              text={
                requestMode
                  ? `Deselect (${requestProducts?.length})`
                  : "Request Products"
              }
              className="hidden md:block"
              onClick={() => {
                setRequestMode((prev) => !prev);
              }}
              whiteBg
            /> */}
            </div>

            <Button
              text="Download CSV File"
              onClick={() => setCurrentTxnDetails({ modalType: DOWNLOAD_CSV })}
              whiteBg
            />
          </div>
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "transfer_requests" ? (
            <ProductTransferRequests />
          ) : activeTab === "requests" ? (
            <ProductRequests />
          ) : (
            <>
              {isLoading ? (
                <CircleLoader blue />
              ) : (
                <>
                  {isSearchMode &&
                    `Search results - ${numberWithCommas(searchResultCount)}`}
                  <div className="flex flex-col flex-grow justify-start items-center w-full h-full new-table">
                    {!isEmpty(displayedProducts) ? (
                      <Table
                        data={displayedProducts}
                        columns={
                          isModal
                            ? columns.slice(0, 2)
                            : width >= 640
                            ? columns
                            : columns.slice(0, 2)
                        }
                        onRowClicked={(e) => {
                          requestMode
                            ? handleRequestProductsUpdate({
                                productId: e?.id,
                                quantity: 1,
                              })
                            : handleEdit(e);
                        }}
                        pointerOnHover
                        pageCount={displayedProductsCount / pageCount}
                        onPageChange={(page) =>
                          isSearchMode
                            ? setCurrentPageSearch(page)
                            : isArchive
                            ? setCurrentPageArchived(page)
                            : isLowQty
                            ? setCurrentPageLowQty(page)
                            : setCurrentPage(page)
                        }
                        currentPage={
                          isSearchMode
                            ? currentPageSearch
                            : isArchive
                            ? currentPageArchived
                            : isLowQty
                            ? currentPageLowQty
                            : currentPage
                        }
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
                              {isSearchMode && isEmpty(searchResult)
                                ? `There are no results for your search '${searchQuery}'`
                                : isArchive
                                ? "There are currently no archived products"
                                : isLowQty
                                ? "There are currently no low in stock products"
                                : "There are currently no products"}
                            </span>
                          }
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {!isEmpty(requestProducts) && requestMode && (
            <Button
              text={`Request ${requestProducts?.length} ${
                requestProducts?.length === 1 ? "Product" : "Products"
              } `}
              onClick={() =>
                setCurrentTxnDetails({ modalType: REQUEST_PRODUCT })
              }
              isDisabled={isEmpty(requestProducts)}
              className="fixed z-[200] bottom-[54.67px] left-0 right-0 mx-auto w-fit"
            />
          )}
        </div>
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
    </>
  );
};
InventoryPage.propTypes = {
  handleProductSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
};
export default observer(InventoryPage);
