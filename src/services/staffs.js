import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getStaffQuery = ({ id }) => gql`
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
      warehouseStaff {
        warehouseId
      }
    }
  }
`;
const getStaffsQuery = ({ page }) => gql`
  {
    __typename
    users_staff(pageNumber: "${page}") {
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
const getArchivedStaffsQuery = ({ page }) => gql`
  {
    __typename
    archived_staffs(pageNumber: "${page}") {
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
const searchStaffsQuery = ({ page, searchQuery }) => gql`
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

const createStaffQuery = gql`
  mutation adminCreateStaff(
    $dob: String!
    $email: String!
    $firstName: String!
    $gender: USER_GENDERS!
    $lastName: String!
    $password: String!
    $phoneNumber: String!
    $role: USER_ROLES
    $warehouseId: String
  ) {
    adminCreateStaff(
      dob: $dob
      email: $email
      firstName: $firstName
      gender: $gender
      lastName: $lastName
      password: $password
      phoneNumber: $phoneNumber
      role: $role
      warehouseId: $warehouseId
    ) {
      staff {
        id
      }
    }
  }
`;

const editStaffQuery = gql`
  mutation adminUpdateStaff(
    $staffId: String!
    $firstName: String!
    $gender: USER_GENDERS!
    $lastName: String!
    $brandId: String!
    $role: USER_ROLES
    $warehouseId: String
  ) {
    adminUpdateStaff(
      staffId: $staffId
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

const editStaffWalletQuery = gql`
  mutation adjustStaffBalance(
    $amount: Float!
    $transactionType: TRANSACTION_TYPE!
    $staffId: String!
  ) {
    adjustStaffBalance(
      amount: $amount
      transactionType: $transactionType
      staffId: $staffId
    ) {
      id
    }
  }
`;

const deleteStaffQuery = gql`
  mutation removeStaff($id: String!) {
    removeStaff(id: $id) {
      status
    }
  }
`;

const apis = {
  getStaffs: ({ page }) =>
    graphQlInstance(getStaffsQuery({ page }), {
      method: "GET",
    }),
  getArchivedStaffs: ({ page }) =>
    graphQlInstance(getArchivedStaffsQuery({ page }), {
      method: "GET",
    }),
  searchStaffs: ({ page, searchQuery }) =>
    graphQlInstance(searchStaffsQuery({ page, searchQuery }), {
      method: "GET",
    }),
  getStaff: ({ id }) =>
    graphQlInstance(getStaffQuery({ id }), {
      method: "GET",
    }),

  createStaff: (variables) =>
    graphQlInstance(createStaffQuery, {
      variables,
    }),

  editStaff: (variables) =>
    graphQlInstance(editStaffQuery, {
      variables,
    }),

  editStaffWallet: (variables) =>
    graphQlInstance(editStaffWalletQuery, {
      variables,
    }),

  deleteStaff: (variables) =>
    graphQlInstance(deleteStaffQuery, {
      variables,
    }),
};

export default apis;
