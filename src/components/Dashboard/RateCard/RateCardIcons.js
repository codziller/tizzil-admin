import React from 'react';

export const SaleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M16.25 7.5L12.5 3.75L8.75 7.5M12.5 4.375V15.625M3.75 11.25L7.5 15L11.25 11.25" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const CustomerIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M13.75 5.625C13.75 7.73896 12.114 9.375 10 9.375C7.88604 9.375 6.25 7.73896 6.25 5.625C6.25 3.51104 7.88604 1.875 10 1.875C12.114 1.875 13.75 3.51104 13.75 5.625ZM3.75 17.5C3.75 13.5817 6.58172 10.625 10 10.625C13.4183 10.625 16.25 13.5817 16.25 17.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
  </svg>
);

export const OrderIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3.75 5H16.25L15 13.75H5L3.75 5ZM3.75 5L3.125 2.5M7.5 8.75V11.25M12.5 8.75V11.25M5 16.875H5.625M14.375 16.875H15" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const WalletRateIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3.125 6.25H16.875C17.2202 6.25 17.5 6.52982 17.5 6.875V15C17.5 15.6904 16.9404 16.25 16.25 16.25H3.75C3.05964 16.25 2.5 15.6904 2.5 15V5C2.5 4.30964 3.05964 3.75 3.75 3.75H15" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M15 11.25C15.6904 11.25 16.25 10.6904 16.25 10C16.25 9.30964 15.6904 8.75 15 8.75C14.3096 8.75 13.75 9.30964 13.75 10C13.75 10.6904 14.3096 11.25 15 11.25Z" 
      fill="currentColor"
    />
  </svg>
);

export const CartRateIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3.75 3.75H4.6875L6.875 12.5H15.625M6.875 12.5L5.3125 5.625H2.5M6.875 12.5L5.625 15H15.625M15.625 12.5L13.75 5.625H7.8125M8.125 17.5C8.46518 17.5 8.75 17.2152 8.75 16.875C8.75 16.5348 8.46518 16.25 8.125 16.25C7.78482 16.25 7.5 16.5348 7.5 16.875C7.5 17.2152 7.78482 17.5 8.125 17.5ZM15 17.5C15.3402 17.5 15.625 17.2152 15.625 16.875C15.625 16.5348 15.3402 16.25 15 16.25C14.6598 16.25 14.375 16.5348 14.375 16.875C14.375 17.2152 14.6598 17.5 15 17.5Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);