import { countries } from "country-flag-icons";
import { getName } from "country-list";
import PropTypes from "prop-types";

import Select from "components/General/Input/Select";
import Flag from "../Flag";
import { moveCountryToFirst } from "utils/functions";

export const countryOptions = () => {
  const list = [];
  countries.forEach((country) => {
    const countryName = getName(country);
    if (countryName) {
      list.push({
        value: country,
        label: countryName,
      });
    }
  });
  return moveCountryToFirst(list);
};
const CountryListDropdown = ({ onClick, value, ...rest }) => {
  const getValue = () => {
    const selectedOption = countryOptions().find((_) => _.value === value);
    if (selectedOption) return selectedOption;
    return null;
  };

  return (
    <Select
      label={"Country"}
      placeholder="Select Country"
      onChange={({ value }) => onClick(value)}
      options={countryOptions()}
      value={getValue()}
      formatOptionLabel={(option) => (
        <div className="flex flex-row items-center space-x-2">
          <Flag countryCode={option.value} />
          <span className="text-black">{option.label}</span>
        </div>
      )}
      {...rest}
    />
  );
};

CountryListDropdown.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
};

export default CountryListDropdown;
