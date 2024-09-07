/* eslint-disable no-unused-vars */
import React from "react";

import Table from "components/General/Table";
import useWindowDimensions from "hooks/useWindowDimensions";
import BreadCrumbs from "components/General/BreadCrumbs";

const members = [
  {
    name: "Access token of the user",
    meta: ["POST", "LABEL"],
    date: "24-06-2023",
  },
  {
    name: "Access token of the user",
    meta: ["POST", "LABEL"],
    date: "24-06-2023",
  },
  {
    name: "Access token of the user",
    meta: ["POST", "LABEL"],
    date: "24-06-2023",
  },
  {
    name: "Access token of the user",
    meta: ["POST", "LABEL"],
    date: "24-06-2023",
  },
  {
    name: "Access token of the user",
    meta: ["POST", "LABEL"],
    date: "24-06-2023",
  },
  {
    name: "Access token of the user",
    meta: ["POST", "LABEL"],
    date: "24-06-2023",
  },
  {
    name: "Access token of the user",
    meta: ["POST", "LABEL"],
    date: "24-06-2023",
  },
  {
    name: "Access token of the user",
    meta: ["POST", "LABEL"],
    date: "24-06-2023",
  },
];

const columns = [
  {
    name: "Description of Log",
    selector: (row) => (
      <div className="text-black text-sm font-medium">{row.name}</div>
    ),
  },
  {
    name: "Meta",
    selector: (row) => (
      <div className="w-[115px] h-7 justify-start items-start gap-2 inline-flex">
        {row.meta.map((item) => (
          <div key={item} className="justify-start items-start gap-2 flex">
            <div className="px-1 py-0.5 bg-blue-clear2 bg-opacity-20 rounded-[3px] justify-start items-start gap-2.5 flex">
              <div className="text-black text-[12px] font-normal">{item}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    sortable: false,
  },
  {
    name: "Date",
    selector: (row) => (
      <div className="text-black text-sm font-normal">{row.date}</div>
    ),
    sortable: false,
  },
];

const ListOfLogs = () => {
  const { width } = useWindowDimensions();
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-start items-start w-full md:space-x-5 pr-2 mb-5">
        <BreadCrumbs
          className=""
          links={[
            {
              name: "Providers",
              link: `/warehouses`,
            },
            { name: "Logs" },
          ]}
        />
      </div>
      <h3 className="text-xl whitespace-nowrap mb-[34px]">Logs</h3>
      <Table
        data={members?.length ? members : []}
        columns={width >= 640 ? columns : columns.slice(0, 2)}
        pointerOnHover
        isAlt
        header
        dataRangeFromTo
        tableClassName="txn-section-table no-padding"
        placeholder="Search by Logs"
      />
    </div>
  );
};

export default ListOfLogs;
