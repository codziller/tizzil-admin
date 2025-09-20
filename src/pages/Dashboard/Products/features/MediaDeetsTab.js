import React from "react";
import ImagePicker from "components/General/Input/ImagePicker";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";

const MediaDeetsTab = ({
  productData,
  handleInputChange,
  isUploadingImages,
  getAllImages,
  handleImageDrop,
  handleImageRemove,
  ribbonOptions,
}) => {
  return (
    <div className="flex flex-col justify-start gap-y-6">
      <ImagePicker
        label={
          isUploadingImages
            ? "Uploading images..."
            : `Please upload at least 2, max 6 (${
                getAllImages().length
              } selected)`
        }
        handleDrop={handleImageDrop}
        images={getAllImages()}
        setImages={() => {}} // Not used in this new approach
        removeImage={handleImageRemove}
        multiple
        disabled={isUploadingImages}
      />

      <Input
        placeholder="Initial Stock"
        type="number"
        value={productData.initialStock}
        onChangeFunc={(val) =>
          handleInputChange("initialStock", parseInt(val) || 0)
        }
        fullWidth
      />

      <div className="mb-4">
        <label className="text-[14px] text-[#555555] block mb-2">
          Meta Title
        </label>
        <Input
          value={productData.metaTitle}
          onChangeFunc={(val) => handleInputChange("metaTitle", val)}
          placeholder="Enter meta title"
          fullWidth
        />
      </div>

      <div className="mb-4">
        <label className="text-[14px] text-[#555555] block mb-2">
          Meta Description
        </label>
        <textarea
          value={productData.metaDescription}
          onChange={(e) =>
            handleInputChange("metaDescription", e.target.value)
          }
          placeholder="Enter meta description"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
        />
      </div>

      <div className="mb-4">
        <label className="text-[14px] text-[#555555] block mb-2">
          How to Use
        </label>
        <textarea
          value={productData.howToUse}
          onChange={(e) =>
            handleInputChange("howToUse", e.target.value)
          }
          placeholder="Enter usage instructions"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
        />
      </div>

      <div className="mb-4">
        <label className="text-[14px] text-[#555555] block mb-2">
          Product Ingredients
        </label>
        <textarea
          value={productData.productIngredients}
          onChange={(e) =>
            handleInputChange("productIngredients", e.target.value)
          }
          placeholder="Enter product ingredients"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
        />
      </div>

      <Select
        placeholder="Ribbon"
        options={ribbonOptions}
        value={ribbonOptions.find(
          (option) => option.value === productData.ribbon
        )}
        onChange={(selected) =>
          handleInputChange("ribbon", selected?.value || null)
        }
        fullWidth
      />

      <Input
        placeholder="Low Stock Alert Quantity"
        type="number"
        value={productData.lowInQuantityValue}
        onChangeFunc={(val) =>
          handleInputChange("lowInQuantityValue", val)
        }
        fullWidth
      />

      <div className="flex items-center gap-3 mt-4">
        <input
          type="checkbox"
          id="isPrivate"
          checked={productData.isPrivate}
          onChange={(e) =>
            handleInputChange("isPrivate", e.target.checked)
          }
          className="w-4 h-4 text-[#690007] border-gray-300 rounded focus:ring-[#690007]"
        />
        <label htmlFor="isPrivate" className="text-sm text-gray-700">
          Make this product private
        </label>
      </div>
    </div>
  );
};

export default MediaDeetsTab;