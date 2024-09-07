import React, { useEffect } from "react";

import PropTypes from "prop-types";
import { ReactComponent as CostPriceIcon } from "assets/icons/wallet-money.svg";
import { ReactComponent as BoxAdd } from "assets/icons/box-add.svg";
import { ReactComponent as QtyLeftIcon } from "assets/icons/3d-cube-scan.svg";
import { ReactComponent as TypeOfStockIcon } from "assets/icons/convert-3d-cube.svg";
import { ReactComponent as UserEditIcon } from "assets/icons/user-edit.svg";
import { ReactComponent as LastUpdatedIcon } from "assets/icons/maximize-circle.svg";
import { observer } from "mobx-react-lite";
import { isEmpty } from "lodash";
import moment from "moment";
import Amount from "components/General/Numbers/Amount";
import { pageCount } from "utils/appConstant";
import Table from "components/General/Table";
import { numberWithCommas } from "utils/formatter";
import ProductsStore from "pages/Dashboard/Products/store";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { useParams } from "react-router-dom";

const QuantityLeft = ({ details, selectedProductOption }) => {
  const { warehouse_id } = useParams();
  const {
    getProductCostPriceHistory,
    productCostPriceHistory,
    productCostPriceHistoryCount,
    productCostPriceHistoryLoading,
  } = ProductsStore;

  useEffect(() => {
    getProductCostPriceHistory({
      data: {
        pageNumber: 1,
        productId: details?.id,
        warehouseId: warehouse_id,
      },
    });
  }, [details?.id]);

  const columns = [
    {
      center: true,
      name: (
        <div className="flex justify-center items-center gap-3">
          <CostPriceIcon />
          <span className="font-700 ">Cost Price</span>
        </div>
      ),
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          <Amount value={row?.costPrice} />
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const amountA = parseFloat(a.costPrice);
        const amountB = parseFloat(b.costPrice);
        return amountA - amountB;
      },
    },

    {
      center: true,
      name: (
        <div className="flex justify-center items-center gap-3">
          <BoxAdd />

          <span className="font-700">Quantity Updated</span>
        </div>
      ),
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          {numberWithCommas(row?.quantityUpdated)}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const amountA = parseFloat(a.quantityUpdated);
        const amountB = parseFloat(b.quantityUpdated);
        return amountA - amountB;
      },
    },
    {
      center: true,
      name: (
        <div className="flex justify-center items-center gap-3">
          <QtyLeftIcon />

          <span className="font-700">Quantity Left</span>
        </div>
      ),
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          {numberWithCommas(row?.quantityLeft)}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const amountA = parseFloat(a.quantityLeft);
        const amountB = parseFloat(b.quantityLeft);
        return amountA - amountB;
      },
    },
    {
      center: true,
      name: (
        <div className="flex justify-center items-center gap-3">
          <TypeOfStockIcon />

          <span className="font-700">Type of Stock Update</span>
        </div>
      ),
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          {row?.typeOfStockUpdate || "Manual"}
        </div>
      ),
    },
    {
      center: true,
      name: (
        <div className="flex justify-center items-center gap-3">
          <UserEditIcon />

          <span className="font-700">Updated By</span>
        </div>
      ),
      selector: (row) => (
        <div className="flex justify-start items-center gap-4">
          {row?.userFullName || "BH Admin"}
        </div>
      ),
    },

    {
      center: true,
      name: (
        <div className="flex justify-center items-center gap-3">
          <LastUpdatedIcon />

          <span className="font-700">Last Updated</span>
        </div>
      ),
      selector: (row) =>
        moment(row.lastUpdatedDateAndTime).format("MMM Do, YYYY hh:mma"),
      sortable: true,
      sortFunction: (a, b) => {
        // Parse 'date' values as Moment.js objects and compare
        const dateA = moment(a.lastUpdatedDateAndTime);
        const dateB = moment(b.lastUpdatedDateAndTime);

        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      },
    },
  ];
  const displayedItems = productCostPriceHistory || [];
  const selectedDisplayedItems = isEmpty(details?.productOptions)
    ? displayedItems
    : displayedItems?.filter(
        (item) =>
          item?.productOptionId === selectedProductOption?.productOptionId &&
          item?.productOptionIndex ===
            selectedProductOption?.productOptionChoiceIndex
      );
  const displayedItemsCount = displayedItems?.length || 0;
  return (
    <>
      <div className="flex flex-col justify-center items-start gap-y-2 w-full pb-4">
        <p className="text-base uppercase">Stock history</p>

        <div className="w-full flex flex-col justify-center items-center gap-4 mt-2">
          <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
            {productCostPriceHistoryLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <CircleLoader blue />
              </div>
            ) : !isEmpty(selectedDisplayedItems) ? (
              <Table
                data={selectedDisplayedItems}
                columns={columns}
                pageCount={displayedItemsCount / pageCount}
                tableClassName="txn-section-table"
                noPadding
              />
            ) : (
              <>
                <div className="text-sm text-grey flex flex-col justify-center items-center space-y-3 h-full">
                  Cost prices for this product is currently empty
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
QuantityLeft.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default observer(QuantityLeft);
