import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getProductQuery = ({ id }) => gql`
  {
    __typename
    product(id: "${id}") {
     
id     
brand {
  brandName
  id
}
brandId
categories {
  name
  id
  }
costPrice
createdAt
discountType
discountValue
isDiscountAllowed
enablePreOrder
isPrivate
howToUse
id
name
preOrderLimit
preOrderMessage
productDescription
productIngredients
productOptions {
  choiceDisplay
  choices{
    description
    imageUrls
    variantCostPrice
    variantName
    variantQuantity
    variantSalePrice
    videoUrls
    visibility
    weight
    color
    main
  }
  name
  id
}
productSubscriptions {
  name
  id
  active
  discountType
  discountValue
  subscriptionDuration
  subscriptionFrequency
  tagline
}
ribbon
salePrice
updatedAt
weight
weightType
imageUrls
lowInQuantityValue
warehouseInventory {
id
lowInQuantityValue
quantity
warehouseId
}
quantity
productCostPrice {
  costPrice
  updatedAt
  id
  quantityLeft
}
archive
       
    }
  }
`;

const getProductQuantitySoldByDateFilterQuery = ({
  productId,
  endDate,
  startDate,
  productOptionChoiceIndex,
  productOptionId,
  warehouseId,
}) =>
  !productOptionId
    ? gql`
{
  __typename
  getProductQuantitySoldByDateFilter(productId: "${productId}", warehouseId: "${warehouseId}",
  dateFilter:{

    endDate: "${endDate}",
startDate: "${startDate}"

  }) {
    profit
    qtyLeft
    qtySold
   
}
}
`
    : gql`
  {
    __typename
    getProductQuantitySoldByDateFilter(productId: "${productId}",
    productOptionChoiceIndex: ${productOptionChoiceIndex},
    productOptionId: "${productOptionId}",
    warehouseId: "${warehouseId}",
    dateFilter:{

      endDate: "${endDate}",
startDate: "${startDate}",
    }) {
      profit
      qtyLeft
      qtySold
     
}
}
`;

const getProductQuantitySoldByDateFilterByBrandIdQuery = ({
  brandId,
  endDate,
  startDate,
}) => gql`
  {
    __typename
    getProductQuantitySoldByDateFilterByBrandId(brandId: "${brandId}",dateFilter:{

      endDate: "${endDate}",
startDate: "${startDate}"
    }) {
      costPrice
      productName
      productId
      profit
      quantityLeft
      quantitySold
      salePrice
      totalGrossRevenue
      averageOrderValue
}
}
`;

const sendProductInventoryCsvQuery = ({ email, endDate, startDate }) => gql`
  {
    __typename
    send_product_inventory_csv(email: "${email}", endDate: "${endDate}", startDate: "${startDate}") {
      status
}
}
`;

const getProductCostPriceHistoryQuery = ({
  productId,
  pageNumber,
  warehouseId,
}) => gql`
  {
    __typename
    products_inventory_history_by_product_id(productId: "${productId}",pageNumber: "${pageNumber}",warehouseId: "${warehouseId}") {
      total
      results {
      costPrice
      lastUpdatedDateAndTime
      quantityLeft
      quantityUpdated
      typeOfStockUpdate
      userFullName
      userId
      productOptionId
      productOptionIndex
      }
}
}
`;

const getProductNameQuery = ({ id }) => gql`
  {
    __typename
    product(id: "${id}") {
    id     
    name
    }
  }
`;

const checkProductQuantityInWarehouseQuery = ({
  productId,
  requiredQuantity,
  warehouseId,
}) => gql`
{
  __typename
  checkProductQuantityInWarehouse(productId: "${productId}", requiredQuantity: ${requiredQuantity}, warehouseId: "${warehouseId}") {    
  scalar
  }
}
`;

const getProductsQuery = ({ page }) => gql`
  {
    __typename
    products_auth(pageNumber: "${page}") {
      total
      results {
      brand {
        brandName
      }
      categories {
        name
        }
      id
      name
      salePrice
      costPrice
      imageUrls
      archive
      quantity
      updatedAt
      lowInQuantityValue
      productCostPrice {
        costPrice
        updatedAt
        id
        quantityLeft
      }
productOptions {
  choices{
    variantCostPrice
    variantQuantity
    main
  }
}
      }
    }
  }
`;

const getVariantsQuery = ({ page }) => gql`
  {
    __typename
    products_auth(pageNumber: "${page}") {
      total
      results {
      brand {
        brandName
      }
      categories {
        name
        }
      id
      name
      imageUrls
productOptions {
  choices{
    variantSalePrice
    main
  }
}
      }
    }
  }
`;

const getProductsByBrandsAndCategoriesQuery = ({
  page,
  categoryIds,
  brandIds,
}) => gql`
  {
    __typename
    products_by_brand_ids_and_category_ids(pageNumber: "${page}",categoryIds: ${categoryIds},brandIds: ${brandIds}) {
      total
      results {
      brand {
        brandName
      }
      categories {
        name
        }
      id
      name
      warehouseInventory {
        lowInQuantityValue
        quantity
        warehouseId
      }
      salePrice
      costPrice
      imageUrls
      archive
      quantity
      updatedAt
      lowInQuantityValue
      productCostPrice {
        costPrice
        updatedAt
        id
        quantityLeft
      }
productOptions {
  choices{
    variantCostPrice
    variantQuantity
    main
  }
}
      }
    }
  }
`;

const getProductsLowInQuantityQuery = ({ page }) => gql`
  {
    __typename
    products_low_in_quantity(pageNumber: "${page}") {
      total
      results {
      brand {
        brandName
      }
      categories {
        name
        }
      id
      name
      warehouseInventory {
        lowInQuantityValue
        quantity
        warehouseId
      }
      salePrice
      costPrice
      imageUrls
      archive
      quantity
      updatedAt
      lowInQuantityValue
      productCostPrice {
        costPrice
        updatedAt
        id
        quantityLeft
      }
productOptions {
  choices{
    variantCostPrice
    variantQuantity
    main
  }
}
      }
    }
  }
`;

const getProductCostPricesQuery = ({ productId }) =>
  gql`
  {
    __typename
    products_cost_prices(productId: "${productId}") {
      id
      costPrice
      quantityLeft
      productOptionId
      productOptionIndex
}
}
`;

const getPrivateProductsQuery = ({ page, isPrivate }) => gql`
  {
    __typename
    products_by_private_status(pageNumber: "${page}",isPrivate:${isPrivate}) {
      total
      results {
      brand {
        brandName
      }
      categories {
        name
        }
      id
      name
    
      salePrice
      imageUrls
      archive
      isPrivate
      productCostPrice {
        costPrice
        updatedAt
        id
        quantityLeft
      }
      productOptions {
        choices{
          variantCostPrice
          variantQuantity
          main
        }
      }
      }
    }
  }
`;

const getProductsCountQuery = ({ page }) => gql`
  {
    __typename
    products_auth(pageNumber: "${page}") {
      total
    }
  }
`;

const createProductQuery = gql`
  mutation createProduct(
    $brandId: String!
    $categoryIds: [String!]!
    $costPrice: String!
    $discountType: DISCOUNT_TYPE
    $discountValue: String
    $isDiscountAllowed: Boolean!
    $enablePreOrder: Boolean!
    $isPrivate: Boolean!
    $howToUse: String
    $imageUrls: [String!]
    $name: String!
    $preOrderLimit: String!
    $preOrderMessage: String
    $productDescription: String
    $productIngredients: String
    $productOptions: [CreateProductOptionInput!]
    $productSubscriptions: [CreateProductSubscriptionInput!]
    $warehouseInventory: [WareHouseInventoryInput!]!
    $ribbon: RIBBON
    $salePrice: String!
    $videoUrls: [String!]
    $weight: String!
    $weightType: WEIGHT_TYPE!
    $exchangeRateSaleCurrency: CURRENCY
    $exchangeRateSalePrice: String
  ) {
    createProduct(
      createProductInput: {
        brandId: $brandId
        categoryIds: $categoryIds
        costPrice: $costPrice
        discountType: $discountType
        discountValue: $discountValue
        isDiscountAllowed: $isDiscountAllowed
        enablePreOrder: $enablePreOrder
        isPrivate: $isPrivate
        howToUse: $howToUse
        imageUrls: $imageUrls
        name: $name
        preOrderLimit: $preOrderLimit
        preOrderMessage: $preOrderMessage
        productDescription: $productDescription
        productIngredients: $productIngredients
        productOptions: $productOptions
        productSubscriptions: $productSubscriptions
        warehouseInventory: $warehouseInventory
        ribbon: $ribbon
        salePrice: $salePrice
        videoUrls: $videoUrls
        weight: $weight
        weightType: $weightType
        exchangeRateSaleCurrency: $exchangeRateSaleCurrency
        exchangeRateSalePrice: $exchangeRateSalePrice
      }
    ) {
      id
    }
  }
`;

const editProductQuery = gql`
  mutation updateProduct(
    $productId: String!
    $brandId: String!
    $discountType: DISCOUNT_TYPE
    $discountValue: String
    $isDiscountAllowed: Boolean!
    $enablePreOrder: Boolean!
    $isPrivate: Boolean!
    $howToUse: String
    $imageUrls: [String!]
    $name: String!
    $preOrderLimit: String!
    $preOrderMessage: String
    $productDescription: String
    $productIngredients: String
    $ribbon: RIBBON
    $salePrice: String!
    $videoUrls: [String!]
    $weight: String!
    $weightType: WEIGHT_TYPE!
    $exchangeRateSaleCurrency: CURRENCY
    $exchangeRateSalePrice: String
  ) {
    updateProduct(
      updateProductInput: {
        brandId: $brandId
        discountType: $discountType
        discountValue: $discountValue
        isDiscountAllowed: $isDiscountAllowed
        enablePreOrder: $enablePreOrder
        isPrivate: $isPrivate
        howToUse: $howToUse
        imageUrls: $imageUrls
        name: $name
        preOrderLimit: $preOrderLimit
        preOrderMessage: $preOrderMessage
        productDescription: $productDescription
        productIngredients: $productIngredients
        ribbon: $ribbon
        salePrice: $salePrice
        videoUrls: $videoUrls
        weight: $weight
        weightType: $weightType
        exchangeRateSaleCurrency: $exchangeRateSaleCurrency
        exchangeRateSalePrice: $exchangeRateSalePrice
      }
      productId: $productId
    ) {
      id
    }
  }
`;

const editProductVariantQuery = gql`
  mutation updateProductVariant(
    $description: String
    $imageUrls: [String!]
    $productVariantId: String!
    $variantCostPrice: String
    $variantName: String
    $variantQuantity: String
    $variantSalePrice: String
    $videoUrls: [String!]
    $visibility: Boolean
    $weight: String
  ) {
    updateProductVariant(
      updateProductInput: {
        description: $description
        imageUrls: $imageUrls
        productVariantId: $productVariantId
        variantCostPrice: $variantCostPrice
        variantName: $variantName
        variantQuantity: $variantQuantity
        variantSalePrice: $variantSalePrice
        videoUrls: $videoUrls
        visibility: $visibility
        weight: $weight
      }
    ) {
      id
    }
  }
`;
const createProductOptionQuery = gql`
  mutation createProductOption(
    $createProductOptionInput: CreateProductOptionInput!
    $productId: String!
  ) {
    createProductOption(
      createProductOptionInput: $createProductOptionInput
      productId: $productId
    ) {
      id
    }
  }
`;
const createProductCategoryQuery = gql`
  mutation createProductCategory($categoryId: String!, $productId: String!) {
    createProductCategory(categoryId: $categoryId, productId: $productId) {
      id
    }
  }
`;

const createProductSubscriptionQuery = gql`
  mutation createProductSubscription(
    $createProductSubscriptionInput: CreateProductOptionInput!
    $productId: String!
  ) {
    createProductSubscription(
      createProductSubscriptionInput: $createProductSubscriptionInput
      productId: $productId
    ) {
      id
    }
  }
`;

const editProductOptionQuery = gql`
  mutation updateProductOption(
    $choiceDisplay: String!
    $choices: [UpdateProductVariant!]
    $name: String!
    $productOptionId: String!
  ) {
    updateProductOption(
      updateProductInput: {
        choiceDisplay: $choiceDisplay
        choices: $choices
        name: $name
        productOptionId: $productOptionId
      }
    ) {
      id
    }
  }
`;
const editProductSubscriptionQuery = gql`
  mutation updateProductSubscription(
    $active: Boolean
    $discountType: DISCOUNT_TYPE
    $discountValue: String
    $name: String
    $productSubscriptionId: String!
    $subscriptionDuration: String
    $subscriptionFrequency: String
    $tagline: String
  ) {
    updateProductSubscription(
      updateProductInput: {
        active: $active
        discountType: $discountType
        discountValue: $discountValue
        name: $name
        productSubscriptionId: $productSubscriptionId
        subscriptionDuration: $subscriptionDuration
        subscriptionFrequency: $subscriptionFrequency
        tagline: $tagline
      }
    ) {
      id
    }
  }
`;
const editProductInventoryQuery = gql`
  mutation updateMultipleProductInventory(
    $costPrice: String
    $salePrice: String
    $products: [UpdateProductInventoryInput!]!
  ) {
    updateMultipleProductInventory(
      products: $products
      costPrice: $costPrice
      salePrice: $salePrice
    ) {
      status
    }
  }
`;
const requestProductsQuery = gql`
  mutation requestProducts(
    $destinationWarehouseId: String!
    $productTransferRequestProductQuantities: [CreateProductTransferRequestProductQuantityInput!]!
    $sourceWarehouseId: String!
  ) {
    requestProducts(
      createProductTransferRequestInput: {
        destinationWarehouseId: $destinationWarehouseId
        productTransferRequestProductQuantities: $productTransferRequestProductQuantities
        sourceWarehouseId: $sourceWarehouseId
      }
    ) {
      id
    }
  }
`;
const getArchivedProductsQuery = ({ page }) => gql`
  {
    __typename
    archived_products(pageNumber: "${page}") {
      total
      results {
        brand {
          brandName
        }
        categories {
          name
          }
        id
        name
        quantity
        lowInQuantityValue
        updatedAt
        salePrice
        costPrice
        imageUrls
        archive
        productOptions {
          choices{
            variantCostPrice
            variantQuantity
            main
          }
        }
      }
    }
  }
`;
const searchProductsQuery = ({ page, searchQuery }) => gql`
  {
    __typename
    searchProducts(pageNumber: "${page}", searchQuery: "${searchQuery}") {
      total
      results {
        brand {
          brandName
        }
        categories {
          name
          }
        id
        name
        quantity
        lowInQuantityValue
        salePrice
        imageUrls
        archive 
        productOptions {
          choices{
            variantCostPrice
            variantQuantity
            main
          }
        }
        productCostPrice {
          costPrice
          updatedAt
          id
          quantityLeft
        }
      }
    }
  }
`;
const deleteProductQuery = gql`
  mutation archiveProduct($archive: Boolean!, $productId: String!) {
    archiveProduct(archive: $archive, productId: $productId) {
      status
    }
  }
`;

const productTransferRequestQuery = ({ id }) => gql`
  {
    __typename
    productTransferRequest(id: ${id}) {
      acceptedBy {
        firstName
        lastName
        id
      }
      cancelledBy {
        firstName
        lastName
        id
      }
      cancelledTime
      code
      completedBy {
        firstName
        lastName
        id
      }
      completedTime
      createdAt
      startTime
      status
      createdBy {
        firstName
        lastName
        id
      }
      destinationWarehouse {
        id
        name
      }
      sourceWarehouse {
        id
        name
      }
      id
      productTransferRequestProductQuantities {
        quantity
        product{
          name
        }
        
      }
    }
  }
`;
const productTransferRequestsQuery = ({
  page,
  warehouseId,
  isSource,
  status,
}) => gql`
  {
    __typename
    productTransferRequests(isSource: ${isSource}, pageNumber: "${page}", status: ${status}, warehouseId: "${warehouseId}") {
      total
      results {
        acceptedBy {
          firstName
          lastName
          id
        }
        cancelledBy {
          firstName
          lastName
          id
        }
        cancelledTime
        code
        completedBy {
          firstName
          lastName
          id
        }
        completedTime
        createdAt
        startTime
        status
        createdBy {
          firstName
          lastName
          id
        }
        destinationWarehouse {
          id
          name
        }
        sourceWarehouse {
          id
          name
        }
        id
        productTransferRequestProductQuantities {
          quantity
          product {
            name
          }
          
        }
      }
    }
  }
`;

const updateProductTransferRequestStatusQuery = gql`
  mutation updateProductTransferRequestStatus(
    $productTransferRequestId: String!
    $status: TRANSFER_REQUEST_STATUS!
    $warehouseId: String!
  ) {
    updateProductTransferRequestStatus(
      productTransferRequestId: $productTransferRequestId
      status: $status
      warehouseId: $warehouseId
    ) {
      status
    }
  }
`;

const deleteProductCategoryQuery = gql`
  mutation removeProductCategory($categoryId: String!, $productId: String!) {
    removeProductCategory(categoryId: $categoryId, productId: $productId) {
      status
    }
  }
`;

const deleteProductOptionQuery = gql`
  mutation removeProductOption($id: String!) {
    removeProductOption(id: $id) {
      status
    }
  }
`;

const deleteProductSubscriptionQuery = gql`
  mutation removeProductSubscription($id: String!) {
    removeProductSubscription(id: $id) {
      status
    }
  }
`;

const deleteProductReviewQuery = ({ productReviewId }) => gql`
  {
    __typename
    deleteProductReview(productReviewId: "${productReviewId}") {
      status
    }
  }
`;

const getProductReviewsQuery = ({ page, productId }) => gql`
  {
    __typename
    products_reviews_by_product_id(pageNumber: "${page}",productId:"${productId}") {
      total
      results {
        id
        createdAt
        rating
        review
        user{
          firstName
          lastName
        }
      }
    }
  }
`;

const getReviewsQuery = ({ page }) => gql`
  {
    __typename
    products_reviews_all(pageNumber: "${page}") {
      total
      results {
        id
        createdAt
        rating
        review
        orderId
        orderCode
        productId
        productName
        user{
          firstName
          lastName
          phoneNumber
          id
        }
      }
    }
  }
`;

const apis = {
  getProducts: ({ page }) =>
    graphQlInstance(getProductsQuery({ page }), {
      method: "GET",
    }),
  getVariants: ({ page }) =>
    graphQlInstance(getVariantsQuery({ page }), {
      method: "GET",
    }),

  getProductsByBrandsAndCategories: ({ page, categoryIds, brandIds }) =>
    graphQlInstance(
      getProductsByBrandsAndCategoriesQuery({ page, categoryIds, brandIds }),
      {
        method: "GET",
      }
    ),

  getProductsLowInQuantity: ({ page }) =>
    graphQlInstance(getProductsLowInQuantityQuery({ page }), {
      method: "GET",
    }),

  getPrivateProducts: ({ page, isPrivate }) =>
    graphQlInstance(getPrivateProductsQuery({ page, isPrivate }), {
      method: "GET",
    }),
  getProductQuantitySoldByDateFilter: ({
    productId,
    startDate,
    endDate,
    productOptionChoiceIndex,
    productOptionId,
    warehouseId,
  }) =>
    graphQlInstance(
      getProductQuantitySoldByDateFilterQuery({
        productId,
        startDate,
        endDate,
        productOptionChoiceIndex,
        productOptionId,
        warehouseId,
      }),
      {
        method: "GET",
      }
    ),

  getProductQuantitySoldByDateFilterByBrandId: ({
    brandId,
    startDate,
    endDate,
  }) =>
    graphQlInstance(
      getProductQuantitySoldByDateFilterByBrandIdQuery({
        brandId,
        startDate,
        endDate,
      }),
      {
        method: "GET",
      }
    ),

  sendProductInventoryCsv: ({ email, startDate, endDate }) =>
    graphQlInstance(
      sendProductInventoryCsvQuery({
        email,
        startDate,
        endDate,
      }),
      {
        method: "GET",
      }
    ),

  getProductsCount: ({ page }) =>
    graphQlInstance(getProductsCountQuery({ page }), {
      method: "GET",
    }),
  getProduct: ({ id }) =>
    graphQlInstance(getProductQuery({ id }), {
      method: "GET",
    }),
  getProductCostPrices: ({ productId }) =>
    graphQlInstance(getProductCostPricesQuery({ productId }), {
      method: "GET",
    }),

  getProductCostPriceHistory: ({ productId, pageNumber, warehouseId }) =>
    graphQlInstance(
      getProductCostPriceHistoryQuery({ productId, pageNumber, warehouseId }),
      {
        method: "GET",
      }
    ),

  getProductName: ({ id }) =>
    graphQlInstance(getProductNameQuery({ id }), {
      method: "GET",
    }),
  checkProductQuantityInWarehouse: ({ id }) =>
    graphQlInstance(checkProductQuantityInWarehouseQuery({ id }), {
      method: "GET",
    }),

  createProduct: (variables) =>
    graphQlInstance(createProductQuery, {
      variables,
    }),

  editProduct: (variables) =>
    graphQlInstance(editProductQuery, {
      variables,
    }),
  editProductVariant: (variables) =>
    graphQlInstance(editProductVariantQuery, {
      variables,
    }),
  editProductOption: (variables) =>
    graphQlInstance(editProductOptionQuery, {
      variables,
    }),
  editProductSubscription: (variables) =>
    graphQlInstance(editProductSubscriptionQuery, {
      variables,
    }),
  editProductInventory: (variables) =>
    graphQlInstance(editProductInventoryQuery, {
      variables,
    }),

  createProductOption: (variables) =>
    graphQlInstance(createProductOptionQuery, {
      variables,
    }),

  createProductCategory: (variables) =>
    graphQlInstance(createProductCategoryQuery, {
      variables,
    }),

  createProductSubscription: (variables) =>
    graphQlInstance(createProductSubscriptionQuery, {
      variables,
    }),

  requestProducts: (variables) =>
    graphQlInstance(requestProductsQuery, {
      variables,
    }),

  searchProducts: ({ page, searchQuery }) =>
    graphQlInstance(searchProductsQuery({ page, searchQuery }), {
      method: "GET",
    }),

  productTransferRequests: ({ page, warehouseId, status, isSource }) =>
    graphQlInstance(
      productTransferRequestsQuery({ page, warehouseId, status, isSource }),
      {
        method: "GET",
      }
    ),
  productTransferRequest: ({ id }) =>
    graphQlInstance(productTransferRequestQuery({ id }), {
      method: "GET",
    }),
  getArchivedProducts: ({ page }) =>
    graphQlInstance(getArchivedProductsQuery({ page }), {
      method: "GET",
    }),
  deleteProduct: (variables) =>
    graphQlInstance(deleteProductQuery, {
      variables,
    }),
  updateProductTransferRequestStatus: (variables) =>
    graphQlInstance(updateProductTransferRequestStatusQuery, {
      variables,
    }),

  deleteProductCategory: (variables) =>
    graphQlInstance(deleteProductCategoryQuery, {
      variables,
    }),
  deleteProductOption: (variables) =>
    graphQlInstance(deleteProductOptionQuery, {
      variables,
    }),
  deleteProductSubscription: (variables) =>
    graphQlInstance(deleteProductSubscriptionQuery, {
      variables,
    }),

  deleteProductReview: ({ productReviewId }) =>
    graphQlInstance(deleteProductReviewQuery({ productReviewId }), {
      method: "GET",
    }),

  getProductReviews: ({ page, productId }) =>
    graphQlInstance(getProductReviewsQuery({ page, productId }), {
      method: "GET",
    }),

  getReviews: ({ page }) =>
    graphQlInstance(getReviewsQuery({ page }), {
      method: "GET",
    }),
};

export default apis;
