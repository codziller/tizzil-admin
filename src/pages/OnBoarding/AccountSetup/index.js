import React from "react";
import OnboardingDefault from "components/OnboardingDefault";
import AccountSetupContainer from "./features";

const AccountSetupPage = () => {
  return (
    <div>
      <OnboardingDefault>
        <AccountSetupContainer />
      </OnboardingDefault>
    </div>
  );
};

export default AccountSetupPage;
