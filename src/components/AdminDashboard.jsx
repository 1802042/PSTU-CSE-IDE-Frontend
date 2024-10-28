import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, json } from "react-router-dom";
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
  mapUpperCaseLanguageId,
  VERDICT_COLORS,
  VERDICT_COLORS_SHORT,
} from "../constants.js";
import { toast, Bounce } from "react-toastify";
import DataTable from "./DataTable.jsx";
import Pagination from "./Pagination.jsx";
import useAuth from "../hooks/useAuth.js";

const ANALYTICS_URL = "/submissions/analytics";
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

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filter, setFilter] = useState({ language: "", status: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [username, setUsername] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const rowsPerPage = 10;
  const { auth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (auth.user?.role !== "admin") {
      navigate("/not-found", { state: { from: location }, replace: true });
    }
  }, [auth, navigate]);

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

  const fetchData = async () => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      console.log(mapUpperCaseLanguageId[filter.language]);
      const analyticsResponse = await axiosPrivate.get(ANALYTICS_URL, {
        withCredentials: true,
        signal: controller.signal,
        params: {
          username,
          languageId: mapUpperCaseLanguageId[filter.language],
          // statusId: filter.status,
          order: sortOrder == "asc" ? true : false,
          page: currentPage,
          count: rowsPerPage,
        },
      });

      if (isMounted) {
        setAnalytics({
          language: analyticsResponse.data?.data?.language,
          verdict: analyticsResponse.data?.data?.verdict,
        });

        const transformedData = Object.entries(
          analyticsResponse.data?.data?.submissions || {}
        ).map(([key, item], i) => ({
          id: (currentPage - 1) * rowsPerPage + i + 1,
          date: format(new Date(item.createdAt), "PPpp"),
          username: item.username,
          record: (currentPage - 1) * rowsPerPage + i + 1,
          language: mapLanguage[item.languageId],
          status: item.status,
          shared: Math.random() > 0.5,
        }));
        console.log(`data : ${JSON.stringify(transformedData)}`);
        setData(transformedData);
      }
    } catch (err) {
      console.log(`err ! : ${JSON.stringify(err)}`);
      if (!isCanceled(err)) {
        const status = err.response?.data?.status;
        if (!status) {
          fireToast("Something Went Wrong!");
        } else if (status == "404") {
          fireToast("Username not found!");
        } else if (status == 401 || status == 403) {
          navigate("/login", { state: { from: location }, replace: true });
        } else if (status == "500") {
          fireToast("Something Went Wrong When Logging! Try Again!");
        } else {
          fireToast("Something Went Wrong!");
        }
      }
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearch = () => {
    fetchData();
  };

  const handleFilterChange = (filterType, value) => {
    setFilter((prev) => ({ ...prev, [filterType]: value }));
  };

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
    <div className="flex flex-col items-center bg-gray-800 text-gray-200 py-5 overflow-hidden">
      <div className="w-full max-w-7xl flex-1 overflow-auto">
        <div className="mb-8 mt-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </div>
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
        <div className="bg-gray-800 rounded-lg p-4 ">
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
                    handleFilterChange("language", e.target.value)
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
                  onChange={(e) => handleFilterChange("status", e.target.value)}
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
}
