import { makeAutoObservable } from "mobx";

class WalletStore {
  // Wallet Balance Data
  totalBalance = 0;
  amountWithdrawn = 0;
  pendingPayout = 0;

  // Transactions
  transactions = [];
  transactionsCount = 0;
  transactionsLoading = false;

  // Request Payout
  requestPayoutLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Actions
  setWalletData = (data) => {
    this.totalBalance = data.totalBalance || 0;
    this.amountWithdrawn = data.amountWithdrawn || 0;
    this.pendingPayout = data.pendingPayout || 0;
  };

  setTransactions = (data) => {
    this.transactions = data.transactions || [];
    this.transactionsCount = data.count || 0;
  };

  setTransactionsLoading = (loading) => {
    this.transactionsLoading = loading;
  };

  setRequestPayoutLoading = (loading) => {
    this.requestPayoutLoading = loading;
  };

  // API Methods (to be implemented with actual API calls)
  getWalletData = async () => {
    // Mock data for now
    this.setWalletData({
      totalBalance: 0,
      amountWithdrawn: 0,
      pendingPayout: 0,
    });
  };

  getTransactions = async ({ page = 1, dateFilter = null } = {}) => {
    this.setTransactionsLoading(true);

    // Mock data for now
    setTimeout(() => {
      this.setTransactions({
        transactions: [],
        count: 0,
      });
      this.setTransactionsLoading(false);
    }, 1000);
  };

  requestPayout = async (payoutData) => {
    this.setRequestPayoutLoading(true);

    // Mock API call
    setTimeout(() => {
      console.log("Payout requested:", payoutData);
      this.setRequestPayoutLoading(false);
    }, 2000);
  };
}

export default new WalletStore();
