import React, { useState } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import ImagePicker from "components/General/Input/ImagePicker";
import ImageSelection from "components/General/Input/ImageSelection";
import Select from "components/General/Input/Select";
import Input from "components/General/Input/Input";
import { Button } from "components/General/Button";
import classNames from "classnames";

const AddProductModal = ({ isOpen, onClose }) => {
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
      title="NEW PRODUCT"
      size="xl"
    >
      <div className="w-full h-full flex flex-col">
        <div className="border-b border-gray-200">
          {/* Tabs */}
          <div className="bg-[#EEEEEE] p-1 flex h-11">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={classNames(
                  "flex-1 px-4 py-2 text-xs uppercase font-medium transition-all",
                  {
                    "bg-white text-[#690007] shadow-md": activeTab === tab,
                    "text-[#050505]": activeTab !== tab,
                  }
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6">
          {/* Basics Tab */}
          {activeTab === "Basics" && (
            <div className="gap-y-2">
              <Input
                placeholder="Product Name"
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

              <Select
                placeholder="Category"
                options={categoryOptions}
                value={productData.category}
                onChange={(selected) => handleInputChange("category", selected)}
                fullWidth
              />

              <Select
                placeholder="Collection"
                options={collectionOptions}
                value={productData.collection}
                onChange={(selected) =>
                  handleInputChange("collection", selected)
                }
                fullWidth
              />
            </div>
          )}

          {/* Media & deets Tab */}
          {activeTab === "Media & deets" && (
            <div className="flex flex-col justify-start gap-y-6">
              <ImagePicker
                label="Please upload at least 2, max 6"
                handleDrop={(val) => {}}
                images={[]}
                setImages={(imgs) => {}}
                removeImage={(file) => {}}
                isDisabled
                multiple
              />

              <ImageSelection
                label="Add Video (optional) (MP4 or link)"
                value={productData.video}
                onChange={(file) => handleInputChange("video", file)}
                accept="video/*"
              />

              <ImageSelection
                label="Upload Size Guide (optional)"
                value={productData.sizeGuide}
                onChange={(file) => handleInputChange("sizeGuide", file)}
                accept="image/*"
              />

              <Input
                placeholder="Stock quantity"
                // type="number"
                value={productData.stockQuantity}
                onChangeFunc={(e) =>
                  handleInputChange("stockQuantity", e.target.value)
                }
                fullWidth
              />
            </div>
          )}

          {/* Fulfillment Tab */}
          {activeTab === "Fulfillment" && (
            <div className="gap-y-2">
              <div className="flex gap-3">
                <Input
                  placeholder="Weight"
                  value={productData.weight}
                  onChangeFunc={(e) =>
                    handleInputChange("weight", e.target.value)
                  }
                  className="flex-1"
                />
                <Select
                  placeholder="Type"
                  options={[
                    { label: "kg", value: "kg" },
                    { label: "g", value: "g" },
                    { label: "lb", value: "lb" },
                  ]}
                  value={productData.weightType}
                  onChange={(selected) =>
                    handleInputChange("weightType", selected)
                  }
                  className="w-24"
                />
              </div>

              <Select
                placeholder="Return policy"
                options={returnPolicyOptions}
                value={productData.returnPolicy}
                onChange={(selected) =>
                  handleInputChange("returnPolicy", selected)
                }
                fullWidth
              />

              <Input
                placeholder="Estimated Delivery time"
                type="date"
                value={productData.estimatedDelivery}
                onChangeFunc={(e) =>
                  handleInputChange("estimatedDelivery", e.target.value)
                }
                fullWidth
              />

              <div>
                <label className="text-[14px] text-[#555555] block mb-2">
                  Care instructions
                </label>
                <textarea
                  value={productData.careInstructions}
                  onChange={(e) =>
                    handleInputChange("careInstructions", e.target.value)
                  }
                  placeholder="Enter care instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex justify-end">
          <Button
            text={activeTab === "Fulfillment" ? "CREATE PRODUCT" : "CONTINUE"}
            onClick={activeTab === "Fulfillment" ? onClose : handleNext}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddProductModal;
