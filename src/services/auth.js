import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getMeQuery = gql`
  {
    __typename
    getMe {
      firstName
      lastName
      email
      email_verified_at
      email_verification_token
    }
  }
`;

const loginQuery = gql`
  mutation adminLoginUser($email: String!, $password: String!) {
    adminLoginUser(email: $email, password: $password) {
      user {
        firstName
        lastName
        email
        role
        gender
        brandId
        warehouseStaff {
          warehouseId
        }
      }
      accessToken
    }
  }
`;

const signupQuery = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    signup(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      user {
        firstName
        lastName
        email
        email_verified_at
        email_verification_token
      }
      token
    }
  }
`;

const verifyQuery = gql`
  mutation VerifyMe($token: String!) {
    verifyMe(token: $token) {
      firstName
      lastName
      email
      email_verified_at
      email_verification_token
    }
  }
`;
const resendVerificationEmailQuery = gql`
  mutation {
    resendVerificationEmail {
      message
    }
  }
`;
const apis = {
  getUser: (jwt) =>
    graphQlInstance(getMeQuery, {
      method: "GET",
      jwt,
    }),

  login: (variables) =>
    graphQlInstance(loginQuery, {
      variables,
    }),

  signupUser: (variables) =>
    graphQlInstance(signupQuery, {
      variables,
    }),

  verifyUser: (variables) =>
    graphQlInstance(verifyQuery, {
      variables,
    }),
  resendVerificationEmail: () =>
    graphQlInstance(resendVerificationEmailQuery, {}),
};

export default apis;
