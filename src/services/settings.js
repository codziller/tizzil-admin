import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getExchangeRateQuery = () => gql`
  {
    __typename
    exchangeRate {
      updatedAt
      id
      exchangeAmount
      currency
    }
  }
`;

const editExchangeRateQuery = gql`
  mutation patchExchangeRate($currency: CURRENCY!, $exchangeAmount: Float!) {
    patchExchangeRate(
      exchangeRateInput: {
        currency: $currency
        exchangeAmount: $exchangeAmount
      }
    ) {
      id
    }
  }
`;

const apis = {
  getExchangeRate: () =>
    graphQlInstance(getExchangeRateQuery(), {
      method: "GET",
    }),

  editExchangeRate: (variables) =>
    graphQlInstance(editExchangeRateQuery, {
      variables,
    }),
};

export default apis;
