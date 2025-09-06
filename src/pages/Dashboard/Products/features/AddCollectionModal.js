import React, { useState } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import ImageSelection from "components/General/Input/ImageSelection";
import Select from "components/General/Input/Select";
import Input from "components/General/Input/Input";
import { Button } from "components/General/Button";

const AddCollectionModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Basics");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    collection: "",
    images: [],
    video: null,
    sizeGuide: null,
    stockQuantity: "",
    weight: "",
    weightType: "kg",
    returnPolicy: "",
    estimatedDelivery: "",
    careInstructions: "",
  });

  const tabs = ["Basics", "Media & deets", "Fulfillment"];

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const categoryOptions = [
    { label: "Clothing", value: "clothing" },
    { label: "Footwear", value: "footwear" },
    { label: "Accessories", value: "accessories" },
  ];

  const collectionOptions = [
    { label: "Summer Collection", value: "summer" },
    { label: "Winter Collection", value: "winter" },
    { label: "New Arrivals", value: "new-arrivals" },
  ];

  const returnPolicyOptions = [
    { label: "7 Days", value: "7days" },
    { label: "14 Days", value: "14days" },
    { label: "30 Days", value: "30days" },
  ];

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      isSideModal={true}
      title="CREATE A NEW COLLECTION"
      size="xl"
    >
      <div className="w-full h-full flex flex-col">
        <div className="py-6">
          <div className="gap-y-2">
            <Input
              placeholder="Collection Name"
              value={productData.name}
              onChangeFunc={(e) => handleInputChange("name", e.target.value)}
              fullWidth
            />

            <div className="mb-4">
              <label className="text-[14px] text-[#555555] block mb-2">
                Product description
              </label>
              <textarea
                value={productData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Write your description here (max 140 chars)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                maxLength={140}
              />
              <div className="text-xs text-gray-500 mt-1">
                {productData.description.length}/140 characters
              </div>
            </div>

            <ImageSelection
              label="Upload Banner (JPG, 1200x600px)"
              value={productData.sizeGuide}
              onChange={(file) => handleInputChange("sizeGuide", file)}
              accept="image/*"
              className="mb-4"
            />
            <Select
              placeholder="Choose Products"
              options={categoryOptions}
              value={productData.category}
              onChange={(selected) => handleInputChange("category", selected)}
              fullWidth
            />
          </div>
        </div>

        <div className="w-full flex gap-4 justify-end">
          <Button isOutline text="SAVE AS DRAFT" onClick={() => {}} />
          <Button text="PUBLISH COLLECTION" onClick={() => {}} />
        </div>
      </div>
    </Modal>
  );
};

export default AddCollectionModal;
