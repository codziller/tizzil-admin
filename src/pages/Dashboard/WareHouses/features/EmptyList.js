/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Button from "components/General/Button/Button";
import { ReactComponent as Plus } from "assets/icons/Plus/plus.svg";
import { ReactComponent as Logout } from "assets/icons/Log_Out.svg";
import EmptyState from "assets/logos/emptyState.png";

export default function EmptyList({ handleCreateProvider }) {
  return (
    <div className="w-full min-h-[506px] flex-col justify-start items-center gap-8 inline-flex">
      <div className=" w-full  min-h-[444px] px-10 py-16 bg-white rounded-lg border border-neutral-200 flex-col justify-center items-center flex">
        <div className="flex-col justify-start items-center gap-10 flex">
          <img
            src={EmptyState}
            alt="empty state"
            className="w-[183px] h-[150px]"
          />
          <div className="flex-col justify-center items-center gap-0.5 flex">
            <div className="text-black text-2xl font-medium leading-[35px]">
              No Warehouse Added
            </div>
            <div className="text-center text-stone-400 text-sm font-normal leading-tight">
              Click the button below to add a warehouse
            </div>
          </div>
          <Button
            onClick={handleCreateProvider}
            text="Add New Warehouse"
            icon={<Plus className="stroke-current" />}
          />
          <div className="flex justify-start items-center gap-2.5 text-red">
            <div className="text-base font-medium">Sign Out</div>
            <Logout className="stroke-current current-svg" />
          </div>
        </div>
      </div>
    </div>
  );
}
