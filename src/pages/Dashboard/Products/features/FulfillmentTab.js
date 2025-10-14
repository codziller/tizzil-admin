import React from "react";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";

const FulfillmentTab = ({
  productData,
  handleInputChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Input
          placeholder="Weight"
          type="number"
          value={productData.weight}
          onChangeFunc={(val) =>
            handleInputChange("weight", parseFloat(val) || 0)
          }
        />
        <Select
          placeholder="Type"
          options={[
            { label: "grams", value: "grams" },
            { label: "milliliters", value: "milliliters" },
          ]}
          value={{
            label: productData.weightType,
            value: productData.weightType,
          }}
          onChange={(selected) =>
            handleInputChange("weightType", selected?.value || "grams")
          }
          className="w-32"
        />
      </div>

      <div className="mb-4">
        <label className="text-[14px] text-[#555555] block mb-2">
          Tags (comma separated)
        </label>
        <Input
          value={productData.tags.join(", ")}
          onChangeFunc={(val) => {
            // Split by comma to create tags array
            const tagsArray = val
              .split(",")
              .map((tag, index, array) => {
                // Only trim tags that are complete (not the last one being typed)
                // This allows the user to type spaces naturally
                if (index === array.length - 1) {
                  // For the last tag, only trim if there's a trailing comma
                  // Otherwise keep it as-is so user can type spaces
                  return tag;
                } else {
                  // For completed tags (followed by comma), trim whitespace
                  return tag.trim();
                }
              })
              .filter((tag, index, array) => {
                // Keep all tags except empty ones that aren't the last one being typed
                if (index === array.length - 1) {
                  // Always keep the last tag (even if empty) so input works naturally
                  return true;
                }
                return tag.trim().length > 0;
              });
            handleInputChange("tags", tagsArray);
          }}
          placeholder="Enter tags separated by commas"
          fullWidth
        />
      </div>

      <Select
        placeholder="Exchange Rate Sale Currency"
        options={[
          { label: "EUR", value: "EUR" },
          { label: "GBP", value: "GBP" },
          { label: "NGN", value: "NGN" },
          { label: "USD", value: "USD" },
        ]}
        value={
          productData.exchangeRateSaleCurrency
            ? {
                label: productData.exchangeRateSaleCurrency,
                value: productData.exchangeRateSaleCurrency,
              }
            : null
        }
        onChange={(selected) =>
          handleInputChange(
            "exchangeRateSaleCurrency",
            selected?.value || null
          )
        }
        fullWidth
      />
    </div>
  );
};

export default FulfillmentTab;