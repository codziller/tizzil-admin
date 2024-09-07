import clsx from "classnames";

import ToolTip from "components/General/ToolTip";

export function truncatedText(
  text,
  maxWidth = "110px",
  className = "text-black"
) {
  return (
    <div className="flex">
      {" "}
      <ToolTip content={text}>
        <span
          className={clsx(
            `leading-none whitespace-nowrap truncate text-ellipsis overflow-hidden`,
            className
          )}
          style={{ maxWidth }}
        >
          {text}
        </span>
      </ToolTip>
    </div>
  );
}
