import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/ModernDashboardLayout";

const Marketing = () => {
  return (
    <div>
      <Helmet>
        <title>Marketing - Tizzil</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default Marketing;
