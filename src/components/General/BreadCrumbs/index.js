import React from "react";
import clsx from "classnames";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { ReactComponent as ArrowRight } from "assets/icons/Arrow/arrow-right.svg";
import { BreadCrumbsWrapper } from "./style";

export default function BreadCrumbs({ links, className }) {
  return (
    <BreadCrumbsWrapper
      className={clsx("flex justify-between items-center w-full", className)}
    >
      <div className="flex flex-row justify-start items-center space-x-2 text-base">
        {links.map(({ link, name, style }, index) =>
          link ? (
            <div
              key={name + index}
              className="flex justify-start items-center space-x-2"
            >
              <Link to={link}>
                <span
                  className={clsx("text-grey-ghostwhite cursor-pointer", style)}
                >
                  {name}
                </span>
              </Link>
              {index !== links.length - 1 && (
                <ArrowRight className="-mt-[3px]" />
              )}
            </div>
          ) : (
            <div
              key={name + index}
              className="flex justify-start items-center space-x-2"
            >
              <span className={clsx("text-black", style)} key={name}>
                {name}
              </span>
              {index !== links.length - 1 && (
                <ArrowRight className="-mt-[3px]" />
              )}
            </div>
          )
        )}
      </div>
    </BreadCrumbsWrapper>
  );
}

BreadCrumbs.propTypes = {
  links: PropTypes.array,
  className: PropTypes.string,
};
