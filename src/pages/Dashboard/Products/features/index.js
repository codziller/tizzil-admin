import React, { useEffect, useMemo, useState } from "react";
import _, { isEmpty, isEqual } from "lodash";
import { useNavigate, useParams } from "react-router";
import PropTypes from "prop-types";
import CircleLoader from "components/General/CircleLoader/CircleLoader";

import { NAIRA, PRODUCT_MODAL_TYPES, pageCount } from "utils/appConstant";
import { ReactComponent as SearchBlackIcon } from "assets/icons/search-black.svg";
import { ReactComponent as FilterIcon } from "assets/icons/filter-icon.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-icon.svg";
import { ReactComponent as DividerIcon } from "assets/icons/divider-icon.svg";
import { ReactComponent as EmptyListIcon } from "assets/icons/empty-list-icon.svg";
import { ReactComponent as ChevronDown } from "assets/icons/Arrow/chevron-down.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import classNames from "classnames";
import { sampleProducts } from "utils/sampleData";
import Modal from "components/General/Modal/Modal/Modal";
import ImagePicker from "components/General/Input/ImagePicker";
import ImageSelection from "components/General/Input/ImageSelection";
import Select from "components/General/Input/Select";
import Input from "components/General/Input/Input";

const ProductCard = ({ product, hasMenu = false, hasDescription = false, isCollection = false, isCategory = false, onAddCategoryClick, onViewItemsClick, onClick }) => {
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
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <div className="relative">
        <div 
          className="w-full h-[220px] bg-[#EFF0EB] bg-cover bg-center"
          style={{
            backgroundImage: product.imageUrls?.[0] ? `url(${product.imageUrls[0]})` : 'none'
          }}
        >
          {product.imageUrls?.[0] && (
            <img 
              src={product.imageUrls[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
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
                <path d="M8 4a1 1 0 100-2 1 1 0 000 2zM8 9a1 1 0 100-2 1 1 0 000 2zM9 13a1 1 0 11-2 0 1 1 0 012 0z" fill="#111111"/>
              </svg>
            </div>
            
            {showMenu && (
              <div className="absolute top-10 right-0 w-[200px] bg-white shadow-lg rounded-md border z-10">
                {isCategory && (
                  <>
                    <div className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center" onClick={() => onAddCategoryClick?.(product)}>
                      <svg width="16" height="16" className="mr-2" fill="#111111" viewBox="0 0 16 16">
                        <path d="M8 4a1 1 0 100-2 1 1 0 000 2zM8 9a1 1 0 100-2 1 1 0 000 2z"/>
                      </svg>
                      <span className="text-sm">Add to category</span>
                    </div>
                    <div className="px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer flex items-center" onClick={() => onViewItemsClick?.(product)}>
                      <svg width="16" height="16" className="mr-2" fill="#111111" viewBox="0 0 16 16">
                        <path d="M8 4a1 1 0 100-2 1 1 0 000 2z"/>
                      </svg>
                      <span className="text-sm">View my items</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-2" style={{ background: '#FBF0DC03', backdropFilter: 'blur(4px)' }}>
        <h3 className="text-[#690007] text-[15px] font-semibold uppercase truncate">
          {product.name}
        </h3>
        
        <div className="mt-1.5">
          {hasDescription ? (
            <p className="text-[#777777] text-sm line-clamp-2">
              {product.productDescription}
            </p>
          ) : (
            <p className="text-[#690007] text-sm font-medium">
              {product.salePrice}
            </p>
          )}
        </div>
        
        {(isCollection || isCategory) && (
          <div className="mt-3.5 flex justify-between items-center text-sm">
            <div>
              <span className="text-[#777777]">Status: </span>
              <span className="text-[#690007]">Live</span>
            </div>
            <div>
              {isCollection ? (
                <>
                  <span className="text-[#777777]">Products: </span>
                  <span className="text-[#690007]">{product.numberOfProducts || 10}</span>
                </>
              ) : (
                <>
                  <span className="text-[#777777]">You: </span>
                  <span className="text-[#690007]">{product.numberOfProducts || 10}</span>
                </>
              )}
            </div>
          </div>
        )}
        
        {isCategory && (
          <div className="mt-2">
            <p className="text-sm">
              <span className="text-[#777777]"># of Live Products: </span>
              <span className="text-[#690007]">{product.numberOfProducts || 230}</span>
            </p>
            <div className="flex mt-2">
              {[1,2,3,4].map((_, index) => (
                <div 
                  key={index}
                  className="w-[22px] h-[22px] rounded-full bg-gray-200 border border-white -ml-2.5 first:ml-0"
                  style={{
                    backgroundImage: product.imageUrls?.[0] ? `url(${product.imageUrls[0]})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  
  const handleApply = () => {
    onApply({ fromDate, toDate, category, status });
    onClose();
  };
  
  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setCategory('');
    setStatus('');
  };
  
  return (
    <Modal active={isOpen} toggler={onClose}>
      <div className="w-full max-w-md mx-auto bg-white rounded-lg p-4">
        <h3 className="text-[#111827] text-base font-bold mb-6">Filter</h3>
        
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">Date created</span>
              <button className="text-[#690007] text-sm font-bold">Reset</button>
            </div>
            <div className="flex gap-2">
              <input 
                type="date" 
                placeholder="From"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input 
                type="date" 
                placeholder="To"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">Category</span>
              <button className="text-[#690007] text-sm font-bold">Reset</button>
            </div>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select category</option>
              <option value="clothing">Clothing</option>
              <option value="footwear">Footwear</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#111827] text-sm font-bold">Status</span>
              <button className="text-[#690007] text-sm font-bold">Reset</button>
            </div>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between gap-5 mt-9">
          <Button 
            text="Reset all"
            isOutline
            onClick={handleReset}
            className="flex-1"
          />
          <Button 
            text="Apply filters"
            onClick={handleApply}
            className="flex-1"
          />
        </div>
      </div>
    </Modal>
  );
};

const NewProductModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Basics');
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    collection: '',
    images: [],
    video: null,
    sizeGuide: null,
    stockQuantity: '',
    weight: '',
    weightType: 'kg',
    returnPolicy: '',
    estimatedDelivery: '',
    careInstructions: ''
  });
  
  const tabs = ['Basics', 'Media & deets', 'Fulfillment'];
  
  const handleInputChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };
  
  const categoryOptions = [
    { label: 'Clothing', value: 'clothing' },
    { label: 'Footwear', value: 'footwear' },
    { label: 'Accessories', value: 'accessories' }
  ];
  
  const collectionOptions = [
    { label: 'Summer Collection', value: 'summer' },
    { label: 'Winter Collection', value: 'winter' },
    { label: 'New Arrivals', value: 'new-arrivals' }
  ];
  
  const returnPolicyOptions = [
    { label: '7 Days', value: '7days' },
    { label: '14 Days', value: '14days' },
    { label: '30 Days', value: '30days' }
  ];
  
  return (
    <Modal active={isOpen} toggler={onClose} isSideModal={true}>
      <div className="w-full h-full flex flex-col">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-black uppercase mb-4">New Product</h2>
          
          {/* Tabs */}
          <div className="bg-[#EEEEEE] p-1 rounded-lg flex h-11">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={classNames(
                  "flex-1 px-4 py-2 rounded text-xs uppercase font-medium transition-all",
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
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Basics Tab */}
          {activeTab === 'Basics' && (
            <div className="space-y-6">
              <Input
                label="Product Name"
                value={productData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                fullWidth
              />
              
              <div>
                <label className="text-[14px] text-[#555555] block mb-2">Product description</label>
                <textarea
                  value={productData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Write your description here (max 140 chars)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                  maxLength={140}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {productData.description.length}/140 characters
                </div>
              </div>
              
              <Select
                label="Category"
                options={categoryOptions}
                value={productData.category}
                onChange={(selected) => handleInputChange('category', selected)}
                fullWidth
              />
              
              <Select
                label="Collection"
                options={collectionOptions}
                value={productData.collection}
                onChange={(selected) => handleInputChange('collection', selected)}
                fullWidth
              />
            </div>
          )}
          
          {/* Media & deets Tab */}
          {activeTab === 'Media & deets' && (
            <div className="space-y-6">
              <div>
                <label className="text-[14px] text-[#555555] block mb-2">Please upload at least 2, max 6</label>
                <div className="border-2 border-dashed border-[#D0D5DD] rounded-lg p-8 text-center">
                  <div className="mb-2">
                    <span className="text-[16px] text-[#0D0D12] font-bold">Click to upload </span>
                    <span className="text-[16px] text-[#667085]">or drag and drop</span>
                  </div>
                  <p className="text-[14px] text-[#667085]">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              </div>
              
              <ImageSelection
                label="Add Video (optional) (MP4 or link)"
                value={productData.video}
                onChange={(file) => handleInputChange('video', file)}
                accept="video/*"
              />
              
              <ImageSelection
                label="Upload Size Guide (optional)"
                value={productData.sizeGuide}
                onChange={(file) => handleInputChange('sizeGuide', file)}
                accept="image/*"
              />
              
              <Input
                label="Stock quantity"
                type="number"
                value={productData.stockQuantity}
                onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                fullWidth
              />
            </div>
          )}
          
          {/* Fulfillment Tab */}
          {activeTab === 'Fulfillment' && (
            <div className="space-y-6">
              <div className="flex gap-3">
                <Input
                  label="Weight"
                  type="number"
                  value={productData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="flex-1"
                />
                <Select
                  label="Type"
                  options={[
                    { label: 'kg', value: 'kg' },
                    { label: 'g', value: 'g' },
                    { label: 'lb', value: 'lb' }
                  ]}
                  value={productData.weightType}
                  onChange={(selected) => handleInputChange('weightType', selected)}
                  className="w-24"
                />
              </div>
              
              <Select
                label="Return policy"
                options={returnPolicyOptions}
                value={productData.returnPolicy}
                onChange={(selected) => handleInputChange('returnPolicy', selected)}
                fullWidth
              />
              
              <Input
                label="Estimated Delivery time"
                type="date"
                value={productData.estimatedDelivery}
                onChange={(e) => handleInputChange('estimatedDelivery', e.target.value)}
                fullWidth
              />
              
              <div>
                <label className="text-[14px] text-[#555555] block mb-2">Care instructions</label>
                <textarea
                  value={productData.careInstructions}
                  onChange={(e) => handleInputChange('careInstructions', e.target.value)}
                  placeholder="Enter care instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-6">
          <Button
            text={activeTab === 'Fulfillment' ? 'Create Product' : 'Continue'}
            onClick={activeTab === 'Fulfillment' ? onClose : handleNext}
            fullWidth
          />
        </div>
      </div>
    </Modal>
  );
};

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  if (!product) return null;
  
  const images = product.imageUrls || [];
  const reviewCount = 3; // Sample review count
  
  return (
    <Modal active={isOpen} toggler={onClose} isSideModal={true}>
      <div className="w-full h-full flex flex-col">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-black uppercase mb-4">Preview</h2>
          
          {/* Product Status */}
          <div className="mb-2">
            <span className={classNames(
              "text-xs px-2 py-1 rounded",
              {
                "bg-green-100 text-[#22C55E]": product.status === 'Active',
                "bg-gray-100 text-gray-600": product.status !== 'Active'
              }
            )}>
              {product.status || 'Active'}
            </span>
          </div>
          
          {/* Product Info */}
          <h3 className="text-[22px] text-[#111111] font-bold mb-2">{product.name}</h3>
          <div className="flex items-center gap-5 mb-4">
            <span className="text-[14px] text-[#444444]">Item {product.code}</span>
            <div className="flex items-center gap-2">
              <div className="flex text-[#690007]">
                {'★'.repeat(5)}
              </div>
              <span className="text-[14px] text-[#6D7280]">({reviewCount})</span>
            </div>
          </div>
          
          <p className="text-[17px] text-[#111827] font-bold mb-5">{product.salePrice}</p>
          
          {/* Order Notification */}
          <div className="flex items-center justify-between p-4 border-t border-b border-[#690007] mb-5">
            <div className="flex items-center gap-5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15h-2v-2h2v2zm0-4h-2V6h2v5z" fill="#F59E0B"/>
              </svg>
              <div>
                <span className="text-[14px] text-gray-700 font-medium">3 Orders </span>
                <span className="text-[14px] text-gray-500">to fulfil</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Image Gallery */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-[350px] object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-3">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={classNames(
                    "w-[60px] h-[60px] object-cover rounded-lg cursor-pointer",
                    {
                      "border-3 border-[#690007]": activeImageIndex === index,
                      "border border-gray-200": activeImageIndex !== index
                    }
                  )}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Delivery Info */}
          <div className="border-t border-b border-[#E5E7EB] py-5 mb-5">
            <div className="flex items-center gap-5 mb-5">
              <span className="text-[14px] text-[#111827] font-bold">Delivery:</span>
              <span className="text-[12px] text-[#22C55E] bg-green-100 px-2 py-1 rounded">Confident</span>
            </div>
            <p className="text-[14px] text-[#4B5563]">Between 1 to 2 days</p>
          </div>
          
          {/* Product Details */}
          <div className="mb-5">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">Product details:</h4>
            <p className="text-[14px] text-[#4B5563]">{product.productDescription}</p>
          </div>
          
          {/* Features */}
          <div className="mb-8">
            <h4 className="text-[14px] text-[#111827] font-bold mb-4">Features:</h4>
            <p className="text-[14px] text-[#4B5563]">{product.productfeatures}</p>
          </div>
        </div>
        
        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between gap-3">
            <Button
              text="Delete product"
              isOutline
              onClick={() => setShowDeleteModal(true)}
              className="flex-1"
            />
            <Button
              text="Move to drafts"
              isOutline
              className="flex-1"
            />
            <Button
              text="Edit product"
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal active={showDeleteModal} toggler={() => setShowDeleteModal(false)}>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold mb-4">Delete Product</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button
              text="Cancel"
              isOutline
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            />
            <Button
              text="Delete"
              onClick={() => {
                setShowDeleteModal(false);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>
      </Modal>
    </Modal>
  );
};
const ProductsPage = ({
  isModal,
  handleProductSelect,
  isSelected,
  modalDetails,
}) => {
  const navigate = useNavigate();
  const { warehouse_id } = useParams();
  const {
    getProducts,
    products,
    productsCount,
    loading
  } = ProductsStore;
  
  const { width, isMobile } = useWindowDimensions();
  const [displayProducts, setDisplayProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(0);
  const [activeProductTab, setActiveProductTab] = useState('All Products');
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const productTabs = ['All Products', 'Drafts', 'Most Purchased', 'Jorts'];

  useEffect(() => {
    // Initialize with sample data or fetch real data
    if (isEmpty(products)) {
      setDisplayProducts(sampleProducts);
    } else {
      setDisplayProducts(products);
    }
  }, [products]);
  
  const handleProductTabClick = (tab) => {
    setActiveProductTab(tab);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For now, just use sample data for all tabs
      setDisplayProducts(sampleProducts);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      setSearchQuery('');
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterApply = (filters) => {
    setAppliedFilters(Object.values(filters).filter(Boolean).length);
  };
  
  const handleProductCardClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetailsModal(true);
  };

  return (
    <>
      <div className={classNames("h-full w-full", { "md:pr-4": !isModal })}>
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5 mt-5">
          {/* Title Section */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#111111]">
                Products
              </h1>
              <span className="text-[14px] text-[#6D7280]">
                {displayProducts.length} TOTAL
              </span>
            </div>
            
            {!isEmpty(displayProducts) && (
              <div className="flex items-center gap-5">
                {/* Search Section */}
                <div className="flex items-center gap-2">
                  {searchExpanded ? (
                    <div className="flex items-center gap-2 transition-all duration-300">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
                        autoFocus
                      />
                      <button
                        onClick={handleSearchToggle}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12 4L4 12M4 4l8 8" stroke="#111111" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      {!isMobile && (
                        <span className="text-[14px] text-[#111111]">Search</span>
                      )}
                      <button
                        onClick={handleSearchToggle}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <SearchBlackIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                
                <DividerIcon />
                
                {/* Filters Section */}
                <div className="flex items-center gap-2">
                  {!isMobile && (
                    <span className="text-[14px] text-[#111111]">
                      Filters {appliedFilters > 0 && `(${appliedFilters})`}
                    </span>
                  )}
                  <button
                    onClick={() => setFilterModalOpen(true)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FilterIcon 
                      className={classNames("w-4 h-4", {
                        "fill-[#690007]": appliedFilters > 0,
                        "fill-[#111111]": appliedFilters === 0
                      })} 
                    />
                  </button>
                </div>
                
                <DividerIcon />
                
                {/* Add Product Button */}
                <div className="flex items-center gap-2">
                  {!isMobile && (
                    <span className="text-[12px] text-[#111111] uppercase">
                      Add a product
                    </span>
                  )}
                  <button
                    onClick={() => setShowNewProductModal(true)}
                    className="w-7 h-7 bg-[#690007] rounded-full flex items-center justify-center hover:bg-[#5a0006] transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Product Tabs */}
          {!isEmpty(displayProducts) && (
            <div className="flex gap-5">
              {productTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleProductTabClick(tab)}
                  className={classNames(
                    "text-[14px] transition-colors",
                    {
                      "text-[#690007]": activeProductTab === tab,
                      "text-[#AAAAAA]": activeProductTab !== tab,
                    }
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
          
          {/* Content Section */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <CircleLoader blue />
            </div>
          ) : isEmpty(displayProducts) ? (
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <EmptyListIcon className="mb-8" />
              <h3 className="text-[16px] text-[#000000] font-medium mb-2">
                Nothing to see here
              </h3>
              <p className="text-[16px] text-[#777777] mb-8">
                products
              </p>
              <Button
                text="ADD A PRODUCT"
                onClick={() => setShowNewProductModal(true)}
              />
            </div>
          ) : (
            <div className={classNames(
              "grid gap-5 w-full",
              "grid-cols-1 sm:grid-cols-3 lg:grid-cols-4"
            )}>
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  hasMenu={true}
                  onClick={handleProductCardClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
      />
      
      <NewProductModal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
      />
      
      <ProductDetailsModal
        isOpen={showProductDetailsModal}
        onClose={() => setShowProductDetailsModal(false)}
        product={selectedProduct}
      />
    </>
  );
};

ProductsPage.propTypes = {
  handleProductSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.func,
  modalDetails: PropTypes.object,
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
};

FilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

NewProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ProductDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
};

export default observer(ProductsPage);
