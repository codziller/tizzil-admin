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
  CUSTOMER_SUPPORT,
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

  get userIsCustomerSupport() {
    return !!(
      (this?.user?.user?.role || this?.user?.role) === CUSTOMER_SUPPORT
    );
  }

  // ====================================================
  // Actions
  // ====================================================

  login = async (data, logUserIn) => {
    this.loading = true;

    try {
      // DEMO MODE: Comment out actual API call for demo purposes
      // let res = await apis.login(data);
      // res = res?.adminLoginUser;
      
      // Demo mode: Create mock response
      const res = {
        user: {
          id: 1,
          email: data.email,
          firstName: 'Demo',
          lastName: 'User',
          userRole: { name: 'BRAND_USER' },
          role: 'BRAND_USER',
          brandId: 1
        },
        access_token: 'demo_token_123',
        refresh_token: 'demo_refresh_token_123',
        brand: {
          id: 1,
          name: 'Demo Brand',
          description: 'This is a demo brand for testing purposes',
          brandName: 'Demo Brand'
        },
        brandUser: {
          id: 1,
          role: 'BRAND_OWNER',
          userId: 1,
          brandId: 1
        }
      };
      
      this.setCurrentUser(res?.user);
      logUserIn(res);
      const message =
        "You have successfully logged into Tizzil admin dashboard (Demo Mode)";
      successToast(`Successfully logged in (Demo)`, message);
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
