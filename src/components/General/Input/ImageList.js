import React from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ImageCard from "./ImageCard";
import classNames from "classnames";

const ImageList = ({
  images,
  setImages,
  multiple,
  type,
  removeImage,
  isBanner,
  isPost,
  isMarketingImg,
}) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    try {
      const updatedImages = [...images];
      const [reorderedImage] = updatedImages.splice(result.source.index, 1);
      updatedImages?.splice(result.destination.index, 0, reorderedImage);
      setImages(updatedImages);
    } catch (error) {}
  };

  return (
    <div className="w-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classNames("grid gap-10 my-4", {
                "grid-cols-1": multiple,
                "grid-cols-1 w-full": !multiple,
              })}
            >
              {images?.map((image, index) => (
                <Draggable
                  key={image?.path || image}
                  draggableId={image?.path || image}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {image ? (
                        <ImageCard
                          image={image}
                          multiple={multiple}
                          type={type}
                          removeImage={removeImage}
                          isBanner={isBanner}
                          isPost={isPost}
                          isMarketingImg={isMarketingImg}
                          index={index}
                        />
                      ) : null}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

ImageList.propTypes = {
  images: PropTypes.array,
  setImages: PropTypes.func,
  multiple: PropTypes.bool,
  type: PropTypes.string,
  removeImage: PropTypes.func,
  isBanner: PropTypes.bool,
  isPost: PropTypes.bool,
  isMarketingImg: PropTypes.bool,
};

export default ImageList;
