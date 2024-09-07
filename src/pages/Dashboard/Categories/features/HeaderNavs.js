import React, { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import _, { isEmpty } from "lodash";
import CircleLoader from "components/General/CircleLoader/CircleLoader";

import { ReactComponent as Plus } from "assets/icons/add.svg";

import TransactionDetailsModal from "./DetailsModal";
import dateConstants from "utils/dateConstants";
import { Button } from "components/General/Button";
import { observer } from "mobx-react-lite";
import CategoriesStore from "../store";
import classNames from "classnames";
import Dropdown from "./Dropdown";

export const dateFilters = [
  {
    value: "today",
    label: "Today",
    start_date: dateConstants?.today,
    end_date: dateConstants?.today,
  },
  {
    value: "this_week",
    label: "This Week",
    start_date: dateConstants?.startOfWeek,
    end_date: dateConstants?.endOfWeek,
  },
  {
    value: "all_time",
    label: "All Time",
    start_date: dateConstants?.firstDay,
    end_date: dateConstants?.today,
  },
];

const HeaderNavs = () => {
  const {
    headerNavs,
    getHeaderNavs,
    loadingHeaderNavs,
    categoryBrands,
    getCategoryBrands,
    editHeaderNavPosition,
    editHeaderNavPositionLoading,
  } = CategoriesStore;

  const [currentTxnDetails, setCurrentTxnDetails] = useState(null);
  const [headerNavsArray, setHeaderNavsArray] = useState(headerNavs);
  const [activeNav, setActiveNav] = useState("");

  useEffect(() => {
    getHeaderNavs();
    getCategoryBrands();
  }, []);

  useEffect(() => {
    setHeaderNavsArray(headerNavs);
  }, [headerNavs]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [headerNavs]);

  const saveHeaderNavsArray = () => {
    editHeaderNavPosition({
      data: {
        headerNavIds: headerNavsArray?.map((item) => item?.id),
      },
    });
  };

  return (
    <>
      <div className="h-full md:pr-4">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1">
            <Button
              text="Save Header Nav Positions"
              onClick={saveHeaderNavsArray}
              isLoading={editHeaderNavPositionLoading}
            />
            <Button
              text="Add Header Nav"
              icon={<Plus className="stroke-current" />}
              className="hidden md:block"
              onClick={() =>
                setCurrentTxnDetails({ modalType: "addHeaderNav", isAdd: true })
              }
            />
          </div>

          {loadingHeaderNavs ? (
            <CircleLoader blue />
          ) : (
            <>
              <div className="flex flex-col flex-grow justify-start items-center w-full">
                {headerNavsArray?.length > 0 ? (
                  <div
                    onMouseLeave={() => setActiveNav("")}
                    className="bg-red-light3 relative hidden sm:flex flex-row justify-center items-center mx-auto w-full h-[30px] md:h-[40px] py-2 border-y border-grey-border2 px-5 md:px-14 lg:px-16 2xl:px-20 z-20"
                  >
                    {/* Brands start */}
                    <div
                      className={classNames("relative w-fit h-full")}
                      onMouseEnter={() => {
                        setActiveNav("brands");
                      }}
                    >
                      <div
                        className={classNames(
                          "flex justify-center items-center text-base hover:text-grey-blue text-blue font-medium space-x-1.5  px-8 icon-text transition-all duration-300 ease-in-out border-r-1/2 border-grey-border3"
                        )}
                      >
                        <span
                          className={classNames(
                            "text-current whitespace-nowrap px-2 py-0.5 rounded hover"
                          )}
                        >
                          Brands
                        </span>
                      </div>

                      {!isEmpty(categoryBrands) && activeNav === "brands" && (
                        <Dropdown categories={categoryBrands} />
                      )}
                    </div>
                    {/* Brands end */}
                    <ReactSortable
                      list={headerNavsArray}
                      setList={setHeaderNavsArray}
                      className={`hidden md:flex justify-end items-center px-10  w-fit transition-all duration-150 ease-in-out  rounded-[87px]`}
                      animation={300}
                      delayOnTouchStart={true}
                      delay={1.5}
                    >
                      {headerNavsArray?.map(
                        ({ imageUrl, name, categories, id }, i, arr) => (
                          <div
                            className={classNames(
                              " w-full h-full cursor-pointer relative"
                            )}
                            onMouseEnter={() => {
                              setActiveNav(name);
                            }}
                            onClick={() =>
                              setCurrentTxnDetails({
                                id,
                                name,
                                imageUrl,
                                modalType: "editHeaderNav",
                                isAdd: false,
                              })
                            }
                            key={name}
                          >
                            <div
                              className={classNames(
                                "flex justify-center items-center text-base hover:text-grey-blue text-blue font-medium space-x-1.5  px-8 icon-text transition-all duration-300 ease-in-out",

                                {
                                  "border-r-1/2 border-grey-border3":
                                    i !== arr.length - 1,
                                }
                              )}
                            >
                              <span
                                className={classNames(
                                  "text-current whitespace-nowrap px-2 py-0.5 rounded hover"
                                )}
                              >
                                {name}
                              </span>
                            </div>

                            {categories && activeNav === name && (
                              <Dropdown categories={categories} />
                            )}
                          </div>
                        )
                      )}
                    </ReactSortable>
                  </div>
                ) : (
                  <>
                    <div className="text-grey-text flex flex-col justify-center items-center space-y-3 h-full">
                      <span>There are no header navs</span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <TransactionDetailsModal
        active={!!currentTxnDetails}
        details={currentTxnDetails}
        toggler={() => setCurrentTxnDetails(null)}
      />
    </>
  );
};

export default observer(HeaderNavs);
