import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Modal from "components/General/Modal/Modal/Modal";
import Select from "components/General/Input/Select";
import Input from "components/General/Input/Input";
import { Button } from "components/General/Button";
import CategoriesStore from "../../Categories/store";

const AddCategoryModal = observer(({ isOpen, onClose, category = null }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    parentCategoryId: "",
    headerNavId: "",
  });

  const isEditMode = !!category;

  useEffect(() => {
    if (isEditMode && category) {
      setCategoryData({
        name: category.name || "",
        parentCategoryId: category.parentCategoryId || "",
        headerNavId: category.headerNavId || "",
        position: category.position || "-1",
      });
    } else {
      setCategoryData({
        name: "",
        parentCategoryId: "",
        headerNavId: "",
        position: "",
      });
    }
  }, [category, isEditMode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      CategoriesStore.getCategories();
      CategoriesStore.getHeaderNavs();
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setCategoryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!categoryData.name.trim()) return;

    const data = {
      name: categoryData.name,
      position: "-1",
      ...(isEditMode && { id: category.id }),
      ...(categoryData.parentCategoryId && {
        parentCategoryId: categoryData.parentCategoryId,
      }),
      ...(categoryData.headerNavId && {
        headerNavId: categoryData.headerNavId,
      }),
    };

    const onSuccess = () => {
      setCategoryData({ name: "", parentCategoryId: "", headerNavId: "" });
      onClose();
    };

    if (isEditMode) {
      CategoriesStore.editCategory({ data, onSuccess });
    } else {
      CategoriesStore.createCategory({ data, onSuccess });
    }
  };

  const parentCategoryOptions = CategoriesStore.categories
    .filter((cat) => (isEditMode ? cat.id !== category.id : true))
    .map((cat) => ({
      label: cat.name,
      value: cat.id,
    }));

  const headerNavOptions = CategoriesStore.headerNavs.map((nav) => ({
    label: nav.name,
    value: nav.id,
  }));

  const isFormValid = categoryData.name.trim();
  const isLoading =
    CategoriesStore.createCategoryLoading ||
    CategoriesStore.editCategoryLoading;

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      isSideModal={true}
      title={isEditMode ? "EDIT CATEGORY" : "ADD A CATEGORY"}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            isOutline
            text="CANCEL"
            onClick={onClose}
            isDisabled={isLoading}
          />
          <Button
            text={isEditMode ? "UPDATE CATEGORY" : "ADD CATEGORY"}
            onClick={handleSubmit}
            isDisabled={!isFormValid || isLoading}
            isLoading={isLoading}
          />
        </div>
      }
    >
      <div className="w-full h-full flex flex-col">
        <div className="py-6">
          <div className="gap-y-4 space-y-4">
            <Input
              placeholder="Category Name"
              value={categoryData.name}
              onChangeFunc={(val) => handleInputChange("name", val)}
              fullWidth
              label="Category Name"
              required
            />

            {isEditMode && (
              <>
                <Select
                  placeholder="Parent Category (Optional)"
                  options={parentCategoryOptions}
                  value={
                    parentCategoryOptions.find(
                      (option) => option.value === categoryData.parentCategoryId
                    ) || null
                  }
                  onChange={(selected) =>
                    handleInputChange("parentCategoryId", selected?.value || "")
                  }
                  fullWidth
                  label="Parent Category"
                  isClearable
                />

                <Select
                  placeholder="Header Nav (Optional)"
                  options={headerNavOptions}
                  value={
                    headerNavOptions.find(
                      (option) => option.value === categoryData.headerNavId
                    ) || null
                  }
                  onChange={(selected) =>
                    handleInputChange("headerNavId", selected?.value || "")
                  }
                  fullWidth
                  label="Header Navigation"
                  isClearable
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default AddCategoryModal;
