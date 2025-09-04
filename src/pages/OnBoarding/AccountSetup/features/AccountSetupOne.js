import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { observer } from "mobx-react-lite";

const AccountSetupOne = ({
  formData,
  updateFormData,
  nextStep,
  hideTitle = false,
}) => {
  const schema = yup.object({
    brandName: yup.string().required("Please enter your brand name"),
    brandEmail: yup
      .string()
      .email("Please enter a valid email address")
      .required("Please enter your brand email"),
    addressLine1: yup.string().required("Please enter your address"),
    country: yup.string().required("Please select your country"),
    city: yup.string().required("Please enter your city"),
    productCategory: yup.string().required("Please select a product category"),
  });

  const defaultValues = {
    brandName: formData?.brandName || "",
    brandEmail: formData?.brandEmail || "",
    addressLine1: formData?.addressLine1 || "",
    country: formData?.country || "",
    city: formData?.city || "",
    productCategory: formData?.productCategory || "",
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
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
    brandName: watch("brandName"),
    brandEmail: watch("brandEmail"),
    addressLine1: watch("addressLine1"),
    country: watch("country"),
    city: watch("city"),
    productCategory: watch("productCategory"),
  };

  const handleNext = () => {
    if (isValid) {
      nextStep();
    }
  };

  // Sample options - these should ideally come from API or constants
  const countryOptions = [
    { label: "United States", value: "US" },
    { label: "United Kingdom", value: "UK" },
    { label: "Canada", value: "CA" },
    { label: "Nigeria", value: "NG" },
    // Add more countries as needed
  ];

  const cityOptions = [
    { label: "New York", value: "new-york" },
    { label: "London", value: "london" },
    { label: "Toronto", value: "toronto" },
    { label: "Lagos", value: "lagos" },
    // Add more cities as needed
  ];

  const categoryOptions = [
    { label: "Fashion & Apparel", value: "fashion-apparel" },
    { label: "Electronics", value: "electronics" },
    { label: "Home & Garden", value: "home-garden" },
    { label: "Beauty & Personal Care", value: "beauty-personal-care" },
    { label: "Sports & Outdoors", value: "sports-outdoors" },
    // Add more categories as needed
  ];

  return (
    <div className="w-full">
      {!hideTitle && (
        <h3 className="text-xl font-bold text-[#111111] mb-6">Brand Info</h3>
      )}

      <form className="flex flex-col space-y-4">
        <Input
          label="Brand Name"
          value={form?.brandName}
          onChangeFunc={(val) => handleChange("brandName", val)}
          placeholder="Enter your brand name"
          type="text"
          formError={errors.brandName}
          required
        />

        <Input
          label="Brand E-mail"
          value={form?.brandEmail}
          onChangeFunc={(val) => handleChange("brandEmail", val)}
          placeholder="Enter your brand email"
          type="email"
          formError={errors.brandEmail}
          required
        />

        <Input
          label="Address"
          value={form?.addressLine1}
          onChangeFunc={(val) => handleChange("addressLine1", val)}
          placeholder="Enter your address"
          type="text"
          formError={errors.addressLine1}
          required
        />

        <Select
          label="Country"
          value={form?.country}
          onChange={(selected) => handleChange("country", selected?.value)}
          placeholder="Select your country"
          options={countryOptions}
          formError={errors.country}
          required
          fullWidth
        />

        <Select
          label="City"
          value={form?.city}
          onChange={(selected) => handleChange("city", selected?.value)}
          placeholder="Select your city"
          options={cityOptions}
          formError={errors.city}
          required
          fullWidth
        />

        <Select
          label="Product Category"
          value={form?.productCategory}
          onChange={(selected) =>
            handleChange("productCategory", selected?.value)
          }
          placeholder="Select product category"
          options={categoryOptions}
          formError={errors.productCategory}
          required
          fullWidth
        />
      </form>
    </div>
  );
};

AccountSetupOne.propTypes = {
  formData: PropTypes.object,
  updateFormData: PropTypes.func,
  nextStep: PropTypes.func,
  hideTitle: PropTypes.bool,
};

export default observer(AccountSetupOne);
