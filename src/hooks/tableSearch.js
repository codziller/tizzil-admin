import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export default function useTableSearch({ debounce }) {
  const [search, setSearch] = useState("");
  const [searchTerm, setTermSearch] = useState("");
  const [debounceResolved, setDebounceResolved] = useState(true);
  // used to monitor the user's keystroke, and to prevent calling the endpoint for every alphabet the user types
  // if debouncedSearch is used in the useEffect, function will call until after {debounce} or 1secs
  // This assumes that the user has finished typing
  const [debouncedSearch] = useDebounce(searchTerm, debounce || 1000);

  const handleSearch = (value) => {
    setDebounceResolved(false);
    return setSearch((prev) => {
      if (value.length < prev.length && value.length <= 2) {
        setTermSearch("");
      } else if (value.length < prev.length) {
        setTermSearch(value);
      } else if (value.length > 2) {
        setTermSearch(value);
      }
      return value;
    });
  };

  useEffect(() => {
    if (searchTerm === debouncedSearch) {
      setDebounceResolved(true);
    }
  }, [debouncedSearch]);

  function clearSearch() {
    setSearch("");
    setTermSearch("");
  }

  return {
    search,
    searchTerm,
    debouncedSearch,
    debounceResolved,
    handleSearch,
    clearSearch,
  };
}
