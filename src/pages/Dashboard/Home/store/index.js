/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { makeAutoObservable } from "mobx";
import apis from "services/common";

class HomeStore {
  // ====================================================
  // State
  // ====================================================
  adminHomePageStats = null;
  brandHomePageStats = null;
  error = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getAdminHomePageStats = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getAdminHomePageStats(data);
      res = res?.adminHomePageStats;
      this.adminHomePageStats = res;
    } catch (error) {
      this.adminHomePageStats = {};
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getBrandHomePageStats = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getBrandHomePageStats(data);
      res = res?.brandHomePageStats;
      this.brandHomePageStats = res;
    } catch (error) {
      this.brandHomePageStats = {};
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getDonationTransactions = async ({ data }) => {
    this.donationTransactionsLoading = true;
    try {
      let res = await apis.getDonationTransactions(data);
      res = res?.donation_wallet_transactions;
      this.donationTransactions = res?.results;
      this.donationTransactionsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.donationTransactionsLoading = false;
    }
  };
}

export default new HomeStore();
