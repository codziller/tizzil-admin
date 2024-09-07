import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import React, { useState } from "react";

import Chart from "react-apexcharts";
import { barOptions, barSeries } from "utils/appConstant";

import dateConstants from "utils/dateConstants";

export const dateFilters = [
  {
    value: "today",
    label: "Today",
    start_date: dateConstants?.today,
    end_date: dateConstants?.today,
  },
  {
    value: "this_week",
    label: "This Week",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
  {
    value: "all_time",
    label: "All Time",
    start_date: dateConstants?.firstDay,
    end_date: dateConstants?.today,
  },
];

const TransactionValueCard = () => {
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);

  return (
    <div className="bg-white flex flex-col justify-start items-start w-full border border-grey-bordercolor rounded-lg px-3 py-5 gap-3.5">
      <div className="flex justify-between items-center w-full gap-3">
        <p className="text-[12px] uppercase text-grey-text font-thin w-full">
          Orders
        </p>
        <div className="w-[150px]">
          <DashboardFilterDropdown
            placeholder="Filter by: "
            options={dateFilters}
            name="payout_filter"
            onClick={(e) => setDateFilter(e)}
            value={dateFilter?.label}
            align="items-end"
          />
        </div>
      </div>

      <div className="w-full min-h-[100px] -mb-8 basier-regular inflow-chart">
        <Chart
          options={barOptions}
          series={barSeries}
          type="bar"
          width={"100%"}
          height={220}
        />
      </div>
    </div>
  );
};

export default TransactionValueCard;
