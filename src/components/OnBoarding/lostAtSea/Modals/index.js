import Button from "../../../General/Button/Button";
import { ReactComponent as EmailIcon } from "assets/icons/Email/Email.svg";
import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { IS_DEV } from "utils/appConstant";

const LostAtSeaModal = ({ email }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col fixed justify-start items-center h-screen w-screen md:py-8 space-y-20 md:px-4 z-30 top-0 right-0">
        <div className="p-8 flex flex-col justify-start items-center h-screen w-screen md:h-auto space-y-6 bg-white md:w-full md:max-w-md md:rounded-lg">
          {IS_DEV && <div className="h-[6px] w-full" />}
          <div className="h-8 w-20">
            <EmailIcon className="w-full h-full" />
          </div>
          <span className="text-xl md:text-2xl font-bold font-helvetica-medium">
            Check your email
          </span>
          <span className="text-sm md:text-base text-grey-text text-center">
            We have sent a link to <span className="text-black">{email}</span>.{" "}
            <br /> Please click on the link to reset your Bani account password.
          </span>

          <Button
            fullWidth
            text="Return to sign in"
            isOutline
            onClick={() => navigate("/")}
          />
        </div>
      </div>
      <div className="fixed top-0 left-0 h-screen w-screen !my-0 backdrop z-20"></div>
    </>
  );
};

LostAtSeaModal.propTypes = {
  email: PropTypes.string,
};

export default LostAtSeaModal;
