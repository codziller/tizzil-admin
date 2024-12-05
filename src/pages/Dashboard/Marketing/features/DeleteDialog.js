import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Delete } from "assets/icons/delete-span.svg";

import Button from "components/General/Button/Button";
import MarketingStore from "../store";
import cleanPayload from "utils/cleanPayload";

const DeleteDialog = ({ details, toggler }) => {
  const {
    deleteDiscount,
    deleteDiscountLoading,
    editDiscount,
    editWareHouseLoading,
    deleteHomeSliderImage,
    deleteHomeSliderImageLoading,
    deleteWebMarketingImage,
    deleteWebMarketingImageLoading,
    deleteMobilePagePost,
    deleteMobilePagePostLoading,
    deleteMobileMarketingImage,
    deleteMobileMarketingImageLoading,
    deleteMobileHeaderNavDiscountBanner,
    deleteMobileHeaderNavDiscountBannerLoading,
    unarchiveDiscount,
    unarchiveDiscountLoading,
  } = MarketingStore;
  const navigate = useNavigate();
  const handleOnSubmit = () => {
    if (details?.archived) {
      const payload = { ...details, currentPage: "", archive: false };

      cleanPayload(payload);
      unarchiveDiscount({
        data: payload,
        page: details?.currentPage,
        onSuccess: () => toggler(),
      });
      return;
    }

    const payload = { id: details?.id };
    const pageType = details?.pageType || "Discount";
    switch (pageType) {
      case "Discount":
        deleteDiscount({
          data: payload,
          onSuccess: () => {
            toggler();
          },
        });
        break;

      case "Homepage Slide":
        deleteHomeSliderImage({
          data: payload,
          onSuccess: () => {
            toggler();
            navigate(-1);
          },
        });
        break;
      case "Marketing Image":
        deleteWebMarketingImage({
          data: payload,
          onSuccess: () => {
            toggler();
            navigate(-1);
          },
        });
        break;

      case "Mobile Page Slider":
        deleteMobilePagePost({
          data: payload,
          onSuccess: () => {
            toggler();
            navigate(-1);
          },
        });
        break;

      case "Mobile Marketing Image":
        deleteMobileMarketingImage({
          data: payload,
          onSuccess: () => {
            toggler();
            navigate(-1);
          },
        });
        break;

      case "Mobile Discount Banner":
        deleteMobileHeaderNavDiscountBanner({
          data: payload,
          onSuccess: () => {
            toggler();
            navigate(-1);
          },
        });
        break;
      default:
        break;
    }
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
        details?.pageType
          ? "Delete"
          : details?.archived
          ? "Unarchive"
          : "Archive"
      } ${details?.pageType || "Discount"}`}</p>

      <p className="mb-3 text-sm text-grey text-center">
        Are you sure you want to{" "}
        {details?.pageType
          ? "Delete"
          : details?.archived
          ? "unarchive"
          : "archive"}{" "}
        <span className="text-black">
          "{details?.pageType ? "Delete" : details?.name}"?
        </span>
      </p>

      <Button
        onClick={handleOnSubmit}
        isLoading={
          deleteDiscountLoading ||
          editWareHouseLoading ||
          deleteHomeSliderImageLoading ||
          deleteWebMarketingImageLoading ||
          deleteMobileMarketingImageLoading ||
          deleteMobileHeaderNavDiscountBannerLoading ||
          unarchiveDiscountLoading
        }
        type="submit"
        text={`Yes, ${
          details?.pageType
            ? "Delete"
            : details?.archived
            ? "unarchive"
            : "archive"
        } this ${details?.pageType || "discount"}`}
        className="mb-2"
        fullWidth
        redBg
      />

      <Button
        onClick={() => toggler?.()}
        isDisabled={
          deleteDiscountLoading ||
          editWareHouseLoading ||
          deleteHomeSliderImageLoading ||
          deleteWebMarketingImageLoading ||
          deleteMobilePagePostLoading ||
          deleteMobileMarketingImageLoading ||
          deleteMobileHeaderNavDiscountBannerLoading
        }
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
