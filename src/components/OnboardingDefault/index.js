import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { IS_DEV } from "utils/appConstant";
import OnboardingHeader from "./OnboardingHeader";
import loginImage from "assets/images/login-image.png";
import signupImage from "assets/images/signup-image.png";

export default function Index({ children }) {
  const location = useLocation().pathname;
  const isSignupPage =
    location.includes("signup") ||
    location.includes("register") ||
    location.includes("account-setup");
  const backgroundImage = isSignupPage ? signupImage : loginImage;

  return (
    <div
      className={`${
        IS_DEV ? "h-with-test-banner" : "h-screen"
      } w-screen bg-white relative overflow-hidden flex flex-col`}
    >
      <OnboardingHeader />

      <div className="flex-1 flex items-start relative">
        {/* Left side image section - Desktop and Tablet - Truly Fixed positioned */}
        <div className="hidden md:block md:w-2/5 lg:w-1/2 fixed left-0 h-[calc(100vh)] z-0">
          <img
            src={backgroundImage}
            alt="Onboarding background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mobile top image */}
        <div className="md:hidden w-full h-[200px] absolute top-[70px] left-0 z-0">
          <img
            src={backgroundImage}
            alt="Onboarding background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side content */}
        <div className="w-full md:w-3/5 lg:w-1/2 md:ml-auto h-full flex flex-col relative z-[8]">
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-6 md:py-12">
            <div className="w-full md:max-w-[362px] md:mx-auto">
              <div className="md:hidden h-[200px]"></div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Index.propTypes = {
  children: PropTypes.elementType,
};
