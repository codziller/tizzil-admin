import React from "react";
import Form from "./Form";

export default function AddReferrals() {
  return (
    <>
      <div className="h-full md:pr-4 pt-1">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            {/* Form Section */}
            <div className="flex flex-col md:basis-[60%] justify-start items-start w-full h-full min-h-76 gap-y-5">
              <Form
                details={{
                  isAdd: true,
                  link: "/dashboard/products/warehouse_id",
                }}
              />
            </div>
            {/* Code Section */}

            <div className="flex flex-col justify-start items-start w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
