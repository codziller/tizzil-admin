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

const adminLoginUserQuery = gql`
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

const brandAdminLoginUserQuery = gql`
  mutation brandAdminLoginUser($email: String!, $password: String!) {
    brandAdminLoginUser(email: $email, password: $password) {
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
      user {
        balance
        baniCustomerRef
        brandId
        createdAt
        dob
        email
        emailConfirmedTime
        firstName
        gender
        guestAddress
        id
        isAffiliateMarketer
        isDeleted
        isEmailConfirmed
        lastName
        name
        phoneNumber
        referralCode
        updatedAt
        username
        userRole {
          name
          id
        }
      }
      brand {
        addressLine1
        addressLine2
        allowNegativeInventory
        bannerImageUrl
        brandName
        businessRegistrationDocumentUrl
        businessRegistrationNumber
        city
        country
        countryShortCode
        createdAt
        description
        domesticDeliveryFee
        estimatedMonthlyOrders
        hasReturnPolicy
        id
        imageUrls
        instagramUrl
        internationalDeliveryFees
        isActive
        isPublic
        latitude
        logoUrl
        longitude
        lowStockAlertThreshold
        owner {
          id
          firstName
          lastName
          email
        }
        postalCode
        productCategory
        productImportMethod
        rejectionReason
        returnPolicyDetails
        reviewedAt
        reviewedBy
        shopifyAccessToken
        shopifyStoreUrl
        shortText
        shouldHandleDomesticDelivery
        state
        stateShortCode
        status
        submittedAt
        tiktokUrl
        updatedAt
        userId
        websiteUrl
        yearsInBusiness
      }
    }
  }
`;
const apis = {
  getUser: (jwt) =>
    graphQlInstance(getMeQuery, {
      method: "GET",
      jwt,
    }),

  adminLoginUser: (variables) =>
    graphQlInstance(adminLoginUserQuery, {
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

  brandAdminLoginUser: (variables) =>
    graphQlInstance(brandAdminLoginUserQuery, {
      variables,
    }),

  authBrandRegistration: (variables) =>
    graphQlInstance(authBrandRegistrationQuery, {
      variables,
    }),
};

export default apis;
