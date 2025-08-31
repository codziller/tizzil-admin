import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { isEmpty, lowerCase, sumBy } from "lodash";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as OrdersIcon } from "assets/icons/orders-icon.svg";
import { ReactComponent as IncomeIcon } from "assets/icons/income-icon.svg";
import ProductsStore from "pages/Dashboard/Products/store";
import { dateFilters } from "pages/Dashboard/Home/features";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { convertToJs } from "utils/functions";
import { numberWithCommas } from "utils/formatter";
import Table from "components/General/Table";
import Amount from "components/General/Numbers/Amount";
import SearchBar from "components/General/Searchbar/SearchBar";
import EarningCard from "pages/Dashboard/Home/features/EarningCard";
import BrandsStore from "../store";

const ViewBrand = ({ isBrandStaff }) => {
  const pageCount = 10000000;
  const { brand_id, warehouse_id } = useParams();

  const brandId = isBrandStaff ? warehouse_id : brand_id;
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const {
    getProductQuantitySoldByDateFilterByBrandId,
    brandProductStats,
    loadingBrandProductStats,
  } = ProductsStore;

  const { getBrand, getBrandLoading, brand } = BrandsStore;

  useEffect(() => {
    if (!brand_id) return;
    getBrand({ data: { id: brand_id } });
  }, [brand_id]);

  useEffect(() => {
    const endDate = moment(dateFilter.end_date)
      .add(1, "day")
      .format("YYYY-MM-DD");
    getProductQuantitySoldByDateFilterByBrandId({
      data: {
        endDate,
        brandId,
        startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
      },
    });
  }, [dateFilter, brandId]);

  useEffect(() => {
    if (!brandProductStats) return;
    setDisplayedItems(brandProductStats);
  }, [brandProductStats]);

  const searchQuery = useMemo(() => {
    return searchInput?.trim();
  }, [searchInput]);

  useEffect(() => {
    if (!searchQuery) {
      setDisplayedItems(brandProductStats);
      return;
    }
    const searchResult = convertToJs(brandProductStats)?.filter((item) =>
      lowerCase(item?.productName).includes(searchQuery.toLowerCase())
    );
    setDisplayedItems(searchResult);
  }, [searchQuery]);

  const handleView = (row) => {
    if (isBrandStaff) {
      return;
    }
    navigate(`/dashboard/products/edit/${warehouse_id}/${row?.productId}`);
  };
  const columns = [
    {
      minWidth: "20%",
      name: "Product",
      selector: (row) => lowerCase(row?.productName),
      cell: (row) => row?.productName,
      sortable: true,
    },

    {
      name: "Quantity Sold",
      selector: (row) => Number(row?.quantitySold),
      cell: (row) => numberWithCommas(row?.quantitySold),
      sortable: true,
    },
    {
      name: "Quantity Left",
      selector: (row) => Number(row?.quantityLeft),
      cell: (row) => numberWithCommas(row?.quantityLeft),
      sortable: true,
    },

    ...(isBrandStaff
      ? []
      : [
          {
            name: "Total Gross Revenue",
            selector: (row) => parseFloat(row?.totalGrossRevenue),
            cell: (row) => (
              <div
                onClick={() => handleView(row)}
                className="flex justify-start items-center gap-4 cursor-pointer"
              >
                <Amount value={row?.totalGrossRevenue} />
              </div>
            ),
            sortable: true,
          },
          {
            name: "AverageOrderValue",
            selector: (row) => parseFloat(row?.averageOrderValue),
            cell: (row) => (
              <div
                onClick={() => handleView(row)}
                className="flex justify-start items-center gap-4 cursor-pointer"
              >
                <Amount value={row?.averageOrderValue} />
              </div>
            ),
            sortable: true,
          },

          {
            name: "Cost Price",
            selector: (row) => parseFloat(row?.costPrice),
            cell: (row) => (
              <div
                onClick={() => handleView(row)}
                className="flex justify-start items-center gap-4 cursor-pointer"
              >
                <Amount value={row?.costPrice} />
              </div>
            ),
            sortable: true,
          },

          {
            name: "Sale Price",
            selector: (row) => parseFloat(row?.salePrice),
            cell: (row) => (
              <div
                onClick={() => handleView(row)}
                className="flex justify-start items-center gap-4 cursor-pointer"
              >
                <Amount value={row?.salePrice} />
              </div>
            ),
            sortable: true,
          },

          {
            name: "Profit",
            selector: (row) => parseFloat(row?.profit),
            cell: (row) => (
              <div
                onClick={() => handleView(row)}
                className="flex justify-start items-center gap-4 cursor-pointer"
              >
                <Amount value={row?.profit} />
              </div>
            ),
            sortable: true,
          },
        ]),
  ];

  const displayedItemsCount = brandProductStats?.length || 0;

  const totalQuantitySold = useMemo(() => {
    return sumBy(brandProductStats, "quantitySold");
  }, [brandProductStats]);

  const totalProfit = useMemo(() => {
    return sumBy(brandProductStats, "profit");
  }, [brandProductStats]);

  return (
    <>
      <div className={"gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto"}>
        {!isBrandStaff ? (
          <div className="mb-5 w-full flex justify-between">
            <div
              onClick={() => navigate(-1)}
              className="scale-90 cursor-pointer"
            >
              <ArrowBack />
            </div>
          </div>
        ) : null}

        {getBrandLoading ? (
          <div className="flex justify-center items-center w-full p-6">
            <CircleLoader blue />
          </div>
        ) : (
          <>
            {!isBrandStaff ? (
              <div className="flex flex-col justify-start items-start mb-5">
                <h2 className="section-heading mb-1 text-xl">
                  <span className="text-red">{brand?.brandName} </span>sales
                  data history
                </h2>
                <span className="text-grey-text font-thin text-sm">
                  Click on a product to view details
                </span>
              </div>
            ) : null}
            <div className="flex justify-between items-center w-fit mb-3 gap-1">
              <div className="w-full sm:w-[200px]">
                <DashboardFilterDropdown
                  placeholder="Filter by: "
                  options={dateFilters}
                  name="payout_filter"
                  onClick={(e) => {
                    if (e.value === "custom") {
                      setShowDateModal(true);
                      return;
                    }
                    setDateFilter(e);
                  }}
                  value={dateFilter?.label}
                />
              </div>

              <div className="flex justify-start items-center w-fit truncate text-base">
                {dateFilter.value === "today"
                  ? moment(dateFilter.start_date).format("MMM Do, YYYY")
                  : `${moment(dateFilter.start_date).format(
                      "MMM Do, YYYY"
                    )} - ${moment(dateFilter.end_date).format("MMM Do, YYYY")}`}
              </div>
            </div>

            <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search for a product"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-4 mt-4">
              {loadingBrandProductStats ? (
                <CircleLoader blue />
              ) : (
                <>
                  {!isBrandStaff ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 smlg:grid-cols-4 gap-4 justify-between items-start w-full mb-2">
                      <EarningCard
                        icon={<OrdersIcon className="scale-[0.8]" />}
                        title="Total Quantity sold"
                        value={totalQuantitySold}
                        link="#"
                      />

                      <EarningCard
                        icon={<IncomeIcon className="scale-[0.8]" />}
                        title="Profit"
                        value={totalProfit}
                        link="#"
                        isAmount
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                    {!isEmpty(displayedItems) ? (
                      <Table
                        data={displayedItems}
                        columns={columns}
                        pageCount={displayedItemsCount / pageCount}
                        pointerOnHover
                        onRowClicked={(e) => {
                          handleView(e);
                        }}
                        tableClassName="txn-section-table"
                        noPadding
                      />
                    ) : (
                      <>
                        <div className="text-sm text-grey flex flex-col justify-center items-center space-y-3 h-full">
                          Sales data history for this brand is currently empty
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <DateRangeModal
        active={showDateModal}
        defaultDate={{
          startDate: new Date(dateFilter.start_date),
          endDate: new Date(dateFilter.end_date),
          key: "selection",
        }}
        onApply={(date) =>
          setDateFilter({
            value: `${moment(date?.startDate).format("DD MMM")} - ${moment(
              date?.endDate
            ).format("DD MMM")}`,
            label: `${moment(date?.startDate).format("DD MMM")} - ${moment(
              date?.endDate
            ).format("DD MMM")}`,
            start_date: date?.startDate,
            end_date: date?.endDate,
          })
        }
        toggler={() => setShowDateModal(false)}
      />
    </>
  );
};
ViewBrand.propTypes = {
  isBrandStaff: PropTypes.bool,
  details: PropTypes.object,
};
export default observer(ViewBrand);
