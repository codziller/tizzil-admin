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
      // Comment out API call for demo mode
      let res = await apis.brandAdminLoginUser(data);
      res = res?.brandAdminLoginUser;

      // Demo data structure matching the API response
      const demoResponse = {
        access_token: "demo_access_token_12345",
        refresh_token: "demo_refresh_token_67890",
        user: {
          id: "demo-user-id-123",
          firstName: "Demo",
          lastName: "User",
          email: data.email || "demo@tizzil.com",
          userRole: {
            name: "BRAND_ADMIN", // Could be "ADMIN" for Tizzil admin or "BRAND_ADMIN" for brand users
            id: "role-123",
          },
        },
        brand: {
          id: "demo-brand-id-456",
          brandName: "Demo Brand Store",
          brandEmail: "brand@tizzil.com",
          logoUrl: "https://via.placeholder.com/100/690007/FFFFFF?text=DB",
        },
        brandUser: {
          brandId: "demo-brand-id-456",
          createdAt: "2024-01-01T00:00:00Z",
          id: "demo-brand-user-789",
          invitedAt: "2024-01-01T00:00:00Z",
          isActive: true,
          joinedAt: "2024-01-01T00:00:00Z",
          role: "OWNER",
          updatedAt: "2024-01-01T00:00:00Z",
          userId: "demo-user-id-123",
        },
      };

      this.setCurrentUser(demoResponse?.user);
      logUserIn(demoResponse);
      const message =
        "You have successfully logged into Tizzil admin dashboard (Demo Mode)";
      successToast(`Successfully logged in`, message);
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  loginAdmin = async (data, logUserIn) => {
    this.loading = true;

    try {
      // Comment out API call for demo mode
      let res = await apis.adminLoginUser(data);
      res = res?.adminLoginUser;

      // Demo data structure matching the API response
      const demoResponse = {
        access_token: "demo_access_token_12345",
        refresh_token: "demo_refresh_token_67890",
        user: {
          id: "demo-user-id-123",
          firstName: "Admin",
          lastName: "User",
          email: data.email || "admin@tizzil.com",
          userRole: {
            name: "ADMIN", // Could be "ADMIN" for Tizzil admin or "BRAND_ADMIN" for brand users
            id: "role-123",
          },
        },
        brand: {
          id: "demo-brand-id-456",
          brandName: "Demo Brand Store",
          brandEmail: "brand@tizzil.com",
          logoUrl: "https://via.placeholder.com/100/690007/FFFFFF?text=DB",
        },
        brandUser: {
          brandId: "demo-brand-id-456",
          createdAt: "2024-01-01T00:00:00Z",
          id: "demo-brand-user-789",
          invitedAt: "2024-01-01T00:00:00Z",
          isActive: true,
          joinedAt: "2024-01-01T00:00:00Z",
          role: "OWNER",
          updatedAt: "2024-01-01T00:00:00Z",
          userId: "demo-user-id-123",
        },
      };

      this.setCurrentUser(demoResponse?.user);
      logUserIn(demoResponse);
      const message =
        "You have successfully logged into Tizzil admin dashboard (Demo Mode)";
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
