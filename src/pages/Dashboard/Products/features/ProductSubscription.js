import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { Link, useParams } from "react-router-dom";
import { subscriptionDurationOptions } from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";
import cleanPayload from "utils/cleanPayload";
import { isEmpty, lowerCase } from "lodash";
import ProductsStore from "../store";
import { observer } from "mobx-react-lite";
import { errorToast } from "components/General/Toast/Toast";
const ProductSubscription = ({ details, toggler, handleOnChange, formObj }) => {
  const { productSubscriptions } = formObj;
  const { currentProductSubscription } = details;
  const { product_id } = useParams();
  const isEdit = !isEmpty(currentProductSubscription);

  const { editProductSubscription, editProductSubscriptionLoading } =
    ProductsStore;

  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    visibility: "",
    collapsed: [],
    showProductOption: false,
  });

  const schema = yup.object({
    name: yup.string().required("Please enter subscription name"),
    subscriptionDuration: yup
      .string()
      .required("Please select subscription duration"),
    subscriptionFrequency: yup
      .string()
      .required("Please enter subscription frequency"),
  });

  const defaultValues = {
    name: currentProductSubscription?.name || "",
    active: currentProductSubscription?.name
      ? currentProductSubscription?.active
      : true,
    discountType: currentProductSubscription?.discountType || "",
    discountValue: currentProductSubscription?.discountValue || "",
    subscriptionDuration:
      currentProductSubscription?.subscriptionDuration || "",
    subscriptionFrequency:
      currentProductSubscription?.subscriptionFrequency || "",
    tagline: currentProductSubscription?.tagline || "",
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
    const updatedVal = rest ? [...rest, ...val] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    name: watch("name"),
    active: watch("active"),
    tagline: watch("tagline"),
    discountType: watch("discountType"),
    discountValue: watch("discountValue"),
    subscriptionDuration: watch("subscriptionDuration"),
    subscriptionFrequency: watch("subscriptionFrequency"),
  };

  const handleOnSubmit = () => {
    if (isEdit) {
      const payload = {
        ...form,
        productSubscriptionId: currentProductSubscription?.id,
      };
      cleanPayload(payload);
      editProductSubscription({
        product_id,
        data: payload,
        onSuccess: () => toggler?.(),
      });
      return;
    }
    const prevOption = productSubscriptions?.find(
      (item) => lowerCase(item?.name) === lowerCase(form.name)
    );
    if (prevOption?.name) {
      errorToast(
        "Error!",
        "You've already added a product subscription with this name"
      );
      return;
    }
    const payload = cleanPayload(form);
    handleOnChange({
      prop: "productSubscriptions",
      val: [...productSubscriptions, payload],
    });
    toggler?.();
  };

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

        <p className="font-600 text-xl ">
          {isEdit
            ? "Edit Product Subscription"
            : "Add a Subscription To This Product"}
        </p>

        <p className="mb-3 text-sm text-grey text-left">
          Easily offer this product on a recurring basis with subscriptions
        </p>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-3 w-full overflow-y-auto"
        >
          <span className="text-grey-text text-sm uppercase">
            Subscription info
          </span>
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-3 md:gap-6">
            <Input
              label="Name"
              value={form?.name}
              onChangeFunc={(val) => handleChange("name", val)}
              placeholder="Product of the month"
              formError={errors.name}
              showFormError={formTwo?.showFormError}
              isRequired
            />
            <Input
              label="Tagline (optional)"
              value={form?.tagline}
              onChangeFunc={(val) => handleChange("tagline", val)}
              placeholder="Subscribe and save 50%"
              formError={errors.tagline}
              showFormError={formTwo?.showFormError}
            />
          </div>
          <CheckBox
            label="Enable Subscription"
            square
            tooltip="Let customers see this subscription"
            onChange={() => handleChange("active", !form.active)}
            checked={form.active}
          />
          <hr className="w-full" />
          <span className="text-grey-text text-sm uppercase">
            Subscription details
          </span>
          <div className="flex flex-col md:flex-row justify-center items-end w-full gap-3 md:gap-6">
            <Input
              label="Repeats every"
              value={form?.subscriptionFrequency}
              onChangeFunc={(val) => handleChange("subscriptionFrequency", val)}
              placeholder="1"
              formError={errors.subscriptionFrequency}
              showFormError={formTwo?.showFormError}
              type="number"
              tooltip="Subscription frequency"
              isRequired
            />

            <Select
              placeholder="Select"
              options={subscriptionDurationOptions}
              onChange={(val) =>
                handleChange("subscriptionDuration", val?.value)
              }
              value={subscriptionDurationOptions.find(
                (item) => item.value === form.subscriptionDuration
              )}
              formError={errors.subscriptionDuration}
              showFormError={formTwo?.showFormError}
              isRequired
              fullWidth
            />
          </div>

          <hr className="w-full mb-2" />
          <span className="text-grey-text text-sm uppercase">
            Subscription discount
          </span>
          <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
            <Input
              label="Discount"
              value={form?.discountValue}
              onChangeFunc={(val) => handleChange("discountValue", val)}
              placeholder="Enter Discount"
              formError={errors.discountValue}
              showFormError={formTwo?.showFormError}
              prefix={form.discountType === "FIXED" ? "₦" : ""}
              suffix={form.discountType === "PERCENTAGE" ? "%" : ""}
              tooltip="Discount"
              type="number"
            />
            <div className="flex justify-center items-center w-full gap-6">
              <CheckBox
                label="₦"
                onChange={() => handleChange("discountType", "FIXED")}
                checked={form.discountType === "FIXED"}
              />

              <CheckBox
                label="%"
                onChange={() => handleChange("discountType", "PERCENTAGE")}
                checked={form.discountType === "PERCENTAGE"}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
            <Button
              onClick={() => toggler?.()}
              text="Cancel"
              fullWidth
              whiteBg
            />

            <Button
              onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
              isLoading={editProductSubscriptionLoading}
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
ProductSubscription.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleOnChange: PropTypes.func,
  formObj: PropTypes.object,
};

export default observer(ProductSubscription);
