import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import SettingsStore from "pages/Dashboard/Settings/store";
import { Link, useParams } from "react-router-dom";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import ImagePicker from "components/General/Input/ImagePicker";
import cleanPayload from "utils/cleanPayload";
import { flatMap, isEmpty, lowerCase, upperCase } from "lodash";
import { uploadImagesToCloud } from "utils/uploadImagesToCloud";
import { observer } from "mobx-react-lite";
import CheckBox from "components/General/Input/CheckBox";

const ProductVariant = ({
  details,
  toggler,
  handleOnChange,
  formObj,
  formObjTwo,
}) => {
  const { exchangeRate } = SettingsStore;
  const { productVariants, productOptions, salePrice, costPrice } = formObj;

  const {} = formObjTwo;
  const { currentProductVariant, currentProductOption } = details;
  const isInventory = details?.isInventory;
  const { product_id } = useParams();
  const isEdit = !isEmpty(currentProductVariant);
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    editLoading: false,
  });

  const inventorySchema = {
    quantity: yup.string().required("Please enter variant name"),
    lowInQuantityValue: yup
      .string()
      .required("Please enter variant low in stock value"),
    costPrice: yup.string().required("Please enter variant cost price"),
  };
  const schema = yup.object({
    variantName: yup.string().required("Please enter variant name"),
    ...(isInventory ? inventorySchema : {}),
  });

  const defaultValues = {
    variantName: currentProductVariant?.variantName || "",
    variantCostPrice: currentProductVariant?.variantCostPrice || "",
    variantSalePrice: currentProductVariant?.variantSalePrice || "",
    imageUrls: currentProductVariant?.imageUrls || [],
    videoUrls: currentProductVariant?.videoUrls || [],
    visibility: currentProductVariant.visibility === false ? false : true,
    description: currentProductVariant?.description || "",
    main: !!currentProductVariant?.main,
    quantity: currentProductVariant?.quantity || "",
    lowInQuantityValue: currentProductVariant?.lowInQuantityValue || "",
    costPrice: currentProductVariant?.costPrice || "",
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
  const handleChange = async (prop, val, rest, isFormTwo) => {
    isFormTwo && setFormTwo({ ...formTwo, [prop]: val });
    const updatedVal = rest ? [...val, ...rest] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    variantName: watch("variantName"),
    variantCostPrice: watch("variantCostPrice"),
    variantSalePrice: watch("variantSalePrice"),
    imageUrls: watch("imageUrls"),
    videoUrls: watch("videoUrls"),
    visibility: watch("visibility"),
    description: watch("description"),
    main: watch("main"),
    quantity: watch("quantity"),
    lowInQuantityValue: watch("lowInQuantityValue"),
    costPrice: watch("costPrice"),
  };

  const currencyItem = exchangeRate?.find(
    (itm) => itm.currency === formObjTwo.currency?.value
  );
  const ngnEquivalentCostPrice =
    parseFloat(currencyItem?.value) * parseFloat(form?.variantCostPrice);
  const ngnEquivalentSalePrice =
    parseFloat(currencyItem?.value) * parseFloat(form?.variantSalePrice);

  const profitMargin =
    product_id && ngnEquivalentSalePrice && ngnEquivalentCostPrice
      ? ngnEquivalentSalePrice - form?.variantCostPrice
      : ngnEquivalentCostPrice && ngnEquivalentSalePrice
      ? ngnEquivalentSalePrice - ngnEquivalentCostPrice
      : form?.variantCostPrice && form?.variantSalePrice
      ? form?.variantSalePrice - form?.variantCostPrice
      : "";

  useEffect(() => {
    if (form.main) {
      handleChange("variantCostPrice", costPrice || "");
      handleChange("variantSalePrice", salePrice || "");
    } else {
      handleChange(
        "variantCostPrice",
        currentProductVariant?.variantCostPrice || ""
      );
      handleChange(
        "variantSalePrice",
        currentProductVariant?.variantSalePrice || ""
      );
    }
  }, [form.main]);

  const handleOnSubmit = async (e) => {
    if (isEdit) {
      try {
        handleChangeTwo("editLoading", true);
        let imagesUrls = [];
        if (form.imageUrls || form.videoUrls) {
          imagesUrls = await Promise.all([
            uploadImagesToCloud(form?.imageUrls),
            uploadImagesToCloud(form?.videoUrls),
          ]);
        }
        const payload = {
          ...form,
          productVariantId: currentProductVariant?.id,
          imageUrls: imagesUrls?.[0],
          videoUrls: imagesUrls?.[1],
        };
        cleanPayload(payload);

        const newChoices = currentProductOption?.choices?.map((item) =>
          cleanPayload(
            item?.variantName === payload.variantName ? payload : item
          )
        );
        const newProductOptions = productOptions?.map((item) => {
          if (item?.name === currentProductOption?.name) {
            return cleanPayload({
              ...currentProductOption,
              choices: newChoices,
              productOptionId: currentProductOption?.id,
            });
          } else {
            return item;
          }
        });

        handleOnChange({
          prop: "productOptions",
          val: newProductOptions,
        });
        toggler?.();
      } catch (error) {
      } finally {
        handleChangeTwo("editLoading", false);
      }
      return;
    }
  };

  const removeFile = (file, prop, files) => {
    let updatedFiles = [...files];
    updatedFiles = updatedFiles.filter(
      (_) => (_?.name || _) !== (file?.name || file)
    );
    handleChange(prop, updatedFiles);
  };
  const mainChoice = useMemo(() => {
    const flattenedProductChoices = flatMap(
      productOptions,
      (item) => item.choices
    );
    return flattenedProductChoices?.find((item) => item?.main);
  }, [productOptions]);

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

        <p className="font-600 text-xl">
          {isEdit
            ? `Edit Product Variant ${isInventory ? "Inventory " : ""} (${
                currentProductVariant?.variantName
              })`
            : "Add Product Variant"}
        </p>

        <p className="mb-3 text-sm text-grey text-left">
          You'll be able to manage pricing and inventory for this variant later
          on
        </p>

        <p className="mb-3 text-sm text-grey-text text-left">
          Quantity Left:{" "}
          {currentProductVariant?.variantQuantity
            ? numberWithCommas(currentProductVariant?.variantQuantity)
            : "0"}
        </p>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-3 w-full overflow-y-auto"
        >
          {form?.main ? (
            <span className="bg-grey-20 text-black px-2 py-0.5 text-xs rounded">
              main
            </span>
          ) : null}

          {isInventory ? null : (
            <>
              <CheckBox
                label="Set this variant as main"
                square
                tooltip="Make this variant represent the default product."
                onChange={() => handleChange("main", !form.main)}
                checked={form.main}
                isDisabled={!form?.main && mainChoice}
              />

              <Input
                label="Variant Name"
                value={form?.variantName}
                onChangeFunc={(val) => handleChange("variantName", val)}
                placeholder="Enter Variant Name"
                formError={errors.variantName}
                showFormError={formTwo?.showFormError}
                isRequired
                isDisabled={!currentProductVariant?.id}
              />

              <div className="flex flex-col md:flex-row justify-center items-start w-full gap-3 md:gap-6">
                {product_id ? (
                  <Input
                    label={`Variant Cost Price (NGN)`}
                    value={form?.variantCostPrice}
                    onChangeFunc={(val) =>
                      handleChange("variantCostPrice", val)
                    }
                    placeholder="Enter Cost Price"
                    formError={errors.variantCostPrice}
                    showFormError={formTwo?.showFormError}
                    prefix="NGN"
                    type="number"
                    isRequired
                    isDisabled={!!product_id}
                  />
                ) : (
                  <Input
                    label={`Variant Cost Price (${upperCase(
                      formObjTwo?.currency?.value
                    )})`}
                    value={form?.variantCostPrice}
                    onChangeFunc={(val) =>
                      handleChange("variantCostPrice", val)
                    }
                    placeholder="Enter Variant Cost Price"
                    formError={errors.variantCostPrice}
                    showFormError={formTwo?.showFormError}
                    prefix={upperCase(formObjTwo?.currency?.value)}
                    type="number"
                    isDisabled={form.main || !!product_id}
                    labelControlTwo={
                      ngnEquivalentCostPrice ? (
                        <div className="flex gap-2 text-base">
                          NGN
                          {numberWithCommas(ngnEquivalentCostPrice)}
                        </div>
                      ) : null
                    }
                  />
                )}

                <Input
                  label={`Variant Sale Price (${upperCase(
                    formObjTwo?.currency?.value
                  )})`}
                  labelControl={
                    profitMargin && (
                      <span
                        className={classNames("text-sm", {
                          "text-red": profitMargin < 0,
                          "text-green": profitMargin > 0,
                          "text-grey-text": profitMargin === 0,
                        })}
                      >{`${
                        profitMargin < 0 ? "Loss" : "Profit"
                      }: ₦${numberWithCommas(profitMargin)}`}</span>
                    )
                  }
                  value={form?.variantSalePrice}
                  onChangeFunc={(val) => handleChange("variantSalePrice", val)}
                  placeholder="Enter Variant Sale Price"
                  formError={errors.variantSalePrice}
                  showFormError={formTwo?.showFormError}
                  prefix={upperCase(formObjTwo?.currency?.value)}
                  tooltip="Selling price of this variant"
                  type="number"
                  isDisabled={form.main}
                  labelControlTwo={
                    ngnEquivalentSalePrice ? (
                      <div className="flex gap-2 text-base">
                        NGN
                        {numberWithCommas(ngnEquivalentSalePrice)}
                      </div>
                    ) : null
                  }
                />
              </div>
            </>
          )}

          {isInventory ? (
            <>
              <Input
                label="Variant Quantity"
                value={form?.quantity}
                onChangeFunc={(val) => handleChange("quantity", val)}
                placeholder="Enter Variant Quantity"
                formError={errors.quantity}
                showFormError={formTwo?.showFormError}
                type="number"
              />
              <Input
                label="Variant Low In Stock Value"
                value={form?.lowInQuantityValue}
                onChangeFunc={(val) => handleChange("lowInQuantityValue", val)}
                placeholder="Enter Variant Low In Stock Value"
                formError={errors.lowInQuantityValue}
                showFormError={formTwo?.showFormError}
                type="number"
              />
              <Input
                label="Cost Price (₦‎)"
                value={form?.costPrice}
                onChangeFunc={(val) => handleChange("costPrice", val)}
                placeholder="Enter Cost Price"
                formError={errors.costPrice}
                showFormError={formTwo?.showFormError}
                prefix={"₦‎"}
                type="number"
              />
            </>
          ) : null}
          {!form.main && !isInventory && (
            <>
              <div className="w-full">
                <div
                  className={classNames(
                    "flex justify-start items-center gap-2 cursor-pointer w-fit",
                    {
                      "text-green-light": form.visibility,
                      "text-grey-fade": !form.visibility,
                    }
                  )}
                  onClick={() => handleChange("visibility", !form.visibility)}
                >
                  <label
                    className={
                      "general-input-label mb-1 relative text-[13px] font-bold !flex justify-start items-center gap-1.5 cursor-pointer"
                    }
                  >
                    Visibility {form.visibility ? "On" : "Off"}
                  </label>
                  <span className="-mt-1">
                    {form.visibility ? (
                      <AiOutlineEye size={20} className="current-svg" />
                    ) : (
                      <AiOutlineEyeInvisible
                        size={20}
                        className="current-svg"
                      />
                    )}
                  </span>
                </div>
              </div>
              <ImagePicker
                label=" Add Variant Image"
                showFormError={formTwo?.showFormError && errors.imageUrls}
                handleDrop={(val) =>
                  handleChange("imageUrls", val, form.imageUrls)
                }
                images={form.imageUrls}
                removeImage={(file) =>
                  removeFile(file, "imageUrls", form.imageUrls)
                }
                multiple
              />
              {/* <ImagePicker
                label=" Add Variant Videos"
                showFormError={formTwo?.showFormError && errors.videoUrls}
                handleDrop={(val) =>
                  handleChange("videoUrls", val, form.videoUrls)
                }
                images={form.videoUrls}
                removeImage={(file) =>
                  removeFile(file, "videoUrls", form.videoUrls)
                }
                placeholder="Drag 'n' drop some videos here, or click to select videos"
                type="video"
                multiple
              /> */}
            </>
          )}

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
              isLoading={formTwo.editLoading}
              type="submit"
              text={isEdit ? "Save Changes" : "Add"}
              className="mb-2"
              fullWidth
            />
          </div>
        </form>
      </div>
    </>
  );
};
ProductVariant.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default observer(ProductVariant);
