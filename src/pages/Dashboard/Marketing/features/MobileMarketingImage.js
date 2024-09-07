import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import CategoriesStore from "pages/Dashboard/Categories/store";
import MarketingStore from "../store";
import { groupBy } from "lodash";

const MobileMarketingImage = () => {
  const { warehouse_id } = useParams();

  const {
    loadingMobileMarketingImages,
    getMobileMarketingImages,
    mobileMarketingImages,
  } = MarketingStore;
  const { headerNavs, loading, getHeaderNavs } = CategoriesStore;
  useEffect(() => {
    getMobileMarketingImages({ data: { page: 1 } });
    getHeaderNavs();
  }, []);

  const forYouMobileMarketingImage = mobileMarketingImages?.filter(
    (_) => _?.isForYou
  );
  const categoryMobileMarketingImage = mobileMarketingImages?.filter(
    (_) => !_?.isForYou
  );

  const groupedMobileMarketingImages = groupBy(
    categoryMobileMarketingImage,
    "headerNavId"
  );

  const postCount = 4;
  const postArray = Array.from({ length: postCount }, () => "");

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
        {loadingMobileMarketingImages ? (
          <CircleLoader blue />
        ) : (
          <>
            <div className="flex flex-col justify-start items-start gap-4 relative w-full">
              <span className="text-black text-lg sm:text-xl font-700 my-5">
                Marketing Images (For You)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 smlg:grid-cols-4 gap-4 justify-between items-start w-full mb-5">
                {postArray?.map((item, i) => {
                  const slide = forYouMobileMarketingImage?.[i];
                  return (
                    <Link
                      key={i + "card"}
                      to={
                        slide
                          ? `/dashboard/marketing/edit-mobile-marketing-image/${warehouse_id}/forYou/${slide?.id}`
                          : `/dashboard/marketing/add-mobile-marketing-image/${warehouse_id}/forYou`
                      }
                      className="flex justify-center items-center cursor-pointer min-w-[187px]  max-w-[187px] min-h-[275px]  max-h-[275px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5 snap-center"
                    >
                      {slide ? (
                        <img
                          src={slide?.imageUrl}
                          alt="slide"
                          className="object-cover w-full h-full  min-h-[275px]  max-h-[275px]"
                        />
                      ) : (
                        <NewPlus className="stroke-current" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <hr className="w-full" />

              {headerNavs?.map((category) => {
                return (
                  <div
                    className="w-full flex flex-col justify-start items-start gap-1"
                    key={category?.name}
                  >
                    <span className="text-black text-lg sm:text-xl font-700 my-5">
                      Marketing Images ({category?.name})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 smlg:grid-cols-4 gap-4 justify-between items-start w-full mb-5">
                      {postArray?.map((item, i) => {
                        const slides =
                          groupedMobileMarketingImages?.[category?.id];
                        const slide = slides?.[i];
                        return (
                          <Link
                            key={i + "card"}
                            to={
                              slide
                                ? `/dashboard/marketing/edit-mobile-marketing-image/${warehouse_id}/${category?.id}/${slide?.id}`
                                : `/dashboard/marketing/add-mobile-marketing-image/${warehouse_id}/${category?.id}`
                            }
                            className="flex justify-center items-center cursor-pointer min-w-[187px]  max-w-[187px] min-h-[275px]  max-h-[275px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5 snap-center"
                          >
                            {slide ? (
                              <img
                                src={slide?.imageUrl}
                                alt="slide"
                                className="object-cover w-full h-full  min-h-[275px]  max-h-[275px]"
                              />
                            ) : (
                              <NewPlus className="stroke-current" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(MobileMarketingImage);
