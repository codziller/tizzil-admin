import React from "react";
import { useNavigate } from "react-router";
import Button from "components/General/Button/Button";
import { ReactComponent as Check } from "assets/icons/Check.svg";

export default function Successful() {
  const navigate = useNavigate();
  return (
    <div className="w-[490px] h-[349px] mt-[-200px] px-16 py-[71px] bg-white rounded-lg border border-neutral-200 flex-col justify-start items-start gap-12 inline-flex">
      <div className="flex-col justify-start w-full items-center gap-8 flex">
        <div className="flex-col justify-start items-center gap-4 flex">
          <div className="w-14 h-14 relative">
            <div className="w-14 h-14 left-0 top-0 absolute bg-white rounded-full border border-indigo-200 flex items-center justify-center">
              <Check className="stroke-current" />
            </div>
          </div>
          <div className="flex-col justify-center items-center gap-1 flex">
            <div className="text-black text-2xl font-medium leading-[35px]">
              Provider Added Succesfully!
            </div>
            <div className="text-center text-stone-400 text-sm font-normal leading-tight">
              You have Succesfully added a provider
            </div>
          </div>
        </div>
        <div className="flex-col w-full justify-center items-center gap-2 flex">
          <Button
            onClick={() => navigate("/warehouses")}
            className="w-full"
            text="View All Your Providers"
          />
        </div>
      </div>
    </div>
  );
}
