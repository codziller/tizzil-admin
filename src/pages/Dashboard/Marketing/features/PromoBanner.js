import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { ReactComponent as NewPlus } from "assets/icons/Plus/new_plus.svg";
import MarketingStore from "../store";
import { observer } from "mobx-react-lite";
import ProductCard from "components/General/Cards/ProductCard";
import classNames from "classnames";

const PromoBanner = () => {
  const { warehouse_id } = useParams();

  const { loadingPromoBanners, getPromoBanners, promoBanners } = MarketingStore;
  useEffect(() => {
    getPromoBanners({ data: { page: 1 } });
  }, []);

  const webPromoBanner = promoBanners?.find((_) => _?.showOnWeb);
  const mobilePromoBanner = promoBanners?.find((_) => _?.showOnMobile);
  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
        {loadingPromoBanners ? (
          <CircleLoader blue />
        ) : (
          <>
            <div className="flex flex-col justify-start items-start gap-4 relative w-full">
              <span className="text-black text-lg sm:text-xl font-700 my-5">
                Web Promo Banner
              </span>

              <Link
                to={
                  webPromoBanner
                    ? `/dashboard/marketing/edit-promo-banner/${warehouse_id}/web/${webPromoBanner?.id}`
                    : `/dashboard/marketing/add-promo-banner/${warehouse_id}/web`
                }
                className="flex justify-center items-center h-[36px] text-center bg-red-light3 cursor-pointer w-full hover:border-red-deep border border-transparent transition-colors duration-500 ease-in-out"
              >
                <p className="text-base font-medium whitespace-nowrap overflow-x-auto overflow-y-hidden px-2">
                  {webPromoBanner?.titleText || "Create Banner"}
                </p>
              </Link>

              <hr className="w-full" />

              <span className="text-black text-lg sm:text-xl font-700 my-5">
                Mobile Promo Banner
              </span>

              <Link
                to={
                  mobilePromoBanner
                    ? `/dashboard/marketing/edit-promo-banner/${warehouse_id}/mobile/${mobilePromoBanner?.id}`
                    : `/dashboard/marketing/add-promo-banner/${warehouse_id}/mobile`
                }
                className="flex justify-center items-center h-[36px] text-center bg-grey-border cursor-pointer w-[375px] hover:border-grey-dark3 border border-transparent transition-colors duration-500 ease-in-out"
              >
                <p className="text-base font-medium text-grey-dark4 w-full whitespace-nowrap overflow-x-auto overflow-y-hidden px-2">
                  {mobilePromoBanner?.titleText || "Create Banner"}
                </p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(PromoBanner);
