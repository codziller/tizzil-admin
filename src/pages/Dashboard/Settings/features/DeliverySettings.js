import React, { useState } from "react";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import Button from "components/General/Button/Button";
import { ReactComponent as TrashIcon } from "assets/icons/trash.svg";
import { ReactComponent as PlusIcon } from "assets/icons/add-circle.svg";

const DeliverySettings = () => {
  const [localDelivery, setLocalDelivery] = useState({
    deliveryName: "Local Delivery",
    countryFields: [
      {
        id: 1,
        country: { value: "nigeria", label: "Nigeria" },
        deliveryFee: "500",
      },
    ],
  });

  const [internationalDelivery, setInternationalDelivery] = useState({
    deliveryName: "International Delivery",
    countryFields: [
      {
        id: 1,
        countries: [
          { value: "usa", label: "United States" },
          { value: "uk", label: "United Kingdom" },
        ],
        deliveryFee: "2500",
      },
    ],
  });

  const countryOptions = [
    { value: "nigeria", label: "Nigeria" },
    { value: "usa", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "canada", label: "Canada" },
    { value: "australia", label: "Australia" },
    { value: "germany", label: "Germany" },
    { value: "france", label: "France" },
    { value: "spain", label: "Spain" },
    { value: "italy", label: "Italy" },
    { value: "brazil", label: "Brazil" },
    { value: "japan", label: "Japan" },
    { value: "south_korea", label: "South Korea" },
    { value: "india", label: "India" },
    { value: "china", label: "China" },
    { value: "south_africa", label: "South Africa" },
    { value: "ghana", label: "Ghana" },
    { value: "kenya", label: "Kenya" },
  ];

  const handleInputChange = (value, meta, section, fieldId = null) => {
    if (section === "local") {
      if (fieldId) {
        setLocalDelivery((prev) => ({
          ...prev,
          countryFields: prev.countryFields.map((field) =>
            field.id === fieldId ? { ...field, [meta.name]: value } : field
          ),
        }));
      } else {
        setLocalDelivery((prev) => ({
          ...prev,
          [meta.name]: value,
        }));
      }
    } else if (section === "international") {
      if (fieldId) {
        setInternationalDelivery((prev) => ({
          ...prev,
          countryFields: prev.countryFields.map((field) =>
            field.id === fieldId ? { ...field, [meta.name]: value } : field
          ),
        }));
      } else {
        setInternationalDelivery((prev) => ({
          ...prev,
          [meta.name]: value,
        }));
      }
    }
  };

  const handleCountrySelectChange = (
    selectedOption,
    meta,
    section,
    fieldId
  ) => {
    if (section === "local") {
      setLocalDelivery((prev) => ({
        ...prev,
        countryFields: prev.countryFields.map((field) =>
          field.id === fieldId
            ? { ...field, [meta.name]: selectedOption }
            : field
        ),
      }));
    } else if (section === "international") {
      setInternationalDelivery((prev) => ({
        ...prev,
        countryFields: prev.countryFields.map((field) =>
          field.id === fieldId
            ? { ...field, [meta.name]: selectedOption }
            : field
        ),
      }));
    }
  };

  const addCountryField = (section) => {
    if (section === "international") {
      const newId =
        Math.max(...internationalDelivery.countryFields.map((f) => f.id)) + 1;
      setInternationalDelivery((prev) => ({
        ...prev,
        countryFields: [
          ...prev.countryFields,
          {
            id: newId,
            countries: [],
            deliveryFee: "",
          },
        ],
      }));
    }
  };

  const removeCountryField = (section, fieldId) => {
    if (section === "international") {
      setInternationalDelivery((prev) => ({
        ...prev,
        countryFields: prev.countryFields.filter(
          (field) => field.id !== fieldId
        ),
      }));
    }
  };

  const removeSelectedCountry = (section, fieldId, countryToRemove) => {
    if (section === "international") {
      setInternationalDelivery((prev) => ({
        ...prev,
        countryFields: prev.countryFields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                countries: field.countries.filter(
                  (country) => country.value !== countryToRemove.value
                ),
              }
            : field
        ),
      }));
    }
  };

  const handleSave = () => {
    console.log("Saving delivery settings:", {
      localDelivery,
      internationalDelivery,
    });
    // Handle save logic here
  };

  const handleCancel = () => {
    console.log("Cancelling delivery changes");
    // Handle cancel logic here
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-10">
        <h2
          style={{
            fontSize: "17px",
            fontWeight: "bold",
            color: "#050505",
            marginBottom: "6px",
          }}
        >
          Delivery
        </h2>
        <p style={{ fontSize: "14px", color: "#666666" }}>
          Customize & setup your delivery terms for customers
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: "40px" }}>
        {/* Local Deliveries Section */}
        <div className="mb-8">
          <Input
            label="Delivery name"
            name="deliveryName"
            value={localDelivery.deliveryName}
            onChangeFunc={(value, meta) =>
              handleInputChange(value, meta, "local")
            }
            placeholder="Enter delivery name"
            fullWidth
          />

          <div style={{ marginTop: "12px" }}>
            {localDelivery.countryFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col md:flex-row gap-5 items-start mb-4"
              >
                <div className="flex-1">
                  <Select
                    name="country"
                    options={countryOptions}
                    value={field.country}
                    onChange={(selected, meta) =>
                      handleCountrySelectChange(
                        selected,
                        meta,
                        "local",
                        field.id
                      )
                    }
                    placeholder="Select country"
                    fullWidth
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="deliveryFee"
                    type="number"
                    value={field.deliveryFee}
                    onChangeFunc={(value, meta) =>
                      handleInputChange(value, meta, "local", field.id)
                    }
                    placeholder="Set Delivery Fee"
                    prefix="₦"
                    fullWidth
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International Deliveries Section */}
        <div className="mb-8">
          <Input
            label="Delivery name"
            name="deliveryName"
            value={internationalDelivery.deliveryName}
            onChangeFunc={(value, meta) =>
              handleInputChange(value, meta, "international")
            }
            placeholder="Enter delivery name"
            fullWidth
          />

          <div style={{ marginTop: "12px" }}>
            {internationalDelivery.countryFields.map((field, index) => (
              <div key={field.id} className="mb-6">
                <div className="flex flex-col md:flex-row gap-5 items-start mb-4">
                  <div className="flex-1">
                    <Select
                      name="countries"
                      options={countryOptions}
                      value={field.countries}
                      onChange={(selected, meta) =>
                        handleCountrySelectChange(
                          selected,
                          meta,
                          "international",
                          field.id
                        )
                      }
                      placeholder="Select countries"
                      isMulti
                      fullWidth
                    />

                    {/* Selected Countries Display */}
                    {field.countries && field.countries.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.countries.map((country, countryIndex) => (
                          <div
                            key={countryIndex}
                            className="flex items-center gap-1 px-2 py-1 bg-[#690007] text-white text-sm rounded"
                          >
                            <span>{country.label}</span>
                            <button
                              onClick={() =>
                                removeSelectedCountry(
                                  "international",
                                  field.id,
                                  country
                                )
                              }
                              className="ml-1 hover:bg-red-700 rounded"
                            >
                              <TrashIcon
                                className="w-3 h-3"
                                style={{ filter: "invert(1)" }}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <Input
                      name="deliveryFee"
                      type="number"
                      value={field.deliveryFee}
                      onChangeFunc={(value, meta) =>
                        handleInputChange(
                          value,
                          meta,
                          "international",
                          field.id
                        )
                      }
                      placeholder="Set Delivery Fee"
                      prefix="₦"
                      fullWidth
                    />
                  </div>

                  {/* Delete Button - only show if more than 1 field */}
                  {internationalDelivery.countryFields.length > 1 && (
                    <div
                      className="w-9 h-9 flex items-center justify-center border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        boxShadow:
                          "0px 4px 8px -2px #1018281A, 0px 2px 4px -2px #1018280F",
                        borderRadius: "6px",
                      }}
                      onClick={() =>
                        removeCountryField("international", field.id)
                      }
                    >
                      <TrashIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Country Button */}
            <button
              onClick={() => addCountryField("international")}
              className="flex items-center gap-2 text-[#2F78EE] hover:text-blue-700 transition-colors text-sm"
              style={{ fontSize: "15px", marginTop: "32px" }}
            >
              <PlusIcon
                className="w-4 h-4"
                style={{
                  filter:
                    "invert(27%) sepia(51%) saturate(2878%) hue-rotate(206deg) brightness(97%) contrast(97%)",
                }}
              />
              Add Country
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 mt-9">
          <Button
            text="Cancel"
            isOutline
            onClick={handleCancel}
            textClass="text-sm font-medium"
            className="px-6 py-2"
          />
          <Button
            text="Save"
            onClick={handleSave}
            textClass="text-sm font-medium"
            className="px-6 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliverySettings;
