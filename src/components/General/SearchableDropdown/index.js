import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as ArrowDownIcon } from "assets/icons/Arrow/arrow-icon.svg";
import DropdownLink from "../Dropdown/DropdownLink";

const SearchableDropdown = ({
  name,
  placeholder,
  data,
  isLoading,
  clickAndClose,
  onClick,
}) => {
  const [active, setActive] = useState(false);
  const [options, setOptions] = useState([]);
  const [isHover, setIsHover] = useState(false);
  const [positionTop, setPositionTop] = useState(false);
  const [value, setValue] = useState("");
  const domNode = useRef();

  const [y, setY] = useState(null);

  const inputRef = useRef();
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
    y > innerHeight / 2 ? setPositionTop(true) : setPositionTop(false);
  }, [innerHeight, y]);

  useEffect(() => {
    if (!data) return;
    setOptions(data);
  }, [data]);

  return (
    <div
      className={`relative flex flex-col justify-start items-center h-full w-full`}
      ref={domNode}
    >
      <div
        className={`relative cursor-pointer rounded-lg h-12 w-full outline-none capitalize tracking-wider focus:outline-none transition-all duration-75 whitespace-nowrap text-base leading-relaxed border border-solid shadow-none
        ${
          value && (value.length > 0 || value > 0)
            ? active
              ? "border-blue"
              : "hover:bg-grey-whitesmoke"
            : active
            ? "border-blue"
            : "hover:bg-grey-whitesmoke"
        }
        ${isLoading ? "pointer-events-none" : "pointer-events-auto"}
        ${isHover && " hover:bg-grey-whitesmoke"}
        `}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => setActive(true)}
      >
        <div
          className={`cursor-pointer overflow-hidden relative rounded-lg h-full w-full bg-white flex space-x-4 items-center justify-between font-normal capitalize tracking-wider whitespace-nowrap py-3 px-4 text-base leading-relaxed text-left
        ${
          value && (value.length > 0 || value > 0)
            ? active
              ? "border-blue"
              : "text-black hover:bg-grey-whitesmoke"
            : active
            ? "border-blue"
            : "hover:bg-grey-whitesmoke"
        }
        `}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            name={name}
            autoComplete="off"
            className={`cursor-pointer h-10 w-full focus:outline-none focus:border-none bg-transparent capitalize ${
              value && value.length > 0
                ? "text-black"
                : active
                ? "text-black"
                : "text-grey"
            }
            `}
            placeholder={placeholder}
          />

          {/* {isLoading ? (
            <div className="ml-3 h-full flex justify-center items-center pointer-events-none">
              <TailSpin color="#5466F9" height={20} width={20} />
            </div>
          ) : value && (value.length > 0 || value > 0) ? (
            <div
              className={`flex justify-end items-center cursor-pointer ${
                active && "text-blue"
              }
              ${
                !active &&
                value &&
                (value.length > 0 || value > 0) &&
                "text-black-secondary"
              }
              ${isHover && "text-blue"}
              `}
              onClick={(e) => {
                // e.preventDefault();
                // e.stopPropagation();
                setActive(false);
                cancelFunc();
              }}
            >
              <Cancel className="stroke-current h-3.5 w-3.5" />
            </div>
          ) : (
            <span
              className={`flex justify-end items-center transition-transform  duration transform ${
                active ? "-rotate-180 text-blue" : "rotate-0"
              }`}
            >
              <ArrowDownIcon className="stroke-current h-3.5 w-3.5" />
            </span>
          )} */}
          <span
            className={`flex justify-end items-center transition-transform  duration transform ${
              active ? "rotate-0 text-blue" : "-rotate-180"
            }`}
          >
            <ArrowDownIcon className="stroke-current h-3.5 w-3.5" />
          </span>
        </div>
        {/* <label
          htmlFor="text"
          className={`absolute ease-in-out duration-75 z-10 cursor-text pointer-events-none ${
            active || value?.length > 0
              ? "left-2.5 -top-2 text-xs px-1 bg-white "
              : "left-4 top-0 text-sm h-12 flex justify-center items-center "
          } 
            ${active && "text-blue"}
            ${
              active
                ? "text-blue"
                : value?.length > 0
                ? "text-black-secondary"
                : "text-black-disabled"
            } 
            ${isHover && "text-blue"}`}
          onClick={() => inputRef.current.focus()}
        >
          {placeholder}
        </label> */}
      </div>

      <div
        className={` bg-white shadow rounded overflow-hidden overflow-y-auto max-h-60 h-fit cursor-pointer absolute z-40 transform w-full
        ${
          positionTop
            ? "origin-bottom bottom-full left-0 mb-1"
            : "origin-top top-full left-0 mt-1"
        }
        ${
          !active
            ? "opacity-0 pointer-events-none scale-0"
            : "opacity-100 scale-100"
        }
       `}
        onClick={() => {
          if (clickAndClose) return setActive((prev) => !prev);
        }}
      >
        {options &&
          options
            ?.filter((it) => {
              if (value === "") {
                return it;
              } else if (
                it?.category_name.toLowerCase().includes(value?.toLowerCase())
              ) {
                return it;
              } else {
                return "";
              }
            })
            .map((el) => (
              <DropdownLink
                onClick={() => {
                  setValue(el.category_name);
                  onClick(el.category_name, { name, value: el.category_name });
                }}
                key={el.category_name}
              >
                <div className="flex justify-start items-center h-10 w-full px-4 capitalize">
                  {el.category_name}
                </div>
              </DropdownLink>
            ))}
      </div>
    </div>
  );
};

SearchableDropdown.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  clickAndClose: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SearchableDropdown;
