import { string, bool, node } from "prop-types";
import { Navigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import DashboardLayout from "components/Layout/DashboardLayout";
import { getUserInfoFromStorage } from "utils/storage";
import { ALL_ROLES } from "utils/appConstant";

export const ProtectedRoute = ({ path, notProtected, children, ...rest }) => {
  const { BRAND_STAFF, GENERAL_ADMIN } = ALL_ROLES;
  const user = getUserInfoFromStorage();
  const userRole = user?.user?.role;
  const warehouse_id = user?.user?.warehouseStaff?.warehouseId;
  const brandId = user?.user?.brandId;

  const defaultUrl =
    userRole === BRAND_STAFF
      ? `/dashboard/home/${brandId}`
      : userRole === GENERAL_ADMIN
      ? `/dashboard/home/${warehouse_id}`
      : `/dashboard/orders/${warehouse_id}`;

  const { isAuthenticated } = useAuth();

  // if (notProtected && isAuthenticated) {
  //   return (
  //     <DashboardLayout>
  //       <Navigate replace to={defaultUrl} />;
  //     </DashboardLayout>
  //   );
  // }

  return (
    <DashboardLayout>
      <Navigate replace to={defaultUrl} />;
    </DashboardLayout>
  );

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
