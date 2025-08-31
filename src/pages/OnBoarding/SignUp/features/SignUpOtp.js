import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OTPInput from "components/General/Input/OTPInput";
import Button from "components/General/Button/Button";
import { observer } from "mobx-react-lite";
import AuthStore from "../store";
import useLogin from "hooks/useLogin";

const SignUpOtp = ({ goToLogin, goBackToSignup }) => {
  const { loading, signup } = AuthStore;
  const { logUserIn } = useLogin();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [signupData, setSignupData] = useState(null);

  useEffect(() => {
    // Get signup form data from localStorage
    const storedData = localStorage.getItem("signupFormData");
    if (storedData) {
      setSignupData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    let timer = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPChange = (value) => {
    setOtp(value);
  };

  const handleResend = async () => {
    if (canResend && signupData) {
      // Implement resend functionality using AuthStore
      setCountdown(59);
      setCanResend(false);
    }
  };

  const handleSubmit = async () => {
    if (otp.length === 4 && signupData) {
      const signupPayload = {
        ...signupData,
        otp: otp,
      };

      await signup(signupPayload, (response) => {
        if (response) {
          // Clear stored signup data
          localStorage.removeItem("signupFormData");
          // Log the user in
          logUserIn(response);
        }
      });
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="md:px-2 md:py-0 py-8 px-3 form-container min-w-[calc(100vw-24px)] mini:!min-w-[362px] snap-center">
      <h2 className="section-heading mb-1 text-lg text-[#444444]">
        VERIFICATION CODE
      </h2>
      <p className="text-sm mb-6 text-[#000000]">
        We've sent a verification code to your email, kindly enter your code
        here.
      </p>

      <div className="flex flex-col items-center mb-6">
        <OTPInput value={otp} onChange={handleOTPChange} numInputs={4} />
      </div>

      <div className="flex justify-between items-center mb-6 text-xs">
        <span>Enter your code ({formatTime(countdown)})</span>
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`${
            canResend
              ? "text-blue-500 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {canResend ? "Resend" : "Not received? Resend"}
        </button>
      </div>

      <div className="flex flex-col justify-start items-center gap-y-2 w-full">
        <Button
          text="Continue"
          fullWidth
          isLoading={loading}
          isDisabled={otp.length !== 4}
          onClick={handleSubmit}
        />
        <div className="mt-[10px] w-full">
          <Button
            text="BACK TO LOGIN"
            fullWidth
            isOutline
            onClick={goToLogin}
          />
        </div>
      </div>
    </div>
  );
};

SignUpOtp.propTypes = {
  goToLogin: PropTypes.func,
  goBackToSignup: PropTypes.func,
};

export default observer(SignUpOtp);
