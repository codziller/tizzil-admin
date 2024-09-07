import styled from "styled-components";

export const SelectSearchWrapper = styled.div`
  width: 100%;

  .dropdown-arrow {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

  .search-wrapper {
    width: 100%;
    position: relative;
  }

  label {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #65717c;
    margin-bottom: 12px;
    display: block;
  }

  .select-search {
    height: 100%;
    width: 100%;
    border: 0.5px solid #e1e1e1;
    border-radius: 8px;
    height: 44px;
  }

  .select-search.has-focus {
    border: 0.5px solid #5444f2;
  }

  .select-search__value,
  input {
    height: 100%;
    width: 100%;
    border-radius: 8px;
  }

  input {
    padding: 0 16px;
    outline: none;
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    color: #000000;
    outline-width: 0.5px;
    cursor: pointer;

    ::placeholder {
      color: #c1c1c1;
      font-weight: 400;
      font-size: 16px;
      line-height: 18px;
    }
  }

  .select-search__select {
    background: #fff;
    border: 0.5px solid #e1e1e1;
    border-radius: 8px;
    z-index: 1;
    position: relative;
    margin-top: 9px;
    width: 100%;
    min-height: 44px;
    display: flex;
    overflow-y: auto;
    max-height: 200px;

    .select-search__options {
      width: 100%;
    }

    .select-search__row {
      height: 39px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      font-weight: 400;
      font-size: 16px;
      line-height: 18px;
      color: #000;
      cursor: pointer;
      width: 100%;

      button {
        width: 100%;
        text-align: left;
        height: 100%;
      }

      :hover {
        background: #f5f6fa;
      }
    }

    .empty-message {
      padding: 10px 16px 0 16px;
    }
  }
`;
