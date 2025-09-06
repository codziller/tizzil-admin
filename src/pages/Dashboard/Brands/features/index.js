import React, { useEffect, useMemo, useState } from "react";

import moment from "moment";
import _, { isEmpty, lowerCase } from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";

import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import CheckBox from "components/General/Input/CheckBox";
import BrandsStore from "../store";
import TransactionDetailsModal from "./DetailsModal";
import BrandDetailModal from "components/General/BrandDetailModal";
import { convertToJs } from "utils/functions";
import AuthStore from "pages/OnBoarding/SignIn/store";
const pageCount = 500;
export const dateFilters = [
  {
    value: "today",
    label: "Today",
    start_date: dateConstants?.today,
    end_date: dateConstants?.today,
  },
  {
    value: "this_week",
    label: "This Week",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
  {
    value: "all_time",
    label: "All Time",
    start_date: dateConstants?.firstDay,
    end_date: dateConstants?.today,
  },
];
const BrandsPage = ({
  isModal,
  handleBrandSelect,
  modalDetails,
  isSelected,
}) => {
  const navigate = useNavigate();
  const { brands, getBrands, loading, brandsCount } = BrandsStore;
  const { userIsGeneralAdmin } = AuthStore;
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [displayedItems, setDisplayedItems] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const isObjectOnChange = modalDetails?.isObjectOnChange;
  useEffect(() => {
    getBrands({ data: { page: currentPage } });
  }, [currentPage]);

  const { warehouse_id } = useParams();
  const searchQuery = useMemo(() => {
    return searchInput?.trim();
  }, [searchInput]);

  useEffect(() => {
    if (!brands) return;
    setDisplayedItems(brands);
  }, [brands]);

  useEffect(() => {
    if (!searchQuery) {
      setDisplayedItems(brands);
      return;
    }
    const searchResult = convertToJs(brands)?.filter((item) =>
      lowerCase(item?.brandName).includes(searchQuery.toLowerCase())
    );
    setDisplayedItems(searchResult);
  }, [searchQuery]);

  const handleEdit = (row) => {
    if (isModal) {
      handleBrandSelect?.(row);
      return;
    }
    setCurrentTxnDetails({ ...row, currentPage, modalType: "edit" });
  };

  const handleView = (row) => {
    if (isModal) {
      handleBrandSelect?.(row);
      return;
    }
    if (userIsGeneralAdmin) {
      setSelectedBrand(row);
      setShowBrandModal(true);
    }
  };

  const handleTabChange = (tab, index) => {
    setActiveTab(index);
  };

  const columns = [
    {
      name: "Brand Logo",
      className: "flex-[0.5]",
      selector: (row) => (
        <img
          className="object-cover w-[45px] h-[45px] rounded-lg"
          src={row?.logoUrl || "https://via.placeholder.com/45x45"}
          alt={row?.brandName}
        />
      ),
      sortable: false,
    },
    {
      name: "Brand Name",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">{row?.brandName}</span>
      ),
      sortable: true,
    },
    {
      name: "No. of orders",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">{row?.totalOrders || 0}</span>
      ),
      sortable: true,
    },
    {
      name: "Revenue",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">₦{(row?.totalRevenue || 0).toLocaleString()}</span>
      ),
      sortable: true,
    },
    {
      name: "Wallet Balance",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#666666]">₦{(row?.walletBalance || 0).toLocaleString()}</span>
      ),
      sortable: true,
    },
    {
      name: "Product Category",
      className: "flex-[1]",
      selector: (row) => (
        <span className="text-[14px] text-[#690007] uppercase font-medium">{row?.productCategory || "N/A"}</span>
      ),
      sortable: true,
    },
    {
      name: "AOV",
      className: "flex-[1]",
      selector: (row) => {
        const aov = row?.totalOrders > 0 ? row?.totalRevenue / row?.totalOrders : 0;
        return (
          <span className="text-[14px] text-[#666666]">₦{aov.toLocaleString()}</span>
        );
      },
      sortable: true,
    },
    {
      name: "",
      className: "flex-[0.5]",
      selector: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5.83333C10.4583 5.83333 10.8333 5.45833 10.8333 5C10.8333 4.54167 10.4583 4.16667 10 4.16667C9.54167 4.16667 9.16667 4.54167 9.16667 5C9.16667 5.45833 9.54167 5.83333 10 5.83333ZM10 10.8333C10.4583 10.8333 10.8333 10.4583 10.8333 10C10.8333 9.54167 10.4583 9.16667 10 9.16667C9.54167 9.16667 9.16667 9.54167 9.16667 10C9.16667 10.4583 9.54167 10.8333 10 10.8333ZM10 15.8333C10.4583 15.8333 10.8333 15.4583 10.8333 15C10.8333 14.5417 10.4583 14.1667 10 14.1667C9.54167 14.1667 9.16667 14.5417 9.16667 15C9.16667 15.4583 9.54167 15.8333 10 15.8333Z" fill="#666666"/>
          </svg>
        </div>
      ),
      sortable: false,
    },
  ];

  // Sample data to work with
  const sampleBrands = [
    {
      id: 1,
      brandName: "Nike Store",
      logoUrl: "https://logo.clearbit.com/nike.com",
      status: "APPROVED",
      email: "nike@brand.com",
      yearsInBusiness: 5,
      totalOrders: 150,
      totalRevenue: 2500000,
      walletBalance: 450000,
      productCategory: "Fashion",
      address: "123 Fashion St, Lagos",
      country: "Nigeria",
      brandBio: "Leading fashion brand in Nigeria",
      instagram: "@nike",
      tiktok: "@nike",
      website: "https://nike.com",
      shopifyStoreUrl: "https://nike.shopify.com",
      imageUrls: ["https://via.placeholder.com/400x200"]
    },
    {
      id: 2,
      brandName: "Adidas Official",
      logoUrl: "https://logo.clearbit.com/adidas.com",
      status: "UNDER_REVIEW",
      email: "adidas@brand.com",
      yearsInBusiness: 3,
      totalOrders: 89,
      totalRevenue: 1200000,
      walletBalance: 150000,
      productCategory: "Sports",
      address: "456 Sport Ave, Abuja",
      country: "Nigeria",
      brandBio: "Innovative sports brand",
      instagram: "@adidas",
      tiktok: "@adidas",
      website: "https://adidas.com",
      shopifyStoreUrl: "https://adidas.shopify.com",
      imageUrls: ["https://via.placeholder.com/400x200"]
    },
    {
      id: 3,
      brandName: "Puma",
      logoUrl: "https://logo.clearbit.com/puma.com",
      status: "APPROVED",
      email: "puma@brand.com",
      yearsInBusiness: 7,
      totalOrders: 200,
      totalRevenue: 3500000,
      walletBalance: 800000,
      productCategory: "Sports",
      address: "789 Athletic Blvd, Port Harcourt",
      country: "Nigeria",
      brandBio: "Premium athletic wear",
      instagram: "@puma",
      tiktok: "@puma",
      website: "https://puma.com",
      shopifyStoreUrl: "https://puma.shopify.com",
      imageUrls: ["https://via.placeholder.com/400x200"]
    }
  ];

  const allBrands = brands?.length > 0 ? brands : sampleBrands;

  const getApprovedBrandsCount = () => {
    return allBrands.filter(brand => brand.status === "APPROVED").length;
  };

  const getPendingBrandsCount = () => {
    return allBrands.filter(brand => brand.status === "UNDER_REVIEW").length;
  };

  const getFilteredBrands = () => {
    let filteredBrands = allBrands;
    
    // Filter by tab
    if (activeTab === 0) {
      filteredBrands = filteredBrands.filter(brand => brand.status === "APPROVED");
    } else if (activeTab === 1) {
      filteredBrands = filteredBrands.filter(brand => brand.status === "UNDER_REVIEW");
    }

    // Filter by search
    if (searchInput) {
      filteredBrands = filteredBrands.filter(brand => 
        brand.brandName.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    return filteredBrands;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [brands]);

  return (
    <>
      <div className="h-full w-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search for a brand"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div>

            {!isModal && (
              <Button
                text="Add Brand"
                icon={<Plus className="stroke-current" />}
                className="hidden md:block"
                onClick={() =>
                  setCurrentTxnDetails({ modalType: "add", isAdd: true })
                }
              />
            )}
          </div>

          {loading && isEmpty(brands) ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {allBrands?.length > 0 ? (
                  <Table
                    data={getFilteredBrands()}
                    columns={columns}
                    onRowClicked={(e) => handleView(e)}
                    pointerOnHover
                    isLoading={loading}
                    pageCount={brandsCount / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                    useEnhancedTable={true}
                    titleTabs={[
                      { title: "Approved Brands", itemCount: getApprovedBrandsCount() },
                      { title: "Pending Brands", itemCount: getPendingBrandsCount() }
                    ]}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>There are no brands for this warehouse </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
      
      <BrandDetailModal
        active={showBrandModal}
        brand={selectedBrand}
        toggler={() => {
          setShowBrandModal(false);
          setSelectedBrand(null);
        }}
      />
    </>
  );
};
BrandsPage.propTypes = {
  handleBrandSelect: PropTypes.func,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
  modalDetails: PropTypes.object,
};
export default observer(BrandsPage);
