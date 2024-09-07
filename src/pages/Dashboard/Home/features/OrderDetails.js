import React from "react";
import PropTypes from "prop-types";

const DetailBlock = ({ title, value }) => (
  <div className={`flex flex-col justify-center items-start w-full gap-2 px-4`}>
    <h6 className="text-base">{title}</h6>
    <p className="text-grey-label text-sm">{value}</p>
  </div>
);
const OrderDetails = () => {
  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4">
      <h3 className="text-lg mb-5">Order Details</h3>
      <div className="flex flex-col justify-start items-start w-full border border-grey-bordercolor rounded">
        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock title="Customer" value={"Jane Doe"} />
        </div>
        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock title="Order ID" value={"1252657612"} />
        </div>

        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock title="Order Date" value={"June 20, 2023"} />
          <DetailBlock title="Delivery Date" value={"June 20, 2023"} />
        </div>
        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock title="Payment Method" value={"Card"} />
        </div>

        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock
            title="Description"
            value={"Payment for Cerave Moisturizer"}
          />
        </div>
        <div className="flex justify-between items-center w-full py-[18px]">
          <DetailBlock title="Total" value={"₦6,720.00"} />
        </div>
      </div>
    </div>
  );
};

DetailBlock.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};
OrderDetails.propTypes = {
  transaction: PropTypes.object,
};
export default OrderDetails;
