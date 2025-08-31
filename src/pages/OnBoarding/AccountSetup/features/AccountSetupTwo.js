import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { observer } from "mobx-react-lite";

const AccountSetupTwo = ({ formData, updateFormData }) => {
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
      <h3 className="text-xl font-bold text-[#111111] mb-6">Brand Bio</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-[#374151] mb-2">
            Brand Description
          </label>
          <textarea
            value={form?.brandDescription}
            onChange={(e) => handleChange("brandDescription", e.target.value)}
            placeholder="Short description (who you are, what you make, why it matters)"
            className="w-full min-h-[120px] p-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-vertical"
            rows={5}
          />
          {errors.brandDescription && (
            <span className="text-red-500 text-xs mt-1">
              {errors.brandDescription.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

AccountSetupTwo.propTypes = {
  formData: PropTypes.object,
  updateFormData: PropTypes.func,
};

export default observer(AccountSetupTwo);