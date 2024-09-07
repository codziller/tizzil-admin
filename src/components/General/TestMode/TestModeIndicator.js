import React from "react";
import { IS_DEV } from "utils/appConstant";
import { ReactComponent as Warning } from "assets/icons/warning-grey.svg";

const TestModeIndicator = () => {
  return (
    <>
      {IS_DEV && (
        <div className="h-[30px] z-[9998]">
          <div className="w-full bg-cream h-[30px] z-[9998] flex items-center justify-center space-x-[7px] fixed top-0 left-0">
            <Warning />
            <p className="text-grey-dark text-[14px]">
              You are currently on test mode
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TestModeIndicator;
