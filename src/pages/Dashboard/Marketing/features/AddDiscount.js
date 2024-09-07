import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { TailSpin } from "react-loader-spinner";
import {
  DISCOUNT_TYPES,
  DISCOUNT_TYPES_OPTION,
  MEDIA_MODAL_TYPES,
  NAIRA,
  ORDER_SOURCE_OPTIONS,
  PRODUCT_MODAL_TYPES,
} from "utils/appConstant";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as AddIcon } from "assets/icons/add-circle.svg";
import MarketingStore from "../store";
import DetailsModal from "./DetailsModal";
import { observer } from "mobx-react-lite";
import CategoriesStore from "pages/Dashboard/Categories/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import ProductsStore from "pages/Dashboard/Products/store";
import cleanPayload from "utils/cleanPayload";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import { flattenCategories } from "utils/functions";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { isArray, isEmpty } from "lodash";
import { errorToast, warningToast } from "components/General/Toast/Toast";
import Select from "components/General/Input/Select";
import Wysiwyg from "components/General/Textarea/Wysiwyg";
import Input from "components/General/Input/Input";
import CheckBox from "components/General/Input/CheckBox";
import moment from "moment";
import DatePickerComponent from "components/General/DatePicker";
import DiscountOverview from "./DiscountOverview";

const { PRODUCT_CATEGORY, PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;
const { BUY_X_GET_X_FREE, BUY_X_GET_Y_FREE, FIXED, FREE_SHIPPING, PERCENTAGE } =
  DISCOUNT_TYPES;
const Form = observer(() => {
  const { warehouse_id, media_id, position } = useParams();
  const { getCategories } = CategoriesStore;
  const {
    createDiscount,
    editDiscount,
    discount,
    loadingDiscount,
    discountProducts,
    discountBrands,
    discountCategories,
    getTopshipCountries,
    topshipCities,
    topshipCountries,
    loadingTopshipCities,
    loadingTopshipCountries,
    getTopshipStates,
    loadingTopshipStates,
    topshipStates,
  } = MarketingStore;
  const { getProductName, getProductLoading, product } = ProductsStore;
  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  useEffect(() => {
    getCategories();
    getTopshipCountries();
  }, []);

  const schema = yup.object({
    name: yup.string().required("Please enter discount name"),
    discountType: yup.string().required("Please select discount type"),
  });

  const defaultValues = {
    categoryIds: media_id ? discountCategories : [],
    brandIds: media_id ? discountBrands : [],
    productIds: media_id ? discountProducts : [],
    discountCode: media_id ? discount?.discountCode : "",
    discountValue: media_id ? discount?.discountValue : "",
    discountType: media_id ? discount?.discountType : "",
    name: media_id ? discount?.name : "",
    discountBuyXvalue: media_id ? discount?.discountBuyXvalue : "",
    discountGetXvalue: media_id ? discount?.discountGetXvalue : "",
    discountGetYproductId: media_id ? discount?.discountGetYproductId : "",
    discountGetYvalue: media_id ? discount?.discountGetYvalue : "",
    discountExpiryTime: media_id ? discount?.discountExpiryTime : "",
    discountLimit: media_id ? discount?.discountLimit : "",
    discountAmountLimit: media_id ? discount?.discountAmountLimit : "",
    topshipCountryId: media_id ? discount?.topshipCountry?.id : "",
    topshipStateIds: media_id ? discount?.topshipState?.id : "",
    countryCode: media_id ? discount?.topshipCountry?.code : "",
    discountLimit: media_id ? discount?.discountLimit : "",
    orderSource: media_id ? discount?.orderSource : "",
    autoApply: media_id ? !!discount?.autoApply : false,
  };

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

  const handleChange = async ({ prop, val, rest, isFormTwo, isWysywyg }) => {
    if (
      prop === "discountValue" &&
      form.discountType === PERCENTAGE &&
      parseFloat(val) > 100
    ) {
      return;
    }

    isFormTwo
      ? setFormTwo({ ...formTwo, [prop]: val, formModified: true })
      : setFormTwo({ ...formTwo, formModified: true });
    let updatedVal;
    if (isWysywyg) {
      updatedVal = JSON.stringify(
        draftToHtml(convertToRaw(val?.getCurrentContent()))
      );
    } else if (rest) {
      updatedVal = [...val, ...rest];
    } else {
      updatedVal = val;
    }

    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    name: watch("name"),
    categoryIds: watch("categoryIds"),
    brandIds: watch("brandIds"),
    productIds: watch("productIds"),
    discountCode: watch("discountCode"),
    discountLimit: watch("discountLimit"),
    discountAmountLimit: watch("discountAmountLimit"),
    orderSource: watch("orderSource"),
    autoApply: watch("autoApply"),
    discountValue: watch("discountValue"),
    discountType: watch("discountType"),
    discountBuyXvalue: watch("discountBuyXvalue"),
    discountGetXvalue: watch("discountGetXvalue"),
    discountGetYproductId: watch("discountGetYproductId"),
    discountGetYvalue: watch("discountGetYvalue"),
    discountExpiryTime: watch("discountExpiryTime"),
    topshipStateIds: watch("topshipStateIds"),
    topshipCountryId: watch("topshipCountryId"),
    countryCode: watch("countryCode"),
  };

  useEffect(() => {
    if (form.topshipCountryId) {
      getTopshipStates({ data: { countryCode: form.countryCode } });
    }
  }, [form.topshipCountryId]);
  useEffect(() => {
    if (
      form?.discountGetYproductId &&
      form?.discountType === BUY_X_GET_Y_FREE
    ) {
      getProductName({ data: { id: form.discountGetYproductId } });
    }
  }, [form?.discountGetYproductId, form?.discountType]);

  useEffect(() => {
    if (
      form.discountType === PERCENTAGE &&
      parseFloat(form.discountValue) > 100
    ) {
      handleChange({ prop: "discountValue", val: "" });
    }
  }, [form.discountType, form.discountValue]);

  const handleOnSubmit = async () => {
    const {
      discountType,
      discountValue,
      discountGetXvalue,
      discountGetYvalue,
      discountBuyXvalue,
      discountGetYproductId,
      productIds,
      categoryIds,
      brandIds,
      topshipCountryId,
      topshipStateIds,
    } = form;
    if (
      (discountType === PERCENTAGE || discountType === FIXED) &&
      !discountValue
    ) {
      warningToast("Error!", "Please enter discount value");
      return;
    }
    if (discountType?.includes("BUY") && !discountBuyXvalue) {
      warningToast("Error!", "Please enter number of product (X) to be bought");
      return;
    }
    if (discountType === BUY_X_GET_X_FREE && !discountGetXvalue) {
      warningToast("Error!", "Please enter number of product (X) to be given");
      return;
    }

    if (discountType === BUY_X_GET_Y_FREE && !discountGetYproductId) {
      warningToast("Error!", "Please  Select product (Y) to be given");
      return;
    }

    if (discountType === BUY_X_GET_Y_FREE && !discountGetYvalue) {
      warningToast("Error!", "Please enter number of product (Y) to be given");
      return;
    }

    if (discountType?.includes("BUY") && isEmpty(productIds)) {
      warningToast("Error!", "Please select product to apply this discount to");
      return;
    }

    // if (isEmpty(productIds?.[0] || categoryIds?.[0] || brandIds?.[0])) {
    //   warningToast(
    //     "Error!",
    //     "Please select products, brands, or categories to apply this discount to"
    //   );
    //   return;
    // }
    handleChangeTwo("createLoading", true);

    try {
      const payload = {
        ...form,
        discountValue: form.discountValue || "0",
        discountGetYvalue: discountGetYvalue ? Number(discountGetYvalue) : "",
        discountGetXvalue: discountGetXvalue ? Number(discountGetXvalue) : "",
        discountBuyXvalue: discountBuyXvalue ? Number(discountBuyXvalue) : "",
        productIds: productIds?.map((item) => item?.id),
        brandIds: brandIds?.map((item) => item?.id),
        categoryIds: categoryIds?.map((item) => item?.id),
        autoApply: media_id ? "" : form.autoApply,
        ...(discountType === FREE_SHIPPING
          ? { topshipStateIds, topshipCountryId }
          : { topshipStateIds: "", topshipCountryId: "" }),
      };

      cleanPayload(payload);
      if (!media_id) {
        await createDiscount({
          data: {
            ...payload,
            discountExpiryTime: new Date(moment(form?.discountExpiryTime)._d),
          },
          onSuccess: () => navigate(-1),
        });
        return;
      } else {
        await editDiscount({
          data: {
            ...payload,
            id: media_id,
            discountExpiryTime: new Date(moment(form?.discountExpiryTime)._d),
          },
          onSuccess: () => navigate(-1),
        });
        return;
      }
    } catch (error) {
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
      handleChangeTwo("createLoading", false);
    }
  };

  const handleRemoveItem = (prop, id) => {
    let prevData = form?.[prop];
    prevData = prevData?.filter((item) => item?.id !== id);
    handleChange({ prop, val: prevData });
  };

  return loadingDiscount ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <>
      <div className="h-full md:pr-4 pt-1">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            <div className="gap-y-4 py-4 w-full h-full pb-4">
              <div className="mb-5">
                <button onClick={() => navigate(-1)} className="scale-90">
                  <ArrowBack />
                </button>
              </div>
              {media_id ? (
                <h2 className="section-heading my-8 text-xl">Edit Discount</h2>
              ) : (
                <h2 className="section-heading mb-3 text-xl">Add Discount</h2>
              )}

              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col justify-start items-start gap-10 w-full"
              >
                <div className="w-full grid grid-cols-1  sm:grid-cols-2  md:grid-cols-3 justify-between items-start gap-6">
                  {/* Products */}
                  <div className="flex flex-col justify-start items-end gap-1 w-full">
                    <div
                      className="shadow-card min-h-[140px] max-h-[140px] p-5 flex flex-col justify-center items-center gap-3 cursor-pointer w-full"
                      onClick={() => handleChangeTwo("modalType", PRODUCT)}
                    >
                      <AddIcon />
                      <span className="text-base">Select Products</span>

                      {!isEmpty(form.productIds) ? (
                        <div className="flex flex-wrap justify-start items-start gap-2 text-xs text-grey-text">
                          {form.productIds?.length}{" "}
                          {form.productIds?.length === 1
                            ? "product"
                            : "products"}{" "}
                          selected
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-start items-start gap-2 text-xs text-grey-text">
                          Leave this field blank to apply discount all products
                        </div>
                      )}
                    </div>
                    <div className="h-[13px]">
                      {errors?.productIds && (
                        <FormErrorMessage type={errors?.productIds} />
                      )}
                    </div>

                    {!isEmpty(form?.productIds) ? (
                      <div className="w-full flex flex-wrap gap-3 mb-3">
                        {form?.productIds?.map((item) => {
                          return (
                            <div
                              className="flex justify-center items-center bg-red-light2 px-2 py-1 gap-2 text-sm"
                              key={item?.id}
                            >
                              <span>{item?.name}</span>
                              <span
                                onClick={() =>
                                  handleRemoveItem("productIds", item?.id)
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

                  {/* Brands */}
                  <div className="flex flex-col justify-start items-end gap-1 w-full">
                    <div
                      className="shadow-card min-h-[140px] max-h-[140px] p-5 flex flex-col justify-center items-center gap-3 cursor-pointer w-full"
                      onClick={() => handleChangeTwo("modalType", BRAND)}
                    >
                      <AddIcon />
                      <span className="text-base">Select Brands</span>

                      {!isEmpty(form.brandIds) ? (
                        <div className="flex flex-wrap justify-start items-start gap-2 text-xs text-grey-text">
                          {form.brandIds?.length}{" "}
                          {form.brandIds?.length === 1 ? "brand" : "brands"}{" "}
                          selected
                        </div>
                      ) : null}
                    </div>
                    <div className="h-[13px]">
                      {errors?.brandIds && (
                        <FormErrorMessage type={errors?.brandIds} />
                      )}
                    </div>

                    {!isEmpty(form?.brandIds) ? (
                      <div className="w-full flex flex-wrap gap-3 mb-3">
                        {form?.brandIds?.map((item) => {
                          return (
                            <div
                              className="flex justify-center items-center bg-red-light2 px-2 py-1 gap-2 text-sm"
                              key={item?.id}
                            >
                              <span>{item?.brandName}</span>
                              <span
                                onClick={() =>
                                  handleRemoveItem("brandIds", item?.id)
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

                  {/* Categories */}
                  <div className="flex flex-col justify-start items-end gap-1 w-full">
                    <div
                      className="shadow-card min-h-[140px] max-h-[140px] p-5 flex flex-col justify-center items-center gap-3 cursor-pointer w-full"
                      onClick={() =>
                        handleChangeTwo("modalType", PRODUCT_CATEGORY_OPTIONS)
                      }
                    >
                      <AddIcon />
                      <span className="text-base">Select Categories</span>

                      {!isEmpty(form.categoryIds) ? (
                        <div className="flex flex-wrap justify-start items-start gap-2 text-xs text-grey-text">
                          {form.categoryIds?.length}{" "}
                          {form.categoryIds?.length === 1
                            ? "category"
                            : "categories"}{" "}
                          selected
                        </div>
                      ) : null}
                    </div>
                    <div className="h-[13px]">
                      {errors?.categoryIds && (
                        <FormErrorMessage type={errors?.categoryIds} />
                      )}
                    </div>

                    {!isEmpty(form?.categoryIds) ? (
                      <div className="w-full flex flex-wrap gap-3 mb-3">
                        {form?.categoryIds?.map((item) => {
                          return (
                            <div
                              className="flex justify-center items-center bg-red-light2 px-2 py-1 gap-2 text-sm"
                              key={item?.id}
                            >
                              <span>{item?.name}</span>
                              <span
                                onClick={() =>
                                  handleRemoveItem("categoryIds", item?.id)
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
                </div>

                <div className="flex flex-col md:flex-row justify-start items-start gap-10 w-full">
                  {/* First section */}
                  <div className="flex flex-col basis-1/2 justify-start items-start gap-y-3 h-full react-datepicker-custom">
                    <CheckBox
                      label="Enable Auto Apply"
                      square
                      tooltip="Apply this discount to all selected products, brands, or categories."
                      onChange={() =>
                        handleChange({
                          prop: "autoApply",
                          val: !form.autoApply,
                        })
                      }
                      checked={form.autoApply}
                      isDisabled={media_id}
                    />
                    <Input
                      label="Discount Name"
                      value={form?.name}
                      onChangeFunc={(val) =>
                        handleChange({ prop: "name", val })
                      }
                      placeholder="Enter Discount Name"
                      formError={errors.name}
                      showFormError={formTwo?.showFormError}
                    />
                    {form.autoApply ? null : (
                      <Select
                        label="Discount Order Source"
                        placeholder="Select discount order source"
                        options={ORDER_SOURCE_OPTIONS}
                        onChange={(val) =>
                          handleChange({ prop: "orderSource", val: val?.value })
                        }
                        value={form.orderSource}
                        formError={errors.orderSource}
                        showFormError={formTwo?.showFormError}
                        fullWidth
                      />
                    )}
                    <DatePickerComponent
                      label="Discount Expiry Time"
                      placeholder="Choose Discount Expiry Time"
                      name="discountExpiryTime"
                      showTimeSelect
                      isRequired
                      value={
                        moment(form?.discountExpiryTime).isValid()
                          ? moment(form?.discountExpiryTime)._d
                          : ""
                      }
                      minDate={
                        moment(form?.end_date).isValid()
                          ? moment(form?.end_date).subtract(0, "days")._d
                          : moment().subtract(1, "days")._d
                      }
                      dateFormat="dd MMMM yyyy hh:mm"
                      onChange={(value) =>
                        handleChange({
                          prop: "discountExpiryTime",
                          val: moment(value).format("YYYY-MM-DD hh:mm"),
                        })
                      }
                    />

                    <Button
                      onClick={() =>
                        setFormTwo({ ...formTwo, showFormError: true })
                      }
                      isLoading={formTwo.createLoading}
                      type="submit"
                      text={media_id ? "Save Changes" : "Add Discount"}
                      className="mt-14 mb-5"
                      fullWidth
                    />
                  </div>

                  {/* Second section */}
                  <div className="flex flex-col basis-1/2 justify-start items-start gap-y-3">
                    <div className="flex flex-col justify-start items-start gap-1">
                      <span className="text-grey-text text-sm">
                        Add discount details here
                      </span>
                    </div>

                    {form.autoApply ? null : (
                      <>
                        <Input
                          label="Discount Code"
                          value={form?.discountCode}
                          onChangeFunc={(val) =>
                            handleChange({ prop: "discountCode", val })
                          }
                          placeholder="Enter Discount Code"
                          formError={errors.discountCode}
                          showFormError={formTwo?.showFormError}
                          isRequired
                        />
                        <Input
                          label="Discount Limit (Leave empty if unlimited)"
                          value={form?.discountLimit}
                          onChangeFunc={(val) =>
                            handleChange({ prop: "discountLimit", val })
                          }
                          placeholder="Enter Discount Limit"
                          formError={errors.discountLimit}
                          showFormError={formTwo?.showFormError}
                          type="number"
                          suffix={
                            form?.discountLimit === "1" ? "time" : "times"
                          }
                        />
                        <Input
                          label="Minimum Order Value(Leave empty if unlimited)"
                          value={form?.discountAmountLimit}
                          onChangeFunc={(val) =>
                            handleChange({ prop: "discountAmountLimit", val })
                          }
                          placeholder="1,000"
                          formError={errors.discountAmountLimit}
                          showFormError={formTwo?.showFormError}
                          type="number"
                          prefix={NAIRA}
                        />
                      </>
                    )}
                    <Select
                      label="Discount Type"
                      placeholder="Select discount type"
                      options={DISCOUNT_TYPES_OPTION}
                      onChange={(val) =>
                        handleChange({ prop: "discountType", val: val?.value })
                      }
                      value={form.discountType}
                      formError={errors.discountType}
                      showFormError={formTwo?.showFormError}
                      isDisabled={!!media_id}
                      fullWidth
                    />

                    {form?.discountType?.includes("BUY") ? (
                      <Input
                        label="Number of product (X) to be bought"
                        value={form?.discountBuyXvalue}
                        onChangeFunc={(val) =>
                          handleChange({ prop: "discountBuyXvalue", val })
                        }
                        placeholder="2"
                        showFormError={formTwo?.showFormError}
                        isRequired
                        tooltip="Number of product (X) to be bought to qualify for this discount"
                        type="number"
                      />
                    ) : null}
                    {form.discountType === BUY_X_GET_X_FREE ? (
                      <Input
                        label="Number of product (X) to be given"
                        value={form?.discountGetXvalue}
                        onChangeFunc={(val) =>
                          handleChange({ prop: "discountGetXvalue", val })
                        }
                        placeholder="2"
                        showFormError={formTwo?.showFormError}
                        isRequired
                        tooltip="Number of product (X) to be given"
                        type="number"
                      />
                    ) : null}
                    {form.discountType === BUY_X_GET_Y_FREE ? (
                      <>
                        <div className="flex flex-col justify-start items-start gap-1">
                          <span className="text-grey-text text-sm">
                            Select product (Y) to be given
                          </span>
                        </div>
                        <div className="flex flex-col justify-start items-end gap-1 w-full">
                          {!isEmpty(form.discountGetYproductId) && (
                            <div className="flex flex-wrap justify-start items-start gap-2 ">
                              {getProductLoading ? (
                                <TailSpin
                                  height="20"
                                  width="20"
                                  color="#000000"
                                  ariaLabel="tail-spin-loading"
                                  radius="1"
                                  visible={true}
                                />
                              ) : (
                                product?.name
                              )}
                            </div>
                          )}
                          <Button
                            onClick={() =>
                              handleChangeTwo("modalType", BUY_X_GET_Y_FREE)
                            }
                            text="Select Product Y"
                            icon={<Plus className="text-black current-svg" />}
                            className=""
                            whiteBg
                            fullWidth
                          />
                        </div>

                        <Input
                          label="Number of product (Y) to be given"
                          value={form?.discountGetYvalue}
                          onChangeFunc={(val) =>
                            handleChange({ prop: "discountGetYvalue", val })
                          }
                          placeholder="2"
                          showFormError={formTwo?.showFormError}
                          isRequired
                          tooltip="Number of product (Y) to be given"
                          type="number"
                        />
                      </>
                    ) : null}
                    {form.discountType === FIXED ||
                    form.discountType === PERCENTAGE ? (
                      <Input
                        label="Discount"
                        value={form?.discountValue}
                        onChangeFunc={(val) =>
                          handleChange({ prop: "discountValue", val })
                        }
                        placeholder="Enter Discount"
                        formError={errors.discountValue}
                        showFormError={formTwo?.showFormError}
                        prefix={form.discountType === FIXED ? "₦" : ""}
                        suffix={form.discountType === PERCENTAGE ? "%" : ""}
                        tooltip="Discount"
                        type="number"
                        isDisabled={!form?.discountType}
                        isRequired
                      />
                    ) : null}

                    {form.discountType === FREE_SHIPPING ? (
                      <>
                        <Select
                          label="Select discount country"
                          placeholder="Search countries"
                          options={topshipCountries}
                          onChange={(val) => {
                            handleChange({
                              prop: "topshipCountryId",
                              val: val?.id,
                            });
                            handleChange({
                              prop: "countryCode",
                              val: val?.value,
                            });
                            handleChange({
                              prop: "topshipStateIds",
                              val: "",
                            });
                          }}
                          value={form.countryCode}
                          formError={errors.topshipCountryId}
                          showFormError={formTwo?.showFormError}
                          fullWidth
                        />
                        {form?.topshipCountryId ? (
                          <Select
                            label="Select discount state"
                            placeholder="Search states"
                            isMulti
                            options={topshipStates}
                            onChange={(val) => {
                              handleChange({
                                prop: "topshipStateIds",
                                val: val?.map((_) => _?.value),
                              });
                            }}
                            value={form.topshipStateIds}
                            formError={errors.topshipStateIds}
                            showFormError={formTwo?.showFormError}
                            isLoading={loadingTopshipStates}
                            fullWidth
                          />
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </form>

              <DiscountOverview details={{ ...discount }} />
            </div>
          </div>
        </div>
      </div>

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{
          modalTitle: "Discount",
          modalType: PRODUCT_CATEGORY_OPTIONS,
          isObjectOnChange: true,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
        type="Post"
      />

      <DetailsModal
        active={formTwo?.modalType === BRAND}
        details={{
          isMultipleBrands: true,
          isObjectOnChange: true,
          prop: "brandIds",
          modalType: BRAND,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT}
        details={{
          isMultipleProducts: true,
          isObjectOnChange: true,
          prop: "productIds",
          modalType: PRODUCT,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />

      <DetailsModal
        active={formTwo?.modalType === BUY_X_GET_Y_FREE}
        details={{
          isMultipleProducts: false,
          prop: "discountGetYproductId",
          modalType: BUY_X_GET_Y_FREE,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />

      <CategoryDetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY}
        details={{ modalType: "add", isAdd: true, isObjectOnChange: true }}
        toggler={() => handleChangeTwo("modalType", false)}
      />
    </>
  );
});

const AddHomePagePost = () => {
  const { media_id } = useParams();
  const {
    loadingDiscount,
    getDiscount,
    getDiscountProducts,
    getDiscountBrands,
    getDiscountCategories,
    loadingDiscountProducts,
    loadingDiscountBrands,
    loadingDiscountCategories,
  } = MarketingStore;

  useEffect(() => {
    if (media_id) {
      getDiscount({ data: { id: media_id } });
      getDiscountProducts({ data: { discountId: media_id, page: 1 } });
      getDiscountBrands({ data: { discountId: media_id, page: 1 } });
      getDiscountCategories({ data: { discountId: media_id, page: 1 } });
    }
  }, [media_id]);
  return loadingDiscount ||
    loadingDiscountProducts ||
    loadingDiscountBrands ||
    loadingDiscountCategories ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePagePost);
