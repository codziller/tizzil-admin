import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Dropdown = ({ categories }) => {
  const linksLength = categories?.length;
  return (
    <div
      className={classNames(
        "grid grid-cols-4 gap-x-10 gap-y-8 justify-start items-start w-fit text-base transition-all duration-150 ease-in-out bg-white h-fit px-6 py-8  z-30 font-medium absolute animate-slide -left-[100px] top-[30px]",
        {
          "min-w-[160px] max-w-[160px]": linksLength === 1,
          "min-w-[320px] max-w-[320px]": linksLength === 2,
          "min-w-[480px] max-w-[480px]": linksLength === 3,
          "min-w-[640px] max-w-[640px]": linksLength > 3,
        }
      )}
    >
      {categories?.map(({ name, subCategories, brands }) => (
        <div
          key={name}
          className={`flex flex-col justify-start align-start gap-y-3 h-fit`}
        >
          <h3 className="font-bold mb-1 whitespace-nowrap">{name}</h3>
          {subCategories?.map(({ name }, i) => (
            <div
              key={name}
              className={`flex justify-start items-center hover:text-grey-text text-blue bani-base  gap-2 `}
            >
              <span className="text-current ">{name}</span>
            </div>
          ))}
          {brands?.map?.(({ name, id, brandName }, i) =>
            id ? (
              <div
                key={id}
                className={`flex justify-start items-center hover:text-grey-text text-blue bani-base  gap-2 `}
              >
                <span className="text-current ">{name || brandName}</span>
              </div>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
};

Dropdown.propTypes = {
  categories: PropTypes.array,
};

export default Dropdown;
