import React, { useEffect, useRef, useState } from "react";
import { getBusinessInitials } from "utils/functions";
import { ReactComponent as UserCaret } from "assets/icons/user-caret.svg";
import { getUserInfoFromStorage } from "utils/storage";
import useAuth from "hooks/useAuth";
const HeaderDropDown = () => {
  const domNode = useRef();
  const [active, setActive] = useState(false);
  const [positionTop, setPositionTop] = useState(false);
  const [y, setY] = useState(null);
  const { logout } = useAuth();
  const innerHeight = window.innerHeight;

  useEffect(() => {
    const maybeHandler = () => {
      setY(domNode?.current?.getBoundingClientRect?.()?.top);
    };
    document.addEventListener("scroll", maybeHandler);
    return () => {
      document.removeEventListener("scroll", maybeHandler);
    };
  });
  useEffect(() => {
    const maybeHandler = (event) => {
      if (!domNode.current.contains(event.target || event.target.childNodes)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", maybeHandler);
    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });
  useEffect(() => {
    if (!y) return;
    y > innerHeight / 1.5 ? setPositionTop(true) : setPositionTop(false);
  }, [innerHeight, y]);
  const { user } = getUserInfoFromStorage();
  const userName = user?.firstName && `${user?.firstName} ${user?.lastName}`;

  return (
    <div className="flex flex-row justify-between items-center" ref={domNode}>
      <button
        onClick={() => setActive((prev) => !prev)}
        className="flex justify-center items-center text-center subpixel-antialiased select-none w-full cursor-pointer scale-75"
      >
        <UserCaret />
      </button>

      <div
        className={`flex flex-col justify-center items-center gap-y-2 shadow-[0_-1px_15px_0_rgba(0,0,0,0.08)] pt-4 bg-white rounded-b-lg overflow-hidden overflow-y-auto absolute  w-[240px] max-h-52  z-40 transform transition-all ease-in-out duration-300 
${positionTop ? "bottom-full" : "top-full"}
${
  positionTop
    ? "origin-bottom-right rounded-lg right-0 mb-2"
    : "origin-top-right rounded-b-lg right-0"
}
${!active ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100"}

 `}
      >
        <span className="flex justify-center items-center h-8 w-8 bg-blue text-center text-white rounded-full subpixel-antialiased select-none text-12 cursor-pointer">
          {getBusinessInitials(userName)}
        </span>

        <h3 className="text-[16px] text-black pb-2 pt-3">{userName}</h3>
        <button
          onClick={logout}
          className="w-full border-t border-grey-bordercolor text-red-deep py-4 text-base hover:bg-grey-whitesmoke transition-colors ease-in-out duration-300"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
export default HeaderDropDown;
