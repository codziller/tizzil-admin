import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const TableAlt = ({ head, children }) => {
  return (
    <div className="flex flex-col w-full justify-start items-start">
      <table className="w-full overflow-x-scroll h-full max-h-fit min-h-36 pb-5">
        <thead className="max-h-fit">
          <tr className="max-h-fit ">
            {head?.map((item, i) => (
              <th
                key={i}
                className={classNames(
                  "max-h-fit border-b-1/2 border-[#E1E1E1]/[.8] py-[15px] px-[10px] text-left",
                  {
                    "max-w-[50px] lg:max-w-fit":
                      item === "Show Account Balance",
                  }
                )}
              >
                <span className="text-base text-grey-text text-left whitespace-nowrap">
                  {item}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="space-y-2 w-full max-h-fit relative">
          {children}
        </tbody>
      </table>
    </div>
  );
};

TableAlt.propTypes = {
  head: PropTypes.array,
  children: PropTypes.any,
};

export default TableAlt;
