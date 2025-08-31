import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import ProviderDashboardLayout from "components/Layout/ProviderDashboardLayout";

const ProviderDashboard = () => {
  return (
    <div>
      <Helmet>
        <title>Provider - Tizzil</title>
      </Helmet>
      <ProviderDashboardLayout>
        <Outlet />
      </ProviderDashboardLayout>
    </div>
  );
};

export default ProviderDashboard;
