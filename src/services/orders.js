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
            phoneNumber
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

const getOrdersQuery = gql`
  query adminGetAllOrders($input: GetOrdersInput!) {
    adminGetAllOrders(input: $input) {
      total
      results {
        id
        orderCode
        orderStatus
        paid
        paymentMethod
        deliveryMethod
        orderSource
        totalAmount
        subtotal
        deliveryFee
        createdAt
        updatedAt
        actualDeliveryDate
        expectedDeliveryDate
        trackingNumber
        trackingUrl
        notes
        isPreOrder
        isSubscription
        isInventoryUpdated
        guestFirstName
        guestLastName
        guestEmail
        guestPhoneNumber
        guestAddress
        brand {
          id
          brandName
        }
        user {
          id
          firstName
          lastName
          email
          phoneNumber
        }
        calculatedOrder {
          id
          totalAmount
          realTotalAmount
          deliveryFee
          realDeliveryFee
          freeDelivery
          serviceCharge
          user {
            id
            firstName
            lastName
            email
          }
          address {
            id
            addressText
            firstName
            lastName
            phoneNumber
            email
            city
            state
            country
          }
          calculatedOrderProducts {
            id
            quantity
            salePrice
            costPrice
            profit
            isPreOrder
            isProductFree
            product {
              id
              name
              imageUrls
            }
            productVariant {
              id
              variantName
              imageUrls
            }
          }
        }
        history {
          date
          text
        }
      }
    }
  }
`;

const getBrandOrdersWithFlavorCloudQuery = gql`
  query getBrandOrdersWithFlavorCloud(
    $brandId: String!
    $pageNumber: Int! = 1
    $pageSize: Int! = 50
    $status: ORDER_STATUS
  ) {
    getBrandOrdersWithFlavorCloud(
      brandId: $brandId
      pageNumber: $pageNumber
      pageSize: $pageSize
      status: $status
    ) {
      total
      results {
        id
        orderCode
        orderStatus
        paid
        paymentMethod
        deliveryMethod
        orderSource
        totalAmount
        subtotal
        deliveryFee
        createdAt
        updatedAt
        actualDeliveryDate
        expectedDeliveryDate
        trackingNumber
        trackingUrl
        notes
        isPreOrder
        isSubscription
        isInventoryUpdated
        guestFirstName
        guestLastName
        guestEmail
        guestPhoneNumber
        guestAddress
        brand {
          id
          brandName
        }
        user {
          id
          firstName
          lastName
          email
          phoneNumber
        }
        calculatedOrder {
          id
          totalAmount
          realTotalAmount
          deliveryFee
          realDeliveryFee
          freeDelivery
          serviceCharge
          user {
            id
            firstName
            lastName
            email
          }
          address {
            id
            addressText
            firstName
            lastName
            phoneNumber
            email
            city
            state
            country
          }
          calculatedOrderProducts {
            id
            quantity
            salePrice
            costPrice
            profit
            isPreOrder
            isProductFree
            product {
              id
              name
              imageUrls
            }
            productVariant {
              id
              variantName
              imageUrls
            }
          }
        }
        history {
          date
          text
        }
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
const getOrderQuery = gql`
  query getOrderByCode($orderCode: String!) {
    getOrderByCode(orderCode: $orderCode) {
      id
      orderCode
      orderStatus
      paid
      paymentMethod
      deliveryMethod
      orderSource
      totalAmount
      subtotal
      deliveryFee
      createdAt
      updatedAt
      actualDeliveryDate
      expectedDeliveryDate
      trackingNumber
      trackingUrl
      notes
      isPreOrder
      isSubscription
      isInventoryUpdated
      guestFirstName
      guestLastName
      guestEmail
      guestPhoneNumber
      guestAddress
      paymentReference
      pickupAddressText
      updatedBy
      brand {
        id
        brandName
      }
      user {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      calculatedOrder {
        id
        totalAmount
        realTotalAmount
        deliveryFee
        realDeliveryFee
        freeDelivery
        serviceCharge
        orderProductsTotalAmount
        user {
          id
          firstName
          lastName
          email
          phoneNumber
        }
        address {
          id
          addressText
          firstName
          lastName
          phoneNumber
          email
          city
          state
          country
          postalCode
          addressLat
          addressLng
        }
        calculatedOrderProducts {
          id
          quantity
          salePrice
          costPrice
          profit
          isPreOrder
          isProductFree
          product {
            id
            name
            imageUrls
          }
          productVariant {
            id
            variantName
            imageUrls
          }
        }
      }
      history {
        date
        text
      }
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
          erpWarehouseNames
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
  getOrders: (variables) =>
    graphQlInstance(getOrdersQuery, {
      method: "POST",
      variables,
    }),

  getBrandOrdersWithFlavorCloud: (variables) =>
    graphQlInstance(getBrandOrdersWithFlavorCloudQuery, {
      method: "POST",
      variables,
    }),

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
  getOrdersCount: ({ page }) =>
    graphQlInstance(getOrdersCountQuery({ page }), {
      method: "GET",
    }),
  getOrder: (variables) =>
    graphQlInstance(getOrderQuery, {
      method: "POST",
      variables,
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
