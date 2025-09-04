import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";
import Signup from "./Signup";
import SignUpOtp from "./SignUpOtp";

const width = 362;

const SignUpPage = () => {
  const scrollXContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [currentStep, setCurrentStep] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);

  const goToLogin = () => {
    navigate("/auth/login");
  };

  const goToSignUpOtp = () => {
    setCurrentStep(1);
    handleCustomScroll(1);
  };

  const goBackToSignup = () => {
    setCurrentStep(0);
    handleCustomScroll(0);
  };

  const handleCustomScroll = (i) => {
    if (scrollXContainerRef.current) {
      scrollXContainerRef.current.scrollLeft = width * i;
    }
  };

  const SIGN_UP_STEPS = [
    {
      title: "Sign Up - Tizzil",
      component: <Signup goToLogin={goToLogin} goToSignUpOtp={goToSignUpOtp} />,
    },
    {
      title: "Verify Email - Tizzil",
      component: (
        <SignUpOtp
          goToLogin={goToLogin}
          goBackToSignup={goBackToSignup}
          isActive={currentStep === 1}
        />
      ),
    },
  ];

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <div className="flex flex-col justify-start items-start text-left w-full">
      <Helmet>
        <title>{SIGN_UP_STEPS[currentStep]?.title}</title>
      </Helmet>
      <div
        className={`flex w-full gap-8 no-scrollbar snap-mandatory snap-x ${
          pageLoaded && "scroll-smooth"
        } overflow-x-hidden`}
        ref={scrollXContainerRef}
      >
        {SIGN_UP_STEPS.map((item, i) => (
          <div className="w-full md:w-fit" key={i + item.title}>
            {item.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(SignUpPage);
