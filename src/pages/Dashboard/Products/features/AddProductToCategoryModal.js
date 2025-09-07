import React, { useState } from "react";
import Modal from "components/General/Modal/Modal/Modal";
import { Button } from "components/General/Button";
import classNames from "classnames";
import { sampleProducts } from "utils/sampleData";
import SearchBar from "components/General/Searchbar/SearchBar";
import ProductCard from "components/General/ProductCard";

const AddProductToCategoryModal = ({ isOpen, onClose, product }) => {
  const [searchInput, setSearchInput] = useState("");
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

  return (
    <Modal
      active={isOpen}
      toggler={onClose}
      isSideModal={true}
      title={`ADD PRODUCTS TO ${product?.name?.toUpperCase()}`}
      size="xl"
    >
      <div className="w-full h-full flex flex-col pb-6 gap-6">
        <SearchBar
          placeholder={"Search your existing products"}
          onChange={setSearchInput}
          value={searchInput}
          className="flex"
        />
        <div
          className={classNames(
            "grid gap-5 w-full",
            "grid-cols-1 sm:grid-cols-2"
          )}
        >
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => {}}
            />
          ))}
        </div>

        <div className="w-full flex gap-4 justify-end">
          <Button isOutline text="CANCEL" onClick={() => {}} />
          <Button text="ADD SELECTED TO CATEGORY" onClick={() => {}} />
        </div>
      </div>
    </Modal>
  );
};

export default AddProductToCategoryModal;
