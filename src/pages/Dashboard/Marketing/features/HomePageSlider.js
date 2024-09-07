import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import MarketingStore from "../store";
import { observer } from "mobx-react-lite";
import SliderPagination from "components/General/siderPagination";
import classNames from "classnames";
import { ReactComponent as Chevron } from "assets/icons/chevron-right-circle.svg";
import useWindowDimensions from "hooks/useWindowDimensions";

const HomePageSlider = () => {
  const { width: windowWidth } = useWindowDimensions;
  const { warehouse_id } = useParams();
  const scrollXContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const [width, setWidth] = useState(null);

  useEffect(() => {
    if (scrollXContainerRef?.current) {
      const elWidth = scrollXContainerRef.current.clientWidth;
      setWidth(elWidth);
    }
  }, [windowWidth]);

  const { loadingHomeSliderImages, getHomeSliderImages, homeSliderImages } =
    MarketingStore;
  useEffect(() => {
    getHomeSliderImages({ data: { page: 1 } });
  }, []);
  const handleCustomScroll = (i) => {
    if (scrollXContainerRef?.current) {
      scrollXContainerRef.current.scrollLeft = width * i;
    }
  };

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleScroll = (direction) => {
    if (direction === "left") {
      scrollXContainerRef.current.scrollLeft -= width;
    } else {
      scrollXContainerRef.current.scrollLeft += width;
    }
  };

  const postCount = 4;
  const postArray = Array.from({ length: postCount }, () => "");

  const handleActiveSlideUpdate = () => {
    for (let i = 0; i < cardsRef?.current?.length; i++) {
      const x = cardsRef?.current[i]?.getBoundingClientRect()?.x;

      if (x >= 0 && x < width) {
        setActiveSlideIndex(i);
      }
    }
  };

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
        <div className="flex justify-between items-center w-full mb-3 gap-1">
          <span className="text-black text-lg sm:text-xl font-700 my-5">
            Manage Homepage Slider
          </span>
        </div>

        {loadingHomeSliderImages ? (
          <CircleLoader blue />
        ) : (
          <>
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                style={{ opacity: activeSlideIndex <= 0 ? 0.6 : 1 }}
                className="flex justify-center items-center absolute top-0 bottom-0 left-4 my-auto max-w-[80px] max-h-[80px] min-w-[80px] min-h-[80px] rounded-full bg-[rgba(245,245,245,0.22)] hover:bg-[rgba(245,245,245,0.5)] transition-colors duration-500 ease-in-out z-10"
              >
                <Chevron className={classNames("scale-75 rotate-[180deg]")} />
              </button>

              <div
                ref={scrollXContainerRef}
                className="flex justify-start items-center gap-4 w-full no-scrollbar overflow-x-auto scroll-smooth snap-mandatory snap-x"
                onScroll={(e) => handleActiveSlideUpdate()}
              >
                {postArray?.map((item, i) => {
                  const slide = homeSliderImages?.[i];
                  return (
                    <Link
                      style={{ minWidth: `${width}px` }}
                      ref={(el) => (cardsRef.current[i] = el)}
                      key={i + "card"}
                      to={
                        slide
                          ? `/dashboard/marketing/edit/${warehouse_id}/${
                              i + 1
                            }/${slide?.id}`
                          : `/dashboard/marketing/add-homepage-slider/${warehouse_id}/${
                              i + 1
                            }`
                      }
                      className="flex justify-center items-center cursor-pointer w-full min-h-[420px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5 snap-center"
                    >
                      {slide ? (
                        <img
                          src={slide?.imageUrl}
                          alt="slide"
                          className="object-cover w-full h-full  min-h-[420px] max-h-[420px]"
                        />
                      ) : (
                        <NewPlus className="stroke-current" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handleScroll("right")}
                style={{
                  opacity: activeSlideIndex >= postArray?.length - 1 ? 0.6 : 1,
                }}
                className="flex justify-center items-center absolute top-0 bottom-0 right-4 my-auto max-w-[80px] max-h-[80px] min-w-[80px] min-h-[80px] rounded-full bg-[rgba(245,245,245,0.22)] hover:bg-[rgba(245,245,245,0.5)] transition-colors duration-500 ease-in-out z-10"
              >
                <Chevron className={classNames("scale-75 ")} />
              </button>
            </div>

            <SliderPagination
              activePage={activeSlideIndex}
              setActivePage={(i) => {
                setActiveSlideIndex(i);
                handleCustomScroll(i);
              }}
              pages={postArray}
              className=""
            />
          </>
        )}
      </div>
    </div>
  );
};

export default observer(HomePageSlider);
