/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/orders";
import { ORDER_STATUSES } from "utils/appConstant";

const { DISPATCHED, CANCELLED, COMPLETED, INPROGRESS, PENDING } =
  ORDER_STATUSES;
class OrdersStore {
  // ====================================================
  // State
  // ====================================================
  orders = [];
  order = null;
  ordersCount = null;

  in_progressOrders = [];
  in_progressOrdersCount = null;
  pendingOrders = [];
  pendingOrdersCount = null;
  dispatchedOrders = [];
  dispatchedOrdersCount = null;
  completedOrders = [];
  completedOrdersCount = null;
  cancelledOrders = [];
  cancelledOrdersCount = null;
  refundedOrders = [];
  refundedOrdersLoading = false;
  refundedOrdersCount = null;


  userOrders = [];
  userOrdersCount = null;
  userOrdersLoading = null;

  error = null;
  loading = false;
  createOrderLoading = false;
  updateOrderStatusLoading = false;
  getOrderLoading = false;
  deleteOrderLoading = false;
  searchResult = [];
  searchResultCount = 0;
  searchLoading = false;
  refundItemInOrderLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  searchOrders = async ({ data }) => {
    this.searchLoading = true;
    try {
      let res = await apis.searchOrders(data);
      res = res?.searchOrders;
      this.searchResult = res?.results || [];
      this.searchResultCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.searchLoading = false;
    }
  };


  getOrdersByUser = async ({ data }) => {
    this.userOrdersLoading = true;
    try {
      let res = await apis.getOrdersByUser(data);
      res = res?.orders_by_user_id;
      this.userOrders = res?.results || [];
      this.userOrdersCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.userOrdersLoading = false;
    }
  };

  getOrders = async ({ input }) => {
    const status = input?.status;
    this.loading = true;
    try {
      let res = await apis.getOrders({ input });
      res = res?.adminGetAllOrders;
      const resResults =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];

      switch (status) {
        case "IN_PROGRESS":
          this.in_progressOrders = resResults;
          this.in_progressOrdersCount = res?.total;
          break;
        case "PROCESSING":
          this.pendingOrders = resResults;
          this.pendingOrdersCount = res?.total;
          break;
        case "DISPATCHED":
          this.dispatchedOrders = resResults;
          this.dispatchedOrdersCount = res?.total;
          break;
        case "COMPLETED":
          this.completedOrders = resResults;
          this.completedOrdersCount = res?.total;
          break;
        case "CANCELLED":
          this.cancelledOrders = resResults;
          this.cancelledOrdersCount = res?.total;
          break;
        default:
          this.orders = resResults;
          this.ordersCount = res?.total;
          break;
      }
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getBrandOrdersWithFlavorCloud = async ({ brandId, pageNumber = 1, pageSize = 50, status }) => {
    this.loading = true;
    try {
      let res = await apis.getBrandOrdersWithFlavorCloud({
        brandId,
        pageNumber,
        pageSize,
        status,
      });
      res = res?.getBrandOrdersWithFlavorCloud;
      const resResults =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];

      switch (status) {
        case "IN_PROGRESS":
          this.in_progressOrders = resResults;
          this.in_progressOrdersCount = res?.total;
          break;
        case "PROCESSING":
          this.pendingOrders = resResults;
          this.pendingOrdersCount = res?.total;
          break;
        case "DISPATCHED":
          this.dispatchedOrders = resResults;
          this.dispatchedOrdersCount = res?.total;
          break;
        case "COMPLETED":
          this.completedOrders = resResults;
          this.completedOrdersCount = res?.total;
          break;
        case "CANCELLED":
          this.cancelledOrders = resResults;
          this.cancelledOrdersCount = res?.total;
          break;
        default:
          this.orders = resResults;
          this.ordersCount = res?.total;
          break;
      }
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getRefundedOrders = async ({ data }) => {
    this.refundedOrdersLoading = true;
    try {
      let res = await apis.getRefundedOrders(data);
      res = res?.orders_with_refunded_products;
      const resResults =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];
      this.refundedOrders = resResults;
      this.refundedOrdersCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.refundedOrdersLoading = false;
    }
  };

  getOrdersCount = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getOrdersCount(data);
      res = res?.orders;
      this.ordersCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getOrder = async ({ orderCode, isRefund }) => {
    this.getOrderLoading = true;
    try {
      let res;
      if (isRefund) {
        res = await apis.getRefundedOrder({ id: orderCode });
        res = res?.order;
      } else {
        res = await apis.getOrder({ orderCode });
        res = res?.getOrderByCode;
      }

      this.order = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getOrderLoading = false;
    }
  };

  createOrder = async ({ data, onSuccess, page }) => {
    this.createOrderLoading = true;
    try {
      await apis.createOrder(data);
      successToast("Operation Successful!", "Order created Successfully.");
      onSuccess?.();
      await this.getOrders({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createOrderLoading = false;
    }
  };

  updateOrderStatus = async ({ data, onSuccess, page }) => {
    this.updateOrderStatusLoading = true;
    try {
      await apis.updateOrderStatus(data);
      successToast(
        "Operation Successful!",
        "Order status updated Successfully."
      );
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.updateOrderStatusLoading = false;
    }
  };

  refundItemInOrder = async ({ data, onSuccess, page }) => {
    this.refundItemInOrderLoading = true;
    try {
      await apis.refundItemInOrder(data);
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.refundItemInOrderLoading = false;
    }
  };

  deleteOrder = async ({ data, onSuccess, page }) => {
    this.deleteOrderLoading = true;
    try {
      await apis.deleteOrder(data);
      successToast("Operation Successful!", "Order deleted Successfully.");
      onSuccess?.();
      await this.getOrders({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteOrderLoading = false;
    }
  };
}

export default new OrdersStore();
