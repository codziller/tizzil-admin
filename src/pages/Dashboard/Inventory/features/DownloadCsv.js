import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { observer } from "mobx-react-lite";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import ProductsStore from "pages/Dashboard/Products/store";
import DatePickerComponent from "components/General/DatePicker";

const DownloadCsv = ({ details, toggler }) => {
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
  });

  const schema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Please enter your email"),
    startDate: yup.string().required("Please select start date"),
    endDate: yup.string().required("Please select end date"),
  });

  const { sendProductInventoryCsv, sendProductInventoryCsvLoading } =
    ProductsStore;

  const defaultValues = {
    email: "",
    startDate: "",
    endDate: "",
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const form = {
    email: watch("email"),
    startDate: watch("startDate"),
    endDate: watch("endDate"),
  };

  const handleOnSubmit = async () => {
    try {
      const payload = {
        ...form,
        startDate: moment(new Date(moment(form?.startDate)._d)).format(
          "YYYY-MM-DD"
        ),
        endDate: moment(new Date(moment(form?.endDate)._d)).format(
          "YYYY-MM-DD"
        ),
      };
      await sendProductInventoryCsv({
        data: payload,
        onSuccess: () => toggler?.(),
      });
    } catch (error) {
    } finally {
    }
  };

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto overflow-x-hidden">
        {details?.link ? (
          <div className="">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 ">
            <Close />
          </button>
        )}

        <h2 className="section-heading mb-3 text-xl">Download Inventory Csv</h2>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-5 w-full filter-modal"
        >
          <Input
            label="Email"
            value={form?.email}
            onChangeFunc={(val) => handleChange("email", val)}
            placeholder="Enter your email address"
            formError={errors.email}
            showFormError={formTwo?.showFormError}
            type="email"
            required
          />
          <div className="flex flex-col md:flex-row justify-start items-start gap-5 w-full mb-6">
            <DatePickerComponent
              placeholder="Start date"
              name="startDate"
              value={
                moment(form?.startDate).isValid()
                  ? moment(form?.startDate)._d
                  : ""
              }
              maxDate={
                moment(form?.endDate).isValid()
                  ? moment(form?.endDate).subtract(1, "days")._d
                  : moment().subtract(1, "days")._d
              }
              dateFormat="dd MMMM yyyy"
              onChange={(value) =>
                handleChange(
                  "startDate",
                  moment(value).format("YYYY-MM-DD hh:mm")
                )
              }
            />

            <DatePickerComponent
              containerClassName="right-react-datepicker"
              placeholder="End date"
              name="endDate"
              value={
                moment(form?.endDate).isValid() ? moment(form?.endDate)._d : ""
              }
              minDate={
                moment(form?.startDate).isValid()
                  ? moment(form?.startDate).add(1, "days")._d
                  : ""
              }
              dateFormat="dd MMMM yyyy"
              onChange={(value) =>
                handleChange(
                  "endDate",
                  moment(value).format("YYYY-MM-DD hh:mm")
                )
              }
            />
          </div>

          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            isLoading={sendProductInventoryCsvLoading}
            type="submit"
            text={"Proceed to download CSV File"}
            className="my-5 "
            fullWidth
          />
        </form>
      </div>
    </>
  );
};
DownloadCsv.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(DownloadCsv);
