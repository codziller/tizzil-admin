import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OTPInput from "components/General/Input/OTPInput";
import Button from "components/General/Button/Button";
import { observer } from "mobx-react-lite";
import AuthStore from "../store";
import useLogin from "hooks/useLogin";

const SignUpOtp = ({ goBackToSignup, isActive }) => {
  const { loading, signup } = AuthStore;
  const { logUserIn } = useLogin();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [canResend, setCanResend] = useState(false);
  const [signupData, setSignupData] = useState(null);

  useEffect(() => {
    // Get signup form data from localStorage with retry mechanism
    const loadSignupData = () => {
      const storedData = localStorage.getItem("signupFormData");
      console.log("Retrieved stored data:", storedData);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log("Parsed signup data:", parsedData);
          setSignupData(parsedData);
          return true;
        } catch (error) {
          console.error("Error parsing stored signup data:", error);
        }
      } else {
        console.log("No stored signup data found");
      }
      return false;
    };

    // Try to load immediately
    if (!loadSignupData()) {
      // If failed, retry after a short delay
      const retryTimer = setTimeout(() => {
        console.log("Retrying to load signup data...");
        loadSignupData();
      }, 100);

      return () => clearTimeout(retryTimer);
    }
  }, []);

  // Reset countdown whenever the screen becomes active (entered from signup)
  useEffect(() => {
    if (isActive) {
      console.log("SignUpOtp component is now active, resetting countdown");
      setCountdown(59);
      setCanResend(false);
    }
  }, [isActive]);

  useEffect(() => {
    let timer = null;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
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
    console.log(
      "Hitting submit - OTP:",
      otp,
      "Length:",
      otp.length,
      "SignupData:",
      signupData
    );

    // Check each condition individually for better debugging
    if (otp.length !== 6) {
      return;
    }

    if (!signupData) {
      console.log(
        "SignupData validation failed - signupData is null/undefined"
      );
      // Try to reload data from localStorage as a fallback
      const storedData = localStorage.getItem("signupFormData");
      console.log("Attempting to reload from localStorage:", storedData);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setSignupData(parsedData);
          console.log("Successfully reloaded signup data, please try again");
          return;
        } catch (error) {
          console.error("Failed to reload signup data:", error);
        }
      }
      console.log("No signup data available - cannot proceed with submission");
      return;
    }

    try {
      const signupPayload = {
        ...signupData,
        otp,
      };

      console.log("Starting to submit with payload:", signupPayload);
      await signup(signupPayload, (response) => {
        if (response) {
          console.log("Signup successful, response:", response);
          // Clear stored signup data
          localStorage.removeItem("signupFormData");
          // Log the user in
          logUserIn(response);
        } else {
          console.log("Signup failed - no response received");
        }
      });
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="md:px-2 md:py-0 py-8 px-3 form-container min-w-[calc(100vw-48px)] md:!min-w-[362px] snap-center mt-20">
      <h2 className="section-heading mb-1 text-lg text-[#444444]">
        VERIFICATION CODE
      </h2>
      <p className="text-sm mb-6 text-[#000000]">
        We've sent a verification code to your email, kindly enter your code
        here.
      </p>

      <div className="flex flex-col items-center mb-6">
        <OTPInput value={otp} onChange={handleOTPChange} numInputs={6} />
      </div>

      <div className="flex justify-between items-center mb-6 text-xs">
        <span>
          Enter your code{" "}
          <span className="text-red">({formatTime(countdown)})</span>
        </span>
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
          isDisabled={otp.length !== 6}
          onClick={handleSubmit}
        />
        <div className="mt-[10px] w-full">
          <Button
            text="BACK TO SIGNUP"
            fullWidth
            isOutline
            onClick={goBackToSignup}
          />
        </div>
      </div>
    </div>
  );
};

SignUpOtp.propTypes = {
  goBackToSignup: PropTypes.func,
  isActive: PropTypes.bool,
};

export default observer(SignUpOtp);
