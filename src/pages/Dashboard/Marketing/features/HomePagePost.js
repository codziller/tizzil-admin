import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import MarketingStore from "../store";
import { observer } from "mobx-react-lite";
import ProductCard from "components/General/Cards/ProductCard";
import classNames from "classnames";

const HomePagePost = () => {
  const { warehouse_id } = useParams();

  const { loadingImages, getImages, images } = MarketingStore;
  useEffect(() => {
    getImages({ data: { page: 1 } });
  }, []);

  const postCount = 3;
  const postArray = Array.from({ length: postCount }, () => "");

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
        <div className="flex justify-between items-center w-full mb-3 gap-1">
          <span className="text-black text-lg sm:text-xl font-700 my-5">
            Manage Homepage Post
          </span>
        </div>

        {loadingImages ? (
          <CircleLoader blue />
        ) : (
          <>
            <div className="relative w-full">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 md:gap-x-10 md:gap-y-12 justify-start items-start w-full">
                {postArray?.map((item, i) => {
                  const slide = images?.[i];
                  return (
                    <Link
                      key={i + "card"}
                      to={
                        slide
                          ? `/dashboard/marketing/edit-homepage-post/${warehouse_id}/${
                              i + 1
                            }/${slide?.id}`
                          : `/dashboard/marketing/add-homepage-post/${warehouse_id}/${
                              i + 1
                            }`
                      }
                      className={classNames(
                        "flex justify-center items-center cursor-pointer w-full",
                        {
                          "min-h-[300px] bg-[#F8F8F8] rounded-[7px] border-[0.8px] border-grey-border hover:border-blue transition-colors duration-500 ease-in-out":
                            !slide,
                        }
                      )}
                    >
                      {slide ? (
                        <ProductCard key={i + "slide"} details={slide} />
                      ) : (
                        <NewPlus className="stroke-current" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(HomePagePost);
