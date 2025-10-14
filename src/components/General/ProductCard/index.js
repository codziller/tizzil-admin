import React, { useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as EditTiny } from "assets/icons/edit-tiny.svg";
import { ReactComponent as EyeTiny } from "assets/icons/eye-tiny.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import Checkbox from "components/General/Checkbox";
import { formatCurrency } from "utils/formatter";

const ProductCard = ({
  product,
  hasMenu = false,
  hasDescription = false,
  isCollection = false,
  isCategory = false,
  onAddCategoryClick,
  onViewItemsClick,
  onClick,
  menuOptions = [], // New prop for dynamic menu options
  isSelect = false, // New prop for selectable mode
  selected = false, // New prop for selected state
  onSelectionChange, // New prop for selection change callback
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { isMobile } = useWindowDimensions();

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleCardClick = () => {
    if (isSelect) {
      // In select mode, clicking the card toggles selection
      onSelectionChange?.(!selected);
    } else {
      // Normal mode, call onClick
      onClick?.(product);
    }
  };
  const cardImage = product?.imageUrls?.[0] || product?.imageUrl || "";
  return (
    <div
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div
          className="w-full h-[220px] bg-[#EFF0EB] bg-cover bg-center"
          style={{
            backgroundImage: cardImage ? `url(${cardImage})` : "none",
          }}
        >
          {cardImage && (
            <img
              src={cardImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {(hasMenu || isSelect) && (
          <div className="absolute top-2 right-2">
            {/* menu box or checkbox */}
            <div
              className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={isSelect ? (e) => {
                e.stopPropagation();
                onSelectionChange?.(!selected);
              } : handleMenuClick}
            >
              {isSelect ? (
                <Checkbox
                  checked={selected}
                  onChange={onSelectionChange}
                  size="sm"
                />
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 4a1 1 0 100-2 1 1 0 000 2zM8 9a1 1 0 100-2 1 1 0 000 2zM9 13a1 1 0 11-2 0 1 1 0 012 0z"
                    fill="#111111"
                  />
                </svg>
              )}
            </div>

            {showMenu && !isSelect && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="absolute top-10 right-0 w-[200px] bg-white shadow-lg rounded-md border z-10"
              >
                {/* Dynamic menu options */}
                {menuOptions.length > 0
                  ? menuOptions.map((option, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center"
                        onClick={() => {
                          setShowMenu(false);
                          option.onClick?.(product);
                        }}
                      >
                        {option.icon && <option.icon className="mr-2" />}
                        <span className="text-sm">{option.label}</span>
                      </div>
                    ))
                  : /* Fallback for category-specific menu */
                    isCategory && (
                      <>
                        <div
                          className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center"
                          onClick={() => {
                            setShowMenu(false);
                            onAddCategoryClick?.(product);
                          }}
                        >
                          <EditTiny className="mr-2" />
                          <span className="text-sm">Add to category</span>
                        </div>
                        <div
                          className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center"
                          onClick={() => {
                            setShowMenu(false);
                            onViewItemsClick?.(product);
                          }}
                        >
                          <EditTiny className="mr-2" />
                          <span className="text-sm">Edit category</span>
                        </div>
                      </>
                    )}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="p-2"
        style={{ background: "#FBF0DC03", backdropFilter: "blur(4px)" }}
      >
        <div className="w-full flex justify-between items-center">
          <h3 className="text-[#690007] text-[14px] font-semibold uppercase truncate">
            {product.name}
          </h3>
          {/* product images */}
          {isCategory && (
            <div className="flex ml-2">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="w-[18px] h-[18px] rounded-full bg-gray-200 border border-white -ml-2.5 first:ml-0"
                  style={{
                    backgroundImage: product.imageUrls?.[0]
                      ? `url(${product.imageUrls[0]})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-1.5">
          {hasDescription ? (
            <p className="text-[#777777] text-sm line-clamp-2">
              {product.productDescription}
            </p>
          ) : (
            <p className="text-[#690007] text-sm font-medium">
              {formatCurrency(product.basePrice || product.salePrice)}
            </p>
          )}
        </div>

        {(isCollection || isCategory) && (
          <div className="mt-3.5 flex justify-between items-center text-sm">
            <div>
              <span className="text-[#777777]">Status: </span>
              <span className="text-[#690007]">
                {product.isActive ? "Live" : "Draft"}
              </span>
            </div>
            <div>
              {isCollection ? (
                <>
                  <span className="text-[#777777]">Products: </span>
                  <span className="text-[#690007]">
                    {product.numberOfProducts || 10}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#777777]">Stock: </span>
                  <span className="text-[#690007]">
                    {product.currentStock || product.quantity || 0}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {isCategory && (
          <div className="mt-2">
            <p className="text-sm">
              <span className="text-[#777777]"># of Live Products: </span>
              <span className="text-[#690007]">
                {product.numberOfProducts || 230}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  hasMenu: PropTypes.bool,
  hasDescription: PropTypes.bool,
  isCollection: PropTypes.bool,
  isCategory: PropTypes.bool,
  onAddCategoryClick: PropTypes.func,
  onViewItemsClick: PropTypes.func,
  onClick: PropTypes.func,
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
  isSelect: PropTypes.bool,
  selected: PropTypes.bool,
  onSelectionChange: PropTypes.func,
};

export default ProductCard;
