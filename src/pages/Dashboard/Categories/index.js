import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/ModernDashboardLayout";

const Categories = () => {
  return (
    <div>
      <Helmet>
        <title>Categories - Tizzil</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default Categories;
