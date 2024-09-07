import React from "react";
import PropTypes from "prop-types";
import { DeleteButton, EditButton } from "components/General/Button";
import ImagesCard from "components/General/ImagesCard";
import DetailsBlock from "./DetailsBlock";

export default function SectionDetails({
  title,
  mainDetails,
  onEdit,
  onDelete,
  productImages,
  onDeleteImage,
  expandPhoto,
  extraInfo,
}) {
  return (
    <div className="flex flex-col justify-start items-center md:max-w-lg w-full h-full md:rounded-lg px-6 border border-grey-border bg-white">
      <div className="hidden md:flex justify-between items-center w-full py-5 border-b border-grey-border overflow-x-auto">
        <h3 className="text-xl text-black">{title}</h3>
        <div className="flex justify-start items-center space-x-3 ">
          {onEdit && <EditButton onClick={onEdit} />}
          {onDelete && <DeleteButton onClick={onDelete} />}
        </div>
      </div>
      <div className="flex flex-col justify-start items-center w-full py-6 space-y-[37px]">
        {mainDetails &&
          Object.keys(mainDetails).map((item) => (
            <DetailsBlock title={item} value={mainDetails[item]} key={item} />
          ))}

        {productImages && productImages.length > 0 && (
          <div className="flex flex-col justify-start items-start w-full space-y-3">
            <span className="text-grey-text">Product images</span>
            <div className="flex flex-row justify-start items-center w-full h-28 space-x-3">
              {productImages.map((el) => (
                <ImagesCard
                  data={el}
                  key={el.item_photo_id}
                  isLoading={false}
                  deleteFunc={() => onDeleteImage(el.item_photo_id)}
                  onClick={() => expandPhoto(el.item_photo)}
                />
              ))}
            </div>
          </div>
        )}
        {extraInfo}
      </div>
    </div>
  );
}

SectionDetails.propTypes = {
  title: PropTypes.string,
  mainDetails: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  productImages: PropTypes.array,
  onDeleteImage: PropTypes.func,
  expandPhoto: PropTypes.func,
  extraInfo: PropTypes.elementType,
};
