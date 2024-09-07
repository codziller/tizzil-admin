/* eslint-disable no-param-reassign */
const TOKEN = "beautyhut-admin-token";
const USER_DATA = "beautyhut-admin-user-data";
const LAST_CURRENT_BUSINESS = "beautyhut-admin-lcb";
export const ACCOUNT_CREATED = "ADMIN_ACCOUNT_CREATED";
export const BUSINESS_CUSTOMER_REFS = "beautyhut-admin-cr";

export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN, token);
  } catch (e) {
    return e;
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN);
  } catch (e) {
    return e;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    return e;
  }
};

export const getFromStorage = (key) => {
  try {
    localStorage.getItem(key);
  } catch (e) {
    return e;
  }
};

export const saveUserInfoToStorage = (payload) => {
  try {
    if (payload.token) {
      delete payload.token;
    }
    localStorage.setItem(USER_DATA, JSON.stringify(payload));
    return payload;
  } catch (e) {
    return e;
  }
};

export const storeBusinessCustomerRef = (businessID, customer_ref) => {
  try {
    const newData = { bid: businessID, customer_ref };
    let formerCustomerRefs = localStorage.getItem(BUSINESS_CUSTOMER_REFS);
    if (!formerCustomerRefs) {
      saveToStorage(BUSINESS_CUSTOMER_REFS, JSON.stringify([newData]));
    } else {
      formerCustomerRefs = JSON.parse(formerCustomerRefs);
      saveToStorage(
        BUSINESS_CUSTOMER_REFS,
        JSON.stringify([...formerCustomerRefs, newData])
      );
    }
  } catch (error) {
    return error;
  }
};

export const getStoredBusinessCustomerRef = (currentBusiness) => {
  let customer_ref;
  const customerRefsArray = localStorage.getItem(BUSINESS_CUSTOMER_REFS);
  if (customerRefsArray) {
    customer_ref = JSON.parse(customerRefsArray).find(
      (obj) => obj?.bid === currentBusiness.tribe_account_id
    )?.customer_ref;
  }
  return customer_ref;
};

export const getUserInfoFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_DATA));
  } catch (error) {
    return error;
  }
};
export const getCurrentRole = () => {
  const currentUser = getUserInfoFromStorage();
  const currentUserRole = currentUser?.user?.role;
  return currentUserRole;
};
const currentUserRole = getCurrentRole();
export const isAdmin = currentUserRole?.includes("ADMIN");

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (e) {
    return e;
  }
};

export const getLastCurrentBusiness = () => {
  try {
    return localStorage.getItem(LAST_CURRENT_BUSINESS);
  } catch (e) {
    return e;
  }
};

export const saveCurrentBusiness = (businessID) => {
  try {
    localStorage.setItem(LAST_CURRENT_BUSINESS, businessID);
  } catch (e) {
    return e;
  }
};

export const saveAccountCreation = (payload) => {
  try {
    localStorage.setItem(ACCOUNT_CREATED, JSON.stringify(payload));
    return payload;
  } catch (e) {
    return e;
  }
};

export const getAccountCreation = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_CREATED));
  } catch (error) {
    return error;
  }
};

export const clearAccountCreation = () => {
  try {
    localStorage.removeItem(ACCOUNT_CREATED);
  } catch (e) {
    return e;
  }
};

export const clearUserDetails = () => {
  try {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_DATA);
    localStorage.removeItem(BUSINESS_CUSTOMER_REFS);
  } catch (e) {
    return e;
  }
};
