import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/ModernDashboardLayout";

const AbandonedCarts = () => {
  return (
    <div>
      <Helmet>
        <title>Abandoned Carts - Tizzil</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default AbandonedCarts;
