import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/DashboardLayout";

const Payments = () => {
  return (
    <div>
      <Helmet>
        <title>Payments - Beautyhut</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default Payments;
