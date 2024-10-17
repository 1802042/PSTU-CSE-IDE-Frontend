import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { CheckCircle, XCircle } from "lucide-react";

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

const CustomButton2 = ({ onClick, disabled, children, isActive }) => (
  <Button
    variant="contained"
    onClick={onClick}
    disabled={disabled}
    endIcon={<PublishedWithChangesIcon />}
    className={`
    px-3 py-1 mx-1 rounded
    ${
      isActive
        ? "bg-blue-500 text-white"
        : "bg-gray-600 text-gray-200 hover:bg-gray-500"
    }
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
    color="success"
  >
    {children}
  </Button>
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

const DataTable = ({ currentData, toggleShareStatus }) => (
  <div className="flex-grow overflow-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-700">
          <th className="border border-gray-600 p-2 text-center">Date</th>
          <th className="border border-gray-600 p-2 text-center">Record</th>
          <th className="border border-gray-600 p-2 text-center">Language</th>
          <th className="border border-gray-600 p-2 text-center">Share Code</th>
          <th className="border border-gray-600 p-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {currentData.map((row) => (
          <tr
            key={row.id}
            className="border-b border-gray-700 hover:bg-gray-700"
          >
            <td className="border border-gray-600 p-2 text-center">
              {row.date}
            </td>
            <td className="border border-gray-600 p-2 text-center">
              {row.record}
            </td>
            <td className="border border-gray-600 p-2 text-center">
              {row.language}
            </td>
            <td className="border border-gray-600 p-2 text-center">
              <div className="flex justify-center items-center space-x-2">
                {row.shared ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                <button
                  onClick={() => toggleShareStatus(row.id)}
                  className="bg-gray-600 text-gray-200 hover:bg-gray-500 px-2 py-1 rounded"
                >
                  {row.shared ? "Make Private!" : "Make Public!"}
                </button>
              </div>
            </td>
            <td className="border border-gray-600 p-2 text-center">
              <CustomButton2 onClick={() => alert(`Clicked on ${row.record}`)}>
                View
              </CustomButton2>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Record = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const rowsPerPage = 12;
  const [data, setData] = useState([]);

  useEffect(() => {
    const generateData = (page) =>
      Array.from({ length: rowsPerPage }, (_, i) => ({
        id: (page - 1) * rowsPerPage + i + 1,
        date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(
          2,
          "0"
        )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        record: `Record ${(page - 1) * rowsPerPage + i + 1}`,
        language: ["English", "Spanish", "French", "German", "Chinese"][
          Math.floor(Math.random() * 5)
        ],
        shared: Math.random() > 0.5,
      }));

    setData(generateData(currentPage));
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    if (currentPage === startPage + 4) {
      setStartPage((prevStart) => prevStart + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      if (currentPage === startPage) {
        setStartPage((prevStart) => prevStart - 1);
      }
    }
  };

  const toggleShareStatus = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, shared: !item.shared } : item
      )
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-20px-40px)] bg-gray-800 text-gray-200 py-5">
      <Pagination
        currentPage={currentPage}
        startPage={startPage}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        setCurrentPage={setCurrentPage}
      />
      <DataTable currentData={data} toggleShareStatus={toggleShareStatus} />
    </div>
  );
};

export default Record;
