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
  ALL_ROLES,
  GENDERS,
  MEDIA_MODAL_TYPES,
  NAIRA,
  PRODUCT_MODAL_TYPES,
  ROLES,
  WALLET_ACTIONS,
} from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { observer } from "mobx-react-lite";
import AffiliateMarketersStore from "../store";
import cleanPayload from "utils/cleanPayload";
import { isEmpty } from "lodash";
import DatePickerComponent from "components/General/DatePicker";
import moment from "moment";
import StaffsStore from "../store";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import Select from "components/General/Input/Select";
import PhoneNumber from "components/General/PhoneNumber/PhoneNumber";
import usePasswordValidation from "hooks/usePasswordValidation";

const { BRAND } = MEDIA_MODAL_TYPES;
const { Credit, Debit } = WALLET_ACTIONS;
const { GUEST } = ALL_ROLES;
const Form = ({ details, toggler }) => {
  const { staff_id, warehouse_id } = useParams();

  const {
    editStaffWallet,
    staff,
    editStaffWalletLoading,
    editStaff,
    editStaffLoading,
    createStaff,
    createStaffLoading,
  } = StaffsStore;
  const { warehouses, loading, getWarehouses } = WareHousesStore;
  const { getBrand, brand, getBrandLoading } = BrandsStore;
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
    ...(staff_id ? { ...addSchema } : {}),
    firstName: yup.string().required("Please enter first name"),
    gender: yup.string().required("Please select gender"),
    lastName: yup.string().required("Please enter last name"),
  });

  const defaultValues = {
    dob: staff_id ? staff?.dob : "",
    email: staff_id ? staff?.email : "",
    firstName: staff_id ? staff?.firstName : "",
    gender: staff_id ? staff?.gender : "",
    lastName: staff_id ? staff?.lastName : "",
    password: "P@55word",
    phoneNumber: staff_id ? staff?.phoneNumber : "",
    role: staff_id ? staff?.role : "",
    warehouseId: staff_id ? staff?.warehouseStaff?.warehouseId : "",
    brandId: staff_id ? staff?.brandId : "",
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
      userId: staff_id,
      phoneNumber: staff_id ? "" : form.phoneNumber,
      dob: staff_id ? "" : form.dob,
      email: staff_id ? "" : form.email,
      password: staff_id ? "" : form.password,
      warehouseId:
        form?.role === "BRAND_STAFF" ? "" : form?.warehouseId || warehouse_id,
    };

    cleanPayload(payload);
    if (staff_id) {
      editStaff({
        data: payload,
        onSuccess: () => navigate(`/dashboard/staffs/${warehouse_id}`),
      });
      return;
    }
    createStaff({
      data: payload,
      onSuccess: () => navigate(`/dashboard/staffs/${warehouse_id}`),
    });
  };

  const handleOnWalletSubmit = () => {
    let payload = {
      amount: parseFloat(form.amount),
      transactionType: form.transactionType,
      staffId: staff_id,
    };

    if (staff_id) {
      editStaffWallet({
        data: payload,
        onSuccess: () => navigate(`/dashboard/staffs/${warehouse_id}`),
      });
      return;
    }
  };

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 ">
        {details?.link ? (
          <div className="mb-5">
            <Link to={`/dashboard/staffs/${warehouse_id}`} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}

        {!staff_id ? (
          <h2 className="section-heading my-8 text-xl">Add Staff</h2>
        ) : (
          <h2 className="section-heading my-8 text-xl  ">Edit Staff</h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col md:flex-row justify-start items-start gap-10 w-full "
        >
          {/* First section */}

          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Staff info
              </span>
              <span className="text-grey-text text-sm">
                Fill in staff details
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[7px] md:gap-5 justify-between items-start w-full">
              <Input
                label="First name"
                value={form?.firstName}
                onChangeFunc={(val) => handleChange({ prop: "firstName", val })}
                placeholder="Enter first name"
                formError={errors.firstName}
                showFormError={formTwo?.showFormError}
              />

              <Input
                label="Last name"
                value={form?.lastName}
                onChangeFunc={(val) => handleChange({ prop: "lastName", val })}
                placeholder="Enter last name"
                formError={errors.lastName}
                showFormError={formTwo?.showFormError}
              />
            </div>

            <Select
              label="Gender"
              placeholder="Select gender"
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
              placeholder="Enter email address"
              type="email"
              formError={errors.email}
              showFormError={formTwo?.showFormError}
              isDisabled={staff_id}
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
              isDisabled={staff_id && form.role !== GUEST}
            />
          </div>

          {/* Second section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 ">
            {!staff_id && (
              <>
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-grey-text text-lg uppercase">
                    Staff info
                  </span>
                  <span className="text-grey-text text-sm">
                    Fill in staff details <br /> Default password: P@55word
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

            {staff_id && (
              <>
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-grey-text text-lg uppercase">
                    Optional Staff Info
                  </span>
                  <span className="text-grey-text text-sm">
                    Fill in staff details
                  </span>
                </div>
                {form.role === GUEST ? (
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
                ) : null}
                <Select
                  label="Role"
                  placeholder="Select staff role"
                  options={ROLES}
                  onChange={(val) =>
                    handleChange({ prop: "role", val: val?.value })
                  }
                  value={form.role}
                  formError={errors.role}
                  showFormError={formTwo?.showFormError}
                  fullWidth
                />

                {staff_id && form?.role === "BRAND_STAFF" && (
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
                {staff_id && form?.role?.includes("WAREHOUSE") ? (
                  <Select
                    label="Select Warehouse"
                    placeholder="Select Warehouse"
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
                  />
                ) : null}
                <Button
                  onClick={() =>
                    setFormTwo({ ...formTwo, showFormError: true })
                  }
                  type="submit"
                  text={!staff_id ? "Add Staff" : "Save Changes"}
                  isLoading={createStaffLoading || editStaffLoading}
                  className="mt-10 mb-5 "
                  fullWidth
                />
              </>
            )}
          </div>
          {/* Third section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3">
            {!staff_id && (
              <>
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-grey-text text-lg uppercase">
                    Optional Staff Info
                  </span>
                  <span className="text-grey-text text-sm">
                    Fill in staff details
                  </span>
                </div>

                <Select
                  label="Role"
                  placeholder="Select staff role"
                  options={ROLES}
                  onChange={(val) =>
                    handleChange({ prop: "role", val: val?.value })
                  }
                  value={form.role}
                  formError={errors.role}
                  showFormError={formTwo?.showFormError}
                  fullWidth
                />

                {form?.role === "BRAND_STAFF" && (
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
                {form?.role?.includes("WAREHOUSE") ? (
                  <Select
                    label="Select Warehouse"
                    placeholder="Select Warehouse"
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
                  />
                ) : null}
                <Button
                  onClick={() =>
                    setFormTwo({ ...formTwo, showFormError: true })
                  }
                  type="submit"
                  text={!staff_id ? "Add Staff" : "Save Changes"}
                  isLoading={createStaffLoading || editStaffLoading}
                  className="mt-10 mb-5 "
                  fullWidth
                />
              </>
            )}
          </div>
        </form>
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
