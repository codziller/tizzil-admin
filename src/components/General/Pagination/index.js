import React from "react";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";

import { ReactComponent as Chevron } from "assets/icons/chevron-right.svg";
import { PaginationWrapper } from "./pagination.style";

const Pagination = ({ pageCount, onPageChange, currentPage }) => {
  return (
    <div className="w-full">
      {pageCount && pageCount > 1 ? (
        <PaginationWrapper>
          <ReactPaginate
            className="react-paginate"
            pageClassName="pagination-page-item"
            activeClassName="active-page"
            breakLabel="..."
            nextLabel={<Chevron />}
            onPageChange={(page) => onPageChange(page.selected + 1)} // Library uses zero index for page number
            pageRangeDisplayed={7}
            marginPagesDisplayed={3}
            pageCount={pageCount}
            previousLabel={<Chevron className="rotate-180" />}
            forcePage={currentPage - 1} // Library uses zero index for page number
            breakClassName="page-item-break"
            renderOnZeroPageCount={null}
          />
        </PaginationWrapper>
      ) : null}
    </div>
  );
};

Pagination.propTypes = {
  pageCount: PropTypes.number,
  onPageChange: PropTypes.func,
  currentPage: PropTypes.number,
};

export default Pagination;
