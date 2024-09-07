import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import UsersStore from "../store";
import Form from "./Form";

const AddUser = () => {
  const { user_id } = useParams();
  const { getUser, getUserLoading } = UsersStore;
  useEffect(() => {
    user_id && getUser({ data: { id: user_id } });
  }, [user_id]);

  return (
    <div className="h-full md:pr-4 pt-1 w-full flex justify-center items-start">
      {getUserLoading ? (
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
export default observer(AddUser);
