import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { TailSpin } from "react-loader-spinner";
import { ReactComponent as SearchIcon } from "assets/icons/SearchIcon/searchIcon.svg";
import { ReactComponent as CaretDownIcon } from "assets/icons/Arrow/caret-down.svg";
import { ReactComponent as DeleteIcon } from "assets/icons/Remove/Remove.svg";
import { ReactComponent as CheckIcon } from "assets/icons/small-check.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import { ReactComponent as CloseIcon } from "assets/icons/close-x.svg";
import { FormErrorMessage } from "./FormErrorMessage";
import ToolTip from "./ToolTip";

const useClickOutside = (handler, additionalRefs = []) => {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      // Check if click is inside main container
      if (domNode.current?.contains(event.target)) {
        return;
      }

      // Check if click is inside any additional refs (like portal dropdown)
      for (const ref of additionalRefs) {
        if (ref.current?.contains(event.target)) {
          return;
        }
      }

      // If click is outside all containers, call handler
      handler();
    };

    document.addEventListener("mousedown", maybeHandler);
    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const MultiSelect = ({
  label,
  placeholder = "Search and select...",
  value = [],
  onChange,
  onInputChange,
  options = [],
  loadOptions,
  loading = false,
  disabled = false,
  leftIcon,
  showSelectedOutside = true,
  selectedPosition = "above", // "above" or "below"
  customOption,
  customSelectedOption,
  fullWidth = true,
  formError,
  showFormError,
  tooltip,
  onBlur,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [localOptions, setLocalOptions] = useState(options);
  const [isBlurred, setIsBlurred] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const searchInputRef = useRef();
  const hasLoadedInitialOptions = useRef(false);
  const selectElementRef = useRef();
  const dropdownRef = useRef();
  const containerRef = useClickOutside(() => setIsOpen(false), [dropdownRef]);

  const errorObject = (showFormError || isBlurred) && formError;
  const isError = !!errorObject;

  // Reusable function to load default options
  const loadDefaultOptions = useCallback(async () => {
    if (!loadOptions) return;

    setIsSearching(true);
    try {
      const results = await loadOptions("");
      setLocalOptions(results);
    } catch (error) {
      console.error("Error loading default options:", error);
      setLocalOptions([]);
    } finally {
      setIsSearching(false);
    }
  }, [loadOptions]);

  // Debounced search function - only call when user actually types
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (loadOptions && query) {
        setIsSearching(true);
        try {
          const results = await loadOptions(query);
          setLocalOptions(results);
        } catch (error) {
          console.error("Error loading options:", error);
          setLocalOptions([]);
        } finally {
          setIsSearching(false);
        }
      } else if (onInputChange) {
        onInputChange(query);
      }
    }, 300),
    [loadOptions, onInputChange]
  );

  // Handle search input changes
  const handleSearchChange = (newSearchValue) => {
    setSearchValue(newSearchValue);
    if (newSearchValue.length > 0) {
      debouncedSearch(newSearchValue);
    } else if (loadOptions) {
      // Load default options when search is cleared for async search
      loadDefaultOptions();
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchValue("");
    if (loadOptions) {
      // Load default options when clearing search for async search
      loadDefaultOptions();
    }
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!loadOptions) {
      setLocalOptions(options);
      hasLoadedInitialOptions.current = false;
    }
  }, [options, loadOptions]);

  // Load initial options only once when component mounts and has loadOptions
  useEffect(() => {
    if (loadOptions && !hasLoadedInitialOptions.current) {
      hasLoadedInitialOptions.current = true;
      loadDefaultOptions();
    }
  }, [loadOptions, loadDefaultOptions]); // Updated dependencies

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle window resize and scroll to recalculate dropdown position
  useEffect(() => {
    if (isOpen) {
      const handlePositionUpdate = () => {
        calculateDropdownPosition();
      };

      window.addEventListener("resize", handlePositionUpdate);
      window.addEventListener("scroll", handlePositionUpdate, true);

      return () => {
        window.removeEventListener("resize", handlePositionUpdate);
        window.removeEventListener("scroll", handlePositionUpdate, true);
      };
    }
  }, [isOpen]);

  // Function to calculate dropdown position
  const calculateDropdownPosition = () => {
    if (selectElementRef.current) {
      const rect = selectElementRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      setDropdownPosition({
        top: rect.bottom + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
      });
    }
  };

  const handleSelectClick = () => {
    if (disabled) return;
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
    if (!isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleOptionClick = (option) => {
    const isSelected = value.some((item) => item.value === option.value);
    let newValue;

    if (isSelected) {
      newValue = value.filter((item) => item.value !== option.value);
    } else {
      newValue = [...value, option];
    }

    onChange(newValue);
  };

  const handleRemoveOption = (optionToRemove) => {
    const newValue = value.filter(
      (item) => item.value !== optionToRemove.value
    );
    onChange(newValue);
  };

  const handleDone = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  const handleBlur = () => {
    setIsBlurred(true);
    if (onBlur) onBlur();
  };

  const renderOption = (option) => {
    if (customOption) {
      return customOption(option);
    }
    return option.label;
  };

  const renderSelectedOption = (option) => {
    if (customSelectedOption) {
      return customSelectedOption(option, () => handleRemoveOption(option));
    }

    return (
      <div className="flex items-center justify-between w-full border border-[#BBBBBB] h-11 px-4">
        <span className="text-sm">{option.label}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveOption(option);
          }}
          className="ml-2 text-[#6B7280] hover:text-[#374151] focus:outline-none"
        >
          <DeleteIcon className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const displayValue =
    value.length > 0
      ? `${value.length} item${value.length > 1 ? "s" : ""} selected`
      : "";

  return (
    <div className={`${fullWidth ? "w-full" : "w-fit"}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <label className="general-input-label text-grey-dark text-[13px] font-bold !flex justify-start items-center gap-1.5">
            {label}
            {tooltip && (
              <ToolTip content={tooltip}>
                <InfoIcon />
              </ToolTip>
            )}
          </label>
        </div>
      )}

      {/* Selected options above */}
      {showSelectedOutside &&
        selectedPosition === "above" &&
        value.length > 0 && (
          <div className="mb-3.5 flex flex-col gap-2">
            {value.map((option) => (
              <div key={option.value}>{renderSelectedOption(option)}</div>
            ))}
          </div>
        )}

      <div className="relative" ref={containerRef}>
        {/* Select Input */}
        <div
          ref={selectElementRef}
          className={`relative h-11 w-full flex items-center justify-between font-normal outline-none cursor-pointer transition-all duration-300 ease-in-out border border-solid
            ${
              isError
                ? "!border-red bg-white"
                : isOpen || value.length > 0
                ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
                : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white"
            }
            ${disabled && "pointer-events-none opacity-50"}
          `}
          onClick={handleSelectClick}
        >
          {leftIcon && (
            <div className="h-full flex mr-1 justify-center items-center w-8">
              <span className="h-full w-12 absolute top-0 left-0 flex justify-center items-center">
                {leftIcon}
              </span>
            </div>
          )}

          {!leftIcon && (
            <div className="h-full flex mr-1 justify-center items-center w-8">
              <span className="h-full w-12 absolute top-0 left-0 flex justify-center items-center">
                <SearchIcon className="w-4 h-4" />
              </span>
            </div>
          )}

          <div className="flex-1 px-12 flex items-center h-full">
            <span
              className={`text-sm ${
                displayValue ? "text-black" : "text-[#ACACAC]"
              }`}
            >
              {displayValue || placeholder}
            </span>
          </div>

          <div className="h-full flex justify-center items-center w-8">
            <span className="h-full w-12 absolute top-0 right-0 flex justify-center items-center">
              <CaretDownIcon
                className={`w-3 h-3 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Portal-based Options Container */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-white z-[99999] rounded-lg border border-[#E1E1E1] max-h-96"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              boxShadow:
                "0px 20px 24px -4px #10182814, 0px 8px 8px -4px #10182808",
            }}
          >
            <div className="p-2">
              {/* Search and Done Row */}
              <div className="flex items-center justify-between gap-2.5 mb-5">
                <div className="flex-1 relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-3 py-2 pr-8 border border-[#BBBBBB] text-sm focus:outline-none focus:border-[#111111]"
                    onBlur={handleBlur}
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                      <CloseIcon className="w-3 h-3 text-gray-500" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleDone}
                  className="text-[12px] text-[#020617] font-bold focus:outline-none"
                >
                  Done
                </button>
              </div>

              {/* Options List */}
              <div className="max-h-72 overflow-y-auto">
                {loading || isSearching ? (
                  <div className="flex justify-center items-center min-h-[150px]">
                    <TailSpin
                      height="20"
                      width="20"
                      color="#000000"
                      ariaLabel="tail-spin-loading"
                      radius="1"
                      visible={true}
                    />
                  </div>
                ) : localOptions.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {localOptions.map((option) => {
                      const isSelected = value.some(
                        (item) => item.value === option.value
                      );
                      return (
                        <div
                          key={option.value}
                          className="flex items-center h-11 px-4 bg-white hover:bg-[#EEEEEE73] cursor-pointer"
                          onClick={() => handleOptionClick(option)}
                        >
                          {/* Checkbox */}
                          <div
                            className={`w-4 h-4 mr-4 rounded border-[2px] flex items-center justify-center
                              ${
                                isSelected
                                  ? "border-[#690007] bg-[#690007]"
                                  : "border-[#DAE0E6] bg-white"
                              }
                            `}
                          >
                            {isSelected && <CheckIcon className="text-white" />}
                          </div>

                          {/* Option Content */}
                          <div className="flex-1">{renderOption(option)}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex justify-center items-center min-h-[150px] text-sm text-gray-500">
                    {searchValue
                      ? "No options found matching your search"
                      : loadOptions
                      ? "Type to search for options"
                      : "No options available"}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Selected options below */}
      {showSelectedOutside &&
        selectedPosition === "below" &&
        value.length > 0 && (
          <div className="mt-3.5 flex flex-col gap-2">
            {value.map((option) => (
              <div key={option.value}>{renderSelectedOption(option)}</div>
            ))}
          </div>
        )}

      {/* Error message */}
      <div className="h-[13px]">
        {errorObject && <FormErrorMessage type={errorObject} />}
      </div>
    </div>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
  options: PropTypes.array,
  loadOptions: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.element,
  showSelectedOutside: PropTypes.bool,
  selectedPosition: PropTypes.oneOf(["above", "below"]),
  customOption: PropTypes.func,
  customSelectedOption: PropTypes.func,
  fullWidth: PropTypes.bool,
  formError: PropTypes.object,
  showFormError: PropTypes.bool,
  tooltip: PropTypes.string,
  onBlur: PropTypes.func,
};

export default MultiSelect;
