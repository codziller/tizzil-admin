import { getName } from "country-list";
import { isEmail, isMobilePhone, isNumeric } from "validator";
import { hasValue } from "./validations";

export function numberWithCommas(x) {
  if (x) {
    const splitNum = String(x)?.split(".");
    const wholeNum = splitNum[0];
    const floatNum = splitNum?.[1]?.substring(0, 2) || "";
    const numWithCommas = wholeNum
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return floatNum ? numWithCommas + "." + floatNum : numWithCommas;
  } else return 0;
}

export function numberFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

export const getFloatValue = (value) => parseFloat(hasValue(value) ? value : 0);

export function formatAddress(address) {
  const { delivery_address, delivery_city, delivery_country, delivery_state } =
    address || {};

  return `${delivery_address}, 
  ${delivery_city} ${delivery_state}, 
  ${getName(delivery_country)}.`;
}

export const capitalizeString = (str, split = " ") => {
  const arr = str.split(split);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const str2 = arr.join(" ");
  return str2;
};

export const trimArrayOfObject = (array) =>
  array.filter((value) => Object.keys(value).length !== 0);

export const handleCustomerSearch = (value) => {
  const toSearch = {};
  if (isEmail(value)) {
    toSearch.customer_email = value;
  } else if (
    (isMobilePhone(value) || isNumeric(value)) &&
    value.length === 11
  ) {
    toSearch.customer_phone = value;
  } else {
    toSearch.customer_first_name = value;
  }

  return toSearch;
};
