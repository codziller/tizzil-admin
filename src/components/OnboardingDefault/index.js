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
    location.includes("signup") || location.includes("register");
  const backgroundImage = isSignupPage ? signupImage : loginImage;

  return (
    <div
      className={`${
        IS_DEV ? "h-with-test-banner" : "h-screen"
      } w-screen bg-white relative overflow-hidden`}
    >
      <OnboardingHeader />

      <div className="h-full flex items-start">
        {/* Left side image - Desktop and Tablet */}
        <div className="hidden md:block md:w-2/5 lg:w-1/2 h-full">
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
        <div className="w-full md:w-3/5 lg:w-1/2 h-full flex items-center justify-center px-6 md:px-12 relative z-10 mt-24">
          <div className="w-full max-w-[362px] mt-[70px] md:mt-0">
            <div className="md:hidden h-[200px]"></div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

Index.propTypes = {
  children: PropTypes.elementType,
};
