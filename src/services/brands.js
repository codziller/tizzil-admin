import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getBrandsQuery = ({
  categoryId,
  city,
  country,
  page,
  searchQuery,
  state,
}) => {
  const params = [];

  if (categoryId) params.push(`categoryId: "${categoryId}"`);
  if (city) params.push(`city: "${city}"`);
  if (country) params.push(`country: "${country}"`);
  params.push(`page: ${page || 1}`);
  if (searchQuery) params.push(`searchQuery: "${searchQuery}"`);
  if (state) params.push(`state: "${state}"`);

  return gql`
    {
      __typename
      adminGetPublicBrands(
        ${params.join("\n        ")}
      ) {
        data {
          id
          brandName
          description
          shortText
          logoUrl
          imageUrls
          addressLine1
          addressLine2
          city
          state
          country
          postalCode
          status
          isActive
          isPublic
          createdAt
          updatedAt
          submittedAt
          reviewedAt
          reviewedBy
          rejectionReason
          domesticDeliveryFee
          internationalDeliveryFees
          shouldHandleDomesticDelivery
          allowNegativeInventory
          lowStockAlertThreshold
          businessRegistrationNumber
          businessRegistrationDocumentUrl
          estimatedMonthlyOrders
          yearsInBusiness
          productImportMethod
          shopifyStoreUrl
          shopifyAccessToken
          latitude
          longitude
          countryShortCode
          stateShortCode
          userId
          owner {
            id
            firstName
            lastName
            email
            phoneNumber
          }
          brandUsers {
            id
            userId
            brandId
            role
            isActive
            createdAt
            updatedAt
            invitedAt
            joinedAt
            user {
              id
              firstName
              lastName
              email
              phoneNumber
            }
          }
        }
        total
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  `;
};

const getBrandQuery = ({ brandId }) => gql`
  {
    __typename
    adminGetBrandById(brandId: "${brandId}") {
      id
      brandName
      description
      shortText
      logoUrl
      imageUrls
      addressLine1
      addressLine2
      city
      state
      country
      postalCode
      status
      isActive
      isPublic
      createdAt
      updatedAt
      submittedAt
      reviewedAt
      reviewedBy
      rejectionReason
      domesticDeliveryFee
      internationalDeliveryFees
      shouldHandleDomesticDelivery
      allowNegativeInventory
      lowStockAlertThreshold
      businessRegistrationNumber
      businessRegistrationDocumentUrl
      estimatedMonthlyOrders
      yearsInBusiness
      productImportMethod
      shopifyStoreUrl
      shopifyAccessToken
      latitude
      longitude
      countryShortCode
      stateShortCode
      userId
      owner {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      brandUsers {
        id
        userId
        brandId
        role
        isActive
        createdAt
        updatedAt
        invitedAt
        joinedAt
        user {
          id
          firstName
          lastName
          email
          phoneNumber
        }
      }
    }
  }
`;

const createBrandQuery = gql`
  mutation createBrand(
    $logoUrl: String!
    $brandName: String!
    $categoryId: String
    $imageUrls: [String!]
    $videoUrls: [String!]
  ) {
    createBrand(
      createBrandInput: {
        logoUrl: $logoUrl
        brandName: $brandName
        categoryId: $categoryId
        imageUrls: $imageUrls
        videoUrls: $videoUrls
      }
    ) {
      id
    }
  }
`;

const editBrandQuery = gql`
  mutation updateBrand(
    $id: String!
    $logoUrl: String
    $brandName: String
    $categoryId: String
    $imageUrls: [String!]
    $videoUrls: [String!]
  ) {
    updateBrand(
      updateBrandInput: {
        id: $id
        logoUrl: $logoUrl
        brandName: $brandName
        categoryId: $categoryId
        imageUrls: $imageUrls
        videoUrls: $videoUrls
      }
    ) {
      id
    }
  }
`;

const deleteBrandQuery = gql`
  mutation removeBrand($id: String!) {
    removeBrand(id: $id) {
      status
    }
  }
`;

const getBrandsAwaitingApprovalQuery = ({
  page,
  city,
  country,
  endDate,
  hasShopifyIntegration,
  maxEstimatedMonthlyOrders,
  maxYearsInBusiness,
  minEstimatedMonthlyOrders,
  minYearsInBusiness,
  productImportMethod,
  searchQuery,
  startDate,
  state
}) => {
  const filterParams = [];

  if (city) filterParams.push(`city: "${city}"`);
  if (country) filterParams.push(`country: "${country}"`);
  if (endDate) filterParams.push(`endDate: "${endDate}"`);
  if (hasShopifyIntegration !== undefined) filterParams.push(`hasShopifyIntegration: ${hasShopifyIntegration}`);
  if (maxEstimatedMonthlyOrders) filterParams.push(`maxEstimatedMonthlyOrders: ${maxEstimatedMonthlyOrders}`);
  if (maxYearsInBusiness) filterParams.push(`maxYearsInBusiness: ${maxYearsInBusiness}`);
  if (minEstimatedMonthlyOrders) filterParams.push(`minEstimatedMonthlyOrders: ${minEstimatedMonthlyOrders}`);
  if (minYearsInBusiness) filterParams.push(`minYearsInBusiness: ${minYearsInBusiness}`);
  if (productImportMethod) filterParams.push(`productImportMethod: "${productImportMethod}"`);
  if (searchQuery) filterParams.push(`searchQuery: "${searchQuery}"`);
  if (startDate) filterParams.push(`startDate: "${startDate}"`);
  if (state) filterParams.push(`state: "${state}"`);

  const filtersString = filterParams.length > 0 ? `filters: { ${filterParams.join(', ')} }` : '';
  const params = [filtersString, `page: ${page || 1}`].filter(Boolean);

  return gql`
    {
      __typename
      adminGetBrandsAwaitingApproval(
        ${params.join('\n        ')}
      ) {
        data {
          registrationId
          brandName
          ownerName
          ownerEmail
          submittedAt
          estimatedMonthlyOrders
          hasShopifyIntegration
          productImportMethod
          totalProducts
          addressInfo {
            addressLine1
            city
            state
            country
            postalCode
          }
          businessInfo {
            registrationNumber
            taxId
            yearsInBusiness
          }
        }
        total
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  `;
};

const getBrandDashboardStatsQuery = gql`
  {
    __typename
    adminGetBrandDashboardStats {
      approvedBrands
      pendingApprovals
      totalRegistrations
      brandsByStatus {
        approved
        pending
      }
    }
  }
`;

const approveBrandRegistrationMutation = gql`
  mutation adminApproveBrandRegistration($registrationId: String!) {
    adminApproveBrandRegistration(registrationId: $registrationId) {
      status
    }
  }
`;

const rejectBrandRegistrationMutation = gql`
  mutation adminRejectBrandRegistration($registrationId: String!, $rejectionReason: String!) {
    adminRejectBrandRegistration(registrationId: $registrationId, rejectionReason: $rejectionReason) {
      status
    }
  }
`;

const apis = {
  getBrands: ({ categoryId, city, country, page, searchQuery, state }) =>
    graphQlInstance(
      getBrandsQuery({ categoryId, city, country, page, searchQuery, state }),
      {
        method: "GET",
      }
    ),
  getBrand: ({ brandId }) =>
    graphQlInstance(getBrandQuery({ brandId }), {
      method: "GET",
    }),

  createBrand: (variables) =>
    graphQlInstance(createBrandQuery, {
      variables,
    }),

  editBrand: (variables) =>
    graphQlInstance(editBrandQuery, {
      variables,
    }),

  deleteBrand: (variables) =>
    graphQlInstance(deleteBrandQuery, {
      variables,
    }),

  getBrandsAwaitingApproval: ({
    page,
    city,
    country,
    endDate,
    hasShopifyIntegration,
    maxEstimatedMonthlyOrders,
    maxYearsInBusiness,
    minEstimatedMonthlyOrders,
    minYearsInBusiness,
    productImportMethod,
    searchQuery,
    startDate,
    state
  }) =>
    graphQlInstance(getBrandsAwaitingApprovalQuery({
      page,
      city,
      country,
      endDate,
      hasShopifyIntegration,
      maxEstimatedMonthlyOrders,
      maxYearsInBusiness,
      minEstimatedMonthlyOrders,
      minYearsInBusiness,
      productImportMethod,
      searchQuery,
      startDate,
      state
    }), {
      method: "GET",
    }),

  getBrandDashboardStats: () =>
    graphQlInstance(getBrandDashboardStatsQuery, {
      method: "GET",
    }),

  approveBrandRegistration: (variables) =>
    graphQlInstance(approveBrandRegistrationMutation, {
      variables,
    }),

  rejectBrandRegistration: (variables) =>
    graphQlInstance(rejectBrandRegistrationMutation, {
      variables,
    }),
};

export default apis;
