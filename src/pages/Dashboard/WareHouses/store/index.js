/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/warehouses";

class WareHousesStore {
  // ====================================================
  // State
  // ====================================================
  warehouses = [];
  warehousesArchived = null;
  warehouse = null;
  warehousesCount = null;
  warehousesArchivedCount = null;
  error = null;
  loading = false;
  loadingArchived = false;
  createWareHouseLoading = false;
  editWareHouseLoading = false;
  getWareHouseLoading = false;
  deleteWarehouseLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getWarehouses = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getWarehouses(data);
      res = res?.warehouses;
      this.warehouses =
        res?.results
          ?.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
          ?.map((item) => {
            return { ...item, label: item?.name, value: item?.id };
          }) || [];
      this.warehousesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getArchivedWarehouses = async ({ data }) => {
    this.loadingArchived = true;
    try {
      let res = await apis.getArchivedWarehouses(data);
      res = res?.archived_warehouses;
      this.warehousesArchived = res?.results || [];
      this.warehousesArchivedCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingArchived = false;
    }
  };

  getWarehouse = async ({ data }) => {
    this.getWareHouseLoading = true;
    try {
      let res = await apis.getWarehouse(data);
      res = res?.warehouse;
      this.warehouse = { ...res, label: res?.name, value: res?.id };
    } catch (error) {
      this.error = error;
    } finally {
      this.getWareHouseLoading = false;
    }
  };

  createWarehouse = async ({ data, onSuccess }) => {
    this.createWareHouseLoading = true;
    try {
      await apis.createWarehouse(data);
      successToast("Operation Successful!", "Warehouse created Successfully.");
      onSuccess?.();
      // await this.getWarehouses({ data: { page: 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createWareHouseLoading = false;
    }
  };

  editWarehouse = async ({ data, onSuccess }) => {
    this.editWareHouseLoading = true;
    try {
      await apis.editWarehouse(data);
      successToast("Operation Successful!", "Warehouse updated Successfully.");
      onSuccess?.();
      await this.getWarehouse({ data: { id: data?.id } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editWareHouseLoading = false;
    }
  };

  deleteWarehouse = async ({ data, onSuccess }) => {
    this.deleteWarehouseLoading = true;
    try {
      await apis.deleteWarehouse(data);
      successToast("Operation Successful!", "Warehouse archived successfully.");
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteWarehouseLoading = false;
    }
  };
}

export default new WareHousesStore();
