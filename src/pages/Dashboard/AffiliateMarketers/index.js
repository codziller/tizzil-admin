import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/ModernDashboardLayout";

const AffiliateMarketers = () => {
  return (
    <div>
      <Helmet>
        <title>Affiliate Marketers - Tizzil</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default AffiliateMarketers;
