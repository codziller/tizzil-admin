import styled from "styled-components";

export const TransactionDetailsWrapper = styled.div`
  max-width: 528px;
  margin: 24px auto 0 auto;
  background: #fff;
  border: 0.5px solid #e1e1e1;
  border-radius: 8px;
  @media (min-width: 567px) {
    min-width: 550px;
  }
  @media (max-width: 566px) {
    max-width: 100%;
  }
  .trx-type {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    background: #02ba81;
    border-radius: 8px 9px 0px 0px;

    h6 {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: #f5f6fa;
    }
  }

  .trx-type.debit {
    background: #02ba81;
    background: #f3564d;
  }

  .transaction-main-content {
    padding: 0 24px 25px 24px;

    .trx-amount-container {
      margin-top: 24px;
      border-bottom: 0.5px solid #e1e1e1;
      margin-bottom: 32px;

      .amount-text {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 17px;
        color: #65717c;
      }

      .amount {
        font-size: 20px;
        line-height: 24px;
        color: #000000;
        margin-bottom: 22px;
      }
    }

    .highlight-text {
      color: #5444f2;
      border-bottom: 1px solid #5444f2;
    }
  }
`;
