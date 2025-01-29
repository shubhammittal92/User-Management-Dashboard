import React from "react";

const Pagination = ({ currentPage, setCurrentPage, filteredUsers, USERS_PER_PAGE, loading }) => {
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={loading} className="page-btn">
          Previous
        </button>
      )}

      <span className="page-number">{currentPage}</span>

      {filteredUsers.length > currentPage * USERS_PER_PAGE && (
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={loading} className="page-btn">
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;