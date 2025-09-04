import styled, { css } from "styled-components";

export const TableWrapper = styled.div`
  height: ${(props) => (props.extendMinHeight ? "100%" : "")};
  width: 100%;
  padding-bottom: 30px;

  .no-padding {
    .rdt_Table {
      padding: 0 !important;
    }
  }
  .hub-section-table {
    .rdt_TableCell,
    .rdt_TableCol,
    .rdt_TableCol_Sortable {
      flex-grow: 3;
    }
    .rdt_TableCell:last-child,
    .rdt_TableCol:last-child,
    .rdt_TableCol_Sortable:last-child {
      flex-grow: 1;
    }
  }
  .overview-section-table,
  .txn-section-table,
  .subtxn-section-table {
    .rdt_TableCell,
    .rdt_TableCol,
    .rdt_TableCol_Sortable {
      flex-grow: 3;
    }
  }

  @media (max-width: 767px) {
    .order-section-table {
      .rdt_TableCell:first-child,
      .rdt_TableCol:first-child,
      .rdt_TableCol_Sortable:first-child {
        flex-grow: 3;
      }

      .rdt_TableCell:last-child,
      .rdt_TableCol:last-child,
      .rdt_TableCol_Sortable:last-child {
        flex-grow: 3;
      }
      .rdt_TableCell > div {
        min-width: 100%;
        height: 100%;
      }
    }
  }
  .customer-overview-table {
    .rdt_TableCell,
    .rdt_TableCol,
    .rdt_TableCol_Sortable {
      flex-grow: 5;
    }
    .rdt_TableCell:last-child,
    .rdt_TableCol:last-child,
    .rdt_TableCol_Sortable:last-child {
      flex-grow: 1;
    }
    .rdt_Table {
      padding: 0 !important;
    }
  }
  .request-overview-table {
    .rdt_Table {
      padding: 0 5px !important;
    }
  }
  .table-container {
    margin-bottom: 24px;
    background: transparent;
    width: 100%;
    .rdt_TableCol,
    .rdt_TableCol_Sortable {
      height: fit-content !important;
    }

    .rdt_TableHeadRow {
      align-items: center;
      background-color: ${(props) =>
        props.header ? "transparent" : "transparent"};
    }
  }

  .rdt_Table {
    padding: 0 ${(props) => (props.noPadding ? "0" : "24px")};

    height: 100%;
  }
  .customer-overview-table {
    .rdt_TableHead {
      display: flex;
    }
  }
  @media (max-width: 639px) {
    .rdt_TableRow {
      padding-top: 5px !important;
      padding-bottom: 5px !important;
    }
    .rdt_TableHead {
      display: none;
    }
    .rdt_TableCell:last-child,
    .rdt_TableCol:last-child,
    .rdt_TableCol_Sortable:last-child {
      flex-grow: 3;
    }
  }
  @media (max-width: 639px) {
    .txn-section-table,
    .hub-section-table {
      .rdt_Table {
        padding: 5px !important;
      }
      .rdt_TableCell,
      .rdt_TableCol,
      .rdt_TableCol_Sortable {
        flex-grow: 1;
      }
    }
  }
  .rdt_TableHeadRow,
  .rdt_TableRow {
    border-bottom: 1px solid #e5e7eb;
  }

  .rdt_TableHeadRow {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    .rdt_TableCol {
      font-family: "AvenirMedium";
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 19px;
      color: #000000;
      height: 72px;
    }
  }

  .rdt_TableRow {
    .rdt_TableCell {
      font-family: "AvenirRegular";
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 19px;
      display: flex;
      align-items: center;
      color: #000000;
      min-height: 55px;
    }
    :hover {
      ${(props) =>
        props.hover &&
        css`
          background: #fcfafa;
        `}
    }
  }
`;

export const PaginationWrapper = styled.div`
  .react-paginate {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0px auto;
    width: fit-content;
    .pagination-page-item,
    .page-item-break {
      margin-right: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      a {
        font-family: "Inter";
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        border-radius: 2px;
        color: #65717c;
        width: fit-content;
        min-width: 33.49px;
        height: 36px;
        background: #fff;
        padding: 0px;
        text-align: center;
        border-radius: 4px;
        border: 1.5px solid #dfe3e8;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .pagination-page-item.active-page {
      a {
        color: #000000;
        border: 1.5px solid #000000;
      }
    }
    .previous,
    .next {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .previous.disabled,
    .next.disabled {
      opacity: 0.2;
    }
  }
`;
