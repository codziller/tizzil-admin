import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const searchOrdersQuery = ({ page, searchQuery, warehouseId }) => gql`
  {
    __typename
    searchOrders(pageNumber: "${page}", searchQuery: "${searchQuery}",warehouseId: "${warehouseId}") {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderCode
        orderStatus
        orderSource
        paid
        paymentMethod
        updatedAt
        guestFirstName
        guestLastName
      }
    }
  }
`;
const getOrdersByUserQuery = ({ page, id }) => gql`
  {
    __typename
    orders_by_user_id(pageNumber: "${page}", id: "${id}") {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderSource
        orderCode
        orderStatus
        paid
        paymentMethod
        updatedAt
        guestFirstName
        guestLastName
      }
    }
  }
`;

const getOrdersQuery = ({
  page,
  status,
  startDate,
  endDate,
  deliveryHandler,
  warehouseId,
}) => gql`
  {
    __typename
    orders(pageNumber: "${page}", warehouseId: "${warehouseId}", status: "${status}",startDate: "${startDate}", endDate: "${endDate}",  ${
  deliveryHandler ? `deliveryHandler:"${deliveryHandler}"` : ""
}) {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderSource
        orderCode
        orderStatus
        paid
        paymentMethod
        updatedAt
        guestFirstName
        guestLastName
      }
    }
  }
`;

const getRefundedOrdersQuery = ({
  page,
  startDate,
  endDate,
  warehouseId,
}) => gql`
  {
    __typename
    orders_with_refunded_products(pageNumber: "${page}", warehouseId: "${warehouseId}", startDate: "${startDate}", endDate: "${endDate}") {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderSource
        orderCode
        orderStatus
        paid
        paymentMethod
        updatedAt
        guestFirstName
        guestLastName
      }
    }
  }
`;

const getBrandOrdersQuery = ({ page, id, startDate, endDate }) => gql`
  {
    __typename
    orders_by_brand_id(pageNumber: "${page}", id: "${id}",startDate: "${startDate}", endDate: "${endDate}") {
      total
      results {
        calculatedOrder {
          totalAmount
          user {
            firstName
            lastName
          }
        }
        id
        deliveryMethod
        orderCode
        orderStatus
        paid
        paymentMethod
        updatedAt
      }
    }
  }
`;

const refundItemInOrderQuery = ({
  calculatedProductId,
  orderCode,
  quantity,
}) => gql`
{
  __typename
  refundItemInOrder(calculatedProductId: "${calculatedProductId}",orderCode: "${orderCode}",quantity: ${quantity}) {
    message
  }
}
`;

const getOrdersCountQuery = ({ page }) => gql`
  {
    __typename
    orders(pageNumber: "${page}") {
      total
    }
  }
`;
const getOrderQuery = ({ id }) => gql`
  {
    __typename
    order(id: "${id}") {
      calculatedOrder {
        warehouse{
          name
        }
        trackingUrl
        topshipShipmentRate {
          mode
        }
        checkDiscountCodeResult {
          status
          amountSaved
          discountCode
          realTotalAmount
          discountType
        }
        address {
          addressText
          firstName
          lastName
          phoneNumber
        }
        calculatedOrderProducts {
          id
          salePrice
          costPrices{
            costPrice
            quantityBought
            quantityLeft
          }
          product {
            id
            name
            imageUrls
            salePrice
            brand {
              brandName
              id
            }
          }
          productOption {
            name
            choices{
              variantName
              variantSalePrice
              imageUrls
            }
          }
          productOptionChoiceIndex
          productOptionId
          quantity
        }
        deliveryFee
        freeDelivery
        serviceCharge
        totalAmount
        updatedAt
        user {
          firstName
          lastName
          phoneNumber
          gender
          email
        }
      }
      deliveryMethod
      guestAddress
      guestDeliveryFee
      guestEmail
      guestFirstName
      guestLastName
      guestPhoneNumber
      storePaymentMethod
      orderSource
      id
      orderCode
      orderStatus
      paid
      paymentMethod
      topshipDispatchStatus
      updatedAt
    }
  }
`;

const getRefundedOrderQuery = ({ id }) => gql`
  {
    __typename
    order(id: "${id}") {
      calculatedOrder {
        warehouse{
          name
        }
        trackingUrl
        topshipShipmentRate {
          mode
        }
        checkDiscountCodeResult {
          status
          amountSaved
          discountCode
          realTotalAmount
          discountType
        }
        address {
          addressText
        }
        refundedCalculatedOrderProducts {
          id
          salePrice
          product {
            id
            name
            imageUrls
            salePrice
          }
          productOption {
            name
            choices{
              variantName
              variantSalePrice
              imageUrls
            }
          }
          productOptionChoiceIndex
          productOptionId
          quantity
        }
        deliveryFee
        freeDelivery
        serviceCharge
        totalAmount
        updatedAt
        user {
          firstName
          lastName
          phoneNumber
          gender
          email
        }
      }
      deliveryMethod
      guestAddress
      guestDeliveryFee
      guestEmail
      guestFirstName
      guestLastName
      guestPhoneNumber
      storePaymentMethod
      orderSource
      id
      orderCode
      orderStatus
      paid
      paymentMethod
      topshipDispatchStatus
      updatedAt
    }
  }
`;

const createOrderQuery = gql`
  mutation createOrder(
    $OrderDescription: String!
    $OrderLogoUrl: String!
    $OrderName: String!
    $OrderShortText: String!
    $categoryId: String
    $imageUrls: [String!]
    $videoUrls: [String!]
  ) {
    createOrder(
      createOrderInput: {
        OrderDescription: $OrderDescription
        OrderLogoUrl: $OrderLogoUrl
        OrderName: $OrderName
        OrderShortText: $OrderShortText
        categoryId: $categoryId
        imageUrls: $imageUrls
        videoUrls: $videoUrls
      }
    ) {
      id
    }
  }
`;

const updateOrderStatusQuery = gql`
  mutation updateOrderStatus($id: String!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      status
    }
  }
`;

const deleteOrderQuery = gql`
  mutation removeOrder($id: String!) {
    removeOrder(id: $id) {
      status
    }
  }
`;

const apis = {
  searchOrders: ({ page, searchQuery, warehouseId }) =>
    graphQlInstance(searchOrdersQuery({ page, searchQuery, warehouseId }), {
      method: "GET",
    }),
  getOrdersByUser: ({ page, id }) =>
    graphQlInstance(getOrdersByUserQuery({ page, id }), {
      method: "GET",
    }),
  getOrders: ({
    page,
    status,
    startDate,
    endDate,
    deliveryHandler,
    warehouseId,
  }) =>
    graphQlInstance(
      getOrdersQuery({
        page,
        status,
        startDate,
        endDate,
        deliveryHandler,
        warehouseId,
      }),
      {
        method: "GET",
      }
    ),

  getRefundedOrders: ({ page, startDate, endDate, warehouseId }) =>
    graphQlInstance(
      getRefundedOrdersQuery({
        page,
        startDate,
        endDate,
        warehouseId,
      }),
      {
        method: "GET",
      }
    ),
  getBrandOrders: ({ page, id, startDate, endDate }) =>
    graphQlInstance(getBrandOrdersQuery({ page, id, startDate, endDate }), {
      method: "GET",
    }),
  getOrdersCount: ({ page }) =>
    graphQlInstance(getOrdersCountQuery({ page }), {
      method: "GET",
    }),
  getOrder: ({ id }) =>
    graphQlInstance(getOrderQuery({ id }), {
      method: "GET",
    }),

  getRefundedOrder: ({ id }) =>
    graphQlInstance(getRefundedOrderQuery({ id }), {
      method: "GET",
    }),

  createOrder: (variables) =>
    graphQlInstance(createOrderQuery, {
      variables,
    }),

  updateOrderStatus: (variables) =>
    graphQlInstance(updateOrderStatusQuery, {
      variables,
    }),

  refundItemInOrder: ({ calculatedProductId, orderCode, quantity }) =>
    graphQlInstance(
      refundItemInOrderQuery({ calculatedProductId, orderCode, quantity }),
      {
        method: "GET",
      }
    ),

  deleteOrder: (variables) =>
    graphQlInstance(deleteOrderQuery, {
      variables,
    }),
};

export default apis;
