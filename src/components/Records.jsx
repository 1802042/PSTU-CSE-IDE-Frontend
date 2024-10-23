import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isCanceled } from "../api/axios.js";
import { mapLanguage } from "../constants.js";
import { format } from "date-fns";
import { toast, Bounce } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

import DataTable from "./DataTable.jsx";
import Pagination from "./Pagination.jsx";

const SUBMISSION_URL = "/submissions";

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

        console.log(JSON.stringify(response.data.data));

        if (isMounted) {
          const transformedData = response.data?.data.map((item, i) => ({
            id: (currentPage - 1) * rowsPerPage + i + 1,
            date: format(new Date(item.createdAt), "PPpp"),
            username: item.username,
            record: (currentPage - 1) * rowsPerPage + i + 1,
            language: mapLanguage[item.languageId],
            status: item.status,
            shared: Math.random() > 0.5,
          }));
          console.log(JSON.stringify(transformedData));
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

  useEffect(() => {
    console.log(JSON.stringify(data));
  }, data);

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
