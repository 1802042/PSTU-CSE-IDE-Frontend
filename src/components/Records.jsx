import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { CheckCircle, XCircle } from "lucide-react";
import { isCanceled } from "../api/axios.js";
import { mapLanguage } from "../constants.js";
import { format } from "date-fns";
import { toast, Bounce } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

const SUBMISSION_URL = "/submissions";
const VERDICT_COLORS = {
  "In Queue": "#e5e7eb", // light gray
  Processing: "#3b82f6", // blue
  Accepted: "#4ade80", // green
  "Wrong Answer": "#ef4444", // red
  "Time Limit Exceeded": "#f97316", // orange
  "Compilation Error": "#a855f7", // purple
  "Runtime Error (SIGSEGV)": "#f43f5e", // rose
  "Runtime Error (SIGXFSZ)": "#f43f5e", // rose
  "Runtime Error (SIGFPE)": "#f43f5e", // rose
  "Runtime Error (SIGABRT)": "#f43f5e", // rose
  "Runtime Error (NZEC)": "#f43f5e", // rose
  "Runtime Error (Other)": "#f43f5e", // rose
  "Internal Error": "#facc15", // yellow
  "Exec Format Error": "#f87171", // light red
};

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
          <th className="border border-gray-600 p-2 text-center">
            Creation Date
          </th>
          <th className="border border-gray-600 p-2 text-center">Record</th>
          <th className="border border-gray-600 p-2 text-center">Language</th>
          <th className="border border-gray-600 p-2 text-center">Status</th>
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
              <span style={{ color: VERDICT_COLORS[row.status] || "white" }}>
                {row.status}
              </span>
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
  const [data, setData] = useState([]);
  const rowsPerPage = 12;

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  const fireToast = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getSubmissions = async () => {
      try {
        const response = await axiosPrivate.get(SUBMISSION_URL, {
          withCredentials: true,
          signal: controller.signal,
          params: {
            page: currentPage,
            count: rowsPerPage,
          },
        });

        if (isMounted) {
          const transformedData = response.data?.data.map((item, i) => ({
            id: (currentPage - 1) * rowsPerPage + i + 1,
            date: format(new Date(item.createdAt), "PPpp"),
            record: (currentPage - 1) * rowsPerPage + i + 1,
            language: mapLanguage[item.languageId],
            status: item.status,
            shared: Math.random() > 0.5,
          }));

          setData(transformedData);
        }
      } catch (err) {
        if (isCanceled(err)) {
        } else {
          const status = err.response?.data?.status;
          if (!status) {
            fireToast("Something Went Wrong!");
          } else if (status == "400") {
            fireToast("Wrong Query Params!");
          } else if (status == "500") {
          } else if (status == 401 || status == 403) {
            navigate("/login", {
              state: { from: location },
              replace: true,
            });
          } else if (status == "500") {
            fireToast("Something Went Wrong When Logging! Try Again!");
          } else {
            fireToast("Something Went Wrong!");
          }
        }
      }
    };

    getSubmissions();

    return () => {
      isMounted = false;
      controller.abort();
    };
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
