import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/DashboardLayout";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home - Beautyhut</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default Home;
