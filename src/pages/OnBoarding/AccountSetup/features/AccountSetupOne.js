import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import CountryListDropdown from "components/General/Input/CountryListDropdown";
import { City, Country, State } from "country-state-city";
import { observer } from "mobx-react-lite";
import { isEmpty, lowerCase } from "lodash";
import CustomGooglePlacesAutocomplete from "components/General/Input/CustomGooglePlacesAutocomplete";

const AccountSetupOne = ({
  formData,
  updateFormData,
  nextStep,
  hideTitle = false,
}) => {
  const [allowManualCity, setAllowManualCity] = useState(false);
  const [addressValue, setAddressValue] = useState("");

  const schema = yup.object({
    brandName: yup.string().required("Please enter your brand name"),
    addressLine1: yup.string().required("Please enter your address"),
    latitude: yup.number().required("Please select a valid address from the suggestions").typeError("Please select a valid address from the suggestions"),
    longitude: yup.number().required("Please select a valid address from the suggestions").typeError("Please select a valid address from the suggestions"),
    country: yup.string().required("Please select your country"),
    countryCode: yup.string(),
    state: yup.string().required("Please select your state"),
    stateCode: yup.string(),
    city: yup.string().required("Please enter your city"),
    postalCode: yup.string().required("Please enter your postal code"),
    productCategory: yup.string().required("Please select a product category"),
  });

  const defaultValues = {
    brandName: formData?.brandName || "",
    addressLine1: formData?.addressLine1 || "",
    latitude: formData?.latitude || null,
    longitude: formData?.longitude || null,
    country: formData?.country || "",
    countryCode: formData?.countryCode || "",
    state: formData?.state || "",
    stateCode: formData?.stateCode || "",
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
    latitude: watch("latitude"),
    longitude: watch("longitude"),
    country: watch("country"),
    countryCode: watch("countryCode"),
    state: watch("state"),
    stateCode: watch("stateCode"),
    city: watch("city"),
    postalCode: watch("postalCode"),
    productCategory: watch("productCategory"),
  };

  // Function to handle place selection from Google Places Autocomplete
  const handlePlaceSelect = (placeData) => {
    if (!placeData) {
      // Clear all fields if place is cleared
      setAddressValue("");
      handleChange("addressLine1", "");
      handleChange("latitude", null);
      handleChange("longitude", null);
      return;
    }

    // Update address value
    setAddressValue(placeData.formattedAddress);

    // Update form fields
    handleChange("addressLine1", placeData.formattedAddress);
    handleChange("latitude", placeData.lat);
    handleChange("longitude", placeData.lng);

    // Prefill country, state, city if available
    if (placeData.countryCode) {
      // Store both country code and country name
      handleChange("countryCode", placeData.countryCode);
      handleChange("country", placeData.country);

      // Find the state ISO code from the state name
      if (placeData.state) {
        const statesList = State.getStatesOfCountry(placeData.countryCode);
        const matchedState = statesList?.find(
          (s) =>
            s.name.toLowerCase() === placeData.state.toLowerCase() ||
            s.isoCode.toLowerCase() === placeData.state.toLowerCase()
        );
        if (matchedState) {
          // Store both state code and state name
          handleChange("stateCode", matchedState.isoCode);
          handleChange("state", matchedState.name);
        }
      }
    }
    if (placeData.city) {
      handleChange("city", placeData.city);
    }
    if (placeData.postalCode) {
      handleChange("postalCode", placeData.postalCode);
    }
  };

  const handleNext = () => {
    if (isValid) {
      nextStep();
    }
  };

  // Dynamic states based on selected country
  const states = useMemo(() => {
    if (!form.countryCode) return [];

    try {
      const statesList = State.getStatesOfCountry(form.countryCode);

      if (!isEmpty(statesList)) {
        return statesList.map((state) => ({
          label: state.name,
          value: state.name,
          isoCode: state.isoCode,
        }));
      }
    } catch (error) {
      console.log("Error getting states:", error);
    }
    return [];
  }, [form.countryCode]);

  const stateValue = useMemo(
    () => states?.find((item) => item.value === form.state),
    [form.state, states]
  );

  // Dynamic cities based on selected country and state
  const cities = useMemo(() => {
    if (!form.countryCode || !form.stateCode) return [];

    // Lagos LGAs
    const lagosLGAs = [
      "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
      "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaaye",
      "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
      "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"
    ];

    // Lagos LCDAs
    const lagosLCDAs = [
      "Agboyi-Ketu", "Bariga", "Egbe-Idimu", "Ejigbo", "Igando-Ikotun",
      "Ikosi-Isheri", "Ipaja-Ayobo", "Isolo", "Itire-Ikate",
      "Iru-Victoria Island", "Lekki", "Odi-Olowo-Ojuwoye", "Ojodu", "Ojokoro",
      "Onigbongbo", "Orile-Agege", "Yaba", "Coker-Aguda", "Agbado-Oke-Odo",
      "Ayobo-Ipaja", "Ikosi-Ejinrin", "Eredo", "Ibeju", "Olorunda",
      "Badagry West", "Otto-Awori", "Oriade"
    ];

    try {
      // Get cities using country code and state ISO code
      const cityList = City.getCitiesOfState(form.countryCode, form.stateCode);
      let citiesArray = [];

      if (!isEmpty(cityList)) {
        citiesArray = cityList.map((city) => ({
          label: city.name,
          value: city.name,
        }));
      }

      // Add Lagos LGAs and LCDAs if country is Nigeria and state is Lagos
      if (form.countryCode === "NG" && form.stateCode === "LA") {
        // Combine LGAs and LCDAs
        const lagosAreas = [...lagosLGAs, ...lagosLCDAs];

        // Add Lagos areas to the list, avoiding duplicates
        lagosAreas.forEach((area) => {
          if (!citiesArray.find((city) => city.value === area)) {
            citiesArray.push({
              label: area,
              value: area,
            });
          }
        });

        // Sort alphabetically
        citiesArray.sort((a, b) => a.label.localeCompare(b.label));
      }

      return citiesArray;
    } catch (error) {
      console.log("Error getting cities:", error);
    }
    return [];
  }, [form.countryCode, form.stateCode]);

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

        <div className="flex flex-col">
          <label className="text-sm font-medium text-[#374151] mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <CustomGooglePlacesAutocomplete
            apiKey={process.env.REACT_APP_PUBLIC_GOOGLE_MAP_API_KEY}
            value={addressValue}
            onChange={(val) => setAddressValue(val)}
            onPlaceSelect={handlePlaceSelect}
            placeholder="Start typing your address..."
            error={
              errors.addressLine1?.message ||
              errors.latitude?.message ||
              errors.longitude?.message
            }
          />
        </div>

        <CountryListDropdown
          label="Country"
          placeholder="Select your country"
          onClick={(countryCode, countryName) => {
            handleChange("countryCode", countryCode);
            handleChange("country", countryName);
            // Reset state and city when country changes
            handleChange("state", "");
            handleChange("stateCode", "");
            handleChange("city", "");
            setAllowManualCity(false);
          }}
          value={form.countryCode}
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
            handleChange("stateCode", val?.isoCode);
            // Reset city when state changes
            handleChange("city", "");
            setAllowManualCity(false);
          }}
          value={stateValue}
          formError={errors.state}
          required
          fullWidth
          isDisabled={!form.countryCode || states.length === 0}
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
              isDisabled={!form.stateCode || cities.length === 0}
            />
            {cities.length === 0 && form.stateCode && (
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
