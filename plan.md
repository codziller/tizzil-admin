# Development Plan

## ⚠️ Errors Encountered

✅ **Fixed**: `selectedProduct is not defined` error in collections.js - Updated reference to use `selectedCollection` instead of `selectedProduct` on line 370.

## 📋 Pending Features/Fixes

<!-- Pending Tasks start -->

1. Getting the error below when I try to create a product at src\pages\Dashboard\Products\features\AddProductModal.js. Please carefully investigate, ask me for additional info if needed, and then fix it. You may have to check the createProductWithInventoryQuery in src\services\products.js

{
"errors": [
{
"message": "Unknown type \"CreateProductWithInventoryInput\". Did you mean \"GetProductInventoryInput\" or \"AddProductsToCategoryInput\"?",
"locations": [
{
"line": 4,
"column": 19
}
],
"extensions": {
"code": "GRAPHQL_VALIDATION_FAILED",
"exception": {
"stacktrace": [
"GraphQLError: Unknown type \"CreateProductWithInventoryInput\". Did you mean \"GetProductInventoryInput\" or \"AddProductsToCategoryInput\"?",
" at Object.NamedType (/app/node_modules/graphql/validation/rules/KnownTypeNamesRule.js:65:11)",
" at Object.enter (/app/node_modules/graphql/language/visitor.js:298:32)",
" at Object.enter (/app/node_modules/graphql/utilities/TypeInfo.js:391:27)",
" at visit (/app/node_modules/graphql/language/visitor.js:194:21)",
" at validate (/app/node_modules/graphql/validation/validate.js:91:24)",
" at validate (/app/node_modules/apollo-server-core/src/requestPipeline.ts:477:27)",
" at processGraphQLRequest (/app/node_modules/apollo-server-core/src/requestPipeline.ts:267:32)",
" at processTicksAndRejections (node:internal/process/task_queues:95:5)",
" at processHTTPRequest (/app/node_modules/apollo-server-core/src/runHttpQuery.ts:437:24)"
]
}
}
}
]
}

<!-- Pending Tasks end -->

## 🔄 Ongoing Implementation

### Instructions:

1. Add your features/fixes to the "Pending Features/Fixes" section
2. As work begins on an item, it will be moved to "Ongoing Implementation" with 🔄
3. Once completed, items will be removed completely to keep the plan.md file clean
4. If you're unable to complete a task, add it to an incomplete section with appropriate emoji, so I'd provide further context on it.
5. Feel free to ask for context or clarification for any feature as needed
