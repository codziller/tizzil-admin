import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { TailSpin } from "react-loader-spinner";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { Link, useParams } from "react-router-dom";
import {
  AFFILIATE_MARKETER_ORDER_TYPES,
  PRODUCT_MODAL_TYPES,
} from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";
import { observer } from "mobx-react-lite";
import AffiliateMarketersStore from "../store";
import cleanPayload from "utils/cleanPayload";
import { isEmpty } from "lodash";
import DatePickerComponent from "components/General/DatePicker";
import moment from "moment";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import UsersStore from "pages/Dashboard/Users/store";
const { PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const { ALL, FIRST } = AFFILIATE_MARKETER_ORDER_TYPES;
const Form = ({ details, toggler }) => {
  const { affiliateMarketer_id, warehouse_id } = useParams();

  const {
    createAffiliateMarketer,
    affiliateMarketer,
    createAffiliateMarketerLoading,
    editAffiliateMarketer,
    editAffiliateMarketerLoading,
  } = AffiliateMarketersStore;
  const { getUser, user, getUserLoading } = UsersStore;
  const navigate = useNavigate();

  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    formModified: false,
    modalType: "",
    createLoading: false,
    noExpiry: false,
  });

  const schema = yup.object({
    userProfitValue: yup.string().required("Please enter profit value"),
    userProfitType: yup.string().required("Please select profit type"),
    userId: yup.string().required("Please select a user"),
    discountCode: yup.string().required("Please enter discount code"),
    discountValue: yup.string().required("Please enter discount value"),
    discountType: yup.string().required("Please select discount type"),
  });

  const defaultValues = {
    userId: affiliateMarketer_id ? affiliateMarketer?.userId : "",
    userProfitValue: affiliateMarketer_id
      ? affiliateMarketer?.userProfitValue
      : "",
    userProfitType: affiliateMarketer_id
      ? affiliateMarketer?.userProfitType
      : "",
    discountCode: affiliateMarketer_id ? affiliateMarketer?.discountCode : "",
    discountValue: affiliateMarketer_id ? affiliateMarketer?.discountValue : "",
    discountType: affiliateMarketer_id ? affiliateMarketer?.discountType : "",
    discountLimit: affiliateMarketer_id ? affiliateMarketer?.discountLimit : "",
    discountExpiryTime: affiliateMarketer_id
      ? affiliateMarketer?.discountExpiryTime
      : "",
    typeOfOrder: affiliateMarketer_id ? affiliateMarketer?.typeOfOrder : FIRST,
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

  const form = {
    userId: watch("userId"),
    userProfitValue: watch("userProfitValue"),
    userProfitType: watch("userProfitType"),
    discountCode: watch("discountCode"),
    discountValue: watch("discountValue"),
    discountType: watch("discountType"),
    discountLimit: watch("discountLimit"),
    discountExpiryTime: watch("discountExpiryTime"),
    typeOfOrder: watch("typeOfOrder"),
  };

  useEffect(() => {
    form?.userId && getUser({ data: { id: form?.userId } });
  }, [form.userId]);

  const handleChange = async (prop, val, rest, isFormTwo) => {
    if (
      (prop === "discountValue" &&
        form.discountType === "PERCENTAGE" &&
        parseFloat(val) > 100) ||
      (prop === "userProfitValue" &&
        form.userProfitType === "PERCENTAGE" &&
        parseFloat(val) > 100)
    ) {
      return;
    }

    isFormTwo
      ? setFormTwo({ ...formTwo, [prop]: val, formModified: true })
      : setFormTwo({ ...formTwo, formModified: true });
    const updatedVal = rest ? [...rest, ...val] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  useEffect(() => {
    if (
      form.discountType === "PERCENTAGE" &&
      parseFloat(form.discountValue) > 100
    ) {
      handleChange("discountValue", "");
    } else if (
      form.userProfitType === "PERCENTAGE" &&
      parseFloat(form.userProfitValue) > 100
    ) {
      handleChange("userProfitValue", "");
    }
  }, [
    form.discountType,
    form.discountValue,
    form.userProfitType,
    form.userProfitValue,
  ]);

  const handleOnSubmit = () => {
    let payload = {
      ...form,
      id: affiliateMarketer_id,
    };

    cleanPayload(payload);
    payload = {
      ...payload,
      discountExpiryTime: formTwo?.noExpiry
        ? null
        : new Date(moment(form?.discountExpiryTime)._d),
    };
    cleanPayload(payload);
    if (affiliateMarketer_id) {
      editAffiliateMarketer({
        data: payload,
        onSuccess: () =>
          navigate(`/dashboard/affiliate-marketers/${warehouse_id}`),
      });
      return;
    }
    createAffiliateMarketer({
      data: payload,
      onSuccess: () =>
        navigate(`/dashboard/affiliate-marketers/${warehouse_id}`),
    });
  };

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 ">
        {details?.link ? (
          <div className="mb-5">
            <Link
              to={`/dashboard/affiliate-marketers/${warehouse_id}`}
              className="scale-90"
            >
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}

        {!affiliateMarketer_id ? (
          <h2 className="section-heading my-8 text-xl">
            Add Affiliate Marketer
          </h2>
        ) : (
          <h2 className="section-heading my-8 text-xl  ">
            Edit Affiliate Marketer
          </h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col md:flex-row justify-start items-start gap-10 w-full "
        >
          {/* First section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Select user
              </span>
              <span className="text-grey-text text-sm">
                Select a user to be added to affiliate marketers
              </span>
            </div>
            <div className="flex flex-col justify-start items-end gap-1 w-full">
              {!isEmpty(form?.userId) && (
                <p>
                  {getUserLoading ? (
                    <TailSpin
                      height="25"
                      width="25"
                      color="#000000"
                      ariaLabel="tail-spin-loading"
                      radius="3"
                      visible={true}
                    />
                  ) : (
                    `${user?.firstName} ${user?.lastName}`
                  )}
                </p>
              )}
              <Button
                onClick={() =>
                  handleChangeTwo("modalType", PRODUCT_CATEGORY_OPTIONS)
                }
                text="Select User"
                icon={<Plus className="text-black current-svg" />}
                className=""
                whiteBg
                fullWidth
              />

              <div className="h-[13px]">
                {errors?.userId && <FormErrorMessage type={errors?.userId} />}
              </div>
            </div>

            <hr className="w-full" />
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">Profit</span>
              <span className="text-grey-text text-sm">
                Configure the profit model to be applied for this affiliate
                marketer
              </span>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
              <Input
                label="Profit Value"
                value={form?.userProfitValue}
                onChangeFunc={(val) => handleChange("userProfitValue", val)}
                placeholder="Enter Profit Value"
                formError={errors.userProfitValue}
                showFormError={formTwo?.showFormError}
                prefix={form.userProfitType === "FIXED" ? "₦" : ""}
                suffix={form.userProfitType === "PERCENTAGE" ? "%" : ""}
                tooltip="Profit Value"
                type="number"
                isDisabled={!form?.userProfitType}
                isRequired
              />
              <div className="flex justify-center items-center w-full gap-6">
                <CheckBox
                  label="₦"
                  onChange={() =>
                    handleChange(
                      "userProfitType",
                      form.userProfitType !== "FIXED" ? "FIXED" : ""
                    )
                  }
                  checked={form.userProfitType === "FIXED"}
                />

                <CheckBox
                  label="%"
                  onChange={() =>
                    handleChange(
                      "userProfitType",
                      form.userProfitType !== "PERCENTAGE" ? "PERCENTAGE" : ""
                    )
                  }
                  checked={form.userProfitType === "PERCENTAGE"}
                />
              </div>
            </div>
          </div>
          {/* Second section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 ">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">Discount</span>
              <span className="text-grey-text text-sm">
                Add discount for this affiliate marketer
              </span>
            </div>
            <Input
              label="Discount Code"
              value={form?.discountCode}
              onChangeFunc={(val) => handleChange("discountCode", val)}
              placeholder="Enter Discount Code"
              formError={errors.discountCode}
              showFormError={formTwo?.showFormError}
              isRequired
            />
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
                isDisabled={!form?.discountType}
                isRequired
              />
              <div className="flex justify-center items-center w-full gap-6">
                <CheckBox
                  label="₦"
                  onChange={() =>
                    handleChange(
                      "discountType",
                      form.discountType !== "FIXED" ? "FIXED" : ""
                    )
                  }
                  checked={form.discountType === "FIXED"}
                />

                <CheckBox
                  label="%"
                  onChange={() =>
                    handleChange(
                      "discountType",
                      form.discountType !== "PERCENTAGE" ? "PERCENTAGE" : ""
                    )
                  }
                  checked={form.discountType === "PERCENTAGE"}
                />
              </div>
            </div>
            <Input
              label="Discount Limit"
              value={form?.discountLimit}
              onChangeFunc={(val) => handleChange("discountLimit", val)}
              placeholder="5 times"
              formError={errors.discountLimit}
              showFormError={formTwo?.showFormError}
              tooltip="how many times this discount can be used"
              suffix={" times"}
              type="number"
            />

            {!formTwo.noExpiry && (
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
                onChange={(value) => {
                  console.log(value);
                  return handleChange(
                    "discountExpiryTime",
                    moment(value).format("YYYY-MM-DD hh:mm")
                  );
                }}
              />
            )}

            <CheckBox
              label="No Expiry Time"
              onChange={() => handleChangeTwo("noExpiry", !formTwo.noExpiry)}
              checked={formTwo.noExpiry}
              square
            />
          </div>
          {/* Third section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Order Discount Type
              </span>
              <span className="text-grey-text text-sm">
                Choose whether to apply the discount to either first order or to
                all orders.
              </span>
            </div>

            <CheckBox
              label="First Order Only"
              onChange={() => handleChange("typeOfOrder", FIRST)}
              checked={form.typeOfOrder === FIRST}
            />

            <CheckBox
              label="All Orders"
              onChange={() => handleChange("typeOfOrder", ALL)}
              checked={form.typeOfOrder === ALL}
            />

            <Button
              onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
              type="submit"
              text={
                !affiliateMarketer_id
                  ? "Add Affiliate Marketer"
                  : "Save Changes"
              }
              isLoading={
                createAffiliateMarketerLoading || editAffiliateMarketerLoading
              }
              className="mt-10 mb-5 "
              fullWidth
            />
          </div>
        </form>
      </div>

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{ modalType: PRODUCT_CATEGORY_OPTIONS }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
    </>
  );
};

Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(Form);
