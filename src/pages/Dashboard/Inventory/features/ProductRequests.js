import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import Table from "components/General/Table";
import {
  PRODUCT_REQUEST_STATUSES,
  PRODUCT_REQUEST_STATUSES_LIST,
  pageCount,
} from "utils/appConstant";

import useWindowDimensions from "hooks/useWindowDimensions";
import TransactionDetailsModal from "./DetailsModal";

import { observer } from "mobx-react-lite";
import ProductsStore from "pages/Dashboard/Products/store";
import { useParams } from "react-router-dom";
import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import classNames from "classnames";

const { INPROGRESS, CANCELLED, PENDING, COMPLETED } = PRODUCT_REQUEST_STATUSES;
const ProductRequests = () => {
  const {
    productRequests,
    getProductRequests,
    productRequestsLoading,
    productRequestsCount,
  } = ProductsStore;
  const { warehouse_id } = useParams();
  const { width, isMobile } = useWindowDimensions();
  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(PRODUCT_REQUEST_STATUSES_LIST[1]);

  useEffect(() => {
    getProductRequests({
      data: {
        page: currentPage,
        warehouseId: warehouse_id,
        status: status?.value,
      },
    });
  }, [currentPage, status]);

  const columns = [
    {
      name: "Code",
      selector: "code",
      sortable: true,
    },
    {
      name: "Source Warehouse",
      selector: "sourceWarehouse.name",
      sortable: true,
    },
    {
      name: "Requested products",
      selector: (row) => (
        <div>
          <span className="text-red-deep">
            x{row?.productTransferRequestProductQuantities[0]?.quantity}
          </span>{" "}
          {row?.productTransferRequestProductQuantities[0]?.product?.name}{" "}
        </div>
      ),
      sortable: false,
    },

    {
      name: "Status",
      minWidth: "120px",
      maxWidth: "120px",
      selector: (row) => (
        <span
          className={classNames({
            "text-yellow":
              row?.status === INPROGRESS || row?.status === PENDING,
            "text-green": row?.status === COMPLETED,
            "text-red-deep": row?.status === CANCELLED,
          })}
        >
          {row?.status}
        </span>
      ),
      sortable: false,
    },
    {
      name: "Date",
      selector: (row) => moment(row.createdAt).format("MMM Do, YYYY hh:mma"),
      sortable: true,
    },

    {
      name: "Actions",
      minWidth: isMobile ? "50%" : "23%",
      selector: (row) => (
        <div className="flex justify-start items-center gap-1.5">
          {row?.status === INPROGRESS ? (
            <span
              onClick={() =>
                setCurrentTxnDetails({
                  ...row,
                  modalSize: "lg",
                  modalType: COMPLETED,
                  pageStatus: status,
                  currentPage,
                })
              }
              className=" cursor-pointer px-4 py-1 rounded-full bg-white text-[11px] text-black border-[1px] border-grey-bordercolor "
            >
              Complete
            </span>
          ) : null}

          <span
            onClick={() =>
              setCurrentTxnDetails({
                ...row,
                modalSize: "lg",
                modalType: "view",
                pageStatus: status,
                currentPage,
              })
            }
            className=" cursor-pointer px-4 py-1 rounded-full bg-black text-[11px] text-white border-[1px] border-grey-bordercolor "
          >
            View
          </span>

          {row?.status === INPROGRESS || row?.status === PENDING ? (
            <span
              onClick={() =>
                setCurrentTxnDetails({
                  ...row,
                  modalSize: "lg",
                  modalType: CANCELLED,
                  pageStatus: status,
                  currentPage,
                })
              }
              className=" cursor-pointer px-4 py-1 rounded-full bg-red-deep text-[11px] text-white "
            >
              Cancel
            </span>
          ) : null}
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

  useEffect(() => scrollToTop(), [productRequests]);

  return (
    <>
      <div className="h-full w-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <div className="sm:min-w-[200px]">
              <DashboardFilterDropdown
                placeholder="Filter by: "
                options={PRODUCT_REQUEST_STATUSES_LIST}
                name="payout_filter"
                onClick={(e) => setStatus(e)}
                value={status?.label}
              />
            </div>
          </div>

          {productRequestsLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {productRequests?.length > 0 ? (
                  <Table
                    data={productRequests}
                    columns={width >= 640 ? columns : columns.slice(0, 2)}
                    onRowClicked={(e) => {
                      setCurrentTxnDetails({ ...e, modalType: "edit" });
                    }}
                    pointerOnHover
                    isLoading={productRequestsLoading}
                    pageCount={productRequestsCount / pageCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    currentPage={currentPage}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <span>You have not requested any products</span>
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

export default observer(ProductRequests);
