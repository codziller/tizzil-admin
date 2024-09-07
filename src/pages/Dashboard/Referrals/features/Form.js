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
        <h2 className="section-heading mb-3 text-xl">Add a New Staff</h2>
      ) : (
        <h2 className="section-heading mb-3 text-xl">Edit Staff</h2>
      )}

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col justify-start items-start gap-y-3 w-full overflow-y-auto"
      >
        <div className="flex-col justify-start items-start flex w-full">
          <div className="general-input-label mb-2 relative text-[13px] font-bold text-grey-dark">
            Add Staff Image
          </div>
          <div className="w-full h-[204px] px-[127px] py-16 bg-stone-50 rounded-lg border border-dashed border-black  flex-col justify-center items-center gap-2.5 flex cursor-pointer">
            <div className="w-[86px] h-[86px] min-w-[86px] min-h-[86px] bg-[#EAEAEA] rounded-full flex items-center justify-center">
              <Gallery className="stroke-current" />
            </div>
          </div>

          <div className="min-h-[13px]">
            {formTwo?.showFormError && errors.name && (
              <FormErrorMessage type={errors.name} />
            )}
          </div>
        </div>
        <Input
          label="Full Name"
          value={form?.name}
          onChangeFunc={(val) => handleChange("name", val)}
          placeholder="Enter Full Name"
          formError={errors.name}
          showFormError={formTwo?.showFormError}
          required
        />

        <Input
          label="Email Address"
          value={form?.name}
          onChangeFunc={(val) => handleChange("name", val)}
          placeholder="Enter Email Address"
          formError={errors.name}
          showFormError={formTwo?.showFormError}
          required
        />

        <Select
          label="Staff Role "
          placeholder="Select Staff Role "
          options={[
            {
              value: "Admin",
              label: "Admin",
            },
            {
              value: "Basic Staff",
              label: "Basic Staff",
            },
          ]}
          onChange={(val) => handleChange("country", val)}
          value={form.country}
          formError={errors.country}
          showFormError={formTwo?.showFormError}
          fullWidth
        />

        <Select
          label="Staff Status "
          placeholder="Select Staff Status "
          options={[
            { label: "Active", value: "Active" },
            { label: "Disabled", value: "Disabled" },
          ]}
          onChange={(val) => handleChange("country", val)}
          value={form.country}
          formError={errors.country}
          showFormError={formTwo?.showFormError}
          fullWidth
        />

        <Button
          onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
          type="submit"
          text={details?.isAdd ? "Add New Staff" : "Save Changes"}
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
