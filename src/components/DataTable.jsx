import Button from "@mui/material/Button";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { CheckCircle, XCircle } from "lucide-react";
import { VERDICT_COLORS } from "../constants.js";

const CustomButton = ({ onClick, disabled, children, isActive }) => (
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

const DataTable = ({ currentData, toggleShareStatus }) => (
  <div className="flex-grow overflow-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-700">
          <th className="border border-gray-600 p-2 text-center">
            Creation Date
          </th>
          <th className="border border-gray-600 p-2 text-center">User</th>
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
              {row.username}
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
              <CustomButton onClick={() => alert(`Clicked on ${row.record}`)}>
                View
              </CustomButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
