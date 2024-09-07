import React from "react";
import PropTypes from "prop-types";
import cerave from "assets/images/cerave.png";
import shm from "assets/images/shm.png";
import corsx from "assets/images/corsx.png";
import rashel from "assets/images/rashel.png";
const DetailBlock = ({ title, value, values }) => (
  <div className={`flex flex-col justify-center items-start w-full gap-2 px-4`}>
    <h6 className="text-base">{title}</h6>
    {value && <p className="text-grey-label text-sm">{value}</p>}
    {values?.map((item, i) => (
      <div className="flex justify-start items-center gap-2 w-full">
        {item?.images && (
          <img
            src={item?.images?.[0]}
            className="w-[45px] h-[45px] min-w-[45px] min-h-[45px]"
          />
        )}
        <p key={i} className="text-grey-label text-sm truncate max-w-[100%]">
          {item?.name} {item?.images && <span className="text-red">x3</span>}
        </p>
      </div>
    ))}
  </div>
);
const OrderDetails = ({ transaction }) => {
  return (
    <div className="gap-y-4 py-4 w-full h-full pb-4">
      <h3 className="text-lg mb-5">Referral Details</h3>
      <div className="flex flex-col justify-start items-start w-full border border-grey-bordercolor rounded">
        <div className="flex justify-between items-start w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock
            title="Referrer"
            values={[
              { name: "Jane Doe" },
              {
                name: (
                  <a className="underline cursor-pointer text-grey-dark">
                    Contact User
                  </a>
                ),
              },
            ]}
          />
          <DetailBlock
            title="Contact"
            values={[
              { name: "mubbzy124@gmail.com" },
              { name: "+2346677887766" },
            ]}
          />
        </div>

        <div className="flex justify-between items-start w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock
            title="Referee"
            values={[
              { name: "Jack Jones" },
              {
                name: (
                  <a className="underline cursor-pointer text-grey-dark">
                    Contact User
                  </a>
                ),
              },
            ]}
          />
          <DetailBlock
            title="Contact"
            values={[
              { name: "mubbzy124@gmail.com" },
              { name: "+2346677887766" },
            ]}
          />
        </div>

        <div className="flex justify-between items-center w-full border-b border-grey-bordercolor py-[18px]">
          <DetailBlock title="Date" value={"June 20, 2023"} />
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
