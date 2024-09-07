import { getCountryCodeFromCurrency } from "utils/data";
import useDefaultCurrency from "./defaultCurrency";

export default function useDefaultCountry() {
  const { currency } = useDefaultCurrency();
  return getCountryCodeFromCurrency(currency);
}
