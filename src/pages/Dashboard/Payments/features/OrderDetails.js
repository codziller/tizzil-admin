import React from "react";
import PropTypes from "prop-types";
import cerave from "assets/images/cerave.png";
import shm from "assets/images/shm.png";

const DetailBlock = ({ title, value, values }) => (
  <div className={`flex flex-col justify-center items-start w-full gap-2 px-4`}>
    <h6 className="text-base">{title}</h6>
    {value && <p className="text-grey-label text-sm">{value}</p>}
    {values?.map((item, i) => (
      <div className="flex justify-start items-center gap-2 w-full">
        <img
          src={item?.images?.[0]}
          className="w-[45px] h-[45px] min-w-[45px] min-h-[45px]"
        />
        <p key={i} className="text-grey-label text-sm truncate max-w-[60%]">
          {item?.name} <span className="text-red">x3</span>
        </p>
      </div>
    ))}
  </div>
);
const OrderDetails = ({ transaction }) => {
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
          <DetailBlock
            title="Products"
            values={[
              { name: "Cerave foaming facial cleanser", images: [cerave] },
              { name: "Simple Hydrating Moisturizer", images: [shm] },
            ]}
          />
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
