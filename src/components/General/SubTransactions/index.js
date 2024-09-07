import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router";
import { PaymentMethod } from "styles/transactions";
import { FilterButton, ExportButton } from "components/General/Button";
import { ReactComponent as ArrowRight } from "assets/icons/Arrow/arrow-right.svg";
import Table from "components/General/Table";
import useWindowDimensions from "hooks/useWindowDimensions";
import {
  determineTransactionType,
  transactionAmount,
} from "utils/transactions";
import classNames from "classnames";

export default function SubTransactions({
  transactionColumn,
  transactionList,
  onExport,
  onFilter,
  tabInfo,
  isLoading,
}) {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const columns = [
    {
      name: "Type",
      selector: (row) => determineTransactionType(row, ""),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => transactionAmount(row),
      sortable: true,
    },
    {
      name: "Payment Method",
      selector: (row) => (
        <PaymentMethod>
          {row?.payin_details?.pay_method.replace("_", " ")}
        </PaymentMethod>
      ),
      sortable: true,
    },
    {
      name: "Paid on",
      selector: (row) => moment(row.pub_date).format("DD MMM 2022"),
      sortable: true,
    },
  ];

  const gotoTransactions = ({ transaction_reference }) => {
    navigate(`/dashboard/merchants/transactions/${transaction_reference}`);
  };

  return (
    <div className="flex flex-col justify-start items-center h-full w-full md:gap-y-6">
      <div className="flex flex-row justify-between items-center w-full">
        <h3 className="text-xl text-black mb-0 hidden md:block">
          Transactions
        </h3>
        <div className="flex justify-between items-center space-x-3">
          {onExport && <ExportButton onClick={onExport} />}
          {onFilter && <FilterButton onClick={onFilter} />}
        </div>
      </div>
      <div className="flex flex-row justify-between md:justify-start items-start md:items-center  space-x-20 pt-8 md:pt-4 pb-4 md:pb-10 px-4 md:rounded-lg rounded-b-none md:rounded-b-lg  bg-white border border-b-[0px] md:border-b border-grey-border w-full">
        {Object.keys(tabInfo).map((item, i) => (
          <div
            className={classNames(
              "flex flex-col justify-start space-y-2",
              {
                "items-end md:items-start": (i + 1) % 2 === 0,
              },
              {
                "items-start": (i + 1) % 2 !== 0,
              }
            )}
            key={item}
          >
            <span className="text-grey-text whitespace-nowrap">{item}</span>
            <span className="text-black text-xl">{tabInfo[item]}</span>
          </div>
        ))}
      </div>
      <Table
        columns={
          width >= 640
            ? transactionColumn || columns
            : transactionColumn?.slice(0, 2) || columns?.slice(0, 2)
        }
        data={transactionList}
        isLoading={isLoading}
        onRowClicked={gotoTransactions}
        pointerOnHover
        extraChild={
          !isLoading && transactionList && transactionList.length > 0 ? (
            <div className="px-[40px]">
              <Link
                to="/dashboard/transactions"
                style={{ width: "fit-content" }}
              >
                <div className="flex align-center items-center justify-center py-[24px] border-t-[0.5px] border-[#E1E1E1]">
                  <p className="mr-[22px]">View all transactions</p>{" "}
                  <span>
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            </div>
          ) : null
        }
        tableClassName="subtxn-section-table hub-section-table !rounded-t-none md:rounded-t-lg"
      />
    </div>
  );
}

SubTransactions.propTypes = {
  transactionColumn: PropTypes.array,
  transactionList: PropTypes.array,
  onExport: PropTypes.func,
  onFilter: PropTypes.func,
  tabInfo: PropTypes.object,
  isLoading: PropTypes.bool,
};
