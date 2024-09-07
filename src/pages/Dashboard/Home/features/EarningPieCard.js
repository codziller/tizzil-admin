import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { convertToJs } from "utils/functions";
import { numberWithCommas } from "utils/formatter";
import { NAIRA } from "utils/appConstant";
import classNames from "classnames";

const COLORS = [
  "#9990fa",
  "#1a8dff",
  "#50aa75",
  "#FF8042",
  "#61008AA1",
  "#E01E1F",
  "#FFB413",
  "#1E1E1E",
  "#70BAF2",
  "#6F3B21",
];

const EarningPieCard = ({
  icon,
  title,
  data,
  link,
  dataKey,
  nameKey,
  isQuantity,
}) => {
  const total = data.reduce((acc, item) => acc + item[dataKey], 0);

  return (
    <Link
      to={link}
      className="bg-white flex flex-col justify-start items-start w-full h-full border border-transparent hover:border-grey-text pt-3 pb-5 gap-3.5 cursor-pointer transition-colors duration-500 ease-in-out"
    >
      <div className="flex justify-start items-start w-full gap-1 border-b-[0.4px] border-grey-border5 px-3 pb-3">
        <span>{icon}</span>
        <p className="text-sm text-grey-dark">{title}</p>
      </div>
      <div className="px-3 flex items-center justify-start gap-4">
        <PieChart width={180} height={300}>
          <Pie
            data={data}
            height={300}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                name={entry?.order_source}
              />
            ))}
          </Pie>
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
            formatter={(value, name, props) => {
              const { payload } = props;
              const percent = ((payload[dataKey] / total) * 100).toFixed(0);
              return [
                `${percent}% (${NAIRA}${numberWithCommas(payload[dataKey])})`,
                payload[nameKey],
              ];
            }}
          />
        </PieChart>
        <div className="flex flex-col gap-1">
          {data?.map((item, i) => (
            <div className="flex items-center gap-2" key={item?.[nameKey]}>
              <div
                style={{ backgroundColor: COLORS?.[i % COLORS.length] }}
                className={classNames(
                  `flex min-w-[4px] min-h-[40px] max-w-[4px] max-h-[40px]`
                )}
              />

              <div
                style={{ color: COLORS?.[i % COLORS.length] }}
                className="flex flex-col justify-start items-start gap-1 text-sm"
              >
                <span className="legend-label">{item?.[nameKey]}</span>
                <span className="legend-value">
                  {isQuantity ? "" : NAIRA}
                  {numberWithCommas(item?.[dataKey])}
                  {" -> "}({((item?.[dataKey] / total) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

EarningPieCard.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  link: PropTypes.string,
  dataKey: PropTypes.string.isRequired,
  nameKey: PropTypes.string.isRequired,
};

export default EarningPieCard;
