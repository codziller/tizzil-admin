import { useNavigate } from "react-router-dom";
import {
  saveToken,
  saveUserInfoToStorage,
  clearAccountCreation,
} from "utils/storage";
import useAuth from "./useAuth";
import { ALL_ROLES, IS_DEV } from "utils/appConstant";
const {
  GENERAL_ADMIN,
  BRAND_STAFF,
  WAREHOUSE_ADMIN,
  WAREHOUSE_STAFF,
  MARKETER,
  DEVELOPER,
  ALL_BRAND_STAFF,
  CUSTOMER_SUPPORT,
} = ALL_ROLES;
function useLogin() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const logUserIn = (user, route) => {
    if (user?.access_token) {
      // Save auth data to localStorage
      localStorage.setItem("access_token", user.access_token);
      localStorage.setItem("refresh_token", user.refresh_token || "");
      localStorage.setItem("user", JSON.stringify(user.user || {}));
      localStorage.setItem("brand", JSON.stringify(user.brand || {}));
      localStorage.setItem("brandUser", JSON.stringify(user.brandUser || {}));
      
      // DEMO MODE: Save complete user data structure that storage functions expect
      const completeUserData = {
        user: {
          id: user.user?.id || 1,
          email: user.user?.email || "demo@example.com",
          firstName: user.user?.firstName || "Demo",
          lastName: user.user?.lastName || "User",
          role: user.user?.userRole?.name || "BRAND_USER",
          userRole: user.user?.userRole || { name: "BRAND_USER" },
          brandId: user.user?.brandId || 1,
          warehouseStaff: user.user?.warehouseStaff || null,
          ...user.user
        },
        brand: user.brand || {
          id: 1,
          name: "Demo Brand",
          description: "Demo brand for testing"
        },
        brandUser: user.brandUser || {
          id: 1,
          role: "BRAND_OWNER"
        },
        access_token: user.access_token,
        refresh_token: user.refresh_token || ""
      };
      
      // Save using the storage utility function that other parts of the app expect
      saveUserInfoToStorage(completeUserData);
      saveToken(user.access_token);
      setAuthenticatedUser(completeUserData);

      // Check if user is Tizzil Admin
      const isAdmin = user.user?.userRole?.name === "ADMIN";

      // if (isAdmin) {
      //   // Admin users go directly to dashboard
      //   navigate("/dashboard/home", { replace: true });
      //   return;
      // }

      // For brand users, check if brand setup is complete
      const hasBrandSetup = user.brand && user.brandUser;

      // if (!hasBrandSetup) {
      //   // Redirect to account setup
      //   navigate('/auth/account-setup', { replace: true });
      //   return;
      // }

      // Brand setup is complete, go to dashboard
      navigate("/dashboard/home", { replace: true });
    } else if (user?.accessToken) {
      // Legacy login support
      const { accessToken, ...rest } = user;
      const warehouseId =
        rest?.user?.warehouseStaff?.warehouseId ||
        (IS_DEV && "61cbeb71-74a5-4ceb-8d9c-41433c4b3d5a") ||
        "";
      const brandId = rest?.user?.brandId;
      const role = rest?.user?.role;
      const defaultRoute =
        role === CUSTOMER_SUPPORT
          ? `/dashboard/orders/${warehouseId}`
          : role === BRAND_STAFF
          ? `/dashboard/home/${brandId}`
          : role === GENERAL_ADMIN && warehouseId
          ? `/warehouses`
          : role === DEVELOPER && warehouseId
          ? `/dashboard/home/${warehouseId}`
          : (role === WAREHOUSE_ADMIN || role === WAREHOUSE_STAFF) &&
            warehouseId
          ? `/dashboard/orders/${warehouseId}`
          : role === MARKETER && warehouseId
          ? `/dashboard/marketing/${warehouseId}`
          : role === ALL_BRAND_STAFF && warehouseId
          ? `/dashboard/brands/${warehouseId}`
          : "";
      if (!defaultRoute) {
        return;
      }
      saveToken(accessToken);
      saveUserInfoToStorage(rest);
      setAuthenticatedUser(user);
      clearAccountCreation();
      navigate(route || defaultRoute, { replace: true });
    }
  };

  return {
    logUserIn,
  };
}

export default useLogin;
