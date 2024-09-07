import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Delete } from "assets/icons/delete-span.svg";
import Button from "components/General/Button/Button";
import { Link } from "react-router-dom";

export default function DeleteDialog({ details, toggler }) {
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
    <div className="flex flex-col justify-center items-center gap-y-2 w-full h-full pb-4 overflow-y-auto">
      {details?.link ? (
        <Link to={details?.link} className="scale-90 mb-2 mr-auto">
          <ArrowBack />
        </Link>
      ) : (
        <button onClick={() => toggler?.()} className="scale-90 mb-5 mr-auto">
          <Close />
        </button>
      )}

      <Delete className="scale-90" />
      <p className="font-600 text-xl ">Delete Promo Code</p>

      <p className="mb-3 text-sm text-grey text-center">
        Are you sure you want to delete{" "}
        <span className="text-black">"{details?.code}"?</span>
      </p>

      <Button
        onClick={() => toggler?.()}
        type="submit"
        text="Yes, Delete this promo code"
        className="mb-2"
        fullWidth
        redBg
      />

      <Button
        onClick={() => toggler?.()}
        type="submit"
        text="No, Cancel"
        className="mb-5"
        fullWidth
        whiteBg
      />
    </div>
  );
}
DeleteDialog.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
