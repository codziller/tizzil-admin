import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getCategoriesQuery = () => gql`
  {
    __typename
    categories {
      id
      createdAt
      name
      parentCategoryId
      position
      headerNavId
      subCategories {
        id
        createdAt
        name
        parentCategoryId
        position
        subCategories {
          id
          createdAt
          name
          parentCategoryId
          position
        }
      }
      updatedAt
    }
  }
`;

const getCategoryBrandsQuery = () => gql`
  {
    __typename
    category_brands {
      brands {
        brandName
        id
      }
      name
      parentCategoryId
      headerNavId
      position
    }
  }
`;

const getHeaderNavsQuery = () => gql`
  {
    __typename
    headerNavs {
      archive
      categories {
        name
        id
        subCategories {
          name
          id
        }
      }
      id
      name
      imageUrl
      position
      createdAt
    }
  }
`;

const getHeaderNavsHiddenQuery = () => gql`
  {
    __typename
    headerNavs_hidden {
      archive
      categories {
        name
        id
        subCategories {
          name
          id
        }
      }
      id
      name
      imageUrl
      position
      createdAt
    }
  }
`;
const getCategoryQuery = ({ id }) => gql`
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

const createCategoryQuery = gql`
  mutation createCategory($name: String!, $parentCategoryId: String) {
    createCategory(
      createCategoryInput: { name: $name, parentCategoryId: $parentCategoryId }
    ) {
      name
      parentCategoryId
    }
  }
`;

const createHeaderNavQuery = gql`
  mutation createHeaderNav($name: String!, $imageUrl: String) {
    createHeaderNav(
      createHeaderNavInput: { name: $name, imageUrl: $imageUrl }
    ) {
      name
    }
  }
`;

const editHeaderNavQuery = gql`
  mutation updateHeaderNav(
    $name: String!
    $id: String!
    $imageUrl: String
    $isPrivate: Boolean
  ) {
    updateHeaderNav(
      updateHeaderNavInput: {
        name: $name
        id: $id
        imageUrl: $imageUrl
        isPrivate: $isPrivate
      }
    ) {
      status
    }
  }
`;

const editHeaderNavPositionQuery = gql`
  mutation updateMultipleHeaderNavPositions($headerNavIds: [String!]!) {
    updateMultipleHeaderNavPositions(
      updateHeaderNavPositionQuery: { headerNavIds: $headerNavIds }
    ) {
      status
    }
  }
`;

const editCategoryQuery = gql`
  mutation updateCategory(
    $id: String!
    $name: String!
    $parentCategoryId: String
    $headerNavId: String
  ) {
    updateCategory(
      updateCategoryInput: {
        id: $id
        name: $name
        parentCategoryId: $parentCategoryId
        headerNavId: $headerNavId
      }
    ) {
      id
      name
      parentCategoryId
    }
  }
`;

const deleteCategoryQuery = gql`
  mutation removeCategory($id: String!) {
    removeCategory(id: $id) {
      status
    }
  }
`;

const deleteHeaderNavQuery = gql`
  mutation removeHeaderNav($id: String!) {
    removeHeaderNav(id: $id) {
      status
    }
  }
`;

const apis = {
  getCategories: () =>
    graphQlInstance(getCategoriesQuery(), {
      method: "GET",
    }),
  getCategoryBrands: () =>
    graphQlInstance(getCategoryBrandsQuery(), {
      method: "GET",
    }),
  getHeaderNavs: () =>
    graphQlInstance(getHeaderNavsQuery(), {
      method: "GET",
    }),
  getHeaderNavsHidden: () =>
    graphQlInstance(getHeaderNavsHiddenQuery(), {
      method: "GET",
    }),

  getCategory: ({ id }) =>
    graphQlInstance(getCategoryQuery({ id }), {
      method: "GET",
    }),

  createCategory: (variables) =>
    graphQlInstance(createCategoryQuery, {
      variables,
    }),

  editCategory: (variables) =>
    graphQlInstance(editCategoryQuery, {
      variables,
    }),

  deleteCategory: (variables) =>
    graphQlInstance(deleteCategoryQuery, {
      variables,
    }),

  createHeaderNav: (variables) =>
    graphQlInstance(createHeaderNavQuery, {
      variables,
    }),

  editHeaderNav: (variables) =>
    graphQlInstance(editHeaderNavQuery, {
      variables,
    }),
  editHeaderNavPosition: (variables) =>
    graphQlInstance(editHeaderNavPositionQuery, {
      variables,
    }),
  deleteHeaderNav: (variables) =>
    graphQlInstance(deleteHeaderNavQuery, {
      variables,
    }),
};

export default apis;
