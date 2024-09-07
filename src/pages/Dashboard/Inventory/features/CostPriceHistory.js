import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { observer } from "mobx-react-lite";
import { isEmpty } from "lodash";
import ProductsStore from "pages/Dashboard/Products/store";
import moment from "moment";
import Amount from "components/General/Numbers/Amount";
import { pageCount } from "utils/appConstant";
import Table from "components/General/Table";

const CostPriceHistory = ({ details, toggler }) => {
  const { warehouse_id } = useParams();
  const { product, getProductCostPriceHistory, getProductLoading } =
    ProductsStore;

  useEffect(() => {
    getProductCostPriceHistory({
      data: { productId: details?.id, warehouseId: warehouse_id },
    });
  }, [details?.id]);

  const columns = [
    {
      minWidth: "40%",
      name: "Date",
      selector: (row) => moment(row.createdAt).format("MMM Do, YYYY hh:mma"),
      sortable: true,
      sortFunction: (a, b) => {
        // Parse 'date' values as Moment.js objects and compare
        const dateA = moment(a.createdAt);
        const dateB = moment(b.createdAt);

        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      },
    },
    {
      name: "Old Cost Price",
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          <Amount value={row?.oldCostPrice} />
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const amountA = parseFloat(a.oldCostPrice);
        const amountB = parseFloat(b.oldCostPrice);
        return amountA - amountB;
      },
    },
    {
      name: "New Cost Price",
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          <Amount value={row?.newCostPrice} />
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const amountA = parseFloat(a.newCostPrice);
        const amountB = parseFloat(b.newCostPrice);
        return amountA - amountB;
      },
    },
  ];
  const displayedItems = product?.productCostPriceHistory;
  const displayedItemsCount = product?.productCostPriceHistory?.length || 0;
  return (
    <>
      <div className="flex flex-col justify-center items-start gap-y-2 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mr-auto">
            <Close />
          </button>
        )}
        {!getProductLoading && (
          <>
            <p className="font-600 text-[16px] ">
              {product?.name} Cost Price History
            </p>

            <p className="mb-3 text-sm text-grey-text  text-left">
              Cost Price History
            </p>
          </>
        )}

        <div className="w-full flex flex-col justify-center items-center gap-4 mt-4">
          {getProductLoading ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
                {!isEmpty(displayedItems) ? (
                  <Table
                    data={displayedItems}
                    columns={columns}
                    pageCount={displayedItemsCount / pageCount}
                    tableClassName="txn-section-table"
                    noPadding
                  />
                ) : (
                  <>
                    <div className="text-sm text-grey flex flex-col justify-center items-center space-y-3 h-full">
                      Cost price history for this product is currently empty
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
            <Button
              onClick={() => toggler?.()}
              text="Close"
              fullWidth
              whiteBg
            />
          </div>
        </div>
      </div>
    </>
  );
};
CostPriceHistory.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default observer(CostPriceHistory);
