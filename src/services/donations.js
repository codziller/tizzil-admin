import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getDonationWalletQuery = () => gql`
  {
    __typename
    donation_wallet {
      balance
    }
  }
`;
const getDonationTransactionsQuery = ({ page, startDate, endDate }) => gql`
  {
    __typename
    donation_wallet_transactions(pageNumber: "${page}",startDate: "${startDate}", endDate: "${endDate}") {
      total
      results {
        amount
        userEmail
        userName
        userPhoneNumber
        createdAt
      }
    }
  }
`;

const apis = {
  getDonationTransactions: ({ page, startDate, endDate }) =>
    graphQlInstance(
      getDonationTransactionsQuery({ page, startDate, endDate }),
      {
        method: "GET",
      }
    ),

  getDonationWallet: () =>
    graphQlInstance(getDonationWalletQuery(), {
      method: "GET",
    }),
};

export default apis;
