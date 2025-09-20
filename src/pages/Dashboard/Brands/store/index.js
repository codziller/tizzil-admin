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
  pendingBrands = [];
  pendingBrandsCount = null;
  dashboardStats = null;
  error = null;
  loading = false;
  pendingBrandsLoading = false;
  dashboardStatsLoading = false;
  createBrandLoading = false;
  editBrandLoading = false;
  getBrandLoading = false;
  deleteBrandLoading = false;
  approveBrandLoading = false;
  rejectBrandLoading = false;
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
      res = res?.adminGetPublicBrands;
      this.brands =
        res?.data
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
      res = res?.adminGetBrandById;
      this.brand = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getBrandLoading = false;
    }
  };

  getBrandsAwaitingApproval = async ({ data }) => {
    this.pendingBrandsLoading = true;
    try {
      let res = await apis.getBrandsAwaitingApproval({
        page: data?.page,
        city: data?.city,
        country: data?.country,
        endDate: data?.endDate,
        hasShopifyIntegration: data?.hasShopifyIntegration,
        maxEstimatedMonthlyOrders: data?.maxEstimatedMonthlyOrders,
        maxYearsInBusiness: data?.maxYearsInBusiness,
        minEstimatedMonthlyOrders: data?.minEstimatedMonthlyOrders,
        minYearsInBusiness: data?.minYearsInBusiness,
        productImportMethod: data?.productImportMethod,
        searchQuery: data?.searchQuery,
        startDate: data?.startDate,
        state: data?.state
      });
      res = res?.adminGetBrandsAwaitingApproval;
      this.pendingBrands =
        res?.data
          ?.sort((a, b) => moment(b.submittedAt).diff(moment(a.submittedAt)))
          ?.map((item) => {
            return { ...item, label: item?.brandName, value: item?.registrationId };
          }) || [];
      this.pendingBrandsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.pendingBrandsLoading = false;
    }
  };

  getBrandDashboardStats = async () => {
    this.dashboardStatsLoading = true;
    try {
      let res = await apis.getBrandDashboardStats();
      res = res?.adminGetBrandDashboardStats;
      this.dashboardStats = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.dashboardStatsLoading = false;
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

  approveBrandRegistration = async ({ registrationId, onSuccess, filters = {} }) => {
    this.approveBrandLoading = true;
    try {
      await apis.approveBrandRegistration({ registrationId });
      successToast("Operation Successful!", "Brand approved successfully.");
      onSuccess?.();
      await this.getBrandsAwaitingApproval({ data: { page: 1, ...filters } });
    } catch (error) {
      this.error = error;
    } finally {
      this.approveBrandLoading = false;
    }
  };

  rejectBrandRegistration = async ({ registrationId, rejectionReason, onSuccess, filters = {} }) => {
    this.rejectBrandLoading = true;
    try {
      await apis.rejectBrandRegistration({ registrationId, rejectionReason });
      successToast("Operation Successful!", "Brand rejected successfully.");
      onSuccess?.();
      await this.getBrandsAwaitingApproval({ data: { page: 1, ...filters } });
    } catch (error) {
      this.error = error;
    } finally {
      this.rejectBrandLoading = false;
    }
  };
}

export default new BrandsStore();
