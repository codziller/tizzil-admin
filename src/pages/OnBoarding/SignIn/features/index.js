import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";
import Login from "./Login";

const width = 362;
const ROUTE_STACKS = { TWO_FA: "TWO_FA", SIGN_UP: "SIGN_UP" };
const SignIn = () => {
  const { SIGN_UP, TWO_FA } = ROUTE_STACKS;
  const scrollXContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [routeStack, setRouteStack] = useState("");
  const [routeTrigger, setRouteTrigger] = useState(0);

  const handleCustomScroll = (i) => {
    scrollXContainerRef.current.scrollLeft = width * i;
  };
  const routeStackIsSignup = useMemo(
    () => routeStack === SIGN_UP,
    [routeStack]
  );

  const routeStackIsTwoFA = useMemo(() => routeStack === TWO_FA, [routeStack]);

  const SIGN_IN_STEPS = [
    {
      title: "Login - Beautyhut",
      route: "/auth/login",
      component: <Login />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(SIGN_IN_STEPS[0]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [pageNavigationDisabled, setPageNavigationDisabled] = useState(true);

  useEffect(() => {
    setPageLoaded(true);
    setPageNavigationDisabled(false);
  }, []);

  const handleSetCurrentPage = (route) => {
    const selectedPage = SIGN_IN_STEPS.find((item) => item.route === route);
    const selectedIndex = SIGN_IN_STEPS.findIndex(
      (item) => item.route === selectedPage?.route
    );
    selectedPage && setCurrentPage({ ...selectedPage, index: selectedIndex });
    handleCustomScroll(selectedIndex);
  };
  const handleActiveSlideUpdate = () => {
    for (let i = 0; i < cardsRef?.current?.length; i++) {
      const x = cardsRef?.current[i]?.getBoundingClientRect()?.x;

      if (x >= 0 && x < 35) {
        // setActiveSlideIndex(i);
      }
    }
  };
  const handleRouteStack = () => {
    if (routeStackIsSignup) {
      navigate("/auth/create-account");
    }
    if (routeStackIsTwoFA) {
      navigate("/auth/2fa");
    }
  };
  useEffect(() => handleSetCurrentPage(location), [location]);
  useEffect(() => routeStack && handleRouteStack(), [routeStack, routeTrigger]);
  const handleCurrentSigninSteps = () => {
    const currentSteps = SIGN_IN_STEPS;
    return currentSteps;
  };
  const CURRENT_SIGN_IN_STEPS = useMemo(() => {
    return handleCurrentSigninSteps();
  }, [routeStack]);

  return (
    <div className="flex flex-col justify-start items-start text-left w-full ">
      <Helmet>
        <title>{currentPage?.title}</title>
      </Helmet>
      <div
        className={`flex w-full gap-8 no-scrollbar snap-mandatory snap-x no-scrollbar ${
          pageLoaded && "scroll-smooth"
        } ${pageNavigationDisabled ? "overflow-x-hidden" : "overflow-x-auto"}`}
        ref={scrollXContainerRef}
        onScroll={(e) => handleActiveSlideUpdate()}
      >
        {CURRENT_SIGN_IN_STEPS.map((item, i) => (
          <div className="w-fit" key={i + item.title}>
            {item.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(SignIn);
