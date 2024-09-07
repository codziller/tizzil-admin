/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/brands";

class BrandsStore {
  // ====================================================
  // State
  // ====================================================
  brands = [];
  brand = null;
  brandsCount = null;
  error = null;
  loading = false;
  createBrandLoading = false;
  editBrandLoading = false;
  getBrandLoading = false;
  deleteBrandLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getBrands = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getBrands(data);
      res = res?.brands;
      this.brands =
        res?.results
          ?.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
          ?.map((item) => {
            return { ...item, label: item?.brandName, value: item?.id };
          }) || [];
      this.brandsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getBrand = async ({ data }) => {
    this.getBrandLoading = true;
    try {
      let res = await apis.getBrand(data);
      res = res?.brand;
      this.brand = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getBrandLoading = false;
    }
  };

  createBrand = async ({ data, onSuccess, page }) => {
    this.createBrandLoading = true;
    try {
      await apis.createBrand(data);
      successToast("Operation Successful!", "Brand created Successfully.");
      onSuccess?.();
      await this.getBrands({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createBrandLoading = false;
    }
  };
  editBrand = async ({ data, onSuccess, page }) => {
    this.editBrandLoading = true;
    try {
      await apis.editBrand(data);
      successToast("Operation Successful!", "Brand updated Successfully.");
      onSuccess?.();
      await this.getBrands({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editBrandLoading = false;
    }
  };

  deleteBrand = async ({ data, onSuccess, page }) => {
    this.deleteBrandLoading = true;
    try {
      await apis.deleteBrand(data);
      successToast("Operation Successful!", "Brand deleted Successfully.");
      onSuccess?.();
      await this.getBrands({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteBrandLoading = false;
    }
  };
}

export default new BrandsStore();
