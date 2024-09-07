import styled from "styled-components";

export const PaginationWrapper = styled.div`
  .react-paginate {
    display: flex;

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
        width: 33.49px;
        height: 42px;
        background: #fff;
        padding: 10px;
        text-align: center;
      }
    }

    .pagination-page-item.active-page {
      a {
        color: #000000;
      }
    }
  }
`;
