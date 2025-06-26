import React from "react";
import ReactPaginate from "react-paginate";

const ExamPagination = ({ pageCount, onPageChange }) => {
  return (
    <ReactPaginate
      previousLabel={"قبلی"}
      nextLabel={"بعدی"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={onPageChange}
      containerClassName={"pagination"}
      pageClassName={"pagination__page"}
      pageLinkClassName={"pagination__link"}
      previousClassName={"pagination__previous"}
      previousLinkClassName={"pagination__link"}
      nextClassName={"pagination__next"}
      nextLinkClassName={"pagination__link"}
      breakClassName={"pagination__break"}
      breakLinkClassName={"pagination__link"}
      activeClassName={"pagination__active"}
    />
  );
};

export default ExamPagination;
