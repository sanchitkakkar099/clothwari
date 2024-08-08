import React from "react";
import { DOTS, usePagination } from "../../hook/usePagination";
import { Link } from "react-router-dom";

function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  TBLData,
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  })
  if(paginationRange?.length < 2){
    return(
      <div className="pagination">
      <div className="records-info">
        {`Showing ${TBLData?.length} of ${totalCount} records`}
      </div>
      </div>
    )
  }

  const onNext = (e) => {
    e.preventDefault()
    onPageChange(currentPage + 1)
  }

  const onPrevious = (e) => {
    e.preventDefault()
    onPageChange(currentPage - 1)
  }

  const onPageChangeFunc = (e,pageNum) => {
    e.preventDefault()
    onPageChange(pageNum)
  }

  const start  =currentPage * pageSize - (pageSize - 1)
  const end = Math.min(start + pageSize - 1,totalCount)
  const lastPage = paginationRange[paginationRange.length - 1]
  return (
    <div className="pagination">
  <div className="records-info">
  {`Showing ${start} - ${end}  of ${totalCount} records`}
  </div>
  <div className="c-maker_pag">
  <div className="pagination-controls">
    <button className="previous-page-btn" onClick={(e) => onPrevious(e)} disabled={currentPage === 1}>Previous</button>
    <div className="page-numbers">
    {paginationRange && Array.isArray(paginationRange) && paginationRange?.length > 0 && 
      paginationRange?.map((pgn,i) => {
        if(pgn === DOTS){
          return <Link to="" key={i}>...</Link>
        }
        return(
          <Link to="" className={currentPage === pgn ? "active-page" : ''} onClick={(e) => onPageChangeFunc(e,pgn)}>{pgn}</Link>
        )
      })
    }
    </div>
    <button className="next-page-btn" onClick={(e) => onNext(e)} disabled={currentPage === lastPage}>Next</button>
  </div>
  <div className="c-maker_input">
    <div className="form-inline">
      <div className="search-box">
        <div className="position-relative">
          <input
            type="text"
            onChange={(e) => onPageChangeFunc(e,parseInt(e.target.value) || 1)}
            className="form-control "
            placeholder="Go to page"
            
            />
          </div>
        </div>
      </div>
    </div>
    </div>
</div>
  );
}

export default Pagination;
