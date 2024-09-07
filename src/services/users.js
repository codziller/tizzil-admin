import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getUserQuery = ({ id }) => gql`
  {
    __typename
    user(id: "${id}") {
      balance
      baniCustomerRef
      createdAt
      dob
      email
      emailConfirmedTime
      firstName
      gender
      id
      isDeleted
      isEmailConfirmed
      lastName
      phoneNumber
      referralCode
      brandId
      role
    }
  }
`;
const getUsersQuery = ({ page }) => gql`
  {
    __typename
    users(pageNumber: "${page}") {
      total
      results {
        balance
        baniCustomerRef
        createdAt
        dob
        email
        emailConfirmedTime
        firstName
        gender
        id
        isDeleted
        isEmailConfirmed
        lastName
        phoneNumber
        referralCode
        role
      }
    }
  }
`;
const getArchivedUsersQuery = ({ page }) => gql`
  {
    __typename
    archived_users(pageNumber: "${page}") {
      total
      results {
        balance
        baniCustomerRef
        createdAt
        dob
        email
        emailConfirmedTime
        firstName
        gender
        id
        isDeleted
        isEmailConfirmed
        lastName
        phoneNumber
        referralCode
        role
      }
    }
  }
`;
const searchUsersQuery = ({ page, searchQuery }) => gql`
  {
    __typename
    searchUsers(pageNumber: "${page}", searchQuery: "${searchQuery}") {
      total
      results {
        balance
        baniCustomerRef
        createdAt
        dob
        email
        emailConfirmedTime
        firstName
        gender
        id
        isDeleted
        isEmailConfirmed
        lastName
        phoneNumber
        referralCode
        role
      }
    }
  }
`;

const createUserQuery = gql`
  mutation adminCreateUser(
    $dob: String!
    $email: String!
    $firstName: String!
    $gender: USER_GENDERS!
    $lastName: String!
    $password: String!
    $phoneNumber: String!
    $role: USER_ROLES
    $warehouseId: String
    $brandId: String
  ) {
    adminCreateUser(
      dob: $dob
      email: $email
      firstName: $firstName
      gender: $gender
      lastName: $lastName
      password: $password
      phoneNumber: $phoneNumber
      role: $role
      warehouseId: $warehouseId
      brandId: $brandId
    ) {
      user {
        id
      }
    }
  }
`;

const editUserQuery = gql`
  mutation adminUpdateUser(
    $userId: String!
    $firstName: String!
    $gender: USER_GENDERS!
    $lastName: String!
    $brandId: String
    $role: USER_ROLES
    $warehouseId: String
  ) {
    adminUpdateUser(
      userId: $userId
      firstName: $firstName
      gender: $gender
      lastName: $lastName
      brandId: $brandId
      role: $role
      warehouseId: $warehouseId
    ) {
      id
    }
  }
`;

const editUserWalletQuery = gql`
  mutation adjustUserBalance(
    $amount: Float!
    $transactionType: TRANSACTION_TYPE!
    $userId: String!
  ) {
    adjustUserBalance(
      amount: $amount
      transactionType: $transactionType
      userId: $userId
    ) {
      id
    }
  }
`;

const deleteUserQuery = gql`
  mutation removeUser($id: String!, $isDeleted: Boolean!) {
    removeUser(id: $id, isDeleted: $isDeleted) {
      status
    }
  }
`;

const apis = {
  getUsers: ({ page }) =>
    graphQlInstance(getUsersQuery({ page }), {
      method: "GET",
    }),
  getArchivedUsers: ({ page }) =>
    graphQlInstance(getArchivedUsersQuery({ page }), {
      method: "GET",
    }),
  searchUsers: ({ page, searchQuery }) =>
    graphQlInstance(searchUsersQuery({ page, searchQuery }), {
      method: "GET",
    }),
  getUser: ({ id }) =>
    graphQlInstance(getUserQuery({ id }), {
      method: "GET",
    }),

  createUser: (variables) =>
    graphQlInstance(createUserQuery, {
      variables,
    }),

  editUser: (variables) =>
    graphQlInstance(editUserQuery, {
      variables,
    }),

  editUserWallet: (variables) =>
    graphQlInstance(editUserWalletQuery, {
      variables,
    }),

  deleteUser: (variables) =>
    graphQlInstance(deleteUserQuery, {
      variables,
    }),
};

export default apis;
