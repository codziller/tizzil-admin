import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import PropTypes from "prop-types";

const Accordion = ({ data, onClick }) => {
  const { title, body } = data;
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleAccordions = () => {
    setIsCollapsed((prev) => !prev);
  };
  return (
    <div
      onClick={() => {
        handleAccordions(title);
        onClick?.(title);
      }}
      className="flex flex-col justify-start items-start w-full transition-all duration-[300ms] ease cursor-pointer "
    >
      <div
        className={`flex justify-between items-start w-full py-[12px] ${
          isCollapsed
            ? "border-b-[0.4px] border-grey-bordercolor"
            : "border-b border-blue"
        } border-solid`}
      >
        <p className="break-words text-left w-full text-grey-dark font-bold text-base">
          {title}
        </p>
        <button
          className={`${
            !isCollapsed && "-rotate-180"
          } transition-all duration-[300ms] ease`}
        >
          {isCollapsed ? <AiOutlinePlus /> : <AiOutlineMinus />}
        </button>
      </div>

      <div
        className={`${
          isCollapsed ? "leading-[0] max-h-[0px] opacity-0" : "leading-normal"
        } py-2 transition-all duration-[300ms] ease cursor-pointer max-w-full `}
      >
        <p className="break-words text-left max-w-[100%] text-grey-dark font-light text-[13px] sm:text-lg">
          {body}
        </p>
      </div>
    </div>
  );
};
Accordion.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
};
export default Accordion;
