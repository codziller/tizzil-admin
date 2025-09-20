import React, { useState, useEffect } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import Select from "components/General/Input/Select";
import Input from "components/General/Input/Input";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import CategoriesStore from "../store";

const AddCategoryModal = ({ isOpen, onClose, category = null }) => {
  const { 
    categories, 
    headerNavs, 
    createCategory, 
    editCategory, 
    createCategoryLoading, 
    editCategoryLoading,
    getHeaderNavs 
  } = CategoriesStore;

  const [categoryData, setCategoryData] = useState({
    name: "",
    parentCategoryId: "",
    headerNavId: "",
  });

  const isEdit = !!category;

  useEffect(() => {
    if (isOpen) {
      getHeaderNavs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (category) {
      setCategoryData({
        name: category.name || "",
        parentCategoryId: category.parentCategoryId || "",
        headerNavId: category.headerNavId || "",
      });
    } else {
      setCategoryData({
        name: "",
        parentCategoryId: "",
        headerNavId: "",
      });
    }
  }, [category]);

  const handleInputChange = (field, value) => {
    setCategoryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!categoryData.name.trim()) {
      return;
    }

    const data = {
      name: categoryData.name,
      ...(isEdit && { id: category.id }),
      ...(categoryData.parentCategoryId && { parentCategoryId: categoryData.parentCategoryId }),
      ...(categoryData.headerNavId && { headerNavId: categoryData.headerNavId }),
    };

    const action = isEdit ? editCategory : createCategory;
    
    await action({
      data,
      onSuccess: () => {
        onClose();
        setCategoryData({
          name: "",
          parentCategoryId: "",
          headerNavId: "",
        });
      },
    });
  };

  const parentCategoryOptions = categories
    ?.filter(cat => !isEdit || cat.id !== category?.id)
    ?.map(cat => ({ label: cat.name, value: cat.id })) || [];

  const headerNavOptions = headerNavs?.map(nav => ({ label: nav.name, value: nav.id })) || [];

  const loading = createCategoryLoading || editCategoryLoading;

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      isSideModal={true}
      title={isEdit ? "EDIT CATEGORY" : "CREATE A NEW CATEGORY"}
      size="xl"
    >
      <div className="w-full h-full flex flex-col">
        <div className="py-6">
          <div className="gap-y-2">
            <Input
              placeholder="Category Name"
              value={categoryData.name}
              onChangeFunc={(e) => handleInputChange("name", e.target.value)}
              fullWidth
              label="Category Name"
              required
            />

            {isEdit && (
              <>
                <Select
                  placeholder="Choose Parent Category (Optional)"
                  options={parentCategoryOptions}
                  value={categoryData.parentCategoryId}
                  onChange={(selected) => handleInputChange("parentCategoryId", selected?.value || "")}
                  fullWidth
                  label="Parent Category"
                  isClearable
                />

                <Select
                  placeholder="Choose Header Nav (Optional)"
                  options={headerNavOptions}
                  value={categoryData.headerNavId}
                  onChange={(selected) => handleInputChange("headerNavId", selected?.value || "")}
                  fullWidth
                  label="Header Navigation"
                  isClearable
                />
              </>
            )}
          </div>
        </div>

        <div className="w-full flex gap-4 justify-end">
          <Button 
            isOutline 
            text="CANCEL" 
            onClick={onClose}
            disabled={loading}
          />
          <Button 
            text={isEdit ? "UPDATE CATEGORY" : "CREATE CATEGORY"} 
            onClick={handleSubmit}
            loading={loading}
            disabled={!categoryData.name.trim()}
          />
        </div>
      </div>
    </Modal>
  );
};

export default observer(AddCategoryModal);