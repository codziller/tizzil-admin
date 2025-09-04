import React from "react";
import { Outlet } from "react-router";
import OnboardingDefault from "components/OnboardingDefault";

const SignUpPage = () => {
  return (
    <div>
      <OnboardingDefault>
        <Outlet />
      </OnboardingDefault>
    </div>
  );
};

export default SignUpPage;
