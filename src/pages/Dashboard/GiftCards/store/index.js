/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/giftCards";

class GiftCardsStore {
  // ====================================================
  // State
  // ====================================================
  giftCards = [];
  giftCard = null;
  giftCardsCount = null;
  error = null;
  loading = false;
  createGiftCardLoading = false;
  getGiftCardLoading = false;
  deleteGiftCardLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getGiftCards = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getGiftCards(data);
      res = res?.getGiftCardCategoryDesigns;
      this.giftCards = res?.results?.sort((a, b) =>
        moment(b.createdAt).diff(moment(a.createdAt))
      );
      this.giftCardsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  createGiftCard = async ({ data, onSuccess, page }) => {
    this.createGiftCardLoading = true;
    try {
      await apis.createGiftCard(data);
      successToast("Operation Successful!", "Gift card created Successfully.");
      onSuccess?.();
      await this.getGiftCards({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createGiftCardLoading = false;
    }
  };

  deleteGiftCard = async ({ data, onSuccess, page }) => {
    this.deleteGiftCardLoading = true;
    try {
      await apis.deleteGiftCard(data);
      successToast("Operation Successful!", "Gift card deleted Successfully.");
      onSuccess?.();
      await this.getGiftCards({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteGiftCardLoading = false;
    }
  };
}

export default new GiftCardsStore();
