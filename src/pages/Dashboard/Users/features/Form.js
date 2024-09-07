import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { TailSpin } from "react-loader-spinner";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { Link, useParams } from "react-router-dom";
import {
  GENDERS,
  MEDIA_MODAL_TYPES,
  NAIRA,
  ROLES,
  WALLET_ACTIONS,
} from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";
import { observer } from "mobx-react-lite";
import cleanPayload from "utils/cleanPayload";
import { isEmpty } from "lodash";
import DatePickerComponent from "components/General/DatePicker";
import moment from "moment";
import UsersStore from "../store";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import OrdersStore from "pages/Dashboard/Orders/store";
import { numberWithCommas } from "utils/formatter";
import Select from "components/General/Input/Select";
import PhoneNumber from "components/General/PhoneNumber/PhoneNumber";
import usePasswordValidation from "hooks/usePasswordValidation";
import UserOrders from "./UserOrders";

const { BRAND } = MEDIA_MODAL_TYPES;
const { Credit, Debit } = WALLET_ACTIONS;
const Form = ({ details, toggler }) => {
  const { user_id, warehouse_id } = useParams();

  const {
    editUserWallet,
    user,
    editUserWalletLoading,
    editUser,
    editUserLoading,
    createUser,
    createUserLoading,
  } = UsersStore;
  const { getWarehouses } = WareHousesStore;
  const { getBrand, brand, getBrandLoading } = BrandsStore;
  const { userOrdersCount } = OrdersStore;
  useEffect(() => {
    getWarehouses({ data: { page: 1 } });
  }, []);
  const navigate = useNavigate();

  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    formModified: false,
    modalType: "",
    createLoading: false,
  });

  const addSchema = {
    dob: yup.string().required("Please select date of birth"),
    email: yup.string().required("Please enter email"),
    password: yup.string().required("Please enter password"),
    phoneNumber: yup.string().required("Please enter phone number"),
  };

  const schema = yup.object({
    ...(user_id ? { ...addSchema } : {}),
    firstName: yup.string().required("Please enter first name"),
    gender: yup.string().required("Please select gender"),
    lastName: yup.string().required("Please enter last name"),
  });

  const defaultValues = {
    dob: user_id ? user?.dob : "",
    email: user_id ? user?.email : "",
    firstName: user_id ? user?.firstName : "",
    gender: user_id ? user?.gender : "",
    lastName: user_id ? user?.lastName : "",
    password: "P@55word",
    phoneNumber: user_id ? user?.phoneNumber?.replace("0", "+234") : "",
    role: user_id ? user?.role : "",
    warehouseId: user_id ? user?.warehouseId : "",
    brandId: user_id ? user?.brandId : "",
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
    dob: watch("dob"),
    email: watch("email"),
    firstName: watch("firstName"),
    gender: watch("gender"),
    lastName: watch("lastName"),
    password: watch("password"),
    phoneNumber: watch("phoneNumber"),
    role: watch("role"),
    warehouseId: watch("warehouseId"),
    brandId: watch("brandId"),
    transactionType: watch("transactionType"),
    amount: watch("amount"),
  };

  useEffect(() => {
    if (!form.brandId) {
      return;
    }
    getBrand({ data: { id: form?.brandId } });
  }, [form.brandId]);
  const { PasswordCheckComp } = usePasswordValidation({
    value: form?.password,
  });

  const handleChange = async ({ prop, val, rest, isFormTwo }) => {
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

  const handleOnSubmit = () => {
    let payload = {
      ...form,
      amount: "",
      transactionType: "",
      userId: user_id,
      phoneNumber: user_id ? "" : form.phoneNumber?.replace("+234", "0"),
      dob: user_id ? "" : form.dob,
      email: user_id ? "" : form.email,
      password: user_id ? "" : form.password,
      warehouseId: form?.role?.includes("BRAND")
        ? ""
        : form?.warehouseId || warehouse_id,
    };

    cleanPayload(payload);
    if (user_id) {
      editUser({
        data: payload,
        onSuccess: () => navigate(-1),
      });
      return;
    }
    createUser({
      data: payload,
      onSuccess: () => navigate(-1),
    });
  };

  const handleOnWalletSubmit = () => {
    let payload = {
      amount: parseFloat(form.amount),
      transactionType: form.transactionType,
      userId: user_id,
    };

    if (user_id) {
      editUserWallet({
        data: payload,
        onSuccess: () => navigate(-1),
      });
      return;
    }
  };

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 ">
        {details?.link ? (
          <div className="mb-5">
            <button onClick={() => navigate(-1)} className="scale-90">
              <ArrowBack />
            </button>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}

        {!user_id ? (
          <h2 className="section-heading my-8 text-xl">Add User</h2>
        ) : (
          <h2 className="section-heading my-8 text-xl  ">Edit User</h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col md:flex-row justify-start items-start gap-10 w-full "
        >
          {/* First section */}

          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
            {user_id && (
              <>
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-grey-text text-lg uppercase">
                    Update Wallet
                  </span>
                  <span className="text-grey-text text-sm">
                    Select the transaction type to be performed on this
                    user&apos;s wallet <br />
                    Wallet Balance -{" "}
                    <span className="text-black">
                      {NAIRA}
                      {numberWithCommas(user?.balance)}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
                  <div className="flex justify-start items-center w-full gap-6">
                    <CheckBox
                      label={Credit}
                      onChange={() =>
                        handleChange({ prop: "transactionType", val: Credit })
                      }
                      checked={form.transactionType === Credit}
                    />

                    <CheckBox
                      label={Debit}
                      onChange={() =>
                        handleChange({ prop: "transactionType", val: Debit })
                      }
                      checked={form.transactionType === Debit}
                    />
                  </div>
                </div>

                {form?.transactionType && (
                  <Input
                    label="Amount"
                    value={form?.amount}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "amount", val })
                    }
                    placeholder="Enter Amount"
                    formError={errors.amount}
                    showFormError={formTwo?.showFormError}
                    prefix={NAIRA}
                    tooltip={`Amount to be ${
                      form.transactionType === Debit ? "debited" : "credited"
                    }`}
                    type="number"
                    isRequired
                  />
                )}
                <Button
                  text={"Update Wallet"}
                  isLoading={editUserWalletLoading}
                  isDisabled={!parseFloat(form.amount) || !form.transactionType}
                  onClick={handleOnWalletSubmit}
                  className="mt-10 mb-5 "
                  fullWidth
                />
              </>
            )}

            {!user_id && (
              <>
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-grey-text text-lg uppercase">
                    User info
                  </span>
                  <span className="text-grey-text text-sm">
                    Fill in user details
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[7px] md:gap-5 justify-between items-start w-full">
                  <Input
                    label="First name"
                    value={form?.firstName}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "firstName", val })
                    }
                    placeholder="Enter first name"
                    formError={errors.firstName}
                    showFormError={formTwo?.showFormError}
                  />

                  <Input
                    label="Last name"
                    value={form?.lastName}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "lastName", val })
                    }
                    placeholder="Enter last name"
                    formError={errors.lastName}
                    showFormError={formTwo?.showFormError}
                  />
                </div>

                <Select
                  label="Gender"
                  placeholder="Select your gender"
                  options={GENDERS}
                  onChange={(val) =>
                    handleChange({ prop: "gender", val: val?.value })
                  }
                  value={form.gender}
                  formError={errors.gender}
                  showFormError={formTwo?.showFormError}
                  fullWidth
                />
                <Input
                  label="Email address"
                  value={form?.email}
                  onChangeFunc={(val) => handleChange({ prop: "email", val })}
                  placeholder="Enter your email address"
                  type="email"
                  formError={errors.email}
                  showFormError={formTwo?.showFormError}
                />
                <PhoneNumber
                  label="Phone number"
                  value={form.phoneNumber}
                  countryClicked={formTwo.country}
                  onPhoneChange={(val) =>
                    handleChange({ prop: "phoneNumber", val })
                  }
                  onCountryChange={(val) =>
                    setFormTwo({ ...formTwo, country: val })
                  }
                  placeholder="Enter phone number"
                  formError={errors.phoneNumber}
                  showFormError={formTwo?.showFormError}
                />
              </>
            )}
          </div>

          {/* Second section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 ">
            {user_id && (
              <>
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-grey-text text-lg uppercase">
                    User info
                  </span>
                  <span className="text-grey-text text-sm">
                    Fill in user details
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[7px] md:gap-5 justify-between items-start w-full">
                  <Input
                    label="First name"
                    value={form?.firstName}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "firstName", val })
                    }
                    placeholder="Enter first name"
                    formError={errors.firstName}
                    showFormError={formTwo?.showFormError}
                  />

                  <Input
                    label="Last name"
                    value={form?.lastName}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "lastName", val })
                    }
                    placeholder="Enter last name"
                    formError={errors.lastName}
                    showFormError={formTwo?.showFormError}
                  />
                </div>

                <Select
                  label="Gender"
                  placeholder="Select your gender"
                  options={GENDERS}
                  onChange={(val) =>
                    handleChange({ prop: "gender", val: val?.value })
                  }
                  value={form.gender}
                  formError={errors.gender}
                  showFormError={formTwo?.showFormError}
                  fullWidth
                />

                <Input
                  label="Email address"
                  value={form?.email}
                  onChangeFunc={(val) => handleChange({ prop: "email", val })}
                  placeholder="Enter your email address"
                  type="email"
                  formError={errors.email}
                  showFormError={formTwo?.showFormError}
                  isDisabled={user_id}
                />
                <PhoneNumber
                  label="Phone number"
                  value={form.phoneNumber}
                  countryClicked={formTwo.country}
                  onPhoneChange={(val) =>
                    handleChange({ prop: "phoneNumber", val })
                  }
                  onCountryChange={(val) =>
                    setFormTwo({ ...formTwo, country: val })
                  }
                  placeholder="Enter phone number"
                  formError={errors.phoneNumber}
                  showFormError={formTwo?.showFormError}
                  isDisabled={user_id}
                />
              </>
            )}

            {!user_id && (
              <>
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-grey-text text-lg uppercase">
                    User info
                  </span>
                  <span className="text-grey-text text-sm">
                    Fill in user details <br /> Default password: P@55word
                  </span>
                </div>
                <DatePickerComponent
                  label="Date Of Birth"
                  placeholder="Select Date Of Birth"
                  name="dob"
                  isRequired
                  value={
                    moment(form?.dob).isValid() ? moment(form?.dob)._d : ""
                  }
                  maxDate={
                    moment(form?.end_date).isValid()
                      ? moment(form?.end_date).subtract(0, "days")._d
                      : moment().subtract(1, "days")._d
                  }
                  dateFormat="dd MMMM yyyy"
                  onChange={(value) =>
                    handleChange({
                      prop: "dob",
                      val: moment(value).format("YYYY-MM-DD"),
                    })
                  }
                  formError={errors.dob}
                  showFormError={formTwo?.showFormError}
                />

                <Input
                  label="Password"
                  value={form?.password}
                  onChangeFunc={(val) =>
                    handleChange({ prop: "password", val })
                  }
                  placeholder="Enter your password"
                  type="password"
                  formError={errors.password}
                  showFormError={formTwo?.showFormError}
                />
                <PasswordCheckComp />
              </>
            )}
          </div>
          {/* Third section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Optional User Info
              </span>
              <span className="text-grey-text text-sm">
                Fill in user details
              </span>
            </div>

            <Select
              label="Role"
              placeholder="Select user role"
              options={ROLES}
              onChange={(val) =>
                handleChange({ prop: "role", val: val?.value })
              }
              value={form.role}
              formError={errors.role}
              showFormError={formTwo?.showFormError}
              fullWidth
            />

            {user_id && form?.role?.includes("BRAND") && (
              <div className="flex flex-col justify-start items-end gap-1 w-full">
                {!isEmpty(form?.brandId) && (
                  <p>
                    {getBrandLoading ? (
                      <TailSpin
                        height="25"
                        width="25"
                        color="#000000"
                        ariaLabel="tail-spin-loading"
                        radius="3"
                        visible={true}
                      />
                    ) : (
                      brand?.brandName
                    )}
                  </p>
                )}

                <Button
                  onClick={() => handleChangeTwo("modalType", BRAND)}
                  text={`Select Brand`}
                  className=""
                  whiteBg
                  fullWidth
                />
              </div>
            )}
            {/* <Select
              label="User Warehouse"
              placeholder="Select User Warehouse"
              options={warehouses}
              onChange={(val) =>
                handleChange({ prop: "warehouseId", val: val?.value })
              }
              value={warehouses?.find(
                (item) => item?.value === form?.warehouseId
              )}
              formError={errors.warehouseId}
              showFormError={formTwo?.showFormError}
              isLoading={loading}
              tooltip="Select a warehouse for warehouse staffs"
              fullWidth
            /> */}

            <Button
              onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
              type="submit"
              text={!user_id ? "Add User" : "Save Changes"}
              isLoading={createUserLoading || editUserLoading}
              className="mt-10 mb-5 "
              fullWidth
            />
          </div>
        </form>

        <hr className="w-full my-4" />

        <h2 className="section-heading my-8 text-xl">
          User Order History ({numberWithCommas(userOrdersCount || 0)})
        </h2>

        <UserOrders />
      </div>

      <DetailsModal
        active={formTwo?.modalType === BRAND}
        details={{ modalType: BRAND, size: "lg" }}
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
