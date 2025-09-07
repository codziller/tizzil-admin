# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Bani Merchant Dashboard Project Outline

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 📋 Pending Features/Fixes

1. In src\pages\OnBoarding\SignUp\features\SignUpOtp.js, when i click Continue after entering otp, nothing happens until I click the secodntime which has something to do with the localaStorage data saved not gotten yet, so save the signupData from src\pages\OnBoarding\SignUp\features\Signup.js in store src\pages\OnBoarding\SignUp\store\index.js too and first try getting from there before falling back to the localStorage data
2. Update src\pages\OnBoarding\AccountSetup\features\AccountSetupOne.js so that a full list of countries, states, and cities are used. Check src\pages\Dashboard\WareHouses\features\CreateProvider.js for the way it's done, and see if you can get list of cities from any of the packages based on the country and state selected. Also, allow user to enter citu as text if they can't find their city in the options of cities
3. Extract ProductCard from src\pages\Dashboard\Products\features\categories.js and put the ProductCard component in src\components\General, then use it in src\pages\Dashboard\Products\features\categories.js and use the same component in src\pages\Dashboard\Products\features\collections.js and src\pages\Dashboard\Products\features\index.js. Also extract FilterModal from each of the three files and create a separate FilterModal file for them and import them in the files, eg ProductFilterModal, CategoryFilterModal, etc.

4. Update src\pages\Dashboard\Products\features\index.js so that list of products is fetched using getProducts, update getProducts and getProductsQuery in src\services\products.js so that it uses the updated query which I'd provide below. Make sure to update ProductCard to use the right fields based on the product schema provided below too.

Query.productsWithInventory(
brandId: String
brandIds: [String!]
categoryIds: [String!]
inStockOnly: Boolean
pageNumber: String!
searchQuery: String
sortBy: ProductSortBy
): ProductResultsSchema!

product_results

type ProductResultsSchema {
results: [ProductSchema!]!
total: Int!
}

num ProductSortBy {
BESTSELLING
DATE_NEW_TO_OLD
DATE_OLD_TO_NEW
PRICE_HIGH_TO_LOW
PRICE_LOW_TO_HIGH
}

type ProductSchema {
averageRating: Float
baseCostPrice: Float!
basePrice: Float!
baseSku: String!
brand: BrandSchema
brandId: ID!
categories: [CategorySchema!]
createdAt: DateTime!
currentStock: Int!
description: String
enablePreOrder: Boolean
exchangeRateSaleCurrency: CURRENCY
howToUse: String
id: ID!
imageUrls: [String!]
inventory: [InventorySchema!]
isActive: Boolean!
isLowStock: Boolean!
isOutOfStock: Boolean!
isPublic: Boolean!
lowInQuantityValue: String
metaDescription: String
metaTitle: String
name: String!
preOrderLimit: Int
preOrderMessage: String
productIngredients: String
productOptions: [ProductOptionSchema!]
productVariants: [ProductVariantSchema!]
ribbon: RIBBON
tags: [String!]
updatedAt: DateTime!
weight: Int
weightType: WEIGHT_TYPE
}

Note that brandId will be the brand id of the logged in user gotten from getUserInfoFromStorage (brand.id) in src\utils\storage.js, inStockOnly should only be passed as true if "In stock" tab is selected. pageNumber is for pagination, use Pagination from src\components\General\Pagination\index.js for that, the sortBy select and categoryIds isMulti select should be added to ProductFilterModal and applied when applied.  Also make sure to add Reset for sortBy and categoryIds and implement the reset logic and well as reset all logic. get list of categories from getCategories in src\pages\Dashboard\Categories\store\index.js. When a product is clicked and the ProductDetailsModal is opened, call getProduct from the store in ProductDetailsModal, show appropriate loader and show the correct informations based on the product schema provided above

5. Update src\pages\Dashboard\Products\features\AddProductModal.js so that it calls createProduct src\pages\Dashboard\Products\store\index.js on submit. use createProductLoading for loading state. Then update createProduct and createProductQuery in src\services\products.js based on the updated info below. When "Media & deets" is the active tab, show 'CREATE VARIANT', and 'CREATE OPTION' is Outline buttons 24px by the left of the primary button in 12px row. When 'CREATE VARIANT' or 'CREATE OPTION' is clicked, open another Modal Body(submodal) by the left which should be 8px from the first one. This means you'd add the functionality for this in src\components\General\Modal\Modal\Modal.js. This sub modal will be exacly like the normal modal but when it is opened, it should smoothly slide left from behind the original one. Its Title section should have right arrow from src\assets\icons\arrow-right.svg instead of CancelIcon which should close(slide back in and hide) the sub modal on click of it.

Now in AddProductModal, the submodal should be opened on clicked of 'CREATE VARIANT' or 'CREATE OPTION' and it should have title of 'VARIANTS' or 'OPTIONS', inside it should be fields to add multiple variants or options. and use the sample payload for create product below to know what the fields for each product variant or product should look like


{
  name: "T-Shirt",
  basePrice: 25.00,
  baseCostPrice: 10.00,
  options: [
    {
      name: "Size",
      type: OptionType.TEXT,
      displayOrder: 1,
      values: [
        { value: "Small", displayOrder: 1 },
        { value: "Medium", displayOrder: 2 },
        { value: "Large", displayOrder: 3 }
      ]
    },
    {
      name: "Color", 
      type: OptionType.COLOR,
      displayOrder: 2,
      values: [
        { value: "Red", colorHex: "#FF0000", displayOrder: 1 },
        { value: "Blue", colorHex: "#0000FF", displayOrder: 2 }
      ]
    }
  ],
  variants: [
    {
      sku: "TSHIRT-SM-RED",
      name: "Small Red",
      initialStock: 10,
      optionValues: [
        { optionName: "Size", optionValue: "Small" },
        { optionName: "Color", optionValue: "Red" }
      ]
    }
  ]
}

So for variants, the have to add name, sku(optional), initialStock(sku and initial stock in a 10px gap row), and optionValues which wil be added by click of a add option value small outline button with plus icon, so by clicking of the button add a row of optionName and optionValue input fields and add more rows as the button is clicked. Then below the variants submodal, add a normal isOutline button to add entire new variant section and keep adding more variant,

For options the name field and type select will be in the same 10px row, and the values will also be added using small outline button with plus like as described in variants above. The colorHex field for when type is COLOR should be gotten using a color selector, see HexColorPicker in src\pages\Dashboard\Products\features\ProductOptions.js for how it is done. Note that the displayOrder fields in the options and values fields are to be gotten by the position of each item, so make sure to add them in a sortable container, see src\components\General\Input\ImageList.js for how it is done. 

Make sure to call getProducts with all the active filters and pageNumber from src\pages\Dashboard\Products\features\index.js in src\pages\Dashboard\Products\store\index.js createProduct after successful product creation. 

After successful product creation, close the AddProductModal and open successToast and put two buttons in a 6px gap row by the right of the successToast just 8px before the close icon 'Edit' isOutline and 'Duplicate Product' primary button. This means you'd update src\components\General\Toast\Toast.js to accept props for this. also update Toast so that success color is #690007 and it that the toast now fills 70% of the screen on tab and desktop, and 80% on mobile. Onclick of the Edit, open the AddProductModal passing the id of and call getProduct to get the details of the product, and  prefill with the data of the product so they can make necessary changes and update the product details using editProduct in products store. See below for details of what to update editProductQuery in src\services\products.js.  If they click 'Duplicate Product'
open a DuplicateProductModal (Create the modal as it does not exist yet) and call getProduct to get the product details, make the title 'Duplicate product', and add a 6px gap column with add input field for 'Product name' with sub label of 'Retain or edit product’s name'(#888888 14px), and prefill the field with the product name. Below show label 'Product status' sub label 'Choose how you’d like the product to appear' and two radio select cards in a 8px gap row below. The RadioCard(border: 1px solid #BBBBBB, p 16px space between) will have name(14px #111827) at the left and radio circle(primary color active bg, border: 1.67px solid #DAE0E6, 16px w/h) by the right. The names will be 'Set as active', 'Set as draft', and only one can be selected. Below put another label 'Product details' sub label 'Select details to copy' multiple RadioCards in a 8px gap 2 per row grid container for them to select which of the fields to copy. The RadioCard names will be 'Description', 'Pricing', 'Media', 'Variants', 'Delevery' . because multiple can be selected, the radio in the RadioCards will have 5px br instead of full. The options selected will determine what to be added to the payload for createProduct in the modal when submited. The buttons below should be 'CANCEL' isOutline, and 'DUPLICATE PRODUCT' primary. 


createProductWithInventory(
brandId: String!
productData: CreateProductSchema!
): ProductSchema!

brandId - id of the logged in user brand

productData: CreateProductSchema!
create_product_with_inventory

type CreateProductSchema {
baseCostPrice: Float!
basePrice: Float!
baseSku: String
categoryIds: [String!]
description: String
exchangeRateSaleCurrency: CURRENCY
howToUse: String
imageUrls: [String!]
initialStock: Int
isPrivate: Boolean
lowInQuantityValue: String
metaDescription: String
metaTitle: String
name: String!
options: [CreateProductOptionSchema!]
productIngredients: String
ribbon: RIBBON
tags: [String!]
variants: [CreateProductVariantSchema!]
weight: Int
weightType: WEIGHT_TYPE
}

updateProduct(
updateData: UpdateProductSchema!
): ProductSchema!


type UpdateProductSchema {
baseCostPrice: Float
basePrice: Float
baseSku: String
categoryIds: [String!]
description: String
enablePreOrder: Boolean
exchangeRateSaleCurrency: CURRENCY
howToUse: String
id: ID!
imageUrls: [String!]
isActive: Boolean
isPublic: Boolean
lowInQuantityValue: String
metaDescription: String
metaTitle: String
name: String
options: [UpdateProductOptionSchema!]
preOrderLimit: Int
preOrderMessage: String
productIngredients: String
ribbon: RIBBON
tags: [String!]
variants: [UpdateProductVariantSchema!]
weight: Int
weightType: WEIGHT_TYPE
}

enum CURRENCY {
EUR
GBP
NGN
USD
}

options: [CreateProductOptionSchema!]
Product options (Size, Color, etc.) - only for products with variants

create_product_option

type CreateProductOptionSchema {
displayOrder: Int!
name: String!
type: OptionType!
values: [CreateProductOptionValueSchema!]!

enum OptionType {
COLOR
IMAGE
MEASUREMENT
TEXT
}

type CreateProductOptionValueSchema {
colorHex: String
displayOrder: Int!
displayValue: String
value: String!
}

enum RIBBON {
BEST_SELLER
LIMITED_EDITION
NEW_IN
SALE
}

type CreateProductVariantSchema {
barcode: String
costPrice: Float
description: String
imageUrls: [String!]
initialStock: Int
isDefault: Boolean
name: String!
optionValues: [VariantOptionValueSchema!]!
salePrice: Float
sku: String
weight: Float
}

type VariantOptionValueSchema {
optionName: String!
optionValue: String!
}

enum WEIGHT_TYPE {
grams
milliliters
}




<!-- New testings -->

1. Update src\pages\OnBoarding\AccountSetup\features\index.js so that on succesul authBrandRegistration, call getMe from src\pages\OnBoarding\SignUp\store\index.js to get the user details, and update the brandUser object in the local storage USER_DATA object already saved from login with the response from 


2. Update src\pages\Dashboard\Products\features\AddCollectionModal.js, src\pages\Dashboard\Products\features\AddProductToCategoryModal.js,  src\pages\Dashboard\Products\features\DuplicateProductModal.js, and src\pages\Dashboard\Products\features\ProductDetailsModal.js ti use the new modal struture, ie. passing the bottom buttons inside footer prop.