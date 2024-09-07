import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/DashboardLayout";

const AffiliateMarketers = () => {
  return (
    <div>
      <Helmet>
        <title>Affiliate Marketers - Beautyhut</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default AffiliateMarketers;
