import React from "react";
import { ReactComponent as TizziLogo } from "assets/logos/logo.svg";

const OnboardingHeader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-[70px] bg-[#F6F7F103] backdrop-blur-[12px] flex items-center justify-center z-[9]">
      <TizziLogo className="w-[91px] h-[24px]" />
    </div>
  );
};

export default OnboardingHeader;
