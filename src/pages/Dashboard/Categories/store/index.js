/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { isEmpty } from "lodash";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/categories";

class CategoriesStore {
  // ====================================================
  // State
  // ====================================================
  categories = [];
  headerNavs = [];
  headerNavsHidden = [];
  category = null;
  categoriesCount = null;
  error = null;
  loading = false;
  loadingHeaderNavs = false;
  loadingHeaderNavsHidden = false;
  createCategoryLoading = false;
  editCategoryLoading = false;
  getCategoryLoading = false;
  deleteCategoryLoading = false;
  createHeaderNavLoading = false;
  editHeaderNavLoading = false;
  editHeaderNavPositionLoading = false;
  deleteHeaderNavLoading = false;
  categoryBrands = null;
  loadingCategoryBrands = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getHeaderNavs = async () => {
    this.loadingHeaderNavs = true;
    try {
      let res = await apis.getHeaderNavs();
      res = res?.headerNavs;

      this.headerNavs =
        res?.map((item) => {
          return { ...item, label: item?.name, value: item?.id };
        }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingHeaderNavs = false;
    }
  };

  getHeaderNavsHidden = async () => {
    this.loadingHeaderNavsHidden = true;
    try {
      let res = await apis.getHeaderNavsHidden();
      res = res?.headerNavs_hidden;

      this.headerNavsHidden =
        res?.map((item) => {
          return { ...item, label: item?.name, value: item?.id };
        }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingHeaderNavsHidden = false;
    }
  };
  getCategoryBrands = async () => {
    this.loadingCategoryBrands = true;
    try {
      let res = await apis.getCategoryBrands();
      res = res?.category_brands?.filter((item) => !isEmpty(item?.brands));
      this.categoryBrands = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingCategoryBrands = false;
    }
  };
  getCategories = async () => {
    this.loading = true;
    try {
      let res = await apis.getCategories();
      res = res?.categories;

      this.categories =
        res
          ?.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
          ?.map((item) => {
            return { ...item, label: item?.name, value: item?.id };
          }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getCategory = async ({ data }) => {
    this.getCategoryLoading = true;
    try {
      let res = await apis.getCategory(data);
      res = res?.category;
      this.category = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getCategoryLoading = false;
    }
  };

  createCategory = async ({ data, onSuccess, noAlert }) => {
    this.createCategoryLoading = true;
    try {
      await apis.createCategory(data);
      !noAlert &&
        successToast("Operation Successful!", "Category created Successfully.");
      onSuccess?.();
      await this.getCategories();
    } catch (error) {
      this.error = error;
    } finally {
      this.createCategoryLoading = false;
    }
  };

  editCategory = async ({ data, onSuccess, noAlert }) => {
    this.editCategoryLoading = true;
    try {
      await apis.editCategory(data);
      !noAlert &&
        successToast("Operation Successful!", "Category updated Successfully.");
      onSuccess?.();
      await this.getCategories();
    } catch (error) {
      this.error = error;
    } finally {
      this.editCategoryLoading = false;
    }
  };

  deleteCategory = async ({ data, onSuccess }) => {
    this.deleteCategoryLoading = true;
    try {
      await apis.deleteCategory(data);
      successToast("Operation Successful!", "Category archived Successfully.");
      onSuccess?.();
      await this.getCategories();
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteCategoryLoading = false;
    }
  };

  createHeaderNav = async ({ data, onSuccess, noAlert }) => {
    this.createHeaderNavLoading = true;
    try {
      await apis.createHeaderNav(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "HeaderNav created Successfully."
        );
      onSuccess?.();
      await this.getHeaderNavs();
    } catch (error) {
      this.error = error;
    } finally {
      this.createHeaderNavLoading = false;
    }
  };

  editHeaderNav = async ({ data, onSuccess, noAlert }) => {
    this.editHeaderNavLoading = true;
    try {
      await apis.editHeaderNav(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "HeaderNav updated Successfully."
        );
      onSuccess?.();
      this.getHeaderNavs();
      this.getHeaderNavsHidden();
    } catch (error) {
      this.error = error;
    } finally {
      this.editHeaderNavLoading = false;
    }
  };

  editHeaderNavPosition = async ({ data, onSuccess, noAlert }) => {
    this.editHeaderNavPositionLoading = true;
    try {
      await apis.editHeaderNavPosition(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "HeaderNav positions updated Successfully."
        );
      onSuccess?.();
      await this.getHeaderNavs();
    } catch (error) {
      this.error = error;
    } finally {
      this.editHeaderNavPositionLoading = false;
    }
  };

  deleteHeaderNav = async ({ data, onSuccess }) => {
    this.deleteHeaderNavLoading = true;
    try {
      await apis.deleteHeaderNav(data);
      successToast("Operation Successful!", "HeaderNav deleted Successfully.");
      onSuccess?.();
      await this.getCategories();
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteHeaderNavLoading = false;
    }
  };
}

export default new CategoriesStore();
