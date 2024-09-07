import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import StaffsStore from "../store";
import Form from "./Form";

const AddStaff = () => {
  const { staff_id } = useParams();
  const { getStaff, getStaffLoading } = StaffsStore;

  useEffect(() => {
    staff_id && getStaff({ data: { id: staff_id } });
  }, [staff_id]);

  return (
    <div className="h-full md:pr-4 pt-1 w-full flex justify-center items-start">
      {getStaffLoading ? (
        <CircleLoader blue />
      ) : (
        <Form
          details={{
            isAdd: true,
            link: "/dashboard/products/warehouse_id",
          }}
        />
      )}
    </div>
  );
};
export default observer(AddStaff);
