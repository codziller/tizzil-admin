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

- **Note: this is a one-way operation. Once you `eject`, you can't go back!**

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

<!-- Done updates -->

<!-- New updates -->

1. Update src\services\donations.js so that the queries and mutations provided below are implemented in it and then integrate them in the WalletStore src\pages\Dashboard\Wallet\store\index.js. See src\pages\Dashboard\Users\store\index.js for how the apis from services are integrated in the store. .
   Update src\pages\Dashboard\Wallet\features\index.js so that on mount of the page, getBrandWithdrawalHistory, getWithdrawalSummary, getBrandCommissionSettings, getBrandCommissionHistory, getBrandPayoutHistory, and getBrandBankAccounts are called from WalletStore. if brandBankAccounts is empty, show a notifier(use the style used for Order Notification in src\pages\Dashboard\Products\features\ProductDetailsModal.js) below the Wallet Cards Grid container, and the text should convey that they have not created a bank account and they should do so in order to process payment(use a more concise and clear message), on click of the notifier, open AddBankAccountModal(not yet created, so create it). Use src\pages\Dashboard\Products\features\AddProductModal.js as guide on how to arrange AddBankAccountModal, categorize the fields in CreateBrandBankAccountInput into three tabs just the way it is done in AddProductModal(use your discretion) and then show the Tabs Details based on the active tab just like is done in AddProductModal. Use src\components\General\Checkbox.js for Boolean fields. On submit, call createBrandBankAccount from WalletStore to create the account number. In src\pages\Dashboard\Wallet\features\index.js, if there are brandBankAccounts, or withdrawalSummary?.minimumWithdrawal, add a section like 'Pie Chart and Additional Cards Section' in src\components\Dashboard\AdminDashboard\AdminDashboard.js and put TopItemsCard(src\components\General\TopItemsCard\index.js) for 'Bank Account'(brandBankAccounts) first, followed by a RateCard(src\components\Dashboard\RateCard\RateCard.js) for 'minimum withdrawal'.

   Update src\components\General\RequestPayoutModal\index.js so that it uses the latest Modal structure i.e footer, title, etc., See src\pages\Dashboard\Products\features\AddCollectionModal.js for how its done. Update The fields in RequestPayoutModal to match whats in CreateWithdrawalRequestInput, withdrawalMethod select should be the first field as it will determine whether some fields should be shown. On submit, call createWithdrawalRequest from WalletStore.

# Create withdrawal request

mutation createWithdrawalRequest($input: CreateWithdrawalRequestInput!) {
createWithdrawalRequest(input: $input) {
id
amount
currency
status
processingFee
netAmount
bankAccount { bankName maskedAccountNumber }
}
}

# Cancel pending withdrawal

mutation cancelWithdrawalRequest($withdrawalId: String!) {
cancelWithdrawalRequest(withdrawalId: $withdrawalId) {
status
}
}

# Get withdrawal history

query getBrandWithdrawalHistory($brandId: String!, $currency: SupportedCurrency, $page: Int, $limit: Int) {
getBrandWithdrawalHistory(brandId: $brandId, currency: $currency, page: $page, limit: $limit) {
withdrawals {
id
amount
status
createdAt
completedAt
bankAccount { bankName }
}
total
}
}

# Get withdrawal summary

query getWithdrawalSummary($brandId: String!, $currency: SupportedCurrency!) {
getWithdrawalSummary(brandId: $brandId, currency: $currency) {
availableBalance
minimumWithdrawal
pendingWithdrawals { count totalAmount }
completedWithdrawals { count totalAmount lastWithdrawal }
verifiedBankAccounts { id bankName maskedAccountNumber }
}
}

# Get current commission settings

query getBrandCommissionSettings($brandId: String!) {
getBrandCommissionSettings(brandId: $brandId) {
id
commissionPercentage
isActive
effectiveFrom
notes
}
}

# Get commission history

query getBrandCommissionHistory($brandId: String!, $page: Int, $limit: Int) {
getBrandCommissionHistory(brandId: $brandId, page: $page, limit: $limit) {
settings {
id
commissionPercentage
isActive
effectiveFrom
effectiveTo
notes
}
total
}
}

# Get payout transaction history

query getBrandPayoutHistory($brandId: String!, $page: Int, $limit: Int) {
getBrandPayoutHistory(brandId: $brandId, page: $page, limit: $limit) {
transactions {
id
transactionType
amount
description
createdAt
order { orderCode }
}
total
currentBalance
}
}

# Get pending withdrawals for admin review

query adminGetPendingWithdrawals($page: Int, $limit: Int) {
adminGetPendingWithdrawals(page: $page, limit: $limit) {
withdrawals {
id
amount
currency
status
createdAt
brand { brandName }
bankAccount { bankName maskedAccountNumber }
requestedByUser { firstName lastName email }
}
total
totalAmount
}
}

# Process withdrawal request

mutation processWithdrawalRequest($input: ProcessWithdrawalInput!) {
processWithdrawalRequest(input: $input) {
id
status
approvedAt
processedAt
completedAt
adminNotes
}
}

# Get admin wallet balance

query getAdminPayoutWallet {
getAdminPayoutWallet {
totalBalance
totalEarnings
totalWithdrawn
currency
lastWithdrawalDate
}
}

# Get admin transaction history

query getAdminPayoutHistory($page: Int, $limit: Int) {
getAdminPayoutHistory(page: $page, limit: $limit) {
transactions {
id
transactionType
amount
description
createdAt
brand { brandName }
order { orderCode }
}
total
currentBalance
}
}

# Update brand commission rate directly

mutation adminUpdateBrandCommissionRate($input: UpdateBrandCommissionRateInput!) {
adminUpdateBrandCommissionRate(input: $input) {
id
commissionPercentage
isActive
effectiveFrom
notes
}
}

Mutation.createBrandBankAccount(
input: CreateBrandBankAccountInput!
): BrandBankAccountSchema!

getBrandBankAccounts(
brandId: String!
currency: String
): BrandBankAccountsSchema!

Mutation.updateBrandBankAccount(
input: UpdateBrandBankAccountInput!
): BrandBankAccountSchema!

deleteBrandBankAccount(
accountId: String!
): BoolSuccessResponseType!

typescript
// Withdrawal inputs
CreateWithdrawalRequestInput {
brandId: String!
currency: SupportedCurrency!
amount: String!
withdrawalMethod: WithdrawalMethod!
bankAccountId: String!
requestNotes?: String
}

ProcessWithdrawalInput {
withdrawalId: String!
action: String! // "approve" | "reject" | "complete" | "fail"
notes?: String
paymentReference?: String
transactionId?: String
failureReason?: String
}

// Commission inputs
RequestCommissionRateChangeInput {
brandId: String!
requestedPercentage: Float!
justification?: String
}

UpdateBrandCommissionRateInput {
brandId: String!
newPercentage: Float!
effectiveFrom?: Date
notes?: String
}

type CreateBrandBankAccountInput {
accountHolderEmail: String
accountHolderName: String!
accountNumber: String
accountType: BankAccountType!
bankAddress: String
bankCity: String
bankCountry: String!
bankName: String!
bankPostalCode: String
bic: String
brandId: String!
bsb: String
currency: SupportedCurrency!
iban: String
institutionNumber: String
isDefault: Boolean!
routingNumber: String
sortCode: String
transitNumber: String
verificationDocumentUrls: [String!]
}

type UpdateBrandBankAccountInput {
accountHolderEmail: String
accountId: String!
bankAddress: String
bankCity: String
bankPostalCode: String
isDefault: Boolean
verificationDocumentUrls: [String!]
}

type BrandBankAccountsSchema {
accounts: [BrandBankAccountSchema!]!
total: Int!
}

type BrandBankAccountSchema {
accountHolderEmail: String
accountHolderName: String!
accountType: BankAccountType!
bankAddress: String
bankCity: String
bankCountry: String!
bankName: String!
bankPostalCode: String
bic: String
brandId: String!
bsb: String
createdAt: DateTime!
currency: SupportedCurrency!
id: ID!
institutionNumber: String
isDefault: Boolean!
lastUsed: DateTime
maskedAccountNumber: String
maskedIban: String
notes: String
rejectionReason: String
routingNumber: String
sortCode: String
status: BankAccountStatus!
transitNumber: String
updatedAt: DateTime!
verifiedAt: DateTime
verifiedBy: String
}

type BoolSuccessResponseType {
status: Boolean!
}

ENUMS

enum BankAccountStatus {
PENDING_VERIFICATION
REJECTED
SUSPENDED
VERIFIED
}

enum BankAccountType {
BUSINESS
CHECKING
SAVINGS
}
enum SupportedCurrency { USD EUR GBP NGN CAD }
enum WithdrawalMethod { BANK_TRANSFER WIRE_TRANSFER ACH SEPA FASTER_PAYMENTS }
enum WithdrawalStatus { PENDING_REVIEW APPROVED PROCESSING COMPLETED REJECTED FAILED CANCELLED }
enum PayoutTransactionType { ORDER_COMMISSION ORDER_PAYOUT ORDER_REFUND_COMMISSION ORDER_REFUND_PAYOUT }

<!-- Pending tasks -->

1. Update src\components\Dashboard\BrandDashboard\BrandDashboard.js, src\components\Dashboard\AdminDashboard\AdminDashboard.js, src\components\General\ProductCard\index.js,
   so that numbers are formatted correctly (i.e thousand, mil, etc), and USD is used instead of Niara or naira sign and amounts, prices, etc are prefixed with USD.
2. 

<!-- To be done -->



1. Update The app so that after signup, when the user is routed to /auth/account-setup, the user should not be able to assess any of the dashboard pages(You can see the dashboard pages at src\routes\index.js) until the complete the brand registration at src\pages\OnBoarding\AccountSetup\features\index.jssrc\pages\OnBoarding\AccountSetup\features\AccountSetupFive.js. This means that even if they refresh the page, so far the brand setup has not been done, they should not be routed to the default logged in user route /dashboard/home as setup in src\components\ProtectedRoute\index.js
2. Update src\pages\OnBoarding\AccountSetup\features\AccountSetupOne.js so that the Address input works for google places search(see REACT_APP_PUBLIC_GOOGLE_MAP_API_KEY in .env) and the list of google places predictions are displayed below the input for the user to select address. The aim is to get the lat and lng of the address(validate for lat and lng) and pass it to the formData to be added to the payload for authBrandRegistration in src\pages\OnBoarding\AccountSetup\features\index.js. After an address is selected from the list of google predictions based on the serach, prefill the country, state, and city based on the address selected, if they are available, if you can't prefill any of the fields i.e country, state, or city, based on the address selected, you can leave it empty for the user to select. Also, I noticed that the list of city is not being shown after selecting country and then state, look into this and fix it so that the list of cities for the selected state shows. Also, if another country is selected after selcting state, reset the state, city selected, do same for when another state is selected after selcting city, reset the city. 
Update logo selection in src\pages\OnBoarding\AccountSetup\features\AccountSetupThree.js so that user can select the part of the image selected to show in the 1:1 logo and also so that the logo is always the same size while being a square and allowing user to choose which part of the image to use for logo if the dimension of the image selected for the logo is more that the specified dimension (96px x 96px). This should also be done for the banner image upload but banner image aspect ration should be 16:9.  
 Validate for all fields in src\pages\OnBoarding\AccountSetup\features\index.js so that user cannot submit until all fields have been filled. 