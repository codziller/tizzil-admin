import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import BlogStore from "../store";
import Form from "./Form";

const AddBlog = () => {
  const { blog_id } = useParams();
  const { getBlog, getBlogLoading } = BlogStore;

  useEffect(() => {
    blog_id && getBlog({ data: { id: blog_id } });
  }, [blog_id]);

  return (
    <div className="h-full md:pr-4 pt-1 w-full flex justify-center items-start">
      {getBlogLoading ? (
        <CircleLoader blue />
      ) : (
        <Form
          details={{
            isAdd: true,
            link: "/dashboard/blog/warehouse_id",
          }}
        />
      )}
    </div>
  );
};
export default observer(AddBlog);
