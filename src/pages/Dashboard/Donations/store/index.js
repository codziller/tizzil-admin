/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { makeAutoObservable } from "mobx";
import apis from "services/donations";

class DonationsStore {
  // ====================================================
  // State
  // ====================================================
  donationWallet = null;
  donationTransactions = [];
  donationTransactionsCount = null;
  error = null;
  loading = false;
  donationTransactionsLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getDonationWallet = async () => {
    this.loading = true;
    try {
      let res = await apis.getDonationWallet();
      res = res?.donation_wallet;
      this.donationWallet = res;
    } catch (error) {
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

export default new DonationsStore();
