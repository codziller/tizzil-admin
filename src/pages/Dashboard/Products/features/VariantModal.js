import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/General/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
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
  options = [],
  editingVariantIndex,
  setEditingVariantIndex,
}) => {
  const removeVariant = (indexToRemove) => {
    setVariants((prev) => prev.filter((_, index) => index !== indexToRemove));
    // If we're editing this variant, clear the edit state
    if (editingVariantIndex === indexToRemove) {
      setEditingVariantIndex(null);
      setCurrentVariant({
        name: "",
        sku: "",
        initialStock: 0,
        optionValues: [{ optionName: "", optionValue: "" }],
      });
    }
  };

  const handleEditVariant = (index) => {
    const variantToEdit = variants[index];
    setCurrentVariant(variantToEdit);
    setEditingVariantIndex(index);
  };

  const handleUpdateVariant = () => {
    if (!currentVariant.name || editingVariantIndex === null) return;

    setVariants((prev) =>
      prev.map((variant, index) =>
        index === editingVariantIndex ? currentVariant : variant
      )
    );
    setEditingVariantIndex(null);
    setCurrentVariant({
      name: "",
      sku: "",
      initialStock: 0,
      optionValues: [{ optionName: "", optionValue: "" }],
    });
  };

  const handleCancelEdit = () => {
    setEditingVariantIndex(null);
    setCurrentVariant({
      name: "",
      sku: "",
      initialStock: 0,
      optionValues: [{ optionName: "", optionValue: "" }],
    });
  };

  // Create option name dropdown options
  const optionNameOptions = options.map((option) => ({
    label: option.name,
    value: option.name,
  }));

  // Get option values for a selected option name
  const getOptionValuesForOption = (optionName) => {
    const selectedOption = options.find((opt) => opt.name === optionName);
    if (!selectedOption || !selectedOption.values) return [];

    return selectedOption.values.map((val) => ({
      label: val.displayValue || val.value,
      value: val.value,
    }));
  };

  return {
    active: isOpen,
    title: "VARIANTS",
    size: "xl",
    toggler: onClose,
    footer: (
      <div className="flex gap-3">
        <Button text="CLOSE" onClick={onClose} isOutline />
        {editingVariantIndex !== null ? (
          <>
            <Button text="CANCEL" onClick={handleCancelEdit} isOutline />
            <Button
              text="UPDATE VARIANT"
              onClick={handleUpdateVariant}
              isDisabled={!currentVariant.name}
            />
          </>
        ) : (
          <Button
            text="ADD VARIANT"
            onClick={saveCurrentVariant}
            isDisabled={!currentVariant.name}
          />
        )}
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
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleEditVariant(index)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit variant"
                    >
                      <MdEdit size={14} />
                    </button>
                    <button
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete variant"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pr-16">
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
              {editingVariantIndex !== null ? "Edit Variant" : "Add New Variant"}
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
                  initialStock: parseInt(val) || 0,
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
              {currentVariant.optionValues.map((optionValue, index) => {
                const optionValueOptions = getOptionValuesForOption(
                  optionValue.optionName
                );

                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                  >
                    <Select
                      placeholder="Select Option Name"
                      options={optionNameOptions}
                      value={
                        optionValue.optionName
                          ? {
                              label: optionValue.optionName,
                              value: optionValue.optionName,
                            }
                          : null
                      }
                      onChange={(selected) => {
                        updateVariantOptionValue(
                          index,
                          "optionName",
                          selected?.value || ""
                        );
                        // Clear option value when option name changes
                        updateVariantOptionValue(index, "optionValue", "");
                      }}
                      fullWidth
                    />
                    <Select
                      placeholder="Select Option Value"
                      options={optionValueOptions}
                      value={
                        optionValue.optionValue
                          ? {
                              label:
                                optionValueOptions.find(
                                  (opt) => opt.value === optionValue.optionValue
                                )?.label || optionValue.optionValue,
                              value: optionValue.optionValue,
                            }
                          : null
                      }
                      onChange={(selected) =>
                        updateVariantOptionValue(
                          index,
                          "optionValue",
                          selected?.value || ""
                        )
                      }
                      fullWidth
                      isDisabled={!optionValue.optionName}
                    />
                    {currentVariant.optionValues.length > 1 && (
                      <button
                        onClick={() => removeOptionValueFromVariant(index)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <MdDelete />
                      </button>
                    )}
                  </div>
                );
              })}
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
  options: PropTypes.array,
  editingVariantIndex: PropTypes.number,
  setEditingVariantIndex: PropTypes.func.isRequired,
};

export default VariantModal;
