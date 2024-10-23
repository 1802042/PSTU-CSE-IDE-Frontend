import { paginationClasses } from "@mui/material";

const CustomButton = ({ onClick, disabled, children, isActive }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
        px-3 py-1 mx-1 rounded
        ${
          isActive
            ? "bg-blue-500 text-white"
            : "bg-gray-600 text-gray-200 hover:bg-gray-500"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
  >
    {children}
  </button>
);

const Pagination = ({
  currentPage,
  startPage,
  handlePrevPage,
  handleNextPage,
  setCurrentPage,
}) => {
  const pageNumbers = () => Array.from({ length: 5 }, (_, i) => startPage + i);

  return (
    <div className="flex justify-center items-center mb-4 bg-gray-700 py-2">
      <CustomButton onClick={handlePrevPage} disabled={currentPage === 1}>
        ←
      </CustomButton>
      {pageNumbers().map((page) => (
        <CustomButton
          key={page}
          onClick={() => setCurrentPage(page)}
          isActive={page === currentPage}
        >
          {page}
        </CustomButton>
      ))}
      <CustomButton onClick={handleNextPage}>→</CustomButton>
    </div>
  );
};

export default Pagination;
