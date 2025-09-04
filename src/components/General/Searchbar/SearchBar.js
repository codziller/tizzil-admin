import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import Loading from "../CircleLoader/CircleLoader";

const InputLoader = styled(Loading)`
  .content {
    margin-bottom: 0;
  }
`;
const useClickOutside = (handler) => {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      if (!domNode.current.contains(event.target || event.target.childNodes)) {
        handler();
      }
    };
    document.addEventListener("mousedown", maybeHandler);
    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const SearchBar = ({
  placeholder,
  value,
  isLoading,
  onChange,
  className = "hidden lg:flex",
  onSearch,
}) => {
  const [active, setActive] = useState(false);
  const inputRef = useRef();
  const domNode = useClickOutside(() => {
    setActive(false);
  });

  return (
    <div
      className={`h-[40px] w-full mx-auto border-[0.5px] border-solid rounded  justify-start items-center relative transition-all duration-150 ease-in-out !z-0
      ${
        active
          ? " border-blue text-blue"
          : "border-grey-border hover:text-blue hover:border-blue focus:border-blue"
      }
      ${className}`}
      ref={domNode}
      onClick={() => {
        setActive(true);
        inputRef.current.focus();
      }}
    >
      <SearchIcon className="stroke-current absolute h-full flex justify-center items-center right-4" />
      <input
        type="text"
        ref={inputRef}
        className="font-500 pl-4 pr-10 w-full h-full text-[16px] sm:text-sm text-grey-text placeholder:text-grey-text outline-none focus:outline-none font-normal antialiased bg-transparent"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength="40"
      />
      {isLoading && (
        <InputLoader
          size="tiny"
          className="mb-0 absolute right-7 my-auto top-0 bottom-0 h-full flex justify-center items-center"
        />
      )}

      {value?.length && onSearch ? (
        <span
          className="text-sm text-white cursor-pointer rounded-md px-2 py-1 hover:bg-blue-bright mr-3 bg-black transition-colors ease-in-out duration-300"
          onClick={(e) => {
            setActive(false);
            e.preventDefault();
            e.stopPropagation();
            onSearch?.("");
          }}
        >
          Search
        </span>
      ) : null}
      {value?.length ? (
        <span
          className="text-sm text-blue cursor-pointer pr-10"
          onClick={(e) => {
            setActive(false);
            e.preventDefault();
            e.stopPropagation();
            onChange("");
          }}
        >
          Clear
        </span>
      ) : null}
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
};
export default SearchBar;
