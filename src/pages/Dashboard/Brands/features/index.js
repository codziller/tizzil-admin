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
      navigate(`/dashboard/brands/view/${warehouse_id}/${row?.id}`);
    }
  };

  const columns = [
    {
      name: "Brand Name",
      minWidth: isModal ? "60%" : "30%",
      selector: (row) => (
        <div
          onClick={() => handleView(row)}
          className="flex justify-start items-center gap-2"
        >
          {isModal && (
            <div className="min-w-[25px]">
              <CheckBox
                checked={isSelected(isObjectOnChange ? row : row?.id)}
                square={!!modalDetails?.isMultipleBrands}
              />
            </div>
          )}
          {(row?.logoUrl && (
            <img
              className="object-cover w-[60px] py-2 px-2 rounded-full bg-grey-border"
              src={row?.logoUrl}
              alt={row?.brandName}
            />
          )) ||
            "NA"}
          <span>{row?.brandName}</span>
        </div>
      ),
      sortable: true,
    },

    {
      name: "Category",
      selector: (row) => row?.category?.name,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.order_date).format("MMM Do, YYYY"),
      sortable: true,
    },

    {
      name: "Actions",
      minWidth: isMobile ? "50%" : "20%",
      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          {userIsGeneralAdmin ? (
            <span
              onClick={() => handleView(row)}
              className=" cursor-pointer px-4 py-1 rounded-full bg-white text-[11px] text-black border-[1px] border-grey-bordercolor"
            >
              View
            </span>
          ) : null}

          <span
            onClick={() => handleEdit(row)}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
          </span>
          <span
            onClick={() =>
              setCurrentTxnDetails({ ...row, currentPage, modalType: "delete" })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-red-deep text-[11px] text-white "
          >
            Delete
          </span>
        </div>
      ),
      sortable: true,
    },
  ];

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
                {brands?.length > 0 ? (
                  <Table
                    data={displayedItems}
                    columns={
                      isModal
                        ? columns.slice(0, 2)
                        : width >= 640
                        ? columns
                        : columns.slice(0, 2)
                    }
                    onRowClicked={(e) => handleView(e)}
                    pointerOnHover
                    isLoading={loading}
                    pageCount={brandsCount / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
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
