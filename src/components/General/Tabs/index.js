import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "classnames";
import { Link } from "react-router-dom";

const Tabs = ({ tabs = [], activeTab, setActiveTab, baseUrl }) => {
  const tabRef = useRef(null);
  const elementsRef = useRef([]);

  const getTabRect = () => {
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

  return (
    <div className="w-full flex relative mb-2">
      <div className="w-full overflow-x-auto ">
        <div
          className="flex flex-row justify-start items-start w-full gap-2"
          ref={tabRef}
        >
          {tabs.map((tab, index) => {
            const tabName = tab?.name || tab;
            const textClass = clsx(
              `w-fit px-2 py-1 text-center cursor-pointer whitespace-nowrap text-sm z-10 border-[0.5px] rounded-md`,
              {
                "text-white font-600 border-transparent": activeTab === tabName,
                "text-black border-black": activeTab !== tabName,
              }
            );
            return baseUrl ? (
              <Link
                to={baseUrl ? `${baseUrl}?tab=${tab?.name}` : "#"}
                key={index}
                ref={(el) => (elementsRef.current[index] = el)}
                className={textClass}
                onClick={() => setActiveTab(tab?.name || tab)}
              >
                {tab?.label || tab}
              </Link>
            ) : (
              <div
                key={index}
                ref={(el) => (elementsRef.current[index] = el)}
                className={textClass}
                onClick={() => setActiveTab(tab?.name || tab)}
              >
                {tab?.label || tab}
              </div>
            );
          })}
        </div>

        <div className="relative w-full h-[26px]">
          <div
            className={`absolute -top-[26px] h-[26px] bg-blue transition-all duration-300 ease-in-out rounded-md`}
            style={{
              //   left: getTabRect()?.left || 0,
              transform: `translateX(${getTabRect()?.left || 0}px)`,
              width: `${getTabRect()?.width || 120}px`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
Tabs.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  baseUrl: PropTypes.string,
};

export default Tabs;
