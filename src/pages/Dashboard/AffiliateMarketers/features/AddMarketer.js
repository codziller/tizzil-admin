import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import AffiliateMarketersStore from "../store";
import Form from "./Form";

const AddMarketer = () => {
  const { affiliateMarketer_id } = useParams();
  const { getAffiliateMarketer, getAffiliateMarketerLoading } =
    AffiliateMarketersStore;
  useEffect(() => {
    affiliateMarketer_id &&
      getAffiliateMarketer({ data: { id: affiliateMarketer_id } });
  }, [affiliateMarketer_id]);
  return (
    <div className="h-full md:pr-4 pt-1 w-full flex justify-center items-start">
      {getAffiliateMarketerLoading ? (
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

export default observer(AddMarketer);
