/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { makeAutoObservable } from "mobx";
import apis from "services/subscriptions";

class SubscriptionStore {
  // ====================================================
  // State
  // ====================================================

  allActiveProductSubscriptions = [];
  allActiveProductSubscriptionsCount = null;
  allActiveProductSubscriptionsLoading = null;

  allDueProductSubscriptions = [];
  allDueProductSubscriptionsCount = null;
  allDueProductSubscriptionsLoading = null;

  error = null;

  searchResult = [];
  searchResultCount = 0;
  searchLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  searchOrders = async ({ data }) => {
    this.searchLoading = true;
    try {
      const res = { results: [], total: 0 };
      // let res = await apis.searchOrders(data);
      // res = res?.searchOrders;
      this.searchResult = res?.results || [];
      this.searchResultCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.searchLoading = false;
    }
  };

  getAllActiveProductSubscriptions = async ({ data }) => {
    this.allActiveProductSubscriptionsLoading = true;
    try {
      let res = await apis.getAllActiveProductSubscriptions(data);
      res = res?.allActiveProductSubscriptions;
      this.allActiveProductSubscriptions = res?.results || [];
      this.allActiveProductSubscriptionsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.allActiveProductSubscriptionsLoading = false;
    }
  };

  getAllDueProductSubscriptions = async ({ data }) => {
    this.allDueProductSubscriptionsLoading = true;
    try {
      let res = await apis.getAllDueProductSubscriptions(data);
      res = res?.allDueProductSubscriptions;
      this.allDueProductSubscriptions = res?.results || [];
      this.allDueProductSubscriptionsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.allDueProductSubscriptionsLoading = false;
    }
  };
}

export default new SubscriptionStore();
