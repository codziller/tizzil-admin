import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ImageSelection from "components/General/Input/ImageSelection";
import { observer } from "mobx-react-lite";

const AccountSetupThree = ({ formData, updateFormData, hideTitle = false }) => {
  const schema = yup.object({
    logo: yup.mixed().required("Please upload a logo"),
    banner: yup.mixed(), // Optional
  });

  const defaultValues = {
    logo: formData?.logo || null,
    banner: formData?.banner || null,
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
    logo: watch("logo"),
    banner: watch("banner"),
  };

  return (
    <div className="w-full">
      {!hideTitle && (
        <h3 className="text-xl font-bold text-[#111111] mb-2">ASSETS</h3>
      )}
      <p className="text-sm text-[#6B7280] mb-6">
        Logo – JPG or PNG, 500×500px
        <br />
        Banner – JPG, 1200×600px
      </p>

      <div className="flex flex-col space-y-6">
        <ImageSelection
          label="Logo upload"
          value={form?.logo}
          onChange={(file) => handleChange("logo", file)}
          accept="image/jpeg,image/jpg,image/png"
          required
          error={errors.logo?.message}
        />

        <ImageSelection
          label="Banner image (optional)"
          value={form?.banner}
          onChange={(file) => handleChange("banner", file)}
          accept="image/jpeg,image/jpg"
          error={errors.banner?.message}
        />
      </div>
    </div>
  );
};

AccountSetupThree.propTypes = {
  formData: PropTypes.object,
  updateFormData: PropTypes.func,
  hideTitle: PropTypes.bool,
};

export default observer(AccountSetupThree);
