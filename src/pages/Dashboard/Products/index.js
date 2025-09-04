import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/ModernDashboardLayout";

const Products = () => {
  return (
    <div>
      <Helmet>
        <title>Products - Tizzil</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default Products;
