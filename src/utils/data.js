import countriesToCurrencies from "country-to-currency";

export const supportedIntlCountries = () => {
  const countries = ["US", "GB", "EU"];
  return countries.map((country) => {
    const currency = countriesToCurrencies[country];
    return {
      label: country === "EU" ? "EUR" : currency,
      value: country === "EU" ? "EUR" : currency,
      country,
    };
  });
};

export const supportedLocalCountries = () => {
  const countries = ["NG"];
  return countries.map((country) => {
    const currency = countriesToCurrencies[country];
    return { label: currency, value: currency, country };
  });
};
