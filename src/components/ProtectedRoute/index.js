import { string, bool, node } from "prop-types";
import { Navigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import DashboardLayout from "components/Layout/ModernDashboardLayout";
import { getUserInfoFromStorage } from "utils/storage";
import { ALL_ROLES } from "utils/appConstant";

export const ProtectedRoute = ({ path, notProtected, children, ...rest }) => {
  const { BRAND_STAFF, GENERAL_ADMIN } = ALL_ROLES;
  const user = getUserInfoFromStorage();
  const userRole = user?.user?.role;
  const warehouse_id = user?.user?.warehouseStaff?.warehouseId;
  const brandId = user?.user?.brandId;
  const hasBrandUser = user?.brandUser?.id;
  const hasBrand = user?.brand?.id;

  // Check if user is admin
  const isAdmin = user?.user?.userRole?.name === "ADMIN";

  // Check if brand setup is complete
  const isBrandSetupComplete = brandId || hasBrandUser || hasBrand;

  const defaultUrl =
    userRole === BRAND_STAFF
      ? `/dashboard/home`
      : userRole === GENERAL_ADMIN
      ? `/dashboard/home`
      : `/dashboard/home`;

  const { isAuthenticated } = useAuth();

  if (notProtected && isAuthenticated) {
    return (
      <DashboardLayout>
        <Navigate replace to={defaultUrl} />;
      </DashboardLayout>
    );
  }

  if (!isAuthenticated && !notProtected) {
    return (
      <Navigate
        replace
        to={{
          pathname: "/",
          state: {
            prevLocation: path,
            error: "You need to login first!",
          },
        }}
        exact
      />
    );
  }

  // Admin users can access any page without brand setup
  if (isAuthenticated && isAdmin && !notProtected) {
    // If admin is trying to access account-setup, redirect to dashboard
    if (path === "/auth/account-setup") {
      return (
        <DashboardLayout>
          <Navigate replace to={defaultUrl} />
        </DashboardLayout>
      );
    }
    // Otherwise, allow access
    return <div>{children}</div>;
  }

  // If authenticated but brand setup is not complete (for non-admin users)
  if (isAuthenticated && !isBrandSetupComplete && !notProtected) {
    // If trying to access any page other than account-setup, redirect to account-setup
    if (path !== "/auth/account-setup") {
      return <Navigate replace to="/auth/account-setup" />;
    }
  }

  // If authenticated and brand setup is complete
  if (isAuthenticated && isBrandSetupComplete) {
    // If trying to access account-setup, redirect to dashboard
    if (path === "/auth/account-setup") {
      return (
        <DashboardLayout>
          <Navigate replace to={defaultUrl} />
        </DashboardLayout>
      );
    }
  }

  return <div>{children}</div>;
};

ProtectedRoute.propTypes = {
  notProtected: bool,
  path: string.isRequired,
  children: node,
};

ProtectedRoute.defaultProps = {
  notProtected: false,
};
