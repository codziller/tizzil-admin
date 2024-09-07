import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getAffiliateMarketerQuery = ({ id }) => gql`
  {
    __typename
    affiliateMarketer(id: "${id}") {
      createdAt
      discountCode
      discountExpiryTime
      discountLimit
      discountType
      discountValue
      id
      updatedAt
      userId
      userProfitType
      userProfitValue
      typeOfOrder
    }
  }
`;
const getAffiliateMarketersQuery = ({ page }) => gql`
  {
    __typename
    affiliateMarketers(pageNumber: "${page}") {
      total
      results {

        createdAt
        discountCode
        discountExpiryTime
        discountLimit
        discountType
        discountValue
        id
        updatedAt
        user {
          firstName
          lastName
          gender
          email 
          phoneNumber
        }
        userProfitType
        userProfitValue
      }
    }
  }
`;

const createAffiliateMarketerQuery = gql`
  mutation createAffiliateMarketer(
    $discountCode: String!
    $discountExpiryTime: DateTime
    $discountLimit: String
    $discountType: DISCOUNT_TYPE!
    $discountValue: String!
    $userId: String!
    $userProfitType: DISCOUNT_TYPE!
    $userProfitValue: String!
    $typeOfOrder: TypeOfAffiliateMarketerOrder!
  ) {
    createAffiliateMarketer(
      createAffiliateMarketerInput: {
        discountCode: $discountCode
        discountExpiryTime: $discountExpiryTime
        discountLimit: $discountLimit
        discountType: $discountType
        discountValue: $discountValue
        userId: $userId
        userProfitType: $userProfitType
        userProfitValue: $userProfitValue
        typeOfOrder: $typeOfOrder
      }
    ) {
      id
    }
  }
`;

const editAffiliateMarketerQuery = gql`
  mutation updateAffiliateMarketer(
    $id: String!
    $discountCode: String!
    $discountExpiryTime: DateTime
    $discountLimit: String
    $discountType: DISCOUNT_TYPE!
    $discountValue: String!
    $userId: String!
    $userProfitType: DISCOUNT_TYPE!
    $userProfitValue: String!
    $typeOfOrder: TypeOfAffiliateMarketerOrder!
  ) {
    updateAffiliateMarketer(
      updateAffiliateMarketerInput: {
        id: $id
        discountCode: $discountCode
        discountExpiryTime: $discountExpiryTime
        discountLimit: $discountLimit
        discountType: $discountType
        discountValue: $discountValue
        userId: $userId
        userProfitType: $userProfitType
        userProfitValue: $userProfitValue
        typeOfOrder: $typeOfOrder
      }
    ) {
      id
    }
  }
`;

const apis = {
  getAffiliateMarketers: ({ page }) =>
    graphQlInstance(getAffiliateMarketersQuery({ page }), {
      method: "GET",
    }),
  getAffiliateMarketer: ({ id }) =>
    graphQlInstance(getAffiliateMarketerQuery({ id }), {
      method: "GET",
    }),

  createAffiliateMarketer: (variables) =>
    graphQlInstance(createAffiliateMarketerQuery, {
      variables,
    }),

  editAffiliateMarketer: (variables) =>
    graphQlInstance(editAffiliateMarketerQuery, {
      variables,
    }),
};

export default apis;
