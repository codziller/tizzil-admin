import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Delete } from "assets/icons/delete-span.svg";

import Button from "components/General/Button/Button";
import StaffsStore from "../store";
import cleanPayload from "utils/cleanPayload";

const DeleteDialog = ({ details, toggler }) => {
  const { warehouse_id } = useParams();
  const { deleteStaff, deleteStaffLoading, editStaff, editWareHouseLoading } =
    StaffsStore;
  const navigate = useNavigate();
  const handleOnSubmit = () => {
    if (details?.isDeleted) {
      const payload = { ...details, currentPage: "", isDeleted: false };

      cleanPayload(payload);
      editStaff({
        data: payload,
        page: details?.currentPage,
        onSuccess: () => navigate(`/dashboard/staffs/${warehouse_id}`),
      });
      return;
    }
    const payload = { id: details?.id };
    deleteStaff({
      data: payload,
      onSuccess: () => {
        toggler();
        navigate(`/dashboard/staffs/${warehouse_id}`);
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
        details?.isDeleted ? "Unarchive" : "Archive"
      } Staff`}</p>

      <p className="mb-3 text-sm text-grey text-center">
        Are you sure you want to {details?.isDeleted ? "unarchive" : "archive"}{" "}
        <span className="text-black">
          "{details?.firstName} {details?.lastName}"?
        </span>
      </p>

      <Button
        onClick={handleOnSubmit}
        isLoading={deleteStaffLoading || editWareHouseLoading}
        type="submit"
        text={`Yes, ${details?.isDeleted ? "unarchive" : "archive"} this staff`}
        className="mb-2"
        fullWidth
        redBg
      />

      <Button
        onClick={() => toggler?.()}
        isDisabled={deleteStaffLoading || editWareHouseLoading}
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
