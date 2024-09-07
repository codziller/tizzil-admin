import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/DashboardLayout";

const Products = () => {
  return (
    <div>
      <Helmet>
        <title>Products - Beautyhut</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default Products;
