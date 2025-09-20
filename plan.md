# Development Plan

## ⚠️ Errors Encountered

✅ **Fixed**: `selectedProduct is not defined` error in collections.js - Updated reference to use `selectedCollection` instead of `selectedProduct` on line 370.

## 📋 Pending Features/Fixes

1. BRAND ADMIN OPERATIONS
(Requires BrandAdminGuard - brand owners/admins only)
Withdrawal Management


graphql
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
Payout & Commission Management


graphql
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

# Request commission rate change
mutation requestCommissionRateChange($input: RequestCommissionRateChangeInput!) {
  requestCommissionRateChange(input: $input) {
    id
    commissionPercentage
    isActive
    notes
  }
}

# Get all payout balances
query getBrandPayoutBalances($brandId: String!) {
  getBrandPayoutBalances(brandId: $brandId) {
    currency
    availableBalance
    pendingBalance
    totalEarnings
    totalWithdrawn
    minimumWithdrawal
    autoWithdrawalEnabled
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
PLATFORM ADMIN OPERATIONS
(Requires AdminGuard - platform administrators only)
Brand Management


graphql
# Get brands awaiting approval
query adminGetBrandsAwaitingApproval($page: Int) {
  adminGetBrandsAwaitingApproval(page: $page) {
    data {
      registrationId
      brandName
      ownerEmail
      ownerName
      submittedAt
      businessInfo { registrationNumber yearsInBusiness }
      addressInfo { city state country }
    }
    total
    hasNextPage
  }
}

# Get brand details for review
query adminGetBrandById($brandId: String!) {
  adminGetBrandById(brandId: $brandId) {
    id
    brandName
    status
    description
    businessRegistrationNumber
    addressLine1
    city
    state
    country
  }
}

# Approve brand registration
mutation adminApproveBrandRegistration($registrationId: String!, $adminUserId: String!) {
  adminApproveBrandRegistration(registrationId: $registrationId, adminUserId: $adminUserId) {
    status
  }
}

# Reject brand registration
mutation adminRejectBrandRegistration($registrationId: String!, $adminUserId: String!, $rejectionReason: String!) {
  adminRejectBrandRegistration(registrationId: $registrationId, adminUserId: $adminUserId, rejectionReason: $rejectionReason) {
    status
  }
}
Withdrawal Management


graphql
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

# Process auto-withdrawals
mutation processAutoWithdrawals {
  processAutoWithdrawals {
    processed
    failed
    details {
      brandId
      currency
      amount
      success
      error
    }
  }
}
Payout & Commission Management


graphql
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

# Get admin dashboard summary
query getAdminPayoutSummary {
  getAdminPayoutSummary {
    adminWallet {
      totalBalance
      totalEarnings
    }
    totalBrandBalances {
      currency
      totalAvailable
      totalEarnings
      brandCount
    }
    recentTransactions {
      id
      transactionType
      amount
      createdAt
      brand { brandName }
    }
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

# Get pending commission rate requests
query getPendingCommissionRateRequests {
  getPendingCommissionRateRequests {
    id
    brandId
    commissionPercentage
    createdAt
    notes
    brand { brandName }
  }
}

# Approve commission rate change
mutation adminApproveCommissionRateChange($input: ApproveCommissionRateChangeInput!) {
  adminApproveCommissionRateChange(input: $input) {
    id
    isActive
    effectiveFrom
    commissionPercentage
  }
}

# Reject commission rate change
mutation adminRejectCommissionRateChange($settingId: String!, $rejectionReason: String!) {
  adminRejectCommissionRateChange(settingId: $settingId, rejectionReason: $rejectionReason) {
    status
  }
}
INPUT TYPES REFERENCE


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

ApproveCommissionRateChangeInput {
  settingId: String!
  effectiveFrom?: Date
}
ENUMS


typescript
enum SupportedCurrency { USD EUR GBP NGN CAD }
enum WithdrawalMethod { BANK_TRANSFER WIRE_TRANSFER ACH SEPA FASTER_PAYMENTS }
enum WithdrawalStatus { PENDING_REVIEW APPROVED PROCESSING COMPLETED REJECTED FAILED CANCELLED }
enum PayoutTransactionType { ORDER_COMMISSION ORDER_PAYOUT ORDER_REFUND_COMMISSION ORDER_REFUND_PAYOUT }
All operations include proper error handling and return appropriate error messages for validation failures, unauthorized access, or business logic violations.

<!-- Pending Tasks end -->

## 🔄 Ongoing Implementation

### Instructions:

1. Add your features/fixes to the "Pending Features/Fixes" section
2. As work begins on an item, it will be moved to "Ongoing Implementation" with 🔄
3. Once completed, items will be removed completely to keep the plan.md file clean
4. If you're unable to complete a task, add it to an incomplete section with appropriate emoji, so I'd provide further context on it.
5. Feel free to ask for context or clarification for any feature as needed
