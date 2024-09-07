import DashboardFilterDropdown from "components/General/Dropdown/DashboardFilterDropdown";
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
const data = [
  {
    name: "Jan",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    uv: 6000,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Apr",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "May",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Jun",
    uv: 7500,
    pv: 3908,
    amt: 2000,
  },
];
const EarningValueCard = () => {
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);

  return (
    <div className="bg-white flex flex-col justify-start items-start w-full border border-grey-bordercolor rounded-lg px-3 py-5 gap-3.5">
      <div className="flex justify-between items-center w-full gap-3">
        <p className="text-[12px] uppercase text-grey-text font-thin w-full">
          Revenue
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

      <div className="bg-white flex flex-col justify-center items-start w-fit border-[0.5px] border-grey-bordercolor rounded-[5px] px-3 py-2 gap-1">
        <p className="text-[8px] uppercase text-grey-text font-thin tracking-wide">
          EARNING RATE
        </p>
        <p className="text-sm text-blue font-thin">1% at NGN 700</p>
      </div>
      <div className="w-full min-h-[100px] mt-4">
        <ResponsiveContainer width="100%" height={122}>
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <YAxis
              axisLine={false}
              tickMargin={0}
              tick={false}
              tickSize={0}
              tickLine={false}
              includeHidden={true}
              width={14}
              name="Earning"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              className="!text-[10px] !text-grey-text"
            />
            <Tooltip
              wrapperClassName="bg-black"
              wrapperStyle={{
                backgroundColor: "#000000",
                borderRadius: "3.5px",
              }}
              contentStyle={{
                padding: "3px 10px",
                backgroundColor: "#000000",
                boxShadow: "0px 4px 4px rgba(225, 225, 225, 0.53)",
                color: "#f5f6fa",
                position: "relative",
                border: "none",
                borderRadius: "3.5px",
                zIndex: 99999999,
                whiteSpace: "nowrap",
              }}
              itemStyle={{ color: "#f5f6fa" }}
            />
            <Area
              type="linear"
              dataKey="uv"
              stroke="#000000"
              strokeWidth={1.5}
              fill="rgba(0, 0, 0, 0.1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningValueCard;
