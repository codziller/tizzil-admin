import { isToday } from "date-fns";
import { flatMap, upperCase } from "lodash";
import moment from "moment";
import { NAIRA_ABBR } from "./appConstant";
import { BRANCH_COLORS } from "./colors";
import { getLinks } from "components/Layout/Components/SideNav";
import { getUserInfoFromStorage } from "./storage";
import { toJS } from "mobx";

export const formatAmount = (amount, decimalPlaces = 2) => {
  if (amount === 0) return 0;
  if (amount % 1 !== 0) return amount;
  if (!amount) return;
  const num = typeof amount === "string" ? amount.split(".00")[0] : amount;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
  }).format(Number(num));
};

export function _delete(obj, prop) {
  if (obj[prop] && !obj[prop].length) delete obj[prop];
}

export const doNothing = () => {};

export const convertWalletToCurrencyOption = (wallet) => ({
  label: (wallet.currency || wallet.crypto_wallet_type).toUpperCase(),
  value: (wallet.currency || wallet.crypto_wallet_type).toLowerCase(),
});

export const getCellContent = (content) => {
  if (!content) {
    return "N/A";
  }
  return content;
};

export const getBusinessInitials = (business) => {
  const initials = business
    ?.split(" ")
    .slice(0, 2)
    .map((i) => i[0])
    .join("");
  return upperCase(initials);
};

export const trimKeys = (key) => {
  if (key) {
    return key.slice(0, 4) + "***********************";
  }
};

export const handleBalanceType = (businessWallets, selectedOutflowWallet) => {
  const balType =
    businessWallets?.find(
      (item) => item.wallet_type?.toLowerCase() === "default"
    )?.currency ||
    selectedOutflowWallet?.currency ||
    selectedOutflowWallet?.crypto_wallet_type;
  return balType;
};

export const handleFileType = (val, prop) => {
  let filesObj = {};
  if (typeof val === "string") {
    if (val?.includes(".pdf")) {
      filesObj = {
        [prop]: {
          type: "pdf",
          url: val,
        },
      };
    } else {
      filesObj = {
        [prop]: {
          type: "image",
          url: val,
        },
      };
    }
  } else if (typeof val === "object") {
    if (val?.name?.includes(".pdf")) {
      filesObj = {
        [prop]: {
          type: "pdf",
          url: URL.createObjectURL(val),
        },
      };
    } else {
      filesObj = {
        [prop]: {
          type: "image",
          url: URL.createObjectURL(val),
        },
      };
    }
  }

  return filesObj;
};

export const isIntlTransfer = (senderCurrency, receiverCurrency) =>
  receiverCurrency !== NAIRA_ABBR;

export const trimAccountNumber = (account_num) =>
  !account_num
    ? null
    : account_num.slice(0, 5) + "**" + account_num.slice(7, 10);

export const trimPhoneNumber = (phone_num) =>
  phone_num.slice(0, 7) + "**" + phone_num.slice(9);

export const formatVATransactionTimeStamp = (date) => {
  let dateText;
  if (isToday(new Date(date))) {
    const minutesDiff = moment(date).diff(moment(new Date()), "minutes");
    const hoursDiff = moment(date).diff(moment(new Date()), "hours");
    const selectedTimeUnit = minutesDiff > 60 ? "hours" : "minutes";
    if (selectedTimeUnit === "minutes" && minutesDiff < 2) {
      return "now";
    }
    dateText = `Today, ${
      selectedTimeUnit === "hours" ? hoursDiff : minutesDiff
    } ${
      selectedTimeUnit === "hours" ? `hour ${hoursDiff > 0 && "s"}` : `minute`
    } ${minutesDiff > 0 && "s"}`;
  } else {
    dateText = moment(date).format("Do MMM - H:mmA");
  }
  return dateText;
};

export const hideSideNav = () => {
  document.querySelector(".sidenav")?.classList.add("hidden-sidenav");
};

export const showSideNav = () => {
  document.querySelector(".sidenav")?.classList.remove("hidden-sidenav");
};

export const formatVACreationTimestamp = (
  timestamp,
  addCreatedPrefix = true
) => {
  if (!timestamp) return "-";
  let dateText;
  if (isToday(new Date(timestamp))) {
    const minutesDiff = moment(new Date()).diff(moment(timestamp), "minutes");
    const hoursDiff = moment(new Date()).diff(moment(timestamp), "hours");
    const selectedTimeUnit = minutesDiff > 60 ? "hours" : "minutes";
    if (selectedTimeUnit === "minutes" && minutesDiff === 0) {
      return (
        <span className="text-grey-text text-12 pointer-events-none">now</span>
      );
    }
    if (selectedTimeUnit === "minutes" && minutesDiff < 2) {
      return "Created now";
    }
    dateText = `Today, ${
      selectedTimeUnit === "hours" ? hoursDiff : minutesDiff
    } ${
      selectedTimeUnit === "hours"
        ? `hour${hoursDiff > 0 && "s"}`
        : `minute${minutesDiff > 0 && "s"}`
    } ago`;
    return dateText;
  } else {
    dateText = moment(timestamp).format("Do MMM - H:mmA");
    return `${addCreatedPrefix ? "Created on" : ""} ${dateText}`;
  }
};

export const getBranchColors = (branch) => {
  const branchColors = {
    color: BRANCH_COLORS[0]?.color,
    background: BRANCH_COLORS[0]?.background,
  };
  try {
    const branchColors_ = JSON.parse(branch?.stand_inner_color);
    if (branchColors_?.color && branchColors_?.background) {
      return branchColors_;
    } else {
      return branchColors;
    }
  } catch (e) {
    return branchColors;
  }
};

export const getMerchantStatus = (status) => (
  <div
    className={`text-${
      status === `pending`
        ? ` warning-text `
        : status === `rejected`
        ? `red `
        : status === `accepted` || status === `approved`
        ? `green-light `
        : `white`
    } text-lg mr-2`}
  >
    {status}
  </div>
);

export const getMerchantDetails = (account_holder_details, type) =>
  type
    ? account_holder_details[type]
    : account_holder_details?.first_name +
      " " +
      account_holder_details?.last_name;

export const getCurrentRoute = (route) => {
  const userData = getUserInfoFromStorage();
  if (!userData || !userData.user) {
    return null;
  }
  const { user } = userData;
  return getLinks("", user)?.find((item) =>
    route.includes(item?.slug || item.link)
  );
};

export const moveCountryToFirst = (countries) => {
  // Find the index of the entry for Nigeria
  const nigeriaIndex = countries.findIndex(
    (country) => country?.country === "NG" || country.value === "NG"
  );

  // Move the entry for Nigeria to the first position if found
  if (nigeriaIndex !== -1) {
    const nigeriaCountry = countries.splice(nigeriaIndex, 1)[0];
    countries.unshift(nigeriaCountry);
  }

  return countries;
};

export const flattenCategories = (categories) => {
  const flattened = [];

  function flatten(category) {
    flattened.push({ name: category.name, id: category.id }); // Push the current category's name

    if (category.subCategories && category.subCategories.length > 0) {
      category.subCategories.forEach((subcategory) => {
        flatten(subcategory); // Recursively flatten subCategories
      });
    }
  }

  categories.forEach((category) => {
    flatten(category);
  });

  return flattened;
};

export const flattenArrayToString = (
  arr,
  separator = ", ",
  emptyText = "N/A"
) =>
  arr
    ?.map((item) => item?.name || item?.brandName)
    ?.join(separator)
    .trim() || emptyText;
export const convertToJs = (obj) => toJS(JSON.parse(JSON.stringify(obj)));
export const flattenProductArray = (productOptions) =>
  flatMap(productOptions, (item) => {
    return item?.choices?.map((choice, index) => {
      return {
        ...choice,
        choiceOptionName: item?.name,
        choiceOptionId: item?.id,
        productOptionId: item?.id,
        productOptionChoiceIndex: index,
        productOption: item,
        label: choice?.variantName,
        value: choice?.variantName + " " + item?.id,
      };
    });
  });
export const getLatestObjectByDate = (arrayOfObjects) => {
  const sortedArray = arrayOfObjects?.sort(
    (a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf()
  );

  // Getting the object with the latest date
  const latestObject = sortedArray[0];
  return latestObject;
};

export const addVariantOriginalSalePrice = (productOptions) => {
  return productOptions?.map((option) => {
    option.choices = option?.choices?.map((choice) => {
      choice.variantOriginalSalePrice = choice?.variantSalePrice;
      return choice;
    });
    return option;
  });
};
