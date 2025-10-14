import React from "react";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";

const BasicTab = ({
  productData,
  handleInputChange,
  categoryOptions,
  selectedCategories,
}) => {
  return (
    <div className="gap-y-2">
      <Input
        placeholder="Product Name"
        value={productData.name}
        onChangeFunc={(val) => handleInputChange("name", val)}
        fullWidth
      />

      <div className="mb-4">
        <label className="text-[14px] text-[#555555] block mb-2">
          Product description
        </label>
        <textarea
          value={productData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Write your description here (max 140 chars)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
          maxLength={140}
        />
        <div className="text-xs text-gray-500 mt-1">
          {productData.description.length}/140 characters
        </div>
      </div>

      <Select
        placeholder="Categories"
        options={categoryOptions}
        value={selectedCategories}
        onChange={(selected) => {
          const categoryIds = selected ? selected.map((cat) => cat.value) : [];
          handleInputChange("categoryIds", categoryIds);
        }}
        fullWidth
        isMulti
      />

      <div className="flex gap-3">
        <Input
          placeholder="Base Price"
          type="number"
          value={productData.basePrice}
          onChangeFunc={(val) =>
            handleInputChange("basePrice", parseFloat(val) || "")
          }
          prefix="USD"
        />
        <Input
          placeholder="Cost Price"
          type="number"
          value={productData.baseCostPrice}
          onChangeFunc={(val) =>
            handleInputChange("baseCostPrice", parseFloat(val) || 0)
          }
          prefix="USD"
        />
      </div>

      <Input
        placeholder="SKU"
        value={productData.baseSku}
        onChangeFunc={(val) => handleInputChange("baseSku", val)}
        fullWidth
      />
    </div>
  );
};

export default BasicTab;
