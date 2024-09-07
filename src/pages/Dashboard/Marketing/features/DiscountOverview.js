import React, { useEffect } from "react";

import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import { isEmpty } from "lodash";
import { numberWithCommas } from "utils/formatter";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import MarketingStore from "../store";
import { NAIRA } from "utils/appConstant";

const DiscountOverview = ({ details }) => {
  const { getDiscountStat, discountStat, loadingDiscountStat } = MarketingStore;

  useEffect(() => {
    if (details?.discountCode) {
      getDiscountStat({
        data: { discountCode: details?.discountCode },
      });
    }
  }, [details?.discountCode]);

  return (
    <>
      <div className="flex flex-col justify-center items-start gap-y-2 w-full pb-4">
        <p className="text-base uppercase">Discount Overview</p>

        <div className="w-full flex flex-col justify-center items-center gap-4 mt-2">
          <div className="flex flex-col flex-grow justify-start items-center w-full h-full">
            {loadingDiscountStat ? (
              <div className="w-full h-full flex justify-center items-center">
                <CircleLoader blue />
              </div>
            ) : !isEmpty(discountStat) ? (
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 justify-center items-center gap-6">
                {/* Card 1 */}
                <div className="w-full flex justify-center items-center box-shadow bg-white rounded-lg p-[4px]">
                  <div className="w-full flex flex-col justify-center items-start bg-red-light2 rounded-lg px-2 py-4 gap-3">
                    <div className="flex justify-center items-center gap-2 pb-3 border-b-1/2 border-grey-light3 w-full">
                      <span className="text-xl font-700">
                        Total Amount Saved
                      </span>
                    </div>

                    <div className="flex justify-center items-center gap-2 text-[20px] font-600 w-full">
                      {NAIRA}
                      {numberWithCommas(discountStat?.totalAmountSaved)}
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="w-full flex justify-center items-center box-shadow bg-white rounded-lg p-[4px]">
                  <div className="w-full flex flex-col justify-center items-start bg-red-light2 rounded-lg px-2 py-4 gap-3">
                    <div className="flex justify-center items-center gap-2 pb-3 border-b-1/2 border-grey-light3 w-full">
                      <span className="text-xl font-700">Total Orders</span>
                    </div>

                    <div className="flex justify-center items-center gap-2 text-[20px] font-600 w-full">
                      {numberWithCommas(discountStat?.totalOrders)}
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="w-full flex justify-center items-center box-shadow bg-white rounded-lg p-[4px]">
                  <div className="w-full flex flex-col justify-center items-start bg-red-light2 rounded-lg px-2 py-4 gap-3">
                    <div className="flex justify-center items-center gap-2 pb-3 border-b-1/2 border-grey-light3 w-full">
                      <span className="text-xl font-700">Total Users</span>
                    </div>

                    <div className="flex justify-center items-center gap-2 text-[20px] font-600 w-full">
                      {numberWithCommas(discountStat?.totalUsers)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm text-grey flex flex-col justify-center items-center space-y-3 h-full">
                  This dicount has not been used.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
DiscountOverview.propTypes = {
  details: PropTypes.object,
};
export default observer(DiscountOverview);
