import { useEffect, useState } from "react";

export default function useDefaultCurrency() {
  const [currency, setCurrency] = useState("");

  useEffect(() => {
    if (currentBusiness) {
      const { fiat_wallet_details } = currentBusiness;
      const defaultWalletCurrency = fiat_wallet_details?.find(
        (item) => item.wallet_type?.toLowerCase() === "default"
      )?.currency;
      setCurrency(defaultWalletCurrency);
    }
  }, [currentBusiness]);
  return {
    currency,
  };
}
