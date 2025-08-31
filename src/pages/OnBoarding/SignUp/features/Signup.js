import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { observer } from "mobx-react-lite";
import AuthStore from "../store";

const Signup = ({ goToLogin, goToSignUpOtp }) => {
  const { loading, signup, sendVerificationMail } = AuthStore;

  const schema = yup.object({
    firstName: yup.string().required("Please enter your first name"),
    lastName: yup.string().required("Please enter your last name"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Please enter your email"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Please enter your password"),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const form = {
    firstName: watch("firstName"),
    lastName: watch("lastName"),
    email: watch("email"),
    password: watch("password"),
  };

  const handleOnSubmit = async (e) => {
    try {
      // First, send verification email
      await sendVerificationMail({ email: form.email }, (success) => {
        if (success) {
          // Store form data for later use in OTP verification
          localStorage.setItem("signupFormData", JSON.stringify(form));
          // Navigate to OTP page
          goToSignUpOtp();
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="md:px-2 md:py-0 py-8 px-3 form-container min-w-[calc(100vw-24px)] mini:!min-w-[362px] snap-center">
      <h2 className="section-heading mb-1 text-lg text-[#444444]">
        LET'S GET YOU IN.
      </h2>
      <p className="text-sm mb-3 text-[#000000]">
        Whether you're here to shop or sell, you're in the right place.
      </p>

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col justify-start items-start space-y-2 w-full"
      >
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <Input
              label="First Name"
              value={form?.firstName}
              onChangeFunc={(val) => handleChange("firstName", val)}
              placeholder="Enter your first name"
              type="text"
              formError={errors.firstName}
              required
            />
          </div>
          <div className="flex-1">
            <Input
              label="Last Name"
              value={form?.lastName}
              onChangeFunc={(val) => handleChange("lastName", val)}
              placeholder="Enter your last name"
              type="text"
              formError={errors.lastName}
              required
            />
          </div>
        </div>

        <Input
          label="Email"
          value={form?.email}
          onChangeFunc={(val) => handleChange("email", val)}
          placeholder="Enter your email address"
          type="email"
          formError={errors.email}
          required
        />

        <Input
          label="Password"
          value={form?.password}
          onChangeFunc={(val) => handleChange("password", val)}
          placeholder="Enter your password"
          type="password"
          formError={errors.password}
          required
        />

        <div className="flex flex-col justify-start items-center gap-y-2 w-full">
          <Button
            type="submit"
            text="CREATE ACCOUNT"
            fullWidth
            isLoading={loading}
            isDisabled={!isValid}
          />
          <div className="mt-[10px] w-full">
            <Button text="LOGIN" fullWidth isOutline onClick={goToLogin} />
          </div>
        </div>
      </form>
    </div>
  );
};

Signup.propTypes = {
  goToLogin: PropTypes.func,
  goToSignUpOtp: PropTypes.func,
};

export default observer(Signup);
