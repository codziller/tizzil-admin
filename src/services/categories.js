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
  mutation adminCreateCategory(
    $name: String!
    $parentCategoryId: String
    $position: String
  ) {
    adminCreateCategory(
      createCategoryInput: {
        name: $name
        parentCategoryId: $parentCategoryId
        position: $position
      }
    ) {
      name
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

// Collection Queries
const getCollectionsQuery = () => gql`
  {
    __typename
    collections {
      id
      name
      description
      imageUrl
      brandId
      isActive
      archive
      position
      createdAt
      updatedAt
      brand {
        id
        brandName
      }
    }
  }
`;

const getCollectionQuery = ({ id }) => gql`
  {
    __typename
    collection(id: "${id}") {
      id
      name
      description
      imageUrl
      brandId
      isActive
      archive
      position
      createdAt
      updatedAt
      brand {
        id
        brandName
      }
    }
  }
`;

const getActiveCollectionsQuery = () => gql`
  {
    __typename
    active_collections {
      id
      name
      description
      imageUrl
      brandId
      isActive
      archive
      position
      createdAt
      updatedAt
      brand {
        id
        brandName
      }
    }
  }
`;

const getInactiveCollectionsQuery = () => gql`
  {
    __typename
    inactive_collections {
      id
      name
      description
      imageUrl
      brandId
      isActive
      archive
      position
      createdAt
      updatedAt
      brand {
        id
        brandName
      }
    }
  }
`;

const getActiveCollectionsByBrandQuery = ({ brandId }) => gql`
  {
    __typename
    active_collections_by_brand(brandId: "${brandId}") {
      id
      name
      description
      imageUrl
      brandId
      isActive
      archive
      position
      createdAt
      updatedAt
      brand {
        id
        brandName
      }
    }
  }
`;

const getCollectionsByBrandQuery = ({ brandId }) => gql`
  {
    __typename
    collections_by_brand(brandId: "${brandId}") {
      id
      name
      description
      imageUrl
      brandId
      isActive
      archive
      position
      createdAt
      updatedAt
      brand {
        id
        brandName
      }
    }
  }
`;

const getCollectionProductsQuery = ({ collectionId }) => gql`
  {
    __typename
    collection_products(collectionId: "${collectionId}")
  }
`;

// Collection Mutations
const createCollectionQuery = gql`
  mutation createCollection($createCollectionInput: CreateCollectionInput!) {
    createCollection(createCollectionInput: $createCollectionInput) {
      id
    }
  }
`;

const updateCollectionQuery = gql`
  mutation updateCollection($updateCollectionInput: UpdateCollectionInput!) {
    updateCollection(updateCollectionInput: $updateCollectionInput) {
      id
    }
  }
`;

const activateCollectionQuery = gql`
  mutation activateCollection($id: String!) {
    activateCollection(id: $id) {
      id
      name
      isActive
    }
  }
`;

const deactivateCollectionQuery = gql`
  mutation deactivateCollection($id: String!) {
    deactivateCollection(id: $id) {
      id
      name
      isActive
    }
  }
`;

const removeCollectionQuery = gql`
  mutation removeCollection($id: String!) {
    removeCollection(id: $id) {
      status
    }
  }
`;

const addProductToCollectionQuery = gql`
  mutation addProductToCollection($collectionId: String!, $productId: String!) {
    addProductToCollection(collectionId: $collectionId, productId: $productId) {
      status
    }
  }
`;

const removeProductFromCollectionQuery = gql`
  mutation removeProductFromCollection(
    $collectionId: String!
    $productId: String!
  ) {
    removeProductFromCollection(
      collectionId: $collectionId
      productId: $productId
    ) {
      status
    }
  }
`;

const updateMultipleCollectionPositionsQuery = gql`
  mutation updateMultipleCollectionPositions(
    $updateCollectionIdsPositionQuery: UpdateCollectionIdsPositionQuery!
  ) {
    updateMultipleCollectionPositions(
      updateCollectionIdsPositionQuery: $updateCollectionIdsPositionQuery
    ) {
      status
    }
  }
`;

// Product-Category Management Mutations
const addProductsToCategoryQuery = gql`
  mutation addProductsToCategory($input: AddProductsToCategoryInput!) {
    addProductsToCategory(input: $input) {
      message
      success
    }
  }
`;

const removeProductsFromCategoryQuery = gql`
  mutation removeProductsFromCategory(
    $categoryId: String!
    $productIds: [String!]!
  ) {
    removeProductsFromCategory(
      categoryId: $categoryId
      productIds: $productIds
    ) {
      brand {
        id
      }
      status
    }
  }
`;

// Product-Collection Management Mutations
const addMultipleProductsToCollectionQuery = gql`
  mutation addMultipleProductsToCollection(
    $collectionId: String!
    $productIds: [String!]!
  ) {
    addMultipleProductsToCollection(
      collectionId: $collectionId
      productIds: $productIds
    ) {
      brand {
        id
      }
      status
    }
  }
`;

const removeMultipleProductsFromCollectionQuery = gql`
  mutation removeMultipleProductsFromCollection(
    $collectionId: String!
    $productIds: [String!]!
  ) {
    removeMultipleProductsFromCollection(
      collectionId: $collectionId
      productIds: $productIds
    ) {
      brand {
        id
      }
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

  // Collection APIs
  getCollections: () =>
    graphQlInstance(getCollectionsQuery(), {
      method: "GET",
    }),

  getCollection: ({ id }) =>
    graphQlInstance(getCollectionQuery({ id }), {
      method: "GET",
    }),

  getActiveCollections: () =>
    graphQlInstance(getActiveCollectionsQuery(), {
      method: "GET",
    }),

  getInactiveCollections: () =>
    graphQlInstance(getInactiveCollectionsQuery(), {
      method: "GET",
    }),

  getActiveCollectionsByBrand: ({ brandId }) =>
    graphQlInstance(getActiveCollectionsByBrandQuery({ brandId }), {
      method: "GET",
    }),

  getCollectionsByBrand: ({ brandId }) =>
    graphQlInstance(getCollectionsByBrandQuery({ brandId }), {
      method: "GET",
    }),

  getCollectionProducts: ({ collectionId }) =>
    graphQlInstance(getCollectionProductsQuery({ collectionId }), {
      method: "GET",
    }),

  createCollection: (variables) =>
    graphQlInstance(createCollectionQuery, {
      variables,
    }),

  updateCollection: (variables) =>
    graphQlInstance(updateCollectionQuery, {
      variables,
    }),

  activateCollection: (variables) =>
    graphQlInstance(activateCollectionQuery, {
      variables,
    }),

  deactivateCollection: (variables) =>
    graphQlInstance(deactivateCollectionQuery, {
      variables,
    }),

  removeCollection: (variables) =>
    graphQlInstance(removeCollectionQuery, {
      variables,
    }),

  addProductToCollection: (variables) =>
    graphQlInstance(addProductToCollectionQuery, {
      variables,
    }),

  removeProductFromCollection: (variables) =>
    graphQlInstance(removeProductFromCollectionQuery, {
      variables,
    }),

  updateMultipleCollectionPositions: (variables) =>
    graphQlInstance(updateMultipleCollectionPositionsQuery, {
      variables,
    }),

  // Product-Category Management APIs
  addProductsToCategory: (variables) =>
    graphQlInstance(addProductsToCategoryQuery, {
      variables,
    }),

  removeProductsFromCategory: (variables) =>
    graphQlInstance(removeProductsFromCategoryQuery, {
      variables,
    }),

  // Product-Collection Management APIs
  addMultipleProductsToCollection: (variables) =>
    graphQlInstance(addMultipleProductsToCollectionQuery, {
      variables,
    }),

  removeMultipleProductsFromCollection: (variables) =>
    graphQlInstance(removeMultipleProductsFromCollectionQuery, {
      variables,
    }),
};

export default apis;
