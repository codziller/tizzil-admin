import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import CategoriesStore from "pages/Dashboard/Categories/store";
import MarketingStore from "../store";
import { groupBy } from "lodash";

const WebMarketingImage = () => {
  const { warehouse_id } = useParams();

  const {
    loadingWebMarketingImages,
    getWebMarketingImages,
    webMarketingImages,
  } = MarketingStore;
  const { headerNavs, getHeaderNavs } = CategoriesStore;
  useEffect(() => {
    getWebMarketingImages({ data: { page: 1 } });
    getHeaderNavs();
  }, []);

  const categoryWebMarketingImage = webMarketingImages?.filter(
    (_) => !_?.isForYou
  );

  const groupedWebMarketingImages = groupBy(
    categoryWebMarketingImage,
    "headerNavId"
  );

  const postCount = 1;
  const postArray = Array.from({ length: postCount }, () => "");

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
        {loadingWebMarketingImages ? (
          <CircleLoader blue />
        ) : (
          <>
            <div className="flex flex-col justify-start items-start gap-4 relative w-full">
              {headerNavs?.map((category) => {
                return (
                  <div
                    className="w-full flex flex-col justify-start items-start gap-1"
                    key={category?.name}
                  >
                    <span className="text-black text-lg sm:text-xl font-700 my-5">
                      Web Marketing Landscape Image ({category?.name})
                    </span>
                    <div className="grid grid-cols-1 justify-between items-start w-full mb-5">
                      {postArray?.map((item, i) => {
                        const slides =
                          groupedWebMarketingImages?.[category?.id];
                        const slide = slides?.[i];
                        return (
                          <Link
                            key={i + "card"}
                            to={
                              slide
                                ? `/dashboard/marketing/edit-web-marketing-image/${warehouse_id}/${category?.id}/${slide?.id}`
                                : `/dashboard/marketing/add-web-marketing-image/${warehouse_id}/${category?.id}`
                            }
                            className="flex justify-center items-center cursor-pointer w-full min-h-[240px] bg-[#F8F8F8] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out gap-2.5 snap-center"
                          >
                            {slide ? (
                              <img
                                src={slide?.imageUrl}
                                alt="slide"
                                className="object-cover w-full h-full object-center  min-h-[240px] max-h-[240px]"
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

export default observer(WebMarketingImage);
