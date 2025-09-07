import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import CountryListDropdown from "components/General/Input/CountryListDropdown";
import { getStates } from "country-state-picker";
import { City } from "country-state-city";
import { observer } from "mobx-react-lite";
import { isEmpty, lowerCase } from "lodash";

const AccountSetupOne = ({
  formData,
  updateFormData,
  nextStep,
  hideTitle = false,
}) => {
  const [allowManualCity, setAllowManualCity] = useState(false);
  const schema = yup.object({
    brandName: yup.string().required("Please enter your brand name"),
    addressLine1: yup.string().required("Please enter your address"),
    country: yup.string().required("Please select your country"),
    state: yup.string().required("Please select your state"),
    city: yup.string().required("Please enter your city"),
    postalCode: yup.string().required("Please enter your postal code"),
    productCategory: yup.string().required("Please select a product category"),
  });

  const defaultValues = {
    brandName: formData?.brandName || "",
    addressLine1: formData?.addressLine1 || "",
    country: formData?.country || "",
    state: formData?.state || "",
    city: formData?.city || "",
    postalCode: formData?.postalCode || "",
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
    addressLine1: watch("addressLine1"),
    country: watch("country"),
    state: watch("state"),
    city: watch("city"),
    postalCode: watch("postalCode"),
    productCategory: watch("productCategory"),
  };

  const handleNext = () => {
    if (isValid) {
      nextStep();
    }
  };

  // Dynamic states based on selected country
  const states = useMemo(() => {
    const selectedCountry = lowerCase(form?.country);
    let statesList = getStates(selectedCountry);
    if (!isEmpty(statesList)) {
      statesList = statesList.map((item) => {
        const itemName =
          selectedCountry === "ng" ? item?.replace(" State", "") : item;
        return { label: itemName, value: itemName };
      });
    } else {
      statesList = [];
    }
    return statesList;
  }, [form.country]);

  const stateValue = useMemo(
    () => states?.find((item) => item.value === form.state),
    [form.state, states]
  );

  // Dynamic cities based on selected country and state
  const cities = useMemo(() => {
    if (!form.country || !form.state) return [];
    
    try {
      // Get the state code for the API call
      const stateCode = form.state;
      const cityList = City.getCitiesOfState(form.country, stateCode);
      
      if (!isEmpty(cityList)) {
        return cityList.map((city) => ({
          label: city.name,
          value: city.name,
        }));
      }
    } catch (error) {
      console.log("Error getting cities:", error);
    }
    return [];
  }, [form.country, form.state]);

  const cityValue = useMemo(
    () => cities?.find((item) => item.value === form.city),
    [form.city, cities]
  );

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
          label="Address"
          value={form?.addressLine1}
          onChangeFunc={(val) => handleChange("addressLine1", val)}
          placeholder="Enter your address"
          type="text"
          formError={errors.addressLine1}
          required
        />

        <CountryListDropdown
          label="Country"
          placeholder="Select your country"
          onClick={(val) => {
            handleChange("country", val);
            // Reset state and city when country changes
            handleChange("state", "");
            handleChange("city", "");
            setAllowManualCity(false);
          }}
          value={form.country}
          formError={errors.country}
          required
          fullWidth
        />

        <Select
          label="State"
          placeholder="Select your state"
          options={states}
          onChange={(val) => {
            handleChange("state", val?.value);
            // Reset city when state changes
            handleChange("city", "");
            setAllowManualCity(false);
          }}
          value={stateValue}
          formError={errors.state}
          required
          fullWidth
          isDisabled={!form.country || states.length === 0}
        />

        {!allowManualCity ? (
          <div className="space-y-2">
            <Select
              label="City"
              placeholder="Select your city"
              options={cities}
              onChange={(val) => handleChange("city", val?.value)}
              value={cityValue}
              formError={errors.city}
              required
              fullWidth
              isDisabled={!form.state || cities.length === 0}
            />
            {cities.length === 0 && form.state && (
              <button
                type="button"
                onClick={() => setAllowManualCity(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Can't find your city? Enter manually
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              label="City"
              value={form?.city}
              onChangeFunc={(val) => handleChange("city", val)}
              placeholder="Enter your city"
              type="text"
              formError={errors.city}
              required
            />
            <button
              type="button"
              onClick={() => {
                setAllowManualCity(false);
                handleChange("city", "");
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Select from list instead
            </button>
          </div>
        )}

        <Input
          label="Postal Code"
          value={form?.postalCode}
          onChangeFunc={(val) => handleChange("postalCode", val)}
          placeholder="Enter your postal code"
          type="text"
          formError={errors.postalCode}
          required
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
