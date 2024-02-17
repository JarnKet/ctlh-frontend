import React from "react";
import { useHistory,useRouteMatch } from "react-router-dom";
import ReactPaginate from "react-paginate";

const PaginationHelper = () => {
  const history = useHistory();
  const match = useRouteMatch();

  const _limit = parseInt(match?.params?.limit);
  const _skip = parseInt(match?.params?.skip);

  const Pagination_helper = (total, rout, filtter) => {
    const handlePageClick = async (event) => {
      let currentPage = event.selected + 1;
      history.push(rout + "/limit/" + _limit + "/skip/" + currentPage, filtter);
    };
    return (
      <ReactPaginate
        previousLabel="ກັບຄືນ"
        onPageChange={handlePageClick}
        breakLabel="..."
        pageRangeDisplayed={5}
        pageCount={Math.ceil(total / _limit)}
        marginPagesDisplayed={3}
        renderOnZeroPageCount={null}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
        forcePage={_skip - 1}
        nextLabel="ຕໍ່ໄປ"
      />
    );
  };
  return {
    _limit,
    _skip,
    Pagination_helper,
  };
};
export default PaginationHelper;
