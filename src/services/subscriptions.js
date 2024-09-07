import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getAllActiveProductSubscriptionsQuery = ({ page }) => gql`
  {
    __typename
    allActiveProductSubscriptions(pageNumber: "${page}") {
      total
      results {
        user {
          firstName
          lastName
        }
        nextDebitDate
        id
        deliveryMethod
        orderSource
        paymentMethod
        createdAt
      }
    }
  }
`;
const getAllDueProductSubscriptionsQuery = ({ page }) => gql`
  {
    __typename
    allDueProductSubscriptions(pageNumber: "${page}") {
      total
      results {
        user {
          firstName
          lastName
        }
        nextDebitDate
        id
        deliveryMethod
        orderSource
        paymentMethod
        updatedAt
      }
    }
  }
`;

const apis = {
  getAllActiveProductSubscriptions: ({ page }) =>
    graphQlInstance(getAllActiveProductSubscriptionsQuery({ page }), {
      method: "GET",
    }),

  getAllDueProductSubscriptions: ({ page }) =>
    graphQlInstance(getAllDueProductSubscriptionsQuery({ page }), {
      method: "GET",
    }),
};

export default apis;
