import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import useLogin from "hooks/useLogin";
import AuthStore from "../store";
import Input from "components/General/Input/Input";
import { observer } from "mobx-react-lite";

const Login = ({ onBackClick, goToForgotPassword }) => {
  const { loading, login } = AuthStore;
  const schema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Please enter your email"),
    password: yup.string().required("Please enter your password"),
  });

  const { logUserIn } = useLogin();

  const defaultValues = {
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
    email: watch("email"),
    password: watch("password"),
  };
  const handleOnSubmit = (e) => {
    login(form, logUserIn);
  };

  return (
    <div className="md:p-7 py-8 px-3 form-container min-w-[calc(100vw-24px)] mini:!min-w-[362px] snap-center">
      {onBackClick && (
        <button onClick={onBackClick} className="scale-90 mb-5">
          <ArrowBack />
        </button>
      )}

      <h2 className="section-heading mb-1 text-xl">Welcome Back</h2>
      <p className="text-base mb-3">Log into your account to continue</p>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col justify-start items-start space-y-6 w-full"
      >
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
          labelControl={
            <label
              onClick={goToForgotPassword}
              className="general-input-label relative text-sm text-blue cursor-pointer"
            >
              Forgot password?
            </label>
          }
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
            text="Log in"
            fullWidth
            isLoading={loading}
            isDisabled={!isValid}
          />
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  onBackClick: PropTypes.func,
  goToForgotPassword: PropTypes.func,
  goToTwoFA: PropTypes.func,
  goToSignUp: PropTypes.func,
};

export default observer(Login);
