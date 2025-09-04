import React from "react";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import { GiCash } from "react-icons/gi";
import { Link } from "react-router-dom";

export default function DeleteDialog({ details, toggler }) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-2 w-full h-full pb-4 overflow-y-auto">
      {details?.link ? (
        <Link to={details?.link} className="scale-90 mb-2 mr-auto">
          <ArrowBack />
        </Link>
      ) : (
        <button onClick={() => toggler?.()} className="scale-90 mb-5 mr-auto">
          <Close />
        </button>
      )}

      <GiCash size={30} className="mb-5" />
      <p className="font-600 text-xl ">Confirm Settlement</p>

      <p className="mb-3 text-sm text-grey text-center">
        Confirm that{" "}
        <span className="text-black">
          &ldquo;{details?.user?.firstName} {details?.user?.lastName}&rdquo;
        </span>{" "}
        has been fully settled
      </p>

      <Button
        onClick={() => toggler?.()}
        type="submit"
        text="Yes, confirm settlement"
        className="mb-2"
        fullWidth
      />

      <Button
        onClick={() => toggler?.()}
        type="submit"
        text="No, Cancel"
        className="mb-5"
        fullWidth
        whiteBg
      />
    </div>
  );
}
DeleteDialog.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
