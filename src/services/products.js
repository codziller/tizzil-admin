import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getProductQuery = ({ id }) => gql`
  {
    __typename
    productWithInventory(id: "${id}") {
     
id     
brand {
  brandName
  id
}
  isActive
brandId
categories {
  name
  id
  }
baseCostPrice
createdAt
enablePreOrder
howToUse
id
name
preOrderLimit
preOrderMessage
productIngredients
productOptions {
  createdAt
  displayOrder
  id
  isRequired
  optionName
  optionType
  optionValues {
    colorHex
    createdAt
    displayOrder
    displayValue
    id
    imageUrl
    isActive
    measurement
    measurementUnit
    productOption {
      id
      optionName
    }
    productOptionId
    updatedAt
    value
  }
  productId
  updatedAt
}
productVariants {
  barcode
  compareAtPrice
  costPrice
  createdAt
  currentStock
  description
  id
  imageUrls
  inventory {
    brand {
      id
      brandName
    }
    brandId
    createdAt
    id
    isLowStock
    isOutOfStock
    lastCountedAt
    lastRestockedAt
    lastStockoutAt
    maxStockLevel
    product {
      id
      name
    }
    productId
    productVariant {
      id
      variantName
    }
    productVariantId
    quantityAllocated
    quantityAvailable
    quantityInTransit
    quantityOnHand
    reorderPoint
    reorderQuantity
    updatedAt
  }
  isActive
  isDefault
  isLowStock
  isOutOfStock
  productId
  sku
  updatedAt
  variantName
  variantOptions {
    createdAt
    id
    productOption {
      id
      optionName
      optionType
    }
    productOptionId
    productOptionValue {
      id
      value
      displayValue
      colorHex
    }
    productOptionValueId
    productVariant {
      id
      variantName
    }
    productVariantId
    updatedAt
  }
  videoUrls
  visibility
  weight
  weightType
}
ribbon
updatedAt
weight
weightType
imageUrls
lowInQuantityValue 
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

const sendProductInventoryCsvQuery = ({
  email,
  endDate,
  startDate,
  warehouseId,
}) => gql`
  {
    __typename
    send_product_inventory_csv(email: "${email}", endDate: "${endDate}", startDate: "${startDate}", warehouseId: "${warehouseId}") {
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
      cloudErpItemCode
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

const getProductsWithInventoryQuery = ({
  brandIds,
  categoryIds,
  collectionIds,
  inStockOnly,
  isActive,
  pageNumber,
  searchQuery,
  sortBy,
}) => gql`
  {
    __typename
    productsWithInventory(
      ${brandIds ? `brandIds: ${JSON.stringify(brandIds)}` : ""}
      ${categoryIds ? `categoryIds: ${JSON.stringify(categoryIds)}` : ""}
      ${collectionIds ? `collectionIds: ${JSON.stringify(collectionIds)}` : ""}
      ${inStockOnly !== undefined ? `inStockOnly: ${inStockOnly}` : ""}
      ${isActive !== undefined ? `isActive: ${isActive}` : ""}
      pageNumber: "${pageNumber}"
      ${searchQuery ? `searchQuery: "${searchQuery}"` : ""}
      ${sortBy ? `sortBy: ${sortBy}` : ""}
    ) {
      total
      results {
        averageRating
        baseCostPrice
        basePrice
        baseSku
        brand {
          id
          brandName
        }
        brandId
        categories {
          id
          name
        }
        createdAt
        currentStock
        description
        enablePreOrder
        exchangeRateSaleCurrency
        howToUse
        id
        imageUrls
        inventory {
          id
          quantityAvailable
        }
        isActive
        isLowStock
        isOutOfStock
        isPublic
        lowInQuantityValue
        metaDescription
        metaTitle
        name
        preOrderLimit
        preOrderMessage
        productIngredients
        productOptions {
          createdAt
          displayOrder
          id
          isRequired
          optionName
          optionType
          optionValues {
            colorHex
            createdAt
            displayOrder
            displayValue
            id
            imageUrl
            isActive
            measurement
            measurementUnit
            productOption {
              id
              optionName
            }
            productOptionId
            updatedAt
            value
          }
          productId
          updatedAt
        }
        productVariants {
          barcode
          compareAtPrice
          costPrice
          createdAt
          currentStock
          description
          id
          imageUrls
          inventory {
            brand {
              id
              brandName
            }
            brandId
            createdAt
            id
            isLowStock
            isOutOfStock
            lastCountedAt
            lastRestockedAt
            lastStockoutAt
            maxStockLevel
            product {
              id
              name
            }
            productId
            productVariant {
              id
              variantName
            }
            productVariantId
            quantityAllocated
            quantityAvailable
            quantityInTransit
            quantityOnHand
            reorderPoint
            reorderQuantity
            updatedAt
          }
          isActive
          isDefault
          isLowStock
          isOutOfStock
          productId
          salePrice
          sku
          updatedAt
          variantName
          variantOptions {
            createdAt
            id
            productOption {
              id
              optionName
              optionType
            }
            productOptionId
            productOptionValue {
              id
              value
              displayValue
              colorHex
            }
            productOptionValueId
            productVariant {
              id
              variantName
            }
            productVariantId
            updatedAt
          }
          videoUrls
          visibility
          weight
          weightType
        }
        ribbon
        tags
        updatedAt
        weight
        weightType
      }
    }
  }
`;

// Helper function to map options from frontend format to GraphQL schema for create
const mapOptionsForCreate = (options) => {
  if (!options || !Array.isArray(options)) return null;

  return options.map(option => {
    const mapped = {
      displayOrder: option.displayOrder || 1,
      isRequired: option.isRequired || false,
      optionName: option.name || option.optionName,
      optionType: option.type || option.optionType,
    };

    // Map option values
    if (option.values || option.optionValues) {
      mapped.optionValues = (option.values || option.optionValues).map(value => ({
        colorHex: value.colorHex || "",
        displayOrder: value.displayOrder || 1,
        displayValue: value.displayValue || "",
        imageUrl: value.imageUrl || "",
        isActive: value.isActive !== undefined ? value.isActive : true,
        measurement: value.measurement,
        measurementUnit: value.measurementUnit || "",
        value: value.value,
      }));
    }

    return mapped;
  });
};

// Helper function to map variants from frontend format to GraphQL schema for create
const mapVariantsForCreate = (variants) => {
  if (!variants || !Array.isArray(variants)) return null;

  return variants.map(variant => {
    const mapped = {
      barcode: variant.barcode || "",
      compareAtPrice: variant.compareAtPrice,
      costPrice: variant.costPrice,
      description: variant.description || "",
      imageUrls: variant.imageUrls || [],
      isActive: variant.isActive !== undefined ? variant.isActive : true,
      isDefault: variant.isDefault || false,
      salePrice: variant.salePrice,
      sku: variant.sku || "",
      variantName: variant.name || variant.variantName,
      videoUrls: variant.videoUrls || [],
      visibility: variant.visibility !== undefined ? variant.visibility : true,
      weight: variant.weight,
      weightType: variant.weightType,
    };

    // Map option values
    if (variant.optionValues) {
      mapped.optionValues = variant.optionValues.map(ov => ({
        optionName: ov.optionName,
        optionValue: ov.optionValue,
      }));
    }

    return mapped;
  });
};

const createProductWithInventoryQuery = gql`
  mutation createProductWithInventory(
    $brandId: String!
    $productData: CreateProductSchema!
  ) {
    createProductWithInventory(brandId: $brandId, productData: $productData) {
      id
    }
  }
`;

// Helper function to serialize GraphQL input objects
const serializeGraphQLInput = (obj) => {
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'string') return `"${obj.replace(/"/g, '\\"')}"`;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  if (Array.isArray(obj)) {
    return `[${obj.map(serializeGraphQLInput).join(', ')}]`;
  }
  if (typeof obj === 'object') {
    const fields = Object.entries(obj)
      .map(([key, value]) => `${key}: ${serializeGraphQLInput(value)}`)
      .join(', ');
    return `{${fields}}`;
  }
  return String(obj);
};

// Helper function to map options from frontend format to GraphQL schema
const mapOptionsForUpdate = (options) => {
  if (!options || !Array.isArray(options)) return null;

  return options.map(option => {
    const mapped = {
      displayOrder: option.displayOrder,
      isRequired: option.isRequired,
      optionName: option.name || option.optionName,
      optionType: option.type || option.optionType,
    };

    // Only include id if it exists (for updates)
    if (option.id) {
      mapped.id = option.id;
    }

    // Map option values
    if (option.values || option.optionValues) {
      mapped.optionValues = (option.values || option.optionValues).map(value => {
        const mappedValue = {
          colorHex: value.colorHex || "",
          displayOrder: value.displayOrder,
          displayValue: value.displayValue || "",
          imageUrl: value.imageUrl || "",
          isActive: value.isActive !== undefined ? value.isActive : true,
          measurement: value.measurement,
          measurementUnit: value.measurementUnit || "",
          value: value.value,
        };

        // Only include id if it exists (for updates)
        if (value.id) {
          mappedValue.id = value.id;
        }

        return mappedValue;
      });
    }

    return mapped;
  });
};

// Helper function to map variants from frontend format to GraphQL schema
const mapVariantsForUpdate = (variants) => {
  if (!variants || !Array.isArray(variants)) return null;

  return variants.map(variant => {
    const mapped = {
      barcode: variant.barcode || "",
      compareAtPrice: variant.compareAtPrice,
      costPrice: variant.costPrice,
      description: variant.description || "",
      imageUrls: variant.imageUrls || [],
      isActive: variant.isActive !== undefined ? variant.isActive : true,
      isDefault: variant.isDefault || false,
      salePrice: variant.salePrice,
      sku: variant.sku || "",
      variantName: variant.name || variant.variantName,
      videoUrls: variant.videoUrls || [],
      visibility: variant.visibility !== undefined ? variant.visibility : true,
      weight: variant.weight,
      weightType: variant.weightType,
    };

    // Only include id if it exists (for updates)
    if (variant.id) {
      mapped.id = variant.id;
    }

    // Map option values
    if (variant.optionValues) {
      mapped.optionValues = variant.optionValues.map(ov => ({
        optionName: ov.optionName,
        optionValue: ov.optionValue,
      }));
    }

    return mapped;
  });
};

const updateProductQuery = ({ updateData }) => {
  // Map options and variants to correct schema format
  const mappedOptions = updateData.options ? mapOptionsForUpdate(updateData.options) : null;
  const mappedVariants = updateData.variants ? mapVariantsForUpdate(updateData.variants) : null;

  return gql`
    mutation {
      updateProduct(
        updateData: {
          id: "${updateData.id}"
          ${updateData.name ? `name: "${updateData.name}"` : ""}
          ${
            updateData.baseCostPrice
              ? `baseCostPrice: ${updateData.baseCostPrice}`
              : ""
          }
          ${updateData.basePrice ? `basePrice: ${updateData.basePrice}` : ""}
          ${updateData.baseSku ? `baseSku: "${updateData.baseSku}"` : ""}
          ${
            updateData.categoryIds
              ? `categoryIds: ${JSON.stringify(updateData.categoryIds)}`
              : ""
          }
          ${
            updateData.description
              ? `description: "${updateData.description.replace(/"/g, '\\"')}"`
              : ""
          }
          ${
            updateData.enablePreOrder !== undefined
              ? `enablePreOrder: ${updateData.enablePreOrder}`
              : ""
          }
          ${
            updateData.exchangeRateSaleCurrency
              ? `exchangeRateSaleCurrency: ${updateData.exchangeRateSaleCurrency}`
              : ""
          }
          ${updateData.howToUse ? `howToUse: "${updateData.howToUse.replace(/"/g, '\\"')}"` : ""}
          ${
            updateData.imageUrls
              ? `imageUrls: ${JSON.stringify(updateData.imageUrls)}`
              : ""
          }
          ${
            updateData.isActive !== undefined
              ? `isActive: ${updateData.isActive}`
              : ""
          }
          ${
            updateData.isPublic !== undefined
              ? `isPublic: ${updateData.isPublic}`
              : ""
          }
          ${
            updateData.lowInQuantityValue
              ? `lowInQuantityValue: "${updateData.lowInQuantityValue}"`
              : ""
          }
          ${
            updateData.metaDescription
              ? `metaDescription: "${updateData.metaDescription.replace(/"/g, '\\"')}"`
              : ""
          }
          ${updateData.metaTitle ? `metaTitle: "${updateData.metaTitle.replace(/"/g, '\\"')}"` : ""}
          ${
            mappedOptions
              ? `options: ${serializeGraphQLInput(mappedOptions)}`
              : ""
          }
          ${
            updateData.preOrderLimit
              ? `preOrderLimit: ${updateData.preOrderLimit}`
              : ""
          }
          ${
            updateData.preOrderMessage
              ? `preOrderMessage: "${updateData.preOrderMessage.replace(/"/g, '\\"')}"`
              : ""
          }
          ${
            updateData.productIngredients
              ? `productIngredients: "${updateData.productIngredients.replace(/"/g, '\\"')}"`
              : ""
          }
          ${updateData.ribbon ? `ribbon: ${updateData.ribbon}` : ""}
          ${updateData.tags ? `tags: ${JSON.stringify(updateData.tags)}` : ""}
          ${
            mappedVariants
              ? `variants: ${serializeGraphQLInput(mappedVariants)}`
              : ""
          }
          ${updateData.weight ? `weight: ${updateData.weight}` : ""}
          ${updateData.weightType ? `weightType: ${updateData.weightType}` : ""}
        }
      ) {
        id
      }
    }
  `;
};

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
    getProductReviews(pageNumber: ${page}, productId: "${productId}") {
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
        productVariantId
        updatedAt
        userId
        user {
          firstName
          lastName
          phoneNumber
          id
          email
        }
      }
    }
  }
`;

const getReviewsQuery = ({ page }) => gql`
  {
    __typename
    getAllProductReviews(pageNumber: ${page}) {
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
        productVariantId
        updatedAt
        userId
        user {
          firstName
          lastName
          phoneNumber
          id
          email
        }
      }
    }
  }
`;

const getOrderProductReviewsQuery = ({ orderId }) => gql`
  {
    __typename
    getOrderProductReviews(orderId: "${orderId}") {
      id
      createdAt
      rating
      review
      orderId
      orderCode
      productId
      productName
      productVariantId
      updatedAt
      userId
      user {
        firstName
        lastName
        phoneNumber
        id
        email
      }
    }
  }
`;

const apis = {
  getProducts: ({ page }) =>
    graphQlInstance(getProductsQuery({ page }), {
      method: "GET",
    }),

  getProductsWithInventory: ({
    brandIds,
    categoryIds,
    collectionIds,
    inStockOnly,
    isActive,
    pageNumber,
    searchQuery,
    sortBy,
  }) =>
    graphQlInstance(
      getProductsWithInventoryQuery({
        brandIds,
        categoryIds,
        collectionIds,
        inStockOnly,
        isActive,
        pageNumber,
        searchQuery,
        sortBy,
      }),
      {
        method: "GET",
      }
    ),

  createProductWithInventory: ({ brandId, productData }) => {
    // Map options and variants to correct schema format
    const mappedProductData = {
      ...productData,
      options: productData.options ? mapOptionsForCreate(productData.options) : undefined,
      variants: productData.variants ? mapVariantsForCreate(productData.variants) : undefined,
    };

    return graphQlInstance(createProductWithInventoryQuery, {
      method: "POST",
      variables: { brandId, productData: mappedProductData },
    });
  },

  updateProduct: ({ updateData }) =>
    graphQlInstance(updateProductQuery({ updateData }), {
      method: "POST",
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

  sendProductInventoryCsv: ({ email, startDate, endDate, warehouseId }) =>
    graphQlInstance(
      sendProductInventoryCsvQuery({
        email,
        startDate,
        endDate,
        warehouseId,
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

  getOrderProductReviews: ({ orderId }) =>
    graphQlInstance(getOrderProductReviewsQuery({ orderId }), {
      method: "GET",
    }),
};

export default apis;
