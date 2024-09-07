import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/DashboardLayout";

const FeaturedSection = () => {
  return (
    <div>
      <Helmet>
        <title>Featured Sections - Beautyhut</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default FeaturedSection;
