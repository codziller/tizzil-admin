import styled from "styled-components";

export const TransactionType = styled.div`
  display: flex;
  align-items: center;
  .type-badge {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 12px;
    @media (max-width: 639px) {
      margin-right: 6px;
      margin-bottom: 2px;
    }
  }

  .type-badge.credit {
    background: #02ba81;
  }
  .type-badge.debit {
    background: #f3564d;
  }
`;

export const PaymentMethod = styled.div`
  text-transform: capitalize;
  font-size: 13px;
  line-height: 17px;
  padding: 2px 10px;
  border: 0.5px solid #e1e1e1;
  border-radius: 20px;
`;
