// Pagination.jsx
import "./Pagination.css";

function Pagination({ currentPage, setCurrentPage, pageNumbers, totalPages }) {
  return (
    <div className="pagination">
      <button
        className="prevB"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pageNumbers.map((number) => (
        <button
          className="pageB"
          key={number}
          onClick={() => setCurrentPage(number)}
          disabled={currentPage === number}
        >
          {number}
        </button>
      ))}
      <button
        className="nextB"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
