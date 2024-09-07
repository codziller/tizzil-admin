import { useState } from "react";
import _ from "lodash";

export default function useTableFilter({
  defaultFilters,
  defaultExportFilters,
  setFilterModal,
  currentPage,
  setCurrentPage,
}) {
  const [filterInput, setFilterInput] = useState(defaultFilters);
  const [filterData, setFilterData] = useState(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState("");
  const [exportInput, setExportInput] = useState(defaultExportFilters);
  const [requestInput, setRequestInput] = useState(defaultExportFilters);
  const hasChanged = !_.isEqual(defaultFilters, filterInput);

  const handleFilter = () => {
    if (hasChanged) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      setFilterData(filterInput);
      setFilterModal?.("");
    } else {
      setFilterModal?.("");
    }
  };

  const clearFilters = () => {
    if (!_.isEqual(defaultFilters, filterInput)) {
      setFilterData(defaultFilters);
      setFilterInput(defaultFilters);
      setCurrentPage(1);
      setFilterModal?.(false);
    }
  };

  const onRemoveFilter = (filter) => {
    setFilterData({
      ...filterData,
      [filter]: defaultFilters[filter],
    });
    setFilterInput({
      ...filterData,
      [filter]: defaultFilters[filter],
    });
  };

  const handleSearch = () => {
    setSearchData(searchInput);
  };

  const clearSearch = () => {
    setSearchData("");
    setSearchInput("");
    setCurrentPage(1);
  };
  return {
    filterInput,
    setFilterInput,
    filterData,
    handleFilter,
    clearFilters,
    onRemoveFilter,
    hasChanged,
    exportInput,
    setExportInput,
    setRequestInput,
    requestInput,
    handleSearch,
    clearSearch,
    searchInput,
    setSearchInput,
    searchData,
  };
}
