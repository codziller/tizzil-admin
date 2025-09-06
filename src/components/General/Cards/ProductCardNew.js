import React, { useState } from "react";
import PropTypes from "prop-types";
import useWindowDimensions from "hooks/useWindowDimensions";
import { ReactComponent as EditTiny } from "assets/icons/edit-tiny.svg";
import { ReactComponent as EyeTiny } from "assets/icons/eye-tiny.svg";

const ProductCard = ({
  product,
  hasMenu = false,
  hasDescription = false,
  isCollection = false,
  isCategory = false,
  onAddCategoryClick,
  onViewItemsClick,
  onClick,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { isMobile } = useWindowDimensions();

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleCardClick = () => {
    onClick?.(product);
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div
          className="w-full h-[220px] bg-[#EFF0EB] bg-cover bg-center rounded-lg"
          style={{
            backgroundImage: product.imageUrls?.[0]
              ? `url(${product.imageUrls[0]})`
              : "none",
          }}
        >
          {product.imageUrls?.[0] && (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        {hasMenu && (
          <div className="absolute top-2 right-2">
            <div
              className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleMenuClick}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 4a1 1 0 100-2 1 1 0 000 2zM8 9a1 1 0 100-2 1 1 0 000 2zM9 13a1 1 0 11-2 0 1 1 0 012 0z"
                  fill="#111111"
                />
              </svg>
            </div>

            {showMenu && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="absolute top-10 right-0 w-[200px] bg-white shadow-lg rounded-md border z-10"
              >
                {isCategory && (
                  <>
                    <div
                      className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center"
                      onClick={() => onAddCategoryClick?.(product)}
                    >
                      <EditTiny className="mr-2" />
                      <span className="text-sm">Add to category</span>
                    </div>
                    <div className="w-full h-px bg-gray-200" />
                    <div
                      className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center"
                      onClick={() => onViewItemsClick?.(product)}
                    >
                      <EyeTiny className="mr-2" />
                      <span className="text-sm">View items</span>
                    </div>
                  </>
                )}
                {!isCategory && (
                  <>
                    <div className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center">
                      <EditTiny className="mr-2" />
                      <span className="text-sm">Edit Product</span>
                    </div>
                    <div className="w-full h-px bg-gray-200" />
                    <div className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center">
                      <EyeTiny className="mr-2" />
                      <span className="text-sm">View Details</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="flex space-x-1 mr-1.5">
            {product.imageUrls?.slice(0, 4).map((url, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full bg-cover bg-center border border-gray-300"
                style={{ backgroundImage: `url(${url})` }}
              />
            ))}
          </div>
          <h3 className="text-base text-[#111827] font-bold">
            {product.name}
          </h3>
        </div>

        {hasDescription && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description || "No description available"}
          </p>
        )}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
  }).isRequired,
  hasMenu: PropTypes.bool,
  hasDescription: PropTypes.bool,
  isCollection: PropTypes.bool,
  isCategory: PropTypes.bool,
  onAddCategoryClick: PropTypes.func,
  onViewItemsClick: PropTypes.func,
  onClick: PropTypes.func,
};

export default ProductCard;