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
        userRole {
          name
          id
        }
        gender
      }
      access_token
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

const authSendVerificationMailQuery = gql`
  mutation authSendVerificationMail($email: String!) {
    authSendVerificationMail(email: $email) {
      status
    }
  }
`;

const authSignupQuery = gql`
  mutation authSignup(
    $dob: String
    $email: String!
    $firstName: String!
    $gender: USER_GENDERS
    $lastName: String!
    $otp: String!
    $password: String!
    $phoneNumber: String
  ) {
    authSignup(
      dob: $dob
      email: $email
      firstName: $firstName
      gender: $gender
      lastName: $lastName
      otp: $otp
      password: $password
      phoneNumber: $phoneNumber
    ) {
      access_token
      brand {
        id
        brandName
        brandEmail
        logoUrl
      }
      brandUser {
        brandId
        createdAt
        id
        invitedAt
        isActive
        joinedAt
        role
        updatedAt
        userId
      }
      refresh_token
      user {
        id
        firstName
        lastName
        email
        userRole {
          name
        }
      }
    }
  }
`;

const authLoginUserQuery = gql`
  mutation authLoginUser($email: String!, $password: String!) {
    authLoginUser(email: $email, password: $password) {
      access_token
      brand {
        id
        brandName
        logoUrl
      }
      brandUser {
        brandId
        createdAt
        id
        invitedAt
        isActive
        joinedAt
        role
        updatedAt
        userId
      }
      refresh_token
      user {
        id
        firstName
        lastName
        email
        userRole {
          name
        }
      }
    }
  }
`;

const authBrandRegistrationQuery = gql`
  mutation authBrandRegistration(
    $registrationData: BrandRegistrationCreateInput!
  ) {
    authBrandRegistration(registrationData: $registrationData) {
      status
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

  authSendVerificationMail: (variables) =>
    graphQlInstance(authSendVerificationMailQuery, {
      variables,
    }),

  authSignup: (variables) =>
    graphQlInstance(authSignupQuery, {
      variables,
    }),

  authLoginUser: (variables) =>
    graphQlInstance(authLoginUserQuery, {
      variables,
    }),

  authBrandRegistration: (variables) =>
    graphQlInstance(authBrandRegistrationQuery, {
      variables,
    }),
};

export default apis;
