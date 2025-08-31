/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import apis from "services/staffs";
import userApis from "services/users";
import { ALL_ROLES } from "utils/appConstant";

const { GUEST, CUSTOMER } = ALL_ROLES;
class StaffsStore {
  // ====================================================
  // State
  // ====================================================
  staffs = [];
  staffsArchived = [];
  searchResult = [];
  staff = null;
  staffsCount = 0;
  staffsArchivedCount = 0;
  searchResultCount = 0;
  error = null;
  loading = false;
  loadingArchived = false;
  searchStaffLoading = false;
  createStaffLoading = false;
  editStaffLoading = false;
  editStaffWalletLoading = false;
  getStaffLoading = false;
  deleteStaffLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getStaffs = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getStaffs(data);
      res = res?.users_staff;
      this.staffs = res?.results || [];
      this.staffsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getArchivedStaffs = async ({ data }) => {
    this.loadingArchived = true;
    try {
      let res = await apis.getArchivedStaffs(data);
      res = res?.archived_staffs;
      this.staffsArchived = res?.results || [];
      this.staffsArchivedCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingArchived = false;
    }
  };

  searchStaffs = async ({ data }) => {
    this.searchStaffLoading = true;
    try {
      let res = await apis.searchStaffs(data);
      res = res?.searchUsers;
      this.searchResult =
        res?.results?.filter(
          (item) => item?.role !== GUEST && item?.role !== CUSTOMER
        ) || [];
      this.searchResultCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.searchStaffLoading = false;
    }
  };

  getStaff = async ({ data }) => {
    this.getStaffLoading = true;
    try {
      let res = await apis.getStaff(data);
      res = res?.user;
      this.staff = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getStaffLoading = false;
    }
  };

  createStaff = async ({ data, onSuccess, page }) => {
    this.createStaffLoading = true;
    try {
      await userApis.createUser(data);
      successToast("Operation Successful!", "Staff created Successfully.");
      onSuccess?.();
      await this.getStaffs({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createStaffLoading = false;
    }
  };

  editStaff = async ({ data, onSuccess, page }) => {
    this.editStaffLoading = true;
    try {
      await userApis.editUser(data);
      successToast("Operation Successful!", "Staff updated Successfully.");
      onSuccess?.();
      await this.getStaffs({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editStaffLoading = false;
    }
  };

  editStaffWallet = async ({ data, onSuccess, page }) => {
    this.editStaffWalletLoading = true;
    try {
      await apis.editStaffWallet(data);
      successToast(
        "Operation Successful!",
        "Staff wallet updated Successfully."
      );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editStaffWalletLoading = false;
    }
  };

  deleteStaff = async ({ data, onSuccess, page }) => {
    this.deleteStaffLoading = true;
    try {
      await apis.deleteStaff(data);
      successToast("Operation Successful!", "Staff archived Successfully.");
      onSuccess?.();
      await this.getStaffs({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteStaffLoading = false;
    }
  };
}

export default new StaffsStore();
