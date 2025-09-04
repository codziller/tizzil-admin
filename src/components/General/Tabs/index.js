import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "classnames";
import { Link } from "react-router-dom";

const Tabs = ({
  tabs = [],
  activeTab,
  setActiveTab,
  baseUrl,
  orientation = "row",
}) => {
  const tabRef = useRef(null);
  const elementsRef = useRef([]);

  const getTabRect = () => {
    if (orientation === "column") return { width: 0, left: 0 };

    const containerLeft = tabRef?.current?.getBoundingClientRect?.()?.left;
    const currentIndex = tabs.indexOf(
      tabs.find((tab) => (tab?.name || tab) === activeTab)
    );
    const elementLeft =
      elementsRef?.current?.[currentIndex]?.getBoundingClientRect?.()?.left;
    const width = elementsRef?.current?.[currentIndex]?.offsetWidth;
    const left = elementLeft - containerLeft;

    return { width, left };
  };

  useEffect(() => {
    elementsRef.current = elementsRef.current.slice(0, tabs.length);
  }, [tabs, activeTab, elementsRef.current, getTabRect?.(), baseUrl]);

  const isRowOrientation = orientation === "row";

  return (
    <div className={`w-full flex relative ${isRowOrientation ? "mb-2" : ""}`}>
      <div className={`w-full ${isRowOrientation ? "overflow-x-auto" : ""}`}>
        <div
          className={clsx("flex w-full", {
            "flex-row justify-start items-start gap-2": isRowOrientation,
            "flex-col gap-1": orientation === "column",
          })}
          ref={tabRef}
        >
          {tabs.map((tab, index) => {
            const tabName = tab?.name || tab;
            const isActive = activeTab === tabName;

            const textClass = clsx(
              "cursor-pointer whitespace-nowrap z-10 transition-all duration-300 ease-in-out",
              {
                // Row orientation styles (original)
                "w-fit px-2 py-1 text-center text-sm border-[0.5px] rounded-md":
                  isRowOrientation,
                "text-white font-600 border-transparent":
                  isRowOrientation && isActive,
                "text-black border-black": isRowOrientation && !isActive,

                // Column orientation styles
                "w-full flex items-center px-3 py-2.5 rounded-lg":
                  orientation === "column",
                "bg-white shadow-sm text-[#690007]":
                  orientation === "column" && isActive,
                "text-[#666666] hover:bg-gray-50":
                  orientation === "column" && !isActive,
              }
            );

            const TabContent = () => (
              <div
                className={clsx("flex items-center", {
                  "gap-2": orientation === "column" && tab?.icon,
                })}
              >
                {orientation === "column" && tab?.icon && (
                  <img
                    src={tab.icon}
                    alt={tab?.label || tab}
                    className={clsx("w-5 h-5", {
                      "text-[#690007]": isActive,
                      "text-[#666666]": !isActive,
                    })}
                    style={{
                      filter: isActive
                        ? "invert(12%) sepia(94%) saturate(7471%) hue-rotate(357deg) brightness(86%) contrast(120%)"
                        : "invert(40%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(96%) contrast(89%)",
                    }}
                  />
                )}
                <span
                  className={clsx({
                    "text-sm": orientation === "column",
                  })}
                >
                  {tab?.label || tab}
                </span>
              </div>
            );

            return baseUrl ? (
              <Link
                to={baseUrl ? `${baseUrl}?tab=${tab?.name}` : "#"}
                key={index}
                ref={(el) => (elementsRef.current[index] = el)}
                className={textClass}
                onClick={() => setActiveTab(tab?.name || tab)}
              >
                <TabContent />
              </Link>
            ) : (
              <div
                key={index}
                ref={(el) => (elementsRef.current[index] = el)}
                className={textClass}
                onClick={() => setActiveTab(tab?.name || tab)}
              >
                <TabContent />
              </div>
            );
          })}
        </div>

        {/* Only show the blue indicator for row orientation */}
        {isRowOrientation && (
          <div className="relative w-full h-[26px]">
            <div
              className={`absolute -top-[26px] h-[26px] bg-blue transition-all duration-300 ease-in-out rounded-md`}
              style={{
                transform: `translateX(${getTabRect()?.left || 0}px)`,
                width: `${getTabRect()?.width || 120}px`,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
Tabs.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  baseUrl: PropTypes.string,
  orientation: PropTypes.oneOf(["row", "column"]),
};

export default Tabs;
