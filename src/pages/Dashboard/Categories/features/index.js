import React, { useEffect, useState } from "react";

import moment from "moment";
import _, { isEmpty } from "lodash";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount } from "utils/appConstant";
import { ReactComponent as Plus } from "assets/icons/add.svg";

import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import CategoriesStore from "../store";
import { flattenArrayToString } from "utils/functions";
import Tabs from "components/General/Tabs";
import HeaderNavs from "./HeaderNavs";
import HeaderNavsHidden from "./HeaderNavsHidden";

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
const TABS = [
  { name: "categories", label: "Categories" },
  { name: "headerNavs", label: "Header Navs" },
  { name: "headerNavsHidden", label: "Hidden Header Navs" },
];
const CategoriesPage = () => {
  const { categories, getCategories, loading } = CategoriesStore;

  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS[0]?.name);
  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    setSearchResults(categories);
  }, [categories]);

  const handleSearch = (value) => {
    const query = value?.toLowerCase();
    setSearchQuery(query);

    const filteredResults = categories?.filter(({ name }) =>
      name?.toLowerCase()?.includes(query)
    );

    setSearchResults(filteredResults);
  };

  const handleEdit = (row) => {
    setCurrentTxnDetails({ ...row, modalType: "edit" });
  };
  const columns = [
    {
      name: "Category Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Subcategories",
      minWidth: isMobile ? "35%" : "40%",
      selector: (row) => (
        <div onClick={() => handleEdit(row)}>
          {flattenArrayToString(row.subCategories)}
        </div>
      ),
      sortable: false,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.createdAt).format("MMM Do, YYYY"),
      sortable: true,
    },

    {
      name: "Actions",
      minWidth: isMobile ? "50%" : "20%",
      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          <span
            onClick={() => handleEdit(row)}
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white "
          >
            Edit
          </span>

          <span
            onClick={() =>
              setCurrentTxnDetails({ ...row, modalType: "delete" })
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

  useEffect(() => scrollToTop(), [categories]);

  const searchResultsEmpty =
    searchQuery && isEmpty(searchResults) && !isEmpty(categories);

  return (
    <>
      <div className="h-full md:pr-4">
        <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === TABS[0].name && (
          <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
            <div className="flex justify-between items-center w-full mb-3 gap-1">
              <div className="w-full sm:w-[45%] sm:min-w-[300px]">
                <SearchBar
                  placeholder={"Search for a category"}
                  onChange={handleSearch}
                  value={searchQuery}
                  className="flex"
                />
              </div>
              <Button
                text="Add Category"
                icon={<Plus className="stroke-current" />}
                className="hidden md:block"
                onClick={() =>
                  setCurrentTxnDetails({ modalType: "add", isAdd: true })
                }
              />
            </div>

            {loading ? (
              <CircleLoader blue />
            ) : (
              <>
                <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                  {searchResults?.length > 0 ? (
                    <Table
                      data={searchResults}
                      columns={width >= 640 ? columns : columns.slice(0, 2)}
                      onRowClicked={(row) => handleEdit(row)}
                      pointerOnHover
                      isLoading={loading}
                      pageCount={categories?.length / pageCount}
                      onPageChange={(page) => setCurrentPage(page)}
                      currentPage={currentPage}
                      tableClassName="txn-section-table"
                      noPadding
                    />
                  ) : (
                    <>
                      <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                        {searchResultsEmpty ? (
                          <span>No results found for "{searchQuery}"</span>
                        ) : (
                          <span>
                            There are no categories for this warehouse
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === TABS[1].name && <HeaderNavs />}
        {activeTab === TABS[2].name && <HeaderNavsHidden />}
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
    </>
  );
};

export default observer(CategoriesPage);
