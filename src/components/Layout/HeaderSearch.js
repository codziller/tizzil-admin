import React, { useEffect, useState, useRef } from "react";
import moment from "moment";

import classNames from "classnames";

import { isEmpty } from "lodash";
import { useNavigate } from "react-router";
import DropdownLink from "components/General/Dropdown/DropdownLink";
import { hasValue } from "utils/validations";
import SearchBar from "components/General/Searchbar/SearchBar";
import transactionsSlice from "../../pages/Dashboard/WareHouses/slice";

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

const HeaderSearch = () => {
  const requiredFilters = {
    start_date: "2020-01-01",
    end_date: moment().format("YYYY-MM-DD"),
  };

  const searchResults = [];
  const searching = false;
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const searchQuery = searchInput?.trim();

  const fetchMerchants = () => {
    const filters = {
      start_date: requiredFilters.start_date,
      end_date: requiredFilters.end_date,
      ...(hasValue(searchQuery) && {
        account_trade_name: searchQuery,
      }),
    };

    // dispatch(
    //   actions.searchMerchants({
    //     data: filters,
    //     page: 1,
    //   })
    // );
  };

  useEffect(() => {
    if (searchQuery?.length > 1) {
      fetchMerchants();
    } else if (searchQuery === "") {
      // dispatch(actions.emptyMerchantsList());
    }
  }, [searchInput]);

  const domNode = useClickOutside(() => {
    setSearchInput("");

    // dispatch(actions.emptyMerchantsList());
  });

  return (
    <div className="h-[44px] w-[400px]" ref={domNode}>
      <SearchBar
        placeholder="Search for anything"
        onChange={setSearchInput}
        value={searchInput}
        isLoading={searching}
      />
      {!isEmpty(searchResults) && hasValue(searchQuery) && !searching && (
        <div className="mt-[10px] shadow bg-white overflow-hidden overflow-y-auto rounded-b-lg max-h-52 z-40 transform transition-none ease-in-out duration-300">
          {searchResults.map((item) => (
            <DropdownLink
              key={item.tribe_account_id}
              onClick={() => {
                navigate(`/dashboard/merchants/${item.tribe_account_id}`, {
                  state: {},
                });
                navigate(0);
              }}
              className={classNames(
                "py-4 m-2 bg-white hover:bg-grey-whitesmoke px-0 business-link"
              )}
            >
              {item?.account_trade_name}
            </DropdownLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
