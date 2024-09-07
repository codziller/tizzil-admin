import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { TailSpin } from "react-loader-spinner";
import { observer } from "mobx-react-lite";
import { isEmpty } from "lodash";
import classNames from "classnames";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as TicketIcon } from "assets/icons/ticket-star.svg";
import { ReactComponent as ShopIcon } from "assets/icons/shop.svg";
// import { ReactComponent as QuantityCard } from "assets/icons/quantity-card.svg";
import { ReactComponent as FatArrow } from "assets/icons/Arrow/fat-arrow.svg";
import Button from "components/General/Button/Button";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import ProductsStore from "pages/Dashboard/Products/store";
import { NAIRA, PRODUCT_MODAL_TYPES } from "utils/appConstant";
import { ReactComponent as Arrow } from "assets/icons/Arrow/arrow-right-grey.svg";
import { numberWithCommas } from "utils/formatter";
import { dateFilters } from "pages/Dashboard/Home/features";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import DateRangeModal from "components/General/Modal/DateRangeModal/DateRangeModal";
import Select from "components/General/Input/Select";
import AuthStore from "pages/OnBoarding/SignIn/store";
import {
  convertToJs,
  flattenArrayToString,
  flattenProductArray,
} from "utils/functions";
import QuantityLeft from "./QuantityLeft";
import DetailsModal from "./DetailsModal";
import useWarehouse from "hooks/useWarehouse";

const { PRODUCT_VARIANT } = PRODUCT_MODAL_TYPES;
const width = 250;
const Form = ({ details, toggler }) => {
  const { product_id, warehouse_id } = useParams();
  const { warehouseIsCentral } = useWarehouse();
  const navigate = useNavigate();
  const scrollXContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const [formTwo, setFormTwo] = useState({
    currentProductVariant: {},
    currentProductOption: {},
    modalType: "",
    showFormError: false,
    productOptionModified: false,
  });
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  const [showDateModal, setShowDateModal] = useState(false);

  const {
    product,
    productStats,
    getProductQuantitySoldByDateFilter,
    loadingProductStats,
    productCostPricesLoading,
    productCostPrices,
  } = ProductsStore;
  const { userIsGeneralAdmin } = AuthStore;
  const [selectedProductOption, setSelectedProductOption] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleScroll = (direction) => {
    if (direction === "left") {
      scrollXContainerRef.current.scrollLeft -= width;
    } else {
      scrollXContainerRef.current.scrollLeft += width;
    }
  };
  useEffect(() => {
    if (
      (!isEmpty(product?.productOptions) &&
        !selectedProductOption?.productOptionId) ||
      isEmpty(product)
    ) {
      return;
    }
    const endDate = moment(dateFilter.end_date)
      .add(1, "day")
      .format("YYYY-MM-DD");

    getProductQuantitySoldByDateFilter({
      data: {
        endDate,
        productId: product_id,
        startDate: moment(dateFilter.start_date).format("YYYY-MM-DD"),
        warehouseId: warehouse_id,
        ...(isEmpty(product?.productOptions)
          ? {}
          : {
              productOptionChoiceIndex:
                selectedProductOption?.productOptionChoiceIndex,
              productOptionId: selectedProductOption?.productOptionId,
            }),
      },
    });
  }, [dateFilter, product_id, selectedProductOption, product]);

  const handleEditOption = (val, prop, rest) => {
    if (prop === "productVariants") {
      setFormTwo({
        ...formTwo,
        currentProductVariant: val,
        currentProductOption: rest,
        modalType: PRODUCT_VARIANT,
      });
      return;
    }
  };

  const handleCloseModal = () => {
    setFormTwo((prev) => {
      return {
        ...prev,
        currentProductOption: {},
        currentProductVariant: {},
        modalType: false,
      };
    });
  };

  const handleActiveSlideUpdate = () => {
    for (let i = 0; i < cardsRef?.current?.length; i++) {
      const x = cardsRef?.current[i]?.getBoundingClientRect()?.x;

      if (x >= 0 && x < width) {
        setActiveSlideIndex(i);
      }
    }
  };
  const productOptions = flattenProductArray(product?.productOptions);
  const allProducts = useMemo(() => {
    return [
      isEmpty(productOptions)
        ? {
            ...product,
            label: product?.name,
            value: product?.name + product?.id,
            main: true,
          }
        : null,
      ...productOptions,
    ]
      ?.filter((item) => item)
      .sort((a, b) => {
        // If a is main and b is not, a comes first
        if (a?.main && !b?.main) return -1;
        // If b is main and a is not, b comes first
        if (!a?.main && b?.main) return 1;
        // If neither or both are main, retain original order
        return 0;
      });
  }, [product]);

  useEffect(() => {
    setSelectedProductOption(allProducts?.[0]);
  }, [allProducts]);
  const productOptionsName = flattenArrayToString(
    product?.productOptions,
    " or ",
    "Variant"
  );

  const selectedImages = selectedProductOption?.main
    ? product?.imageUrls
    : selectedProductOption?.imageUrls;

  const selectedQuantity = isEmpty(product?.productOptions)
    ? product?.quantity
    : selectedProductOption?.variantQuantity;

  const selectedCostPrices = isEmpty(product?.productOptions)
    ? productCostPrices
    : productCostPrices?.filter(
        (item) =>
          item?.productOptionId === selectedProductOption?.productOptionId &&
          item?.productOptionIndex ===
            selectedProductOption?.productOptionChoiceIndex
      );

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5 w-full flex justify-between">
            <div
              onClick={() => navigate(-1)}
              className="scale-90 cursor-pointer"
            >
              <ArrowBack />
            </div>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <h2 className="section-heading mb-3 text-xl uppercase md:basis-1/3">
            Edit <span className="text-red">{product?.name}</span> Inventory
          </h2>

          <div className="flex flex-col justify-start items-start gap-2 md:basis-2/3">
            <span className="text-xl font-700 mb-1">Basic Information</span>
            <span className="text-base">{product?.name}</span>
            <span className="text-base">
              <span className="font-700">Category</span> :{" "}
              {flattenArrayToString(product?.categories)}
            </span>
            <span className="text-base">
              <span className="font-700">Sale Price</span> : {NAIRA}
              {numberWithCommas(
                selectedProductOption?.variantSalePrice || product?.salePrice
              )}
            </span>
          </div>
        </div>

        <form className="flex flex-col md:flex-row justify-start items-start gap-10 md:gap-20 w-full overflow-y-auto">
          {/* First section */}
          <div className="flex flex-col basis-1/2 justify-start items-start gap-y-4 overflow-y-auto">
            <Select
              label={`Select ${productOptionsName}`}
              placeholder="Select variant"
              options={allProducts}
              onChange={(val) => setSelectedProductOption(val)}
              value={selectedProductOption}
              formatOptionLabel={(option) => (
                <div
                  key={option?.value}
                  className="flex flex-row items-center gap-2"
                >
                  <span className="text-black">{option.label}</span>

                  {option?.main ? (
                    <span className="text-black bg-red-light3 px-2 py-0.5 border border-black text-xs">
                      Main
                    </span>
                  ) : null}
                </div>
              )}
              fullWidth
            />
            {isEmpty(selectedImages) ? (
              <span className="text-grey text-lg uppercase px-6 mb-6">
                The selected product has no image.
              </span>
            ) : (
              <div className="w-full flex justify-center items-center border-[1.5px] border-red-light2 bg-white box-shadow-3 rounded-lg p-10 gap-6 mb-6">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  style={{ opacity: activeSlideIndex <= 0 ? 0.6 : 1 }}
                  className="flex justify-center items-center max-w-[60px] max-h-[60px] min-w-[60px] min-h-[60px] rounded-full bg-[rgba(245,245,245,0.22)] hover:bg-[rgba(245,245,245,0.5)] transition-colors duration-500 ease-in-out z-10"
                >
                  <Arrow className={classNames("scale-75 rotate-[180deg]")} />
                </button>
                <div
                  ref={scrollXContainerRef}
                  className="flex justify-start items-center gap-4 w-[250px] max-w-[250px] min-w-[250px] no-scrollbar overflow-x-hidden scroll-smooth snap-mandatory snap-x"
                  onScroll={(e) => handleActiveSlideUpdate()}
                >
                  {selectedImages?.map((item, i) => (
                    <img
                      ref={(el) => (cardsRef.current[i] = el)}
                      key={item}
                      className="max-w-[250px] min-w-[250px] h-[220px] object-cover"
                      src={item}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  style={{
                    opacity:
                      activeSlideIndex >= selectedImages?.length - 1 ? 0.6 : 1,
                  }}
                  className="flex justify-center items-center  max-w-[60px] max-h-[60px] min-w-[60px] min-h-[60px] rounded-full bg-[rgba(245,245,245,0.22)] hover:bg-[rgba(245,245,245,0.5)] transition-colors duration-500 ease-in-out z-10"
                >
                  <Arrow className={classNames("scale-75 ")} />
                </button>
              </div>
            )}

            <div className="w-full flex flex-col justify-start items-start border-[1.5px] border-red-light2 bg-white rounded-lg px-4 py-6 gap-6 mt-6 mb-12 md:max-h-[400px] md:overflow-y-auto">
              <span className="text-base">
                COST PRICES{" "}
                {productCostPricesLoading
                  ? ""
                  : ` (${productCostPrices?.length})`}
              </span>

              {productCostPricesLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <CircleLoader blue />
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-6">
                  {selectedCostPrices?.map((item, i) => (
                    <div
                      key={i}
                      className="w-full flex justify-center items-center box-shadow bg-white rounded-lg p-[4px]"
                    >
                      <div className="w-full flex flex-col justify-center items-start bg-red-light2 rounded-lg px-2 py-4 gap-5">
                        <div className="flex justify-start items-start gap-2 pb-1 border-b-1/2 border-grey-light3">
                          <TicketIcon />

                          <div className="flex flex-col justify-start items-start gap-2">
                            <span className="text-xs">Cost Price</span>
                            <span className="text-xl font-700">
                              {NAIRA}
                              {numberWithCommas(item?.costPrice)}
                            </span>
                          </div>
                        </div>

                        {warehouseIsCentral ? (
                          <div className="flex justify-start items-center gap-2">
                            <ShopIcon />

                            <div className="flex justify-start items-center gap-2">
                              <span className="text-xs">Quantity Left:</span>
                              <span className="text-red-deep text-base font-700">
                                {numberWithCommas(item?.quantityLeft)}
                              </span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Second section */}
          <div className="flex flex-col basis-1/2 justify-start items-start gap-y-3 overflow-y-auto">
            <div className="w-full flex justify-center items-center border-[1.5px] border-red-light2 bg-white rounded-lg p-[4px] mt-[90px]">
              <div className="w-full flex flex-col justify-center items-start bg-grey-light2 rounded-lg p-10 gap-5">
                <span className="font-700 text-xl">Stock</span>

                <div className="w-full flex flex-col gap-2 justify-center items-center bg-white rounded-lg p-6">
                  <span className="uppercase ">Quantity At Hand</span>

                  <span className="text-red-deep font-800 text-2xl ">
                    {numberWithCommas(
                      warehouseIsCentral
                        ? selectedQuantity || 0
                        : productStats?.qtyLeft
                    )}
                  </span>

                  <Button
                    text="Adjust Stock"
                    onClick={() =>
                      handleEditOption(
                        {
                          ...selectedProductOption,
                          // ...choice,
                          // productOptionChoiceIndex: i,
                          // productOptionId: item?.id,
                        },
                        "productVariants",
                        selectedProductOption?.productOption
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col justify-start items-start p-10 gap-6 mt-6">
              <span className="text-base">ADDITIONAL SALES DATA</span>

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
                      )} - ${moment(dateFilter.end_date).format(
                        "MMM Do, YYYY"
                      )}`}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between items-start w-full mb-2">
                <div className="quantity-card  bg-cover bg-no-repeat bg-center flex flex-col justify-center items-start gap-3 p-6 h-full">
                  <span className="text-white text-lg font-700 z-10">
                    Quantity Sold
                  </span>

                  {loadingProductStats ? (
                    <span className="z-10">
                      <TailSpin
                        height="30"
                        width="30"
                        color="#ffffff"
                        ariaLabel="tail-spin-loading"
                        radius="3"
                        strokeWidth={5}
                        visible={true}
                      />
                    </span>
                  ) : (
                    <div className="flex justify-start items-center gap-1.5">
                      <span className="text-white text-3xl font-800 z-10">
                        {numberWithCommas(productStats?.qtySold)}
                      </span>
                      <span className="z-10">
                        <FatArrow />
                      </span>
                    </div>
                  )}
                </div>

                {userIsGeneralAdmin ? (
                  <div className="profit-card  bg-cover bg-no-repeat bg-center flex flex-col justify-center items-start gap-3 p-6 h-full">
                    <span className="text-white text-lg font-700 z-10">
                      Profit
                    </span>

                    {loadingProductStats ? (
                      <span className="z-10">
                        <TailSpin
                          height="30"
                          width="30"
                          color="#ffffff"
                          ariaLabel="tail-spin-loading"
                          radius="3"
                          strokeWidth={5}
                          visible={true}
                        />
                      </span>
                    ) : (
                      <div className="flex justify-start items-center gap-1.5">
                        <span className="text-white text-3xl font-800 z-10">
                          {NAIRA} {numberWithCommas(productStats?.profit)}
                        </span>
                        <span className="z-10">
                          <FatArrow />
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </form>

        <QuantityLeft
          details={{ ...product }}
          selectedProductOption={selectedProductOption}
        />
      </div>

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_VARIANT}
        details={{
          modalSize: "lg",
          modalType: formTwo?.modalType,
          productOptionsName,
          allProducts,
          setSelectedProductOption,
          selectedProductOption,
          product,
          currentPage: details?.currentPage,
        }}
        toggler={handleCloseModal}
      />

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
Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default observer(Form);
