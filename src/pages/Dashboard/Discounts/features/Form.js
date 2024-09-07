import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Gallery } from "assets/icons/gallery-black.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import Textarea from "components/General/Textarea/Textarea";
import { Link } from "react-router-dom";
import { FormErrorMessage } from "components/General/FormErrorMessage";

export default function Form({ details, toggler }) {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
  });

  const schema = yup.object({
    name: yup.string().required("Please enter your name"),
    country: yup.string().required("Please select your country"),
    amount: yup.string().required("Please enter amount"),
    quantity: yup.string().required("Please enter quantity"),
  });

  //

  //   const { actions } = signInSlice;

  const defaultValues = {
    name: "",
    country: "",
    amount: "",
    quantity: "",
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
    name: watch("name"),
    country: watch("country"),
    amount: watch("amount"),
    quantity: watch("quantity"),
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      toggler?.();
    }
    // onSubmit(e);
    // dispatch(actions.signInUser({ username: name, country }));
  };

  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
      {details?.link ? (
        <div className="mb-5">
          <Link to={details?.link} className="scale-90">
            <ArrowBack />
          </Link>
        </div>
      ) : (
        <button onClick={() => toggler?.()} className="scale-90 mb-5">
          <Close />
        </button>
      )}

      {details?.isAdd ? (
        <h2 className="section-heading my-8 text-xl">Add Discount Code</h2>
      ) : (
        <h2 className="section-heading mb-3 text-xl">Edit Discount Code</h2>
      )}

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col justify-start items-start gap-y-3 w-full overflow-y-auto"
      >
        <Input
          label="Discount Code"
          value={form?.name}
          onChangeFunc={(val) => handleChange("name", val)}
          placeholder="Enter Discount Code"
          formError={errors.name}
          showFormError={formTwo?.showFormError}
          required
        />

        <Textarea
          label="Message"
          value={form?.name}
          onChangeFunc={(val) => handleChange("name", val)}
          placeholder="Get 10% off when you order on beautyhut"
          formError={errors.name}
          showFormError={formTwo?.showFormError}
          required
        />

        <Select
          label="Product Category"
          placeholder="Select Product Category"
          options={[]}
          onChange={(val) => handleChange("country", val)}
          value={form.country}
          formError={errors.country}
          showFormError={formTwo?.showFormError}
          fullWidth
        />
        <Input
          label="Quantity"
          value={form?.quantity}
          onChangeFunc={(val) => handleChange("quantity", val)}
          placeholder="Enter Quantity"
          formError={errors.quantity}
          showFormError={formTwo?.showFormError}
          type="number"
          required
        />

        <Input
          label="Amount (₦‎)"
          value={form?.amount}
          onChangeFunc={(val) => handleChange("amount", val)}
          placeholder="Enter Amount"
          formError={errors.amount}
          showFormError={formTwo?.showFormError}
          prefix={"₦‎"}
          type="number"
          required
        />

        <Button
          onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
          type="submit"
          text={details?.isAdd ? "Add Discount Code" : "Save Changes"}
          className="mt-8 mb-5"
          fullWidth
        />
      </form>
    </div>
  );
}
Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
