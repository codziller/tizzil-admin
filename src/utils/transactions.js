import moment from "moment";
import { TransactionType } from "styles/transactions";
import { numberWithCommas } from "utils/formatter";
import {
  pendingTransactionStatus,
  sucessfulTransactionStatus,
  partPaidTransactionStatus,
  failedTransactionStatus,
  NAIRA,
} from "./appConstant";
import classNames from "classnames";

export const determineTransactionType = (type, stringValue) => {
  if (type?.tx_verb) {
    if (type?.tx_verb?.includes("credit")) {
      return stringValue ? (
        "Credit"
      ) : (
        <div className="flex flex-col gap-2 py-4">
          <span className="sm:hidden">
            {determineSourceAccount(type) ||
              determineTxnFrom(type) ||
              type?.transaction_note}
          </span>
          <TransactionType className="text-[12px] sm:text-[13px]">
            <span className="type-badge credit"></span>
            <span className="text-grey-text sm:text-black">Credit</span>
          </TransactionType>
        </div>
      );
    } else if (type?.tx_verb?.includes("debit")) {
      return stringValue ? (
        "Debit"
      ) : (
        <div className="flex flex-col gap-2">
          <span className="sm:hidden">
            {determineSourceAccount(type) || determineTxnFrom(type)}
          </span>
          <TransactionType className="text-[12px] sm:text-[13px]">
            <span className="type-badge debit"></span>{" "}
            <span className="text-grey-text sm:text-black">Debit</span>
          </TransactionType>
        </div>
      );
    }

    return "";
  }

  return "";
};

export const transactionAmount = (row) => {
  if (row) {
    const { total, currency, salePrice, price, calculatedOrder } = row;
    const discountTypeIsBuyX =
      calculatedOrder?.checkDiscountCodeResult?.discountType?.includes("BUY_X");
    const discountTypeIsFreeDel =
      calculatedOrder?.checkDiscountCodeResult?.discountType ===
      "FREE_SHIPPING";

    return (
      <div className="flex flex-col justify-start items-start gap-2">
        {calculatedOrder?.checkDiscountCodeResult?.realTotalAmount &&
        !(discountTypeIsBuyX || discountTypeIsFreeDel) ? (
          <p className="text-grey-dark line-through">
            {NAIRA}
            {numberWithCommas(
              calculatedOrder?.checkDiscountCodeResult?.realTotalAmount
            )}
          </p>
        ) : null}
        <div>
          {`${currency || NAIRA} ${numberWithCommas(
            calculatedOrder?.totalAmount || salePrice || total || price
          )}`}
        </div>
      </div>
    );
  }
};

export const paymentMethods = [
  {
    name: "Fiat",
    label: "Fiat",
    value: "fiat",
  },
  // {
  //   name: "Crypto",
  //   label: "Crypto",
  //   value: "crypto",
  // },
];

export const transactionTypes = [
  {
    name: "Credit",
    label: "Credit",
    value: "credit",
  },
  {
    name: "Debit",
    label: "Debit",
    value: "debit",
  },
];

export const statDateType = [
  {
    name: "Monthly",
    label: "Monthly",
    value: "monthly",
  },
  {
    name: "Weekly",
    label: "Weekly",
    value: "weekly",
  },
];

export const statusType = [
  {
    name: "Approved",
    label: "Approved",
    value: "approved",
  },
  {
    name: "Pending",
    label: "Pending",
    value: "pending",
  },
  {
    name: "Unapproved",
    label: "Unapproved",
    value: "unapproved",
  },
];

export const determineTransactionStatus = (type, isPayout) => {
  const acceptedPendingTxnStatus = isPayout
    ? pendingTransactionStatus
    : pendingTransactionStatus?.filter((stat) => stat !== "on_going");
  if (type) {
    if (acceptedPendingTxnStatus.includes(type)) {
      return "pending";
    } else if (sucessfulTransactionStatus.includes(type)) {
      return "completed";
    } else if (failedTransactionStatus.includes(type)) {
      return "failed";
    } else if (partPaidTransactionStatus.includes(type)) {
      return "part paid";
    }
    return "";
  }
  return "";
};

export const determineTransactionStatusStyle = (type) => {
  if (type) {
    if (type === "pending") {
      return "text-grey-text";
    } else if (type === "completed") {
      return "text-green-light";
    } else if (type === "failed") {
      return "text-red";
    } else if (type === "part paid") {
      return "text-yellow";
    }
  } else {
    return "text-black ";
  }
  return "";
};

export const determineSourceAccount = (transactionDetails) => {
  const accName = transactionDetails?.payout_details?.receiver_first_name
    ? transactionDetails?.payout_details?.receiver_first_name +
      " " +
      transactionDetails?.payout_details?.receiver_last_name
    : transactionDetails?.payout_details?.receiver_account_name
    ? transactionDetails?.payout_details?.receiver_account_name
    : transactionDetails?.payin_details?.holder_first_name
    ? transactionDetails?.payin_details?.holder_first_name +
      " " +
      transactionDetails?.payin_details?.holder_last_name
    : transactionDetails?.payin_details?.holder_account_name
    ? transactionDetails?.payin_details?.holder_account_name
    : transactionDetails?.crypto_payin_details?.coin_address
    ? transactionDetails?.crypto_payin_details?.coin_address
    : transactionDetails?.crypto_payout_details?.coin_address
    ? transactionDetails?.crypto_payout_details?.coin_address
    : "";
  return accName;
};

export const determineTxnFrom = (transactionDetails) => {
  const txnFrom = transactionDetails?.tx_verb?.includes("manual")
    ? transactionDetails?.source_account_name
    : "";
  return txnFrom;
};
