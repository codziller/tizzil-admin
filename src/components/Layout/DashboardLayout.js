import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { ReactComponent as CaretUp } from "assets/icons/caret-up-white.svg";
import Loading from "components/General/CircleLoader/CircleLoader";

import Toast from "../General/Toast/Toast";
import Hamburger from "./Components/hamburger";
import SideNav from "./Components/SideNav";
import HeaderDropDown from "./Components/HeaderDropDown";
import { getCurrentRoute } from "utils/functions";

const DashboardLayout = ({ children }) => {
  const topRef = useRef(null);
  const childrenContainerRef = useRef(null);
  const location = useLocation();
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [sidenavCollapsed, setSidenavCollapsed] = useState(
    !!location.pathname.includes("add")
  );
  const [showScrollTop, setShowScrollTop] = useState(false);

  const layoutLoading = false;

  useEffect(() => {
    setSidenavCollapsed(
      !!(
        location.pathname.includes("add") || location.pathname.includes("edit")
      )
    );
  }, [location]);
  const handleScrollTop = () => {
    if (window.scrollY >= 150) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  useEffect(() => {
    handleScrollTop();
    window.addEventListener("scroll", handleScrollTop);
    return () => {
      window.removeEventListener("scroll", handleScrollTop);
    };
  }, []);

  const scrollToTop = () => {
    topRef.current.scrollIntoView();
  };

  const currentRoute = getCurrentRoute(location.pathname);
  return (
    <div className={`w-screen flex flex-grow flex-col h-full min-h-[100vh]`}>
      <Toast />

      <header
        className={classNames(
          "dashboard-header px-[12px] flex flex-row justify-between items-center w-full border-b border-grey-border h-[60px] md:h-20 mt-[0px] md:mt-0",

          {
            "lg:w-[calc(100%-100px)] lg:ml-[100px]": sidenavCollapsed,
            "lg:w-[calc(100%-250px)] lg:ml-[250px]": !sidenavCollapsed,
          }
        )}
      >
        <div className="relative flex flex-row justify-between items-center mx-auto w-full md:px-4 ">
          <div className="flex flex-row justify-start items-center gap-x-[20px]">
            <Hamburger
              click={() => {
                setSidenavOpen(!sidenavOpen);
              }}
              className={sidenavOpen ? "ham_crossed" : ""}
            />
            <div className="flex flex-col justify-start items-start gap-1 w-full overflow-hidden">
              <span className="text-black text-lg sm:text-xl font-700">
                {currentRoute?.heading || currentRoute?.title}
              </span>
              <span className="text-grey-text2 text-sm sm:text-base truncate">
                {currentRoute?.label}
              </span>
            </div>
          </div>

          <HeaderDropDown />
        </div>
      </header>

      <section className="w-full h-full flex flex-row flex-grow max-w-9xl mx-auto">
        <SideNav
          {...{
            sidenavOpen,
            setSidenavOpen,
            sidenavCollapsed,
            setSidenavCollapsed,
          }}
        />
        <div className="lg:hidden">
          <SideNav
            withBackDrop
            {...{
              sidenavOpen,
              setSidenavOpen,
              sidenavCollapsed,
              setSidenavCollapsed,
            }}
          />
        </div>
        <main
          className={classNames(
            "mt-[60px] md:mt-[80px] w-full bg-grey-whitesmoke pb-14 px-6 flex flex-col flex-grow overflow-y-scroll overflow-x-hidden relative",
            {
              "pt-6": !location.pathname.includes("/dashboard/services"),
            },
            {
              "lg:ml-[100px]": sidenavCollapsed,
              "lg:ml-[250px]": !sidenavCollapsed,
            }
          )}
          ref={childrenContainerRef}
        >
          <div ref={topRef} />

          {layoutLoading ? (
            <div className="flex items-center justify-center h-full w-full">
              <Loading />
            </div>
          ) : (
            children
          )}
        </main>
      </section>

      <button
        onClick={scrollToTop}
        className={classNames(
          "fixed cursor-pointer h-[65.33px] flex items-center justify-center w-[65.33px] rounded-[50%] bg-blue bottom-[130px] right-[10.67px] transition-all duration-500 ease",
          {
            "z-[-9] opacity-0 ": !showScrollTop,
            "z-[200] opacity-100": showScrollTop,
          }
        )}
      >
        <CaretUp className="stroke-white" />
      </button>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.any,
};

export default DashboardLayout;
