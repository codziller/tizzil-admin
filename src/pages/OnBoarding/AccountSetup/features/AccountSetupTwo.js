import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textarea from "components/General/Textarea/Textarea";
import { observer } from "mobx-react-lite";

const AccountSetupTwo = ({ formData, updateFormData, hideTitle = false }) => {
  const schema = yup.object({
    brandDescription: yup
      .string()
      .min(10, "Description must be at least 10 characters")
      .required("Please enter your brand description"),
  });

  const defaultValues = {
    brandDescription: formData?.brandDescription || "",
  };

  const {
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
    updateFormData({ [prop]: val });
  };

  const form = {
    brandDescription: watch("brandDescription"),
  };

  return (
    <div className="w-full">
      {!hideTitle && (
        <h3 className="text-xl font-bold text-[#111111] mb-6">Brand Bio</h3>
      )}

      <div className="flex flex-col space-y-4">
        <Textarea
          label="Brand Description"
          value={form?.brandDescription}
          onChangeFunc={(val) => handleChange("brandDescription", val)}
          placeholder="Short description (who you are, what you make, why it matters)"
          formError={errors.brandDescription}
          rows={5}
          required
        />
      </div>
    </div>
  );
};

AccountSetupTwo.propTypes = {
  formData: PropTypes.object,
  updateFormData: PropTypes.func,
  hideTitle: PropTypes.bool,
};

export default observer(AccountSetupTwo);
