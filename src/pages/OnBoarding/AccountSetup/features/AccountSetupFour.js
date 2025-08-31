import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import IconTypeInput from "components/General/Input/IconTypeInput";
import { observer } from "mobx-react-lite";

const AccountSetupFour = ({ formData, updateFormData }) => {
  const schema = yup.object({
    instagramUrl: yup
      .string()
      .url("Please enter a valid Instagram URL")
      .nullable(),
    tiktokUrl: yup
      .string()
      .url("Please enter a valid TikTok URL")
      .nullable(),
    websiteUrl: yup
      .string()
      .url("Please enter a valid website URL")
      .nullable(),
  });

  const defaultValues = {
    instagramUrl: formData?.instagramUrl || "",
    tiktokUrl: formData?.tiktokUrl || "",
    websiteUrl: formData?.websiteUrl || "",
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
    instagramUrl: watch("instagramUrl"),
    tiktokUrl: watch("tiktokUrl"),
    websiteUrl: watch("websiteUrl"),
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-[#111111] mb-6">Social Links (optional)</h3>
      
      <div className="flex flex-col space-y-6">
        <IconTypeInput
          label="Instagram"
          type="instagram"
          value={form?.instagramUrl}
          onChange={(val) => handleChange("instagramUrl", val)}
          error={errors.instagramUrl?.message}
        />
        
        <IconTypeInput
          label="TikTok"
          type="tiktok"
          value={form?.tiktokUrl}
          onChange={(val) => handleChange("tiktokUrl", val)}
          error={errors.tiktokUrl?.message}
        />
        
        <IconTypeInput
          label="Website"
          type="website"
          value={form?.websiteUrl}
          onChange={(val) => handleChange("websiteUrl", val)}
          error={errors.websiteUrl?.message}
        />
      </div>
    </div>
  );
};

AccountSetupFour.propTypes = {
  formData: PropTypes.object,
  updateFormData: PropTypes.func,
};

export default observer(AccountSetupFour);