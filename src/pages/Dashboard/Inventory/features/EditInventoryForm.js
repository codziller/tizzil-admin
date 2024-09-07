import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import { Link, useParams } from "react-router-dom";
import { isEmpty, isNumber, upperCase } from "lodash";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Hashtag } from "assets/icons/hashtag.svg";
import { ReactComponent as CostPriceIcon } from "assets/icons/wallet-money.svg";
import { ReactComponent as TypeOfStockIcon } from "assets/icons/convert-3d-cube.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { numberWithCommas } from "utils/formatter";
import cleanPayload from "utils/cleanPayload";
import Select from "components/General/Input/Select";
import ProductsStore from "pages/Dashboard/Products/store";
import Flag from "components/General/Flag";
import SettingsStore from "pages/Dashboard/Settings/store";
import { supportedIntlCountries, supportedLocalCountries } from "utils/data";
import { NAIRA } from "utils/appConstant";
import useWarehouse from "hooks/useWarehouse";

const EditInventoryForm = ({ details, toggler, handleOnChange }) => {
  const {
    selectedProductOption,
    productOptionsName,
    allProducts,
    setSelectedProductOption,
    product,
  } = details;
  const { product_id, warehouse_id } = useParams();
  const { warehouseIsCentral } = useWarehouse();
  const {
    editProductInventory,
    editProductInventoryLoading,
    getProduct,
    getProductCostPrices,
    getProductCostPriceHistory,
    productStats,
  } = ProductsStore;
  const { getExchangeRate, exchangeRate } = SettingsStore;
  const currencyOptions = [
    ...supportedLocalCountries(),
    ...supportedIntlCountries(),
  ];
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    editLoading: false,
    allProducts,
    currency: currencyOptions?.[0],
  });

  const inventorySchema = {
    quantity: yup.string().required("Please enter variant name"),
    lowInQuantityValue: yup
      .string()
      .required("Please enter variant low in stock value"),
    costPrice: yup.string().required("Please enter variant cost price"),
    salePrice: yup.string().required("Please enter variant sale price"),
  };
  const schema = yup.object(inventorySchema);

  const defaultValues = {
    quantity: "",
    lowInQuantityValue: "",
    costPrice: "",
    salePrice: "",
  };
  useEffect(() => {
    getExchangeRate();
  }, []);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const handleChange = async (prop, val, isFormTwo) => {
    isFormTwo && setFormTwo({ ...formTwo, [prop]: val });
    setValue(prop, val);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    quantity: watch("quantity"),
    lowInQuantityValue: watch("lowInQuantityValue"),
    costPrice: watch("costPrice"),
    salePrice: watch("salePrice"),
  };
  const selectedQuantity = isEmpty(product?.productOptions)
    ? product?.quantity
    : selectedProductOption?.variantQuantity;
  const currencyItem = exchangeRate?.find(
    (itm) => itm.currency === formTwo.currency?.value
  );
  const ngnEquivalentCostPrice =
    parseFloat(currencyItem?.value) * parseFloat(form?.costPrice);
  const ngnEquivalentSalePrice =
    parseFloat(currencyItem?.value) * parseFloat(form?.salePrice);
  const handleUpdateProducts = async (value) => {
    const updatedAllProducts = await formTwo?.allProducts?.map((item) => {
      if (item.value === selectedProductOption?.value) {
        return {
          ...item,
          quantity: form.quantity,
          lowInQuantityValue: form.lowInQuantityValue,
          costPrice: form.costPrice,
          salePrice: form.salePrice,
        };
      } else {
        return item;
      }
    });
    setFormTwo({
      ...formTwo,
      allProducts: updatedAllProducts,
      ...(value ? {} : { editLoading: true }),
    });

    handleUpdateProductsForm(value);
  };

  const handleUpdateProductsForm = (value) => {
    if (!value) return;
    const matchedProduct = formTwo?.allProducts?.find(
      (item) => item?.value === value
    );
    handleChange("quantity", matchedProduct?.quantity || "");
    handleChange(
      "lowInQuantityValue",
      matchedProduct?.lowInQuantityValue || ""
    );
    handleChange("costPrice", matchedProduct?.costPrice || "");
    handleChange("salePrice", matchedProduct?.salePrice || "");
  };
  const handleOnSubmit = async (e) => {
    try {
      const updatedAllProducts = await formTwo?.allProducts?.map((item) => {
        if (item.value === selectedProductOption?.value) {
          return {
            ...item,
            quantity: form.quantity,
            lowInQuantityValue: form.lowInQuantityValue,
            costPrice: form.costPrice,
            salePrice: form.salePrice,
          };
        } else {
          return item;
        }
      });
      let mainInventory;
      let mainSalePrice;
      let singleChoiceInventory;

      const choiceInventory = updatedAllProducts
        ?.map((choice) => {
          if (choice?.main && choice?.lowInQuantityValue) {
            mainInventory = {
              costPrice:
                formTwo?.currency?.value === "NGN"
                  ? choice?.costPrice
                  : String(
                      parseFloat(choice?.costPrice) *
                        parseFloat(currencyItem?.value || 1)
                    ),
              salePrice:
                formTwo?.currency?.value === "NGN"
                  ? choice?.salePrice
                  : Math.ceil(
                      parseFloat(choice?.salePrice) *
                        parseFloat(currencyItem?.value || 1)
                    ).toString(),
              lowInQuantityValue: choice?.lowInQuantityValue,
              productOptionChoiceIndex: choice?.productOptionChoiceIndex,
              productOptionId: choice?.productOptionId,
              quantity: Number(choice.quantity),
              main: !!choice?.main,
            };
            mainSalePrice = choice?.salePrice;
          } else if (!choice?.main && choice?.lowInQuantityValue) {
            singleChoiceInventory = {
              costPrice:
                formTwo?.currency?.value === "NGN"
                  ? choice?.costPrice
                  : String(
                      parseFloat(choice?.costPrice) *
                        parseFloat(currencyItem?.value || 1)
                    ),
              salePrice:
                formTwo?.currency?.value === "NGN"
                  ? choice?.salePrice
                  : Math.ceil(
                      parseFloat(choice?.salePrice) *
                        parseFloat(currencyItem?.value || 1)
                    ).toString(),
              lowInQuantityValue: choice?.lowInQuantityValue,
              productOptionChoiceIndex: choice?.productOptionChoiceIndex,
              productOptionId: choice?.productOptionId,
              quantity: Number(choice.quantity),
              main: !!choice?.main,
            };
          }
          return cleanPayload({
            costPrice:
              formTwo?.currency?.value === "NGN"
                ? choice?.costPrice
                : String(
                    parseFloat(choice?.costPrice) *
                      parseFloat(currencyItem?.value || 1)
                  ),
            salePrice:
              formTwo?.currency?.value === "NGN"
                ? choice?.salePrice
                : Math.ceil(
                    parseFloat(choice?.salePrice) *
                      parseFloat(currencyItem?.value || 1)
                  ).toString(),
            lowInQuantityValue: choice?.lowInQuantityValue,
            productOptionChoiceIndex: choice?.productOptionChoiceIndex,
            productOptionId: choice?.productOptionId,
            quantity: Number(choice.quantity),
            exchangeRateSaleCurrency:
              formTwo?.currency?.value === "NGN"
                ? null
                : formTwo?.currency?.value,
            exchangeRateSalePrice:
              formTwo?.currency?.value === "NGN"
                ? null
                : String(choice?.salePrice),
          });
        })
        ?.filter((item) => item?.lowInQuantityValue);

      // const productOptionModified = !isEmpty(singleChoiceInventory);
      const newPayload = {
        lowInQuantityValue: String(mainInventory?.lowInQuantityValue || ""),
        quantity: mainInventory?.costPrice
          ? String(mainInventory?.quantity || 0)
          : "",
        costPrice: mainInventory?.costPrice,
        salePrice: mainInventory?.salePrice,
        warehouseId: warehouse_id,
        productId: product_id,
        productOptions: null,
        choiceInventory: !isEmpty(product?.productOptions)
          ? choiceInventory
          : null,
        exchangeRateSaleCurrency:
          formTwo?.currency?.value === "NGN"
            ? null
            : mainInventory?.salePrice
            ? formTwo?.currency?.value
            : null,
        exchangeRateSalePrice:
          formTwo?.currency?.value === "NGN"
            ? null
            : mainInventory?.salePrice
            ? String(mainSalePrice)
            : null,
      };
      cleanPayload(newPayload);
      const payload = {
        ...(mainInventory?.costPrice
          ? { costPrice: mainInventory?.costPrice }
          : {}),
        ...(mainInventory?.salePrice
          ? { salePrice: mainInventory?.salePrice }
          : {}),
        products: [
          {
            ...newPayload,
            choiceInventory: newPayload?.choiceInventory || [],
          },
        ],
      };

      await editProductInventory({
        data: payload,
        onSuccess: () => {
          getProduct({ data: { id: product_id } });
          getProductCostPrices({ data: { productId: product_id } });
          getProductCostPriceHistory({
            data: {
              pageNumber: 1,
              productId: product_id,
              warehouseId: warehouse_id,
            },
          });
          toggler();
        },
        page: details?.currentPage,
        warehouse_id,
      });
    } catch (error) {
    } finally {
      handleChangeTwo("editLoading", false);
    }
    return;
  };

  const selectedCostPrice =
    selectedProductOption?.variantCostPrice || product?.costPrice || 0;

  const selectedSalePrice =
    selectedProductOption?.variantSalePrice || product?.salePrice || 0;

  return (
    <>
      <div className="flex flex-col justify-center items-start gap-y-2 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mr-auto">
            <Close />
          </button>
        )}

        <p className="font-600 text-xl uppercase">New Adjustment</p>

        <p className="mb-3 text-sm text-grey text-left">
          Select a variant to adjust it's stock
        </p>
        <div className="flex flex-col md:flex-row justify-start items-start gap-3 w-full">
          <Select
            label={`Select ${productOptionsName}`}
            placeholder="Select variant"
            options={allProducts}
            onChange={(val) => {
              handleUpdateProducts(val?.value);
              setSelectedProductOption(val);
            }}
            value={selectedProductOption}
            isDisabled={allProducts?.length <= 1}
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

          <Select
            fullWidth
            value={formTwo.currency}
            onChange={(val) => handleChangeTwo("currency", val)}
            labelControl={
              currencyItem?.value ? (
                <div className="flex gap-2 text-base">
                  1{formTwo.currency.label} = NGN
                  {numberWithCommas(currencyItem?.value)}
                </div>
              ) : null
            }
            label="Select Currency"
            options={currencyOptions}
            formatOptionLabel={(option) => (
              <div className="flex flex-row items-center">
                {option.country && <Flag countryCode={option.country} />}
                <span className="text-black ml-3">
                  {option.value?.toUpperCase()}
                </span>
              </div>
            )}
          />
        </div>
        <div className="flex w-full rounded-lg px-4 py-3 bg-red-light2 box-shadow-2 gap-8 mb-5">
          {selectedProductOption?.imageUrls?.[0] ? (
            <div className="p-6 rounded-lg bg-white flex justify-center items-center w-[90px] h-[90px]">
              <img
                alt={
                  selectedProductOption?.name ||
                  selectedProductOption?.variantName
                }
                src={selectedProductOption?.imageUrls?.[0]}
                className="object-cover w-[60px] h-[60px]"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2 justify-center items-start">
            <span className="text-sm uppercase font-700">
              {product?.name}{" "}
              {selectedProductOption?.variantName
                ? ` - ${selectedProductOption?.variantName}`
                : ""}
            </span>
            <div className="flex gap-2 justify-center items-start">
              <Hashtag />
              <span className="text-sm ">
                Stocked Product:{" "}
                <span className="font-700">
                  {numberWithCommas(
                    warehouseIsCentral
                      ? selectedQuantity || 0
                      : productStats?.qtyLeft
                  )}{" "}
                  in stock
                </span>
              </span>
            </div>
            <div className="flex gap-3 justify-center items-start">
              <div className="flex gap-2 justify-center items-start">
                <CostPriceIcon width={16} />
                <span className="text-sm ">
                  Cost Price:{" "}
                  <span className="font-700">
                    {NAIRA} {numberWithCommas(selectedCostPrice)}
                  </span>
                </span>
              </div>

              <div className="flex gap-2 justify-center items-start">
                <TypeOfStockIcon width={16} />
                <span className="text-sm ">
                  Sale Price:{" "}
                  <span className="font-700">
                    {NAIRA} {numberWithCommas(selectedSalePrice)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-3 w-full overflow-y-auto"
        >
          <div className="flex flex-col md:flex-row justify-start items-start gap-3 w-full">
            <Input
              label="Quantity"
              value={form?.quantity}
              onChangeFunc={(val) => handleChange("quantity", val)}
              placeholder="Quantity"
              formError={errors.quantity}
              showFormError={formTwo?.showFormError}
              type="number"
              isCounter
            />
            <Input
              label="Low In Stock"
              value={form?.lowInQuantityValue}
              onChangeFunc={(val) => handleChange("lowInQuantityValue", val)}
              placeholder="Low In Stock Value"
              formError={errors.lowInQuantityValue}
              showFormError={formTwo?.showFormError}
              type="number"
              isCounter
            />
          </div>
          <div className="flex flex-col md:flex-row justify-start items-start gap-3 w-full">
            <Input
              labelControl={
                ngnEquivalentCostPrice ? (
                  <div className="flex gap-2 text-base">
                    NGN
                    {numberWithCommas(ngnEquivalentCostPrice)}
                  </div>
                ) : null
              }
              labelControlTwo={
                <span
                  onClick={() => handleChange("costPrice", selectedCostPrice)}
                  className="cursor-pointer text-sm text-blue underline"
                >
                  Use last cost price
                </span>
              }
              label={`Cost Price (${upperCase(formTwo?.currency?.value)})`}
              value={form?.costPrice}
              onChangeFunc={(val) => handleChange("costPrice", val)}
              placeholder="Enter Cost Price"
              formError={errors.costPrice}
              showFormError={formTwo?.showFormError}
              prefix={upperCase(formTwo?.currency?.value)}
              type="number"
            />

            <Input
              labelControl={
                ngnEquivalentSalePrice ? (
                  <div className="flex gap-2 text-base">
                    NGN
                    {numberWithCommas(ngnEquivalentSalePrice)}
                  </div>
                ) : null
              }
              labelControlTwo={
                <span
                  onClick={() => handleChange("salePrice", selectedSalePrice)}
                  className="cursor-pointer text-sm text-blue underline"
                >
                  Use last sale price
                </span>
              }
              label={`Sale Price (${upperCase(formTwo?.currency?.value)})`}
              value={form?.salePrice}
              onChangeFunc={(val) => handleChange("salePrice", val)}
              placeholder="Enter Sale Price"
              formError={errors.salePrice}
              showFormError={formTwo?.showFormError}
              prefix={upperCase(formTwo?.currency?.value)}
              type="number"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
            <Button
              onClick={() => toggler?.()}
              text="Cancel"
              fullWidth
              whiteBg
            />

            <Button
              onClick={() => {
                setFormTwo({ ...formTwo, showFormError: true });
              }}
              isLoading={formTwo.editLoading || editProductInventoryLoading}
              type="submit"
              text="Save Changes"
              className="mb-2"
              fullWidth
            />
          </div>
        </form>
      </div>
    </>
  );
};
EditInventoryForm.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  form: PropTypes.object,
};
export default observer(EditInventoryForm);
