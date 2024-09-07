/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/marketers";

class AffiliateMarketersStore {
  // ====================================================
  // State
  // ====================================================
  affiliateMarketers = null;
  affiliateMarketer = null;
  affiliateMarketersCount = null;
  error = null;
  loading = false;
  createAffiliateMarketerLoading = false;
  editAffiliateMarketerLoading = false;
  getAffiliateMarketerLoading = false;
  affiliateMarketerForm = {};
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  setAffiliateMarketerForm = (payload) => {
    this.affiliateMarketerForm = { ...this.affiliateMarketerForm, ...payload };
  };

  getAffiliateMarketers = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getAffiliateMarketers(data);
      res = res?.affiliateMarketers;
      this.affiliateMarketers =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];
      this.affiliateMarketersCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getAffiliateMarketer = async ({ data }) => {
    this.getAffiliateMarketerLoading = true;
    try {
      let res = await apis.getAffiliateMarketer(data);
      res = res?.affiliateMarketer;
      this.affiliateMarketer = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getAffiliateMarketerLoading = false;
    }
  };

  createAffiliateMarketer = async ({ data, onSuccess }) => {
    this.createAffiliateMarketerLoading = true;
    try {
      await apis.createAffiliateMarketer(data);
      successToast(
        "Operation Successful!",
        "Affiliate marketer created Successfully."
      );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.createAffiliateMarketerLoading = false;
    }
  };
  editAffiliateMarketer = async ({ data, onSuccess }) => {
    this.editAffiliateMarketerLoading = true;
    try {
      await apis.editAffiliateMarketer(data);
      successToast(
        "Operation Successful!",
        "Affiliate marketer updated Successfully."
      );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editAffiliateMarketerLoading = false;
    }
  };
}

export default new AffiliateMarketersStore();
