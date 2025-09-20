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

  // Collection State
  collections = [];
  activeCollections = [];
  inactiveCollections = [];
  collectionsByBrand = [];
  activeCollectionsByBrand = [];
  collection = null;
  collectionProducts = [];
  loadingCollections = false;
  loadingActiveCollections = false;
  loadingInactiveCollections = false;
  loadingCollectionsByBrand = false;
  loadingActiveCollectionsByBrand = false;
  loadingCollection = false;
  loadingCollectionProducts = false;
  createCollectionLoading = false;
  updateCollectionLoading = false;
  activateCollectionLoading = false;
  deactivateCollectionLoading = false;
  removeCollectionLoading = false;
  addProductToCollectionLoading = false;
  removeProductFromCollectionLoading = false;
  updateMultipleCollectionPositionsLoading = false;

  // Product-Category Management State
  addProductsToCategoryLoading = false;
  removeProductsFromCategoryLoading = false;

  // Product-Collection Management State
  addMultipleProductsToCollectionLoading = false;
  removeMultipleProductsFromCollectionLoading = false;

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
          ?.sort((a, b) => moment(b.updatedAt).diff(moment(a.updatedAt)))
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

  // ====================================================
  // Collection Actions
  // ====================================================

  getCollections = async () => {
    this.loadingCollections = true;
    try {
      let res = await apis.getCollections();
      res = res?.collections;

      this.collections =
        res
          ?.sort((a, b) => moment(b.updatedAt).diff(moment(a.updatedAt)))
          ?.map((item) => {
            return { ...item, label: item?.name, value: item?.id };
          }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingCollections = false;
    }
  };

  getCollection = async ({ data }) => {
    this.loadingCollection = true;
    try {
      let res = await apis.getCollection(data);
      res = res?.collection;
      this.collection = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingCollection = false;
    }
  };

  getActiveCollections = async () => {
    this.loadingActiveCollections = true;
    try {
      let res = await apis.getActiveCollections();
      res = res?.active_collections;

      this.activeCollections =
        res
          ?.sort((a, b) => moment(b.updatedAt).diff(moment(a.updatedAt)))
          ?.map((item) => {
            return { ...item, label: item?.name, value: item?.id };
          }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingActiveCollections = false;
    }
  };

  getInactiveCollections = async () => {
    this.loadingInactiveCollections = true;
    try {
      let res = await apis.getInactiveCollections();
      res = res?.inactive_collections;

      this.inactiveCollections =
        res?.map((item) => {
          return { ...item, label: item?.name, value: item?.id };
        }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingInactiveCollections = false;
    }
  };

  getActiveCollectionsByBrand = async ({ brandId }) => {
    this.loadingActiveCollectionsByBrand = true;
    try {
      let res = await apis.getActiveCollectionsByBrand({ brandId });
      res = res?.active_collections_by_brand;

      this.activeCollectionsByBrand =
        res?.map((item) => {
          return { ...item, label: item?.name, value: item?.id };
        }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingActiveCollectionsByBrand = false;
    }
  };

  getCollectionsByBrand = async ({ brandId }) => {
    this.loadingCollectionsByBrand = true;
    try {
      let res = await apis.getCollectionsByBrand({ brandId });
      res = res?.collections_by_brand;

      this.collectionsByBrand =
        res?.map((item) => {
          return { ...item, label: item?.name, value: item?.id };
        }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingCollectionsByBrand = false;
    }
  };

  getCollectionProducts = async ({ collectionId }) => {
    this.loadingCollectionProducts = true;
    try {
      let res = await apis.getCollectionProducts({ collectionId });
      this.collectionProducts = res?.collection_products || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingCollectionProducts = false;
    }
  };

  createCollection = async ({ data, onSuccess, noAlert }) => {
    this.createCollectionLoading = true;
    try {
      await apis.createCollection(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Collection created Successfully."
        );
      onSuccess?.();
      await this.getCollections();
    } catch (error) {
      this.error = error;
    } finally {
      this.createCollectionLoading = false;
    }
  };

  updateCollection = async ({ data, onSuccess, noAlert }) => {
    this.updateCollectionLoading = true;
    try {
      await apis.updateCollection(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Collection updated Successfully."
        );
      onSuccess?.();
      await this.getCollections();
    } catch (error) {
      this.error = error;
    } finally {
      this.updateCollectionLoading = false;
    }
  };

  activateCollection = async ({ data, onSuccess, noAlert }) => {
    this.activateCollectionLoading = true;
    try {
      await apis.activateCollection(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Collection activated Successfully."
        );
      onSuccess?.();
      await this.getCollections();
    } catch (error) {
      this.error = error;
    } finally {
      this.activateCollectionLoading = false;
    }
  };

  deactivateCollection = async ({ data, onSuccess, noAlert }) => {
    this.deactivateCollectionLoading = true;
    try {
      await apis.deactivateCollection(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Collection deactivated Successfully."
        );
      onSuccess?.();
      await this.getCollections();
    } catch (error) {
      this.error = error;
    } finally {
      this.deactivateCollectionLoading = false;
    }
  };

  removeCollection = async ({ data, onSuccess }) => {
    this.removeCollectionLoading = true;
    try {
      await apis.removeCollection(data);
      successToast("Operation Successful!", "Collection removed Successfully.");
      onSuccess?.();
      await this.getCollections();
    } catch (error) {
      this.error = error;
    } finally {
      this.removeCollectionLoading = false;
    }
  };

  addProductToCollection = async ({ data, onSuccess, noAlert }) => {
    this.addProductToCollectionLoading = true;
    try {
      await apis.addProductToCollection(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Product added to collection Successfully."
        );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.addProductToCollectionLoading = false;
    }
  };

  removeProductFromCollection = async ({ data, onSuccess, noAlert }) => {
    this.removeProductFromCollectionLoading = true;
    try {
      await apis.removeProductFromCollection(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Product removed from collection Successfully."
        );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.removeProductFromCollectionLoading = false;
    }
  };

  updateMultipleCollectionPositions = async ({ data, onSuccess, noAlert }) => {
    this.updateMultipleCollectionPositionsLoading = true;
    try {
      await apis.updateMultipleCollectionPositions(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Collection positions updated Successfully."
        );
      onSuccess?.();
      await this.getCollections();
    } catch (error) {
      this.error = error;
    } finally {
      this.updateMultipleCollectionPositionsLoading = false;
    }
  };

  // ====================================================
  // Product-Category Management Actions
  // ====================================================

  addProductsToCategory = async ({ data, onSuccess, noAlert }) => {
    this.addProductsToCategoryLoading = true;
    try {
      await apis.addProductsToCategory(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Products added to category Successfully."
        );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.addProductsToCategoryLoading = false;
    }
  };

  removeProductsFromCategory = async ({ data, onSuccess, noAlert }) => {
    this.removeProductsFromCategoryLoading = true;
    try {
      await apis.removeProductsFromCategory(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Products removed from category Successfully."
        );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.removeProductsFromCategoryLoading = false;
    }
  };

  // ====================================================
  // Product-Collection Management Actions (new methods)
  // ====================================================

  addMultipleProductsToCollection = async ({ data, onSuccess, noAlert }) => {
    this.addMultipleProductsToCollectionLoading = true;
    try {
      await apis.addMultipleProductsToCollection(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Products added to collection Successfully."
        );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.addMultipleProductsToCollectionLoading = false;
    }
  };

  removeMultipleProductsFromCollection = async ({ data, onSuccess, noAlert }) => {
    this.removeMultipleProductsFromCollectionLoading = true;
    try {
      await apis.removeMultipleProductsFromCollection(data);
      !noAlert &&
        successToast(
          "Operation Successful!",
          "Products removed from collection Successfully."
        );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.removeMultipleProductsFromCollectionLoading = false;
    }
  };
}

export default new CategoriesStore();
