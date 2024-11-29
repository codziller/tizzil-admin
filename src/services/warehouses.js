import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getWarehousesQuery = ({ page }) => gql`
  {
    __typename
    warehouses(pageNumber: "${page}") {
      total
      results {
        name
        country
        state
        createdAt
        id
        lat
        lng
        archive
        products {
          brandId
        }
      }
    }
  }
`;

const getArchivedWarehousesQuery = ({ page }) => gql`
  {
    __typename
    archived_warehouses(pageNumber: "${page}") {
      total
      results {
        name
        country
        state
        createdAt
        id
        lat
        lng
        archive
        products {
          brandId
        }
      }
    }
  }
`;

const getWarehouseQuery = ({ id }) => gql`
  {
    __typename
    warehouse(id: "${id}") {
      name
      country
      state
      createdAt
      id
      lat
      lng
      products {
        brandId
      }
    }
  }
`;

const createWarehouseQuery = gql`
  mutation createWarehouse(
    $name: String!
    $country: String!
    $state: String!
    $lat: String!
    $lng: String!
    $erpName: String!
  ) {
    createWarehouse(
      createWarehouseDto: {
        name: $name
        country: $country
        state: $state
        lat: $lat
        lng: $lng
        erpName: $erpName
      }
    ) {
      name
      country
      state
      lat
      lng
    }
  }
`;

const editWarehouseQuery = gql`
  mutation updateWarehouse(
    $name: String!
    $country: String!
    $state: String!
    $id: String!
    $erpName: String!
  ) {
    updateWarehouse(
      updateWarehouseDto: {
        name: $name
        country: $country
        state: $state
        id: $id
        erpName: $erpName
      }
    ) {
      name
      country
      state
      id
    }
  }
`;

const deleteWarehouseQuery = gql`
  mutation removeWarehouse($id: String!) {
    removeWarehouse(id: $id) {
      status
    }
  }
`;

const apis = {
  getWarehouses: ({ page }) =>
    graphQlInstance(getWarehousesQuery({ page }), {
      method: "GET",
    }),
  getArchivedWarehouses: ({ page }) =>
    graphQlInstance(getArchivedWarehousesQuery({ page }), {
      method: "GET",
    }),
  getWarehouse: ({ id }) =>
    graphQlInstance(getWarehouseQuery({ id }), {
      method: "GET",
    }),

  createWarehouse: (variables) =>
    graphQlInstance(createWarehouseQuery, {
      variables,
    }),

  editWarehouse: (variables) =>
    graphQlInstance(editWarehouseQuery, {
      variables,
    }),

  deleteWarehouse: (variables) =>
    graphQlInstance(deleteWarehouseQuery, {
      variables,
    }),
};

export default apis;
