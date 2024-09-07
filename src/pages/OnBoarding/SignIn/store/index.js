/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import apis from "services/auth";
import { ALL_ROLES } from "utils/appConstant";
const {
  GENERAL_ADMIN,
  BRAND_STAFF,
  WAREHOUSE_ADMIN,
  WAREHOUSE_STAFF,
  DEVELOPER,
  MARKETER,
  ALL_BRAND_STAFF,
} = ALL_ROLES;
class AuthStore {
  // ====================================================
  // State
  // ====================================================
  user = null;
  otp_value = "";
  error = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Computed views
  // ====================================================
  // While MobX promotes OOP, we can still benefit from using FP where it's appropriate
  get userIsGeneralAdmin() {
    return !!(
      this?.user?.user?.role === GENERAL_ADMIN ||
      this?.user?.role === GENERAL_ADMIN
    );
  }

  get userIsWarehouseAdmin() {
    return !!(
      this?.user?.user?.role === WAREHOUSE_ADMIN ||
      this?.user?.role === WAREHOUSE_ADMIN
    );
  }

  get userIsWarehouseStaff() {
    return !!(
      this?.user?.user?.role === WAREHOUSE_STAFF ||
      this?.user?.role === WAREHOUSE_STAFF
    );
  }

  get userIsBrandStaff() {
    return !!((this?.user?.user?.role || this?.user?.role) === BRAND_STAFF);
  }
  get userIsDeveloperStaff() {
    return !!((this?.user?.user?.role || this?.user?.role) === DEVELOPER);
  }
  get userIsMarketingStaff() {
    return !!((this?.user?.user?.role || this?.user?.role) === MARKETER);
  }
  get userIsAllBrandStaff() {
    return !!((this?.user?.user?.role || this?.user?.role) === ALL_BRAND_STAFF);
  }

  // ====================================================
  // Actions
  // ====================================================

  login = async (data, logUserIn) => {
    this.loading = true;

    try {
      let res = await apis.login(data);
      res = res?.adminLoginUser;
      this.setCurrentUser(res?.user);
      logUserIn(res);
      const message =
        "You have successfully logged into beautyhut admin dashboard";
      successToast(`Successfully logged in`, message);
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };
  setCurrentUser = (data) => {
    this.user = data;
  };

  logoutUser = () => {
    this.user = null;
    this.setCurrentUser(null);
  };
}

export default new AuthStore();
