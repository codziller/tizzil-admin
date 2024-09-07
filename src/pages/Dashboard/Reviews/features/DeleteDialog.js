import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Delete } from "assets/icons/delete-span.svg";

import Button from "components/General/Button/Button";
import ProductsStore from "pages/Dashboard/Products/store";

const DeleteDialog = ({ details, toggler }) => {
  const { deleteReview, deleteReviewLoading, editWareHouseLoading } =
    ProductsStore;

  const handleOnSubmit = () => {
    if (details?.isDeleted) {
      return;
    }
    const payload = { productReviewId: details?.id };
    deleteReview({
      data: payload,
      onSuccess: () => {
        toggler();
      },
    });
  };

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

      <Delete className="scale-90" />
      <p className="font-600 text-xl ">{`${
        details?.isDeleted ? "Unarchive" : "Delete"
      } Review`}</p>

      <p className="mb-3 text-sm text-grey text-center">
        Are you sure you want to {details?.isDeleted ? "unarchive" : "delete"}{" "}
        this review
      </p>

      <Button
        onClick={handleOnSubmit}
        isLoading={deleteReviewLoading}
        type="submit"
        text={`Yes, ${details?.isDeleted ? "unarchive" : "delete"} this review`}
        className="mb-2"
        fullWidth
        redBg
      />

      <Button
        onClick={() => toggler?.()}
        isDisabled={deleteReviewLoading}
        text="No, Cancel"
        className="mb-5"
        fullWidth
        whiteBg
      />
    </div>
  );
};
DeleteDialog.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(DeleteDialog);
