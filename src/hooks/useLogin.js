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
    if (user?.accessToken) {
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
