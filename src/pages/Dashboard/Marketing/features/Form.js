import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Gallery } from "assets/icons/gallery-black.svg";
import Button from "components/General/Button/Button";
import Textarea from "components/General/Textarea/Textarea";
import { Link } from "react-router-dom";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import ImagePicker from "components/General/Input/ImagePicker";

export default function Form({ details, toggler }) {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
  });

  const schema = yup.object({});

  //

  //   const { actions } = signInSlice;

  const defaultValues = {
    name: "",
    country: "",
    amount: "",
    images: [],
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
    images: watch("images"),
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      toggler?.();
    }
    // onSubmit(e);
    // dispatch(actions.signInUser({ username: name, country }));
  };
  const removeFile = (file, prop, files) => {
    let updatedFiles = [...files];
    updatedFiles = updatedFiles.filter((_) => _?.name !== file?.name);
    handleChange(prop, updatedFiles);
  };
  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
      <div className="mb-5">
        <Link to={details?.link} className="scale-90">
          <ArrowBack />
        </Link>
      </div>
      {details?.isAdd ? (
        <h2 className="section-heading my-8 text-xl">Add New Offer Image</h2>
      ) : (
        <h2 className="section-heading mb-3 text-xl">Edit Product</h2>
      )}

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col justify-start items-start gap-y-3 w-full overflow-y-auto"
      >
        <ImagePicker
          label="Select Image "
          showFormError={formTwo?.showFormError && errors.images}
          handleDrop={(val) => handleChange("images", val, form.images)}
          images={form.images}
          removeImage={(file) => removeFile(file, "images", form.images)}
          multiple={false}
        />

        <Textarea
          label="Description  (150 characters Max)"
          value={form?.name}
          onChangeFunc={(val) => handleChange("name", val)}
          placeholder="Enter Description"
          formError={errors.name}
          showFormError={formTwo?.showFormError}
          required
        />
        <Button
          onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
          type="submit"
          text={details?.isAdd ? "Upload" : "Save Changes"}
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
