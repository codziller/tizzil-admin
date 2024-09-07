import React, { useEffect, useState } from "react";
import moment from "moment";
import _ from "lodash";
import qs from "query-string";

import useTableFilter from "hooks/useTableFilter";
import { promos } from "utils/appConstant";
import { hasValue } from "utils/validations";
import { paramsObjectToQueryString } from "utils/request";

export default function FeaturedSectionPage() {
  const requiredFilters = {
    start_date: "2020-01-01",
    end_date: moment().format("YYYY-MM-DD"),
  };

  const defaultFilters = {
    start_date: "",
    end_date: "",
    tx_verb: "",
    fiat_wallet_id: "",
    coin_wallet_id: "",
    account_status: "",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput] = useState("");

  const params = qs.parse(location.hash?.substring(1));

  const searchQuery = searchInput?.trim();

  const { filterData } = useTableFilter({
    defaultFilters,
    currentPage,
    setCurrentPage,
    params,
  });

  const fetchMerchants = () => {
    const filters = {
      start_date: hasValue(filterData?.start_date)
        ? filterData?.start_date
        : requiredFilters.start_date,
      end_date: hasValue(filterData?.end_date)
        ? filterData?.end_date
        : requiredFilters.end_date,
      ...(hasValue(searchQuery) && {
        account_trade_name: searchQuery,
      }),
      ...(hasValue(filterData?.account_status) && {
        account_status: filterData.account_status.value,
      }),
    };

    const paramsData = {
      ...filters,
    };

    if (
      _.isEqual(
        { start_date: paramsData.start_date, end_date: paramsData.end_date },
        requiredFilters
      )
    ) {
      delete paramsData.start_date;
      delete paramsData.end_date;
    }

    window.location.hash = paramsObjectToQueryString(paramsData);
  };

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchInput]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToTop(), [promos]);

  return (
    <>
      <div className="h-full md:pr-4 md:bg-white md:px-4">
        <div className="flex flex-col justify-start items-start h-full w-full gap-y-5">
          <div className="flex justify-between items-center w-full mb-3 gap-1"></div>
        </div>
      </div>
    </>
  );
}
