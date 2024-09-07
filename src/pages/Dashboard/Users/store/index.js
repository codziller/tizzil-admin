/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import apis from "services/users";

class UsersStore {
  // ====================================================
  // State
  // ====================================================
  users = [];
  usersArchived = [];
  searchResult = [];
  user = null;
  usersCount = 0;
  usersArchivedCount = 0;
  searchResultCount = 0;
  error = null;
  loading = false;
  loadingArchived = false;
  searchUserLoading = false;
  createUserLoading = false;
  editUserLoading = false;
  editUserWalletLoading = false;
  getUserLoading = false;
  deleteUserLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getUsers = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getUsers(data);
      res = res?.users;
      this.users = res?.results || [];
      this.usersCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getArchivedUsers = async ({ data }) => {
    this.loadingArchived = true;
    try {
      let res = await apis.getArchivedUsers(data);
      res = res?.archived_users;
      this.usersArchived = res?.results || [];
      this.usersArchivedCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingArchived = false;
    }
  };

  searchUsers = async ({ data }) => {
    this.searchUserLoading = true;
    try {
      let res = await apis.searchUsers(data);
      res = res?.searchUsers;
      this.searchResult = res?.results || [];
      this.searchResultCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.searchUserLoading = false;
    }
  };

  getUser = async ({ data }) => {
    this.getUserLoading = true;
    try {
      let res = await apis.getUser(data);
      res = res?.user;
      this.user = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getUserLoading = false;
    }
  };

  createUser = async ({ data, onSuccess, page }) => {
    this.createUserLoading = true;
    try {
      await apis.createUser(data);
      successToast("Operation Successful!", "User created Successfully.");
      onSuccess?.();
      await this.getUsers({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createUserLoading = false;
    }
  };
  editUser = async ({ data, onSuccess, page }) => {
    this.editUserLoading = true;
    try {
      await apis.editUser(data);
      successToast("Operation Successful!", "User updated Successfully.");
      onSuccess?.();
      await this.getUsers({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editUserLoading = false;
    }
  };

  editUserWallet = async ({ data, onSuccess, page }) => {
    this.editUserWalletLoading = true;
    try {
      await apis.editUserWallet(data);
      successToast(
        "Operation Successful!",
        "User wallet updated Successfully."
      );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editUserWalletLoading = false;
    }
  };

  deleteUser = async ({ data, onSuccess, page }) => {
    this.deleteUserLoading = true;
    try {
      await apis.deleteUser(data);
      successToast(
        "Operation Successful!",
        `User ${data?.isDeleted ? "archived" : "unarchived"} Successfully.`
      );
      onSuccess?.();
      await this.getUsers({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteUserLoading = false;
    }
  };
}

export default new UsersStore();
