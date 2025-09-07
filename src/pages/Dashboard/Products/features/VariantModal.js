import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/General/Button";
import Input from "components/General/Input/Input";
import { MdAdd, MdDelete } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const VariantModal = ({
  isOpen,
  onClose,
  variants,
  setVariants,
  currentVariant,
  setCurrentVariant,
  addOptionValueToVariant,
  removeOptionValueFromVariant,
  updateVariantOptionValue,
  saveCurrentVariant,
  addNewVariant,
}) => {
  const removeVariant = (indexToRemove) => {
    setVariants((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return {
    active: isOpen,
    title: "VARIANTS",
    size: "xl",
    toggler: onClose,
    footer: (
      <div className="flex gap-3">
        <Button text="CLOSE" onClick={onClose} isOutline />
        <Button
          text="ADD VARIANT"
          onClick={saveCurrentVariant}
          disabled={!currentVariant.name}
        />
      </div>
    ),
    children: (
      <div className="flex flex-col gap-6">
        {/* Created Variants Preview */}
        {variants.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Created Variants ({variants.length})
            </h4>
            <div className="space-y-2">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="relative p-3 bg-gray-50 rounded-lg border"
                >
                  <button
                    onClick={() => removeVariant(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete variant"
                  >
                    <FaTrash size={12} />
                  </button>
                  <div className="flex items-center justify-between pr-8">
                    <span className="font-medium">{variant.name}</span>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        Stock: {variant.initialStock}
                      </span>
                      {variant.sku && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {variant.sku}
                        </span>
                      )}
                    </div>
                  </div>
                  {variant.optionValues.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {variant.optionValues.map((optionValue, ovIndex) => (
                        <span
                          key={ovIndex}
                          className="text-xs px-2 py-1 bg-white rounded border"
                        >
                          {optionValue.optionName}: {optionValue.optionValue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Variant Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Add New Variant
            </h4>
            <Button
              text="Add Variant Section"
              onClick={addNewVariant}
              size="sm"
              outline
            />
          </div>

          <Input
            placeholder="Variant Name"
            value={currentVariant.name}
            onChangeFunc={(val) =>
              setCurrentVariant((prev) => ({
                ...prev,
                name: val,
              }))
            }
            fullWidth
          />

          <div className="flex gap-3">
            <Input
              placeholder="SKU (optional)"
              value={currentVariant.sku}
              onChangeFunc={(val) =>
                setCurrentVariant((prev) => ({
                  ...prev,
                  sku: val,
                }))
              }
            />
            <Input
              placeholder="Initial Stock"
              type="number"
              value={currentVariant.initialStock}
              onChangeFunc={(val) =>
                setCurrentVariant((prev) => ({
                  ...prev,
                  initialStock: parseInt(val) || "",
                }))
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Option Values
              </label>
              <Button
                text="Add Option Value"
                onClick={addOptionValueToVariant}
                size="sm"
                outline
                icon={<MdAdd />}
              />
            </div>

            <div className="space-y-2">
              {currentVariant.optionValues.map((optionValue, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                >
                  <Input
                    placeholder="Option Name"
                    value={optionValue.optionName}
                    onChangeFunc={(val) =>
                      updateVariantOptionValue(index, "optionName", val)
                    }
                  />
                  <Input
                    placeholder="Option Value"
                    value={optionValue.optionValue}
                    onChangeFunc={(val) =>
                      updateVariantOptionValue(index, "optionValue", val)
                    }
                  />
                  {currentVariant.optionValues.length > 1 && (
                    <button
                      onClick={() => removeOptionValueFromVariant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  };
};

VariantModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  variants: PropTypes.array.isRequired,
  setVariants: PropTypes.func.isRequired,
  currentVariant: PropTypes.object.isRequired,
  setCurrentVariant: PropTypes.func.isRequired,
  addOptionValueToVariant: PropTypes.func.isRequired,
  removeOptionValueFromVariant: PropTypes.func.isRequired,
  updateVariantOptionValue: PropTypes.func.isRequired,
  saveCurrentVariant: PropTypes.func.isRequired,
  addNewVariant: PropTypes.func.isRequired,
};

export default VariantModal;
