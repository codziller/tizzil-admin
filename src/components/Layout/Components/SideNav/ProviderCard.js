import React from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { ReactComponent as SwitchIcon } from "assets/icons/switch-white.svg";
import { getBusinessInitials } from "utils/functions";
import Flag from "components/General/Flag";
import classNames from "classnames";

export default function ProviderCard({
  provider,
  sidenavCollapsed,
  getWareHouseLoading,
}) {
  return (
    <div className="p-3.5 bg-grey-dark3 border border-transparent hover:border-grey-23 transition-colors duration-500 ease-in-out flex flex-col justify-start items-start gap-2.5 w-full overflow-hidden provider-card-nav">
      {getWareHouseLoading ? (
        <div className="flex flex-col justify-between items-start gap-2 w-full ">
          <div className="flex justify-between items-start gap-2 w-full ">
            <Skeleton className="max-h-[32.5px] w-[36px] bg-grey-border2 rounded border-1/2 border-grey-border2" />
            <Skeleton className="max-h-[32.5px] w-[100px] bg-grey-border2 rounded border-1/2 border-grey-border2" />
          </div>
          <Skeleton className="max-h-[32.5px] w-[100px] bg-grey-border2 rounded border-1/2 border-grey-border2" />
        </div>
      ) : (
        <>
          <div
            className={classNames("flex justify-between items-start gap-2", {
              "w-full": !sidenavCollapsed,
            })}
          >
            {!sidenavCollapsed && (
              <div className="flex justify-start items-center gap-2">
                <div>
                  <Flag countryCode={provider?.country} />
                </div>

                <span className="text-grey-23 text-base">
                  {provider?.state}
                </span>
              </div>
            )}
            <span className="flex justify-center items-center rounded-full min-w-[19px] min-h-[19px] bg-grey-16 border border-transparent transition-colors duration-500 ease-in-out switch-icon">
              <SwitchIcon />
            </span>
          </div>

          <div className="justify-start items-center gap-2.5 flex">
            <span className="text-white text-[18px]">
              {sidenavCollapsed
                ? getBusinessInitials(provider?.state)
                : provider?.name}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

ProviderCard.propTypes = {
  provider: PropTypes.object,
  sidenavCollapsed: PropTypes.bool,
  getWareHouseLoading: PropTypes.func,
};
