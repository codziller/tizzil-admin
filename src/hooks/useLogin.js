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
    let targetRoute = "/dashboard/home";
    let shouldNavigate = true;

    if (user?.access_token) {
      // Save auth tokens
      saveToken(user.access_token);
      localStorage.setItem("refresh_token", user.refresh_token || "");

      // Save user data using storage utility
      saveUserInfoToStorage(user);
      setAuthenticatedUser(user);

      // Check if user is Tizzil Admin
      const isAdmin = user.user?.userRole?.name === "ADMIN";

      if (isAdmin) {
        // Admin users go directly to dashboard
        targetRoute = "/dashboard/home";
      } else {
        // For brand users, check if brand setup is complete
        const hasBrandSetup = user.brand && user.brandUser;

        if (!hasBrandSetup) {
          // Redirect to account setup
          targetRoute = "/auth/account-setup";
        } else {
          // Brand setup is complete, go to dashboard
          targetRoute = "/dashboard/home";
        }
      }
    } else if (user?.accessToken) {
      // Legacy login support
      const { accessToken, ...rest } = user;
      const warehouseId =
        rest?.user?.warehouseStaff?.warehouseId ||
        (IS_DEV && "61cbeb71-74a5-4ceb-8d9c-41433c4b3d5a") ||
        "";
      const brandId = rest?.user?.brandId;
      const role = rest?.user?.role;
      const defaultRoute = "/dashboard/home/";
      if (!defaultRoute) {
        shouldNavigate = false;
      } else {
        saveToken(accessToken);
        saveUserInfoToStorage(rest);
        setAuthenticatedUser(user);
        clearAccountCreation();
        targetRoute = route || defaultRoute;
      }
    } else {
      shouldNavigate = false;
    }

    // Perform navigation after all processing is complete
    if (shouldNavigate) {
      navigate(targetRoute, { replace: true });
    }
  };

  return {
    logUserIn,
  };
}

export default useLogin;
