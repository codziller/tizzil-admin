import React from "react";
import Form from "./Form";

export default function AddProduct() {
  return (
    <>
      <div className="h-full md:pr-4 pt-1">
        <Form
          details={{
            isAdd: true,
            link: "/dashboard/products/warehouse_id",
          }}
        />
      </div>
    </>
  );
}
