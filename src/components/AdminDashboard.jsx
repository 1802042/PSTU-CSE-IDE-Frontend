import React, { useState, useEffect } from "react";
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
import DataTable from "./Records.jsx"; // Import DataTable from Records.jsx

const VERDICT_COLORS = {
  "In Queue": "#64748b",
  Processing: "#3b82f6",
  Accepted: "#22c55e",
  "Wrong Answer": "#ef4444",
  "Time Limit Exceeded": "#f97316",
  "Compilation Error": "#a855f7",
  "Runtime Error": "#f43f5e",
  "Internal Error": "#facc15",
  "Exec Format Error": "#f87171",
};

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
  const [analytics, setAnalytics] = useState({
    languageStats: [],
    verdictStats: [],
  });
  const [filter, setFilter] = useState({ language: "", status: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Simulating API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: Array.from({ length: 100 }, (_, i) => ({
              id: i + 1,
              createdAt: new Date(
                Date.now() - Math.floor(Math.random() * 10000000000)
              ),
              language: LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)],
              status:
                Object.keys(VERDICT_COLORS)[
                  Math.floor(Math.random() * Object.keys(VERDICT_COLORS).length)
                ],
              shared: Math.random() > 0.5,
            })),
          });
        }, 500);
      });

      const transformedData = response.data.map((item) => ({
        ...item,
        date: format(new Date(item.createdAt), "PPpp"),
      }));

      setData(transformedData);
      updateAnalytics(transformedData);
    };

    fetchData();
  }, []);

  const updateAnalytics = (data) => {
    const languageCounts = {};
    const verdictCounts = {};
    let total = 0;

    data.forEach((item) => {
      languageCounts[item.language] = (languageCounts[item.language] || 0) + 1;
      verdictCounts[item.status] = (verdictCounts[item.status] || 0) + 1;
      total++;
    });

    setAnalytics({
      languageStats: Object.entries(languageCounts).map(([name, value]) => ({
        name,
        value,
        total,
      })),
      verdictStats: Object.entries(verdictCounts).map(([name, value]) => ({
        name,
        value,
        total,
      })),
    });
  };

  const filteredData = data.filter(
    (item) =>
      (filter.language === "" || item.language === filter.language) &&
      (filter.status === "" || item.status === filter.status) &&
      (search === "" ||
        item.id.toString().includes(search) ||
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

  return (
    <div className="flex flex-col items-center h-screen overflow-y-auto bg-gray-900 text-white p-4">
      <div className="w-full px-10">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Language Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.languageStats}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    animationDuration={500}
                  >
                    {analytics.languageStats.map((entry, index) => (
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
            <h2 className="text-2xl font-bold mb-4">Submission Verdicts</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.verdictStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8">
                    {analytics.verdictStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={VERDICT_COLORS[entry.name] || "#8884d8"}
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
