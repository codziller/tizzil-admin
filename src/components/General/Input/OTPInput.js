import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const OTPInput = ({ value, onChange, numInputs = 4 }) => {
  const [otp, setOtp] = useState(new Array(numInputs).fill(""));
  const inputRefs = useRef([]);

  // Sync internal state with value prop
  useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, numInputs);
      while (otpArray.length < numInputs) {
        otpArray.push("");
      }
      setOtp(otpArray);
    } else {
      setOtp(new Array(numInputs).fill(""));
    }
  }, [value, numInputs]);

  const handleChange = (element, index) => {
    const val = element.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange(otpString);

    // Focus next input
    if (val && index < numInputs - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, numInputs);

    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length && i < numInputs; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus last filled input or first empty one
    const nextIndex = Math.min(pasteData.length, numInputs - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength={1}
          className={`w-[70px] h-[60px] text-center text-[28px] font-bold text-[#1E1E1E] border transition-all duration-300 ease-in-out focus:outline-none ${
            digit
              ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
              : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white focus:bg-white focus:border-[#111111] focus:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
          }`}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

OTPInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  numInputs: PropTypes.number,
};

export default OTPInput;
