/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { groupBy, sortBy } from "lodash";
import { makeAutoObservable } from "mobx";
import apis from "services/settings";
import { getLatestObjectByDate } from "utils/functions";

class SettingsStore {
  // ====================================================
  // State
  // ====================================================
  exchangeRate = null;
  loading = false;

  editExchangeRateLoading = false;

  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getExchangeRate = async () => {
    this.loading = true;
    try {
      let res = await apis.getExchangeRate();
      res = res?.exchangeRate;
      res = groupBy(res, "currency");
      const rateObj = Object.keys(res).map((item) => ({
        currency: item,
        value: getLatestObjectByDate(res[item])?.exchangeAmount,
      }));

      this.exchangeRate = rateObj;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  editExchangeRate = async ({ data, onSuccess }) => {
    this.editExchangeRateLoading = true;
    try {
      await apis.editExchangeRate(data);
      successToast(
        "Operation Successful!",
        "Exchange rate updated successfully."
      );
      this.getExchangeRate();
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editExchangeRateLoading = false;
    }
  };
}

export default new SettingsStore();
