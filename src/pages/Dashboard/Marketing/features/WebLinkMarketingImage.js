import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import CategoriesStore from "pages/Dashboard/Categories/store";
import MarketingStore from "../store";
import { groupBy } from "lodash";
import { convertToJs } from "utils/functions";

const WebLinkMarketingImage = () => {
  const { warehouse_id } = useParams();

  const {
    loadingWebLinkMarketingImages,
    getWebLinkMarketingImages,
    webLinkMarketingImages,
  } = MarketingStore;
  const { headerNavs, getHeaderNavs } = CategoriesStore;
  useEffect(() => {
    getWebLinkMarketingImages({ data: { page: 1 } });
    getHeaderNavs();
  }, []);

  const categoryWebLinkMarketingImage = webLinkMarketingImages?.filter(
    (_) => !_?.isForYou
  );

  const groupedWebLinkMarketingImages = groupBy(
    categoryWebLinkMarketingImage,
    "headerNavId"
  );

  const postCount = 4;
  const postArray = Array.from({ length: postCount }, () => "");

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
        {loadingWebLinkMarketingImages ? (
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
                      Marketing Images ({category?.name})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 smlg:grid-cols-4 gap-4 justify-between items-start w-full mb-5">
                      {postArray?.map((item, i) => {
                        const slides =
                          groupedWebLinkMarketingImages?.[category?.id];
                        const slide = slides?.[i];
                        return (
                          <Link
                            key={i + "card"}
                            to={
                              slide
                                ? `/dashboard/marketing/edit-web-link-marketing-image/${warehouse_id}/${category?.id}/${slide?.id}`
                                : `/dashboard/marketing/add-web-link-marketing-image/${warehouse_id}/${category?.id}`
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

export default observer(WebLinkMarketingImage);
