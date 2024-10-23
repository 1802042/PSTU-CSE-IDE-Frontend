import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { isCanceled } from "../api/axios.js";
import {
  mapLanguage,
  mapIdToLanguage,
  mapIdToVerdict,
  VERDICT_COLORS,
  VERDICT_COLORS_SHORT,
} from "../constants.js";
import { toast, Bounce } from "react-toastify";
import DataTable from "./DataTable.jsx";
import Pagination from "./Pagination.jsx";

const SUBMISSION_URL = "/submissions";
const ANALYTICS_URL = "/submissions/analytics";
const ANALYTICS_SUBMISSION_URL = "/submissions/analytics-submission";

const LANGUAGES = ["C", "C++", "Java", "JavaScript", "Python"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-800 text-white rounded">
        <p className="font-semibold">{payload[0].name}</p>
        <p>Count: {payload[0].value}</p>
        <p>
          Percentage:{" "}
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filter, setFilter] = useState({ language: "", status: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const rowsPerPage = 10;

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
    console.log(analytics);
  }, [analytics]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getAnalytics = async () => {
      try {
        const response = await axiosPrivate.get(ANALYTICS_URL, {
          withCredentials: true,
          signal: controller.signal,
        });

        if (isMounted) {
          setAnalytics(response.data.data);
        }
      } catch (err) {
        if (isCanceled(err)) {
        } else {
          const status = err.response?.data?.status;
          if (!status) {
            fireToast("Something Went Wrong!");
          } else if (status == "404") {
            fireToast("username not found!");
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

    getAnalytics();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getSubmissions = async () => {
      try {
        const response = await axiosPrivate.get(ANALYTICS_SUBMISSION_URL, {
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
            username: item.username,
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

  const filteredData = data.filter(
    (item) =>
      (filter.language === "" || item.language === filter.language) &&
      (filter.status === "" || item.status === filter.status) &&
      (search === "" ||
        item.id.toString().includes(search) ||
        item.username.toString().includes(search) ||
        item.language.toLowerCase().includes(search.toLowerCase()) ||
        item.status.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleShareStatus = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, shared: !item.shared } : item
      )
    );
  };

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

  // Transform analytics data for charts
  const languageData = Object.entries(analytics.language || {}).map(
    ([id, count]) => ({
      name: mapIdToLanguage[id],
      value: count,
      total: Object.values(analytics.language || {}).reduce(
        (acc, val) => acc + val,
        0
      ),
    })
  );

  const verdictData = Object.entries(analytics.verdict || {}).map(
    ([id, count]) => ({
      name: mapIdToVerdict[id],
      value: count,
      total: Object.values(analytics.verdict || {}).reduce(
        (acc, val) => acc + val,
        0
      ),
    })
  );

  return (
    <div className="flex flex-col items-center bg-gray-800 text-gray-200 py-5">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Language Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(2)}%`
                    }
                    animationDuration={500}
                  >
                    {languageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(VERDICT_COLORS)[
                            index % Object.keys(VERDICT_COLORS).length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Submission Verdicts
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={verdictData}>
                  <XAxis dataKey="name" tick={{ fill: "#FFFFFF" }} />
                  <YAxis tick={{ fill: "#FFFFFF" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" fill="#1F2937">
                    {verdictData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={VERDICT_COLORS_SHORT[entry.name] || "#1F2937"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
          <div className="flex justify-between mb-4">
            <div className="flex gap-4">
              <div className="min-w-[200px]">
                <label
                  htmlFor="language-filter"
                  className="block text-sm font-medium text-gray-300"
                >
                  Language
                </label>
                <select
                  id="language-filter"
                  value={filter.language}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Languages</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[200px]">
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-300"
                >
                  Status
                </label>
                <select
                  id="status-filter"
                  value={filter.status}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  {Object.keys(VERDICT_COLORS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="min-w-[200px]">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-300"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search..."
              />
            </div>
          </div>
          <div>
            <Pagination
              currentPage={currentPage}
              startPage={startPage}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              setCurrentPage={setCurrentPage}
            />
            <DataTable
              currentData={filteredData}
              toggleShareStatus={toggleShareStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
