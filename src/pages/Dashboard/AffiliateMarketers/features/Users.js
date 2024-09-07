import React, { useState } from "react";

import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { Link } from "react-router-dom";

import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import UsersPage from "pages/Dashboard/Users/features";

const Users = ({ details, toggler, handleChange, form }) => {
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    categoryId: form?.categoryId || "",
  });

  const isSelected = useCallback(
    (id) => formTwo?.categoryId === id,
    [formTwo.categoryId]
  );

  const handleSubmit = (val) => {
    setFormTwo({ ...formTwo, userId: val });
    handleChange("userId", val);
    toggler?.();
  };
  return (
    <>
      <div className="flex flex-col justify-center items-start gap-y-2 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mr-auto">
            <Close />
          </button>
        )}

        <p className="font-600 text-[20px] ">Select A User</p>

        <p className="mb-3 text-sm text-grey text-left">
          Search for a user to be added to affiliate marketers
        </p>

        <UsersPage
          isModal
          handleUserSelect={(e) => handleSubmit(e?.id)}
          isSelected={isSelected}
        />
      </div>
    </>
  );
};
Users.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default observer(Users);
