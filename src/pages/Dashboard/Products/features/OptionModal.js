import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/General/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { HexColorPicker } from "react-colorful";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdAdd, MdDelete, MdDragIndicator, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const OptionModal = ({
  isOpen,
  onClose,
  options,
  setOptions,
  currentOption,
  setCurrentOption,
  addOptionValue,
  removeOptionValue,
  updateOptionValue,
  onOptionDragEnd,
  saveCurrentOption,
  editingOptionIndex,
  setEditingOptionIndex,
}) => {
  const removeOption = (indexToRemove) => {
    setOptions((prev) => prev.filter((_, index) => index !== indexToRemove));
    // If we're editing this option, clear the edit state
    if (editingOptionIndex === indexToRemove) {
      setEditingOptionIndex(null);
      setCurrentOption({
        name: "",
        type: "TEXT",
        values: [{ value: "", displayValue: "", colorHex: "" }],
      });
    }
  };

  const handleEditOption = (index) => {
    const optionToEdit = options[index];
    setCurrentOption(optionToEdit);
    setEditingOptionIndex(index);
  };

  const handleUpdateOption = () => {
    if (
      !currentOption.name ||
      currentOption.values.some((v) => !v.value) ||
      editingOptionIndex === null
    )
      return;

    setOptions((prev) =>
      prev.map((option, index) =>
        index === editingOptionIndex ? currentOption : option
      )
    );
    setEditingOptionIndex(null);
    setCurrentOption({
      name: "",
      type: "TEXT",
      values: [{ value: "", displayValue: "", colorHex: "" }],
    });
  };

  const handleCancelEdit = () => {
    setEditingOptionIndex(null);
    setCurrentOption({
      name: "",
      type: "TEXT",
      values: [{ value: "", displayValue: "", colorHex: "" }],
    });
  };

  return {
    active: isOpen,
    title: "OPTIONS",
    size: "xl",
    toggler: onClose,
    footer: (
      <div className="flex gap-3">
        <Button text="CLOSE" onClick={onClose} isOutline />
        {editingOptionIndex !== null ? (
          <>
            <Button text="CANCEL" onClick={handleCancelEdit} isOutline />
            <Button
              text="UPDATE OPTION"
              onClick={handleUpdateOption}
              isDisabled={
                !currentOption.name ||
                currentOption.values.some((v) => !v.value)
              }
            />
          </>
        ) : (
          <Button
            text="ADD OPTION"
            onClick={saveCurrentOption}
            isDisabled={
              !currentOption.name || currentOption.values.some((v) => !v.value)
            }
          />
        )}
      </div>
    ),
    children: (
      <div className="flex flex-col gap-6">
        {/* Created Options Preview */}
        {options.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Created Options ({options.length})
            </h4>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="relative p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleEditOption(index)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit option"
                    >
                      <MdEdit size={14} />
                    </button>
                    <button
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete option"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pr-16">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {option.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {option.values.map((value, vIndex) => (
                      <div
                        key={vIndex}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-white rounded border"
                      >
                        {value.colorHex && (
                          <div
                            className="w-3 h-3 rounded-full border"
                            style={{
                              backgroundColor: value.colorHex,
                            }}
                          />
                        )}
                        {value.displayValue || value.value}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Option Form */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">
            {editingOptionIndex !== null ? "Edit Option" : "Add New Option"}
          </h4>

          <div className="flex gap-3">
            <Input
              placeholder="Option Name (e.g., Color, Size)"
              value={currentOption.name}
              onChangeFunc={(val) =>
                setCurrentOption((prev) => ({
                  ...prev,
                  name: val,
                }))
              }
            />
            <Select
              placeholder="Type"
              value={{
                label: currentOption.type,
                value: currentOption.type,
              }}
              onChange={(selected) =>
                setCurrentOption((prev) => ({
                  ...prev,
                  type: selected.value,
                }))
              }
              options={[
                { label: "TEXT", value: "TEXT" },
                { label: "COLOR", value: "COLOR" },
              ]}
              className="w-32"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Option Values
              </label>
              <Button
                text="Add Value"
                onClick={addOptionValue}
                size="sm"
                outline
                icon={<MdAdd />}
              />
            </div>

            <DragDropContext onDragEnd={onOptionDragEnd}>
              <Droppable droppableId="option-values">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {currentOption.values.map((value, index) => (
                      <Draggable
                        key={`value-${index}`}
                        draggableId={`value-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-400 cursor-move"
                            >
                              <MdDragIndicator />
                            </div>

                            <Input
                              placeholder="Value"
                              value={value.value}
                              onChangeFunc={(val) =>
                                updateOptionValue(index, "value", val)
                              }
                            />

                            {currentOption.type === "COLOR" && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded border cursor-pointer"
                                  style={{
                                    backgroundColor:
                                      value.colorHex || "#ffffff",
                                  }}
                                />
                                <HexColorPicker
                                  color={value.colorHex || "#ffffff"}
                                  onChange={(color) =>
                                    updateOptionValue(index, "colorHex", color)
                                  }
                                  style={{
                                    width: "150px",
                                    height: "100px",
                                  }}
                                />
                              </div>
                            )}

                            {currentOption.values.length > 1 && (
                              <button
                                onClick={() => removeOptionValue(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <MdDelete />
                              </button>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    ),
  };
};

OptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  setOptions: PropTypes.func.isRequired,
  currentOption: PropTypes.object.isRequired,
  setCurrentOption: PropTypes.func.isRequired,
  addOptionValue: PropTypes.func.isRequired,
  removeOptionValue: PropTypes.func.isRequired,
  updateOptionValue: PropTypes.func.isRequired,
  onOptionDragEnd: PropTypes.func.isRequired,
  saveCurrentOption: PropTypes.func.isRequired,
  editingOptionIndex: PropTypes.number,
  setEditingOptionIndex: PropTypes.func.isRequired,
};

export default OptionModal;
