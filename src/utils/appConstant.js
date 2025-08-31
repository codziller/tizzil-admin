import { lowerCase } from "lodash";
import { numberWithCommas } from "./formatter";
import cerave from "assets/images/cerave.png";

export const pageCount = 60;

export const IS_DEV = [
  "testflight.getbani.com",
  "localhost",
  "playground.bani.africa",
].includes(window.location.hostname);

export const NAIRA_ABBR = "NGN";

export const teamMemberDefaultActionsState = (isAccount = false) => {
  return {
    can_add: false,
    can_authorize: false,
    can_read: isAccount,
    can_delete: false,
    can_edit: false,
  };
};

export const pendingTransactionStatus = [
  "in_progress",
  "source_processing",
  "pending",
  "on_going",
];
export const sucessfulTransactionStatus = ["completed", "paid"];
export const failedTransactionStatus = ["failed"];
export const partPaidTransactionStatus = ["on_going", "part_payment"];
export const isRequired = { required: true };
export const REQUEST_TYPES = {
  POST: "POST",
};

export const MERCHANTS_MODAL_TYPES = {
  SEARCH_FILTER: "SEARCH_FILTER",
  MECHANT_TRANSACTIONS_FILTER: "MECHANT_TRANSACTIONS_FILTER",
};

export const STAT_DATE_TYPE = {
  MONTHLY: "months",
  WEEKLY: "weeks",
};

export const barOptions = {
  chart: { height: 300, type: "bar", toolbar: { show: false } },
  grid: {
    show: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: { position: "top" },
      colors: {
        ranges: [{ from: 0, to: 1, color: "red" }],
        backgroundBarColors: [],
        backgroundBarOpacity: 0,
        backgroundBarRadius: 0,
      },
    },
  },
  fill: { colors: ["rgba(0, 0, 0, 0.1)"], type: "solid" },
  states: {
    normal: { filter: { type: "none", value: 0 } },
    hover: { filter: { type: "none", value: 0.15 } },
    active: {
      allowMultipleDataPointsSelection: false,
      filter: {
        type: "none",
        value: 0.35,
        colors: ["#000"],
        style: { fontSize: "2px", colors: ["#000000"], fontWeight: "100" },
      },
    },
  },
  stroke: {
    show: true,
    curve: "smooth",
    lineCap: "butt",
    colors: ["#E3E6EA"],
    width: 0.5,
  },
  dataLabels: {
    enabled: false,
    offsetY: -20,
    style: { fontSize: "12px", colors: ["#red"] },
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    position: "bottom",
    lines: {
      show: false,
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      show: true,
      style: {
        fontSize: "2px",
        colors: [
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
          "#65717C",
        ],
        fontWeight: "100",
      },
    },
    crosshairs: {
      show: false,
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#5444F2",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    convertedCatToNumeric: false,
  },
  yaxis: {
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      show: true,
      style: { fontSize: "2px", colors: ["#65717C"], fontWeight: "100" },
    },
    lines: {
      show: false,
    },
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      return (
        '<div class="apex_custom_tooltip">' +
        "<span>" +
        w.globals.labels[dataPointIndex] +
        ": " +
        "Orders" +
        " " +
        numberWithCommas(series[seriesIndex][dataPointIndex]) +
        "</span>" +
        "</div>"
      );
    },
  },
};

export const RIBBONS = [
  { label: "new in", value: "NEW_IN" },
  { label: "best seller", value: "BEST_SELLER" },
  { label: "limited edition", value: "LIMITED_EDITION" },
  { label: "sale", value: "SALE" },
];

export const barSeries = [
  {
    name: "Inflow Wallet Overview",
    data: ["350.0", "400.0", "200.0", "1379.0", "900.0", "700.0", "2010.0"],
  },
];

export const transactions = [
  {
    id: "1252657612",
    payment_method: "Card",
    order_date: "2022-02-25T12:05:30.322212Z",
    delivery_date: "2022-02-25T12:05:30.322212Z",
    total: "24000",
    currency: "₦‎",
    frequency: "2",
    duration: "weeks",
  },
];
export const products = [
  {
    name: "Cerave foaming facial cleanser",
    price: "23000",
    currency: "₦",
    discount: 10,
    category: "Skin Product",
    quantity: 32,
    images: [cerave],
  },
].map((item, i) => {
  return { id: i + 1, ...item };
});
export const staffs = [
  {
    name: "Mubarak Alabidun",
    role: "Admin",
    email: "mubbzy124@gmail.com",
    phone_number: "0812 368 4453",
    date: "2022-02-25T12:05:30.322212Z",
    products: "4",
  },
].map((item, i) => {
  return { id: i + 1, ...item };
});

export const promos = [
  {
    code: "425681",
    price: "15000",
    currency: "₦",
    status: "Active",
    date: "2022-02-25T12:05:30.322212Z",
  },
].map((item, i) => {
  return { id: i + 1, ...item };
});

export const PRODUCT_MODAL_TYPES = {
  PRODUCT_OPTION: "PRODUCT_OPTION",
  PRODUCT_VARIANT: "PRODUCT_VARIANT",
  PRODUCT_SUBSCRIPTION: "PRODUCT_SUBSCRIPTION",
  PRODUCT_CATEGORY: "PRODUCT_CATEGORY",
  PRODUCT_CATEGORY_OPTIONS: "PRODUCT_CATEGORY_OPTIONS",
  DELETE: "DELETE",
  INVENTORY: "INVENTORY",
  BRANDS: "BRANDS",
};

export const subscriptionDurationOptions = [
  { label: "Weeks", value: "WEEKLY" },
  { label: "Months", value: "MONTHLY" },
];

export const CHOICE_DISPLAY = {
  COLOR: "COLOR",
  LIST: "LIST",
};
export const NAIRA = "₦‎";
export const ALL_ROLES = {
  CUSTOMER_SUPPORT: "CUSTOMER_SUPPORT",
  CUSTOMER: "CUSTOMER",
  GENERAL_ADMIN: "GENERAL_ADMIN",
  GENERAL_STAFF: "GENERAL_STAFF",
  BRAND_STAFF: "BRAND_STAFF",
  GUEST: "GUEST",
  WAREHOUSE_ADMIN: "WAREHOUSE_ADMIN",
  WAREHOUSE_STAFF: "WAREHOUSE_STAFF",
  MARKETER: "MARKETER",
  DEVELOPER: "DEVELOPER",
  ALL_BRAND_STAFF: "ALL_BRAND_STAFF",
};
const {
  CUSTOMER,
  CUSTOMER_SUPPORT,
  GENERAL_ADMIN,
  BRAND_STAFF,
  WAREHOUSE_ADMIN,
  WAREHOUSE_STAFF,
  MARKETER,
  DEVELOPER,
  ALL_BRAND_STAFF,
} = ALL_ROLES;
export const ROLES = [
  {
    value: CUSTOMER,
    label: "CUSTOMER",
  },
  {
    value: GENERAL_ADMIN,
    label: "GENERAL ADMIN",
  },
  // {
  //   value: GENERAL_STAFF,
  //   label: "GENERAL STAFF",
  // },

  {
    value: BRAND_STAFF,
    label: "BRAND STAFF",
  },
  {
    value: ALL_BRAND_STAFF,
    label: "ALL BRANDS STAFF",
  },
  // {
  //   value: GUEST,
  //   label: "GUEST",
  // },

  {
    value: WAREHOUSE_ADMIN,
    label: "WAREHOUSE ADMIN",
  },
  {
    value: WAREHOUSE_STAFF,
    label: "WAREHOUSE STAFF",
  },

  {
    value: MARKETER,
    label: "MARKETER",
  },
  {
    value: DEVELOPER,
    label: "DEVELOPER",
  },
  {
    value: CUSTOMER_SUPPORT,
    label: "CUSTOMER SUPPORT",
  },
];

export const WALLET_ACTIONS = { Credit: "Credit", Debit: "Debit" };

export const SLIDE_LINK_TYPES = [
  { name: "Brand Page", value: "BRAND" },
  { name: "Product Page", value: "PRODUCT" },
  { name: "No Page", value: "NONE" },
];

export const MEDIA_MODAL_TYPES = { BRAND: "BRAND", PRODUCT: "PRODUCT" };

export const IMAGE_NAME_ENUM = [
  { name: "1", value: "UNDER_HOME_PAGE_SLIDER_WEB_A" },
  { name: "2", value: "UNDER_HOME_PAGE_SLIDER_WEB_B" },
  { name: "3", value: "UNDER_HOME_PAGE_SLIDER_WEB_C" },
];
export const AFFILIATE_MARKETER_ORDER_TYPES = { ALL: "ALL", FIRST: "FIRST" };

export const INVENTORY_MODAL_TYPES = {
  COST_PRICE_HISTORY: "COST_PRICE_HISTORY",
  REQUEST_PRODUCT: "REQUEST_PRODUCT",
  DOWNLOAD_CSV: "DOWNLOAD_CSV",
};

export const PRODUCT_REQUEST_STATUSES = {
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  INPROGRESS: "INPROGRESS",
  PENDING: "PENDING",
};
export const PRODUCT_REQUEST_STATUSES_LIST = [
  { label: "Pending", value: "PENDING" },
  { label: "In-progress", value: "INPROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];
export const GENDERS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Non-binary", value: "NON_BINARY" },
  { label: "Prefer not to say", value: "UNSPECIFIED" },
];

export const WEIGHT_TYPES = { grams: "grams", milliliters: "milliliters" };

export const formatCapitalUnderscoreText = (text) =>
  lowerCase(text)?.replaceAll("_", " ");
export const ORDER_STATUSES = {
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  INPROGRESS: "IN_PROGRESS",
  PENDING: "PENDING",
  DISPATCHED: "DISPATCHED",
  REFUNDED: "REFUNDED",
};

export const SUBSCRIPTION_TYPES = {
  ACTIVE: "ACTIVE",
  DUE: "DUE",
};

export const ORDER_STATUS_OPTIONS = [
  { label: ORDER_STATUSES.INPROGRESS, value: ORDER_STATUSES.INPROGRESS },
  { label: ORDER_STATUSES.DISPATCHED, value: ORDER_STATUSES.DISPATCHED },
  { label: ORDER_STATUSES.COMPLETED, value: ORDER_STATUSES.COMPLETED },
  { label: ORDER_STATUSES.CANCELLED, value: ORDER_STATUSES.CANCELLED },
];

export const DISCOUNT_TYPES = {
  BUY_X_GET_X_FREE: "BUY_X_GET_X_FREE",
  BUY_X_GET_Y_FREE: "BUY_X_GET_Y_FREE",
  FIXED: "FIXED",
  FREE_SHIPPING: "FREE_SHIPPING",
  PERCENTAGE: "PERCENTAGE",
};
export const DISCOUNT_TYPES_OPTION = [
  {
    label: formatCapitalUnderscoreText(DISCOUNT_TYPES.FIXED),
    value: DISCOUNT_TYPES.FIXED,
  },
  {
    label: formatCapitalUnderscoreText(DISCOUNT_TYPES.PERCENTAGE),
    value: DISCOUNT_TYPES.PERCENTAGE,
  },
  {
    label: formatCapitalUnderscoreText(DISCOUNT_TYPES.FREE_SHIPPING),
    value: DISCOUNT_TYPES.FREE_SHIPPING,
  },
  {
    label: formatCapitalUnderscoreText(DISCOUNT_TYPES.BUY_X_GET_Y_FREE),
    value: DISCOUNT_TYPES.BUY_X_GET_Y_FREE,
  },
  {
    label: formatCapitalUnderscoreText(DISCOUNT_TYPES.BUY_X_GET_X_FREE),
    value: DISCOUNT_TYPES.BUY_X_GET_X_FREE,
  },
];

export const ORDER_SOURCE_OPTIONS = [
  { label: "APP", value: "APP" },
  { label: "FACEBOOK", value: "FACEBOOK" },
  { label: "INSTAGRAM", value: "INSTAGRAM" },
  { label: "STORE", value: "STORE" },
  { label: "WEB", value: "WEB" },
  { label: "WHATSAPP", value: "WHATSAPP" },
];
export const CENTRAL_WAREHOUSE_ID = "77a9c714-eea8-4601-b8e7-bac977078490";
