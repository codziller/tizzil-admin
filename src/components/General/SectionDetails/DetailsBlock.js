import React from "react";
import PropTypes from "prop-types";
import {
  determineTransactionStatusStyle,
  determineTransactionType,
} from "utils/transactions";
import CopyToClipboard from "react-copy-to-clipboard";
import { successToast } from "../Toast/Toast";

export default function DetailsBlock({
  title,
  value,
  noEllipsis,
  transactionDetails,
}) {
  const handleTitleSort = () => {
    let titleText = title;
    if (titleText?.includes("account_name")) {
      titleText = transactionDetails?.payout_details?.receiver_account_name
        ? "Recipient account name"
        : transactionDetails?.payout_details?.receiver_first_name
        ? "Recipient name"
        : transactionDetails?.payin_details?.holder_account_name
        ? "Holder account name"
        : transactionDetails?.payin_details?.holder_first_name
        ? "Holder name"
        : transactionDetails?.crypto_payin_details?.coin_address
        ? "Holder coin address"
        : transactionDetails?.crypto_payout_details?.coin_address
        ? "Recipient coin address"
        : "";
    } else if (titleText?.includes("account_num")) {
      titleText = transactionDetails?.payout_details?.receiver_account_num
        ? "Recipient account number"
        : transactionDetails?.payout_details?.receiver_phone
        ? "Recipient phone number"
        : transactionDetails?.payin_details?.holder_account_number
        ? "Holder account number"
        : transactionDetails?.payin_details?.holder_phone
        ? "Holder phone number"
        : "";
    } else if (titleText?.includes("bank_name_phone_carrier")) {
      titleText = transactionDetails?.payout_details?.receiver_bank_name
        ? "Recipient bank name"
        : transactionDetails?.payin_details?.holder_bank_name
        ? "Holder bank name"
        : transactionDetails?.payin_details?.holder_phone_carrier
        ? "Holder phone carrier"
        : "";
    } else if (titleText?.includes("payment_method")) {
      titleText =
        determineTransactionType(transactionDetails, true) === "Debit"
          ? "Payout method"
          : determineTransactionType(transactionDetails, true) === "Credit"
          ? "Payment method"
          : "";
    }

    return titleText;
  };

  const showCopySuccess = (copiedKey) =>
    successToast("Copied", `${copiedKey} copied to clipboard`);
  return handleTitleSort() && value ? (
    <div className="flex flex-row justify-between items-start w-full">
      <span
        className={`text-grey-text
      ${
        handleTitleSort() === "Transaction note" ? "whitespace-nowrap pr-2" : ""
      }
      `}
      >
        {handleTitleSort()}
      </span>

      {handleTitleSort() === "Transaction hash" ||
      handleTitleSort() === "Transaction reference" ? (
        <CopyToClipboard
          text={value}
          onCopy={() => {
            showCopySuccess(handleTitleSort());
          }}
        >
          <span
            className={`cursor-pointer
        ${determineTransactionStatusStyle(value)}
        
        text-right ${
          handleTitleSort() === "Transaction note"
            ? "overflow-ellipsis whitespace-wrap max-w-43%"
            : !noEllipsis
            ? "overflow-ellipsis overflow-hidden whitespace-nowrap max-w-40% sm:max-w-max"
            : noEllipsis
            ? "overflow-hidden whitespace-nowrap "
            : ""
        }
          `}
          >
            {value || "-"}
          </span>
        </CopyToClipboard>
      ) : (
        <span
          className={`
         ${determineTransactionStatusStyle(value)}
         
         text-right capitalize ${
           handleTitleSort() === "Transaction note"
             ? "overflow-ellipsis whitespace-wrap max-w-43% overflow-x-hidden"
             : !noEllipsis
             ? "overflow-ellipsis overflow-hidden whitespace-nowrap max-w-40%"
             : noEllipsis
             ? "overflow-hidden whitespace-nowrap "
             : ""
         }
           `}
        >
          {value || "-"}
        </span>
      )}
    </div>
  ) : null;
}

DetailsBlock.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  noEllipsis: PropTypes.bool,
  transactionDetails: PropTypes.object,
};
