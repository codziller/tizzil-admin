import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getBrandHomePageStatsQuery = ({ id, startDate, endDate }) => gql`
  {
    __typename
    brandHomePageStats(id: "${id}", startDate: "${startDate}", endDate: "${endDate}") {
      totalOrders
      totalProducts
      totalRevenue
      averageOrderValue
      totalGrossRevenue
    }
  }
`;

const getAdminHomePageStatsQuery = ({ startDate, endDate, warehouseId }) =>
  warehouseId
    ? gql`
  {
    __typename
    adminHomePageStats(startDate: "${startDate}", endDate: "${endDate}",warehouseId: "${warehouseId}") {
      totalOrders
      totalProducts
      totalRevenue
      totalUsers
      totalGrossRevenue
      totalDeliveryRevenue
      averageOrderValue
      revenueByOrderSource{
        order_source
        total_revenue
      }
    revenueByPaymentMethod{
    total_revenue
    payment_method
    }
    orderCountsBySource{
      order_source
      count
    }
    orderCountByPaymentMethod{
      payment_method
      count
    }
    totalCostPriceSold
    totalQuantitySold
    totalDeliveryRevenueByHandler{
      total_delivery_revenue
      delivery_handler
    }
    totalDonatedAmount
    totalUniqueDonors
    }
  }
`
    : gql`
{
  __typename
  adminHomePageStats(startDate: "${startDate}", endDate: "${endDate}") {
    totalOrders
    totalProducts
    totalRevenue
    totalUsers
    totalGrossRevenue
    totalDeliveryRevenue
    averageOrderValue
    revenueByOrderSource{
        order_source
        total_revenue
      }
    revenueByPaymentMethod{
    total_revenue
    payment_method
    }
    orderCountsBySource{
      order_source
      count
    }
    orderCountByPaymentMethod{
      payment_method
      count
    }
    totalCostPriceSold
    totalQuantitySold
    totalDeliveryRevenueByHandler{
      total_delivery_revenue
      delivery_handler
    }
    totalDonatedAmount
    totalUniqueDonors
  }
}
`;

const apis = {
  getBrandHomePageStats: ({ id, startDate, endDate }) =>
    graphQlInstance(getBrandHomePageStatsQuery({ id, startDate, endDate }), {
      method: "GET",
    }),
  getAdminHomePageStats: ({ startDate, endDate, warehouseId }) =>
    graphQlInstance(
      getAdminHomePageStatsQuery({ startDate, endDate, warehouseId }),
      {
        method: "GET",
      }
    ),
};

export default apis;
