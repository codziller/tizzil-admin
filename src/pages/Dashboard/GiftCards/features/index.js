import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import qs from "query-string";
import { Link, useParams } from "react-router-dom";

import useTableFilter from "hooks/useTableFilter";
import ActiveFilter from "components/General/ActiveFilter";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import { pageCount, promos } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import useWindowDimensions from "hooks/useWindowDimensions";
import { paramsObjectToQueryString } from "utils/request";
import { transactionAmount } from "utils/transactions";
import TransactionDetailsModal from "./DetailsModal";
import SearchBar from "components/General/Searchbar/SearchBar";
import { Button } from "components/General/Button";
import TableDropdown from "components/General/Dropdown/TableDropdown";
import GiftCardsStore from "../store";
import { observer } from "mobx-react-lite";

const GiftCardsPage = () => {
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const { warehouse_id } = useParams();

  const searching = "";

  const { getGiftCards, giftCards, loading } = GiftCardsStore;

  useEffect(() => {
    getGiftCards({ data: { page: currentPage } });
  }, [currentPage]);

  useEffect(() => {
    console.log({ giftCards });
  }, [giftCards]);
  const columns = [
    {
      name: "Card Design",
      selector: (row) => (
        <div className="capitalize py-2">
          <img
            src={row?.cardDesign}
            alt=""
            className="w-[195px] h-[112.5px] max-[768px]:w-[148.5px] max-[768px]:h-[80.5px] object-cover rounded"
          />
        </div>
      ),
      sortable: false,
    },
    {
      name: "Category",
      selector: (row) => (
        <span className="capitalize">
          {row?.cardCategory?.replace("_", " ")?.toLowerCase()}
        </span>
      ),
      sortable: false,
    },
    {
      name: "ID",
      selector: "id",
      sortable: false,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.createdAt).fromNow(),
      sortable: false,
    },

    {
      name: "Actions",

      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
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
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [promos]);

  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            {/* <div className="w-full sm:w-[45%] sm:min-w-[300px]">
              <SearchBar
                placeholder={"Search gift cards"}
                onChange={setSearchInput}
                value={searchInput}
                className="flex"
              />
            </div> */}
            <div></div>
            <Link to={`/dashboard/gift-cards/add-gift-cards/${warehouse_id}`}>
              <Button
                text="Add New Gift Card Design"
                icon={<Plus className="stroke-current" />}
                className="hidden md:block"
              />
            </Link>
          </div>

          {loading ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {giftCards?.length > 0 ? (
                  <Table
                    data={
                      giftCards?.length ? giftCards.slice(0, pageCount) : []
                    }
                    columns={width >= 640 ? columns : columns.slice(0, 2)}
                    onRowClicked={(e) => {
                      setCurrentTxnDetails({ ...e, modalType: "delete" });
                    }}
                    pointerOnHover
                    isLoading={loading}
                    pageCount={giftCards?.length / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <SearchIcon className="stroke-current" />
                      <span>No gift cards</span>
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

export default observer(GiftCardsPage);
