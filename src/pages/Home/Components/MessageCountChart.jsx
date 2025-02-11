import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Import the dropdown icon

const MessageCountChart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("daily");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";

        if (filter === "daily") {
          url = `http://localhost:8080/api/v1/send-message/message-count-by-date?year=${year}&month=${month}`;
        } else if (filter === "monthly") {
          url = `http://localhost:8080/api/v1/send-message/message-count-by-month?year=${year}`;
        } else if (filter === "yearly") {
          url = `http://localhost:8080/api/v1/send-message/message-count-by-year`;
        }

        const response = await axios.get(url);
        console.log("Fetched data:", response.data);

        const formattedData = response.data.map((item) => ({
          ...item,
          month:
            filter === "monthly"
              ? new Date(2023, item.month - 1).toLocaleString("default", {
                  month: "short",
                })
              : item.month,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching message count data:", error);
      }
    };

    fetchData();
  }, [filter, year, month]);

  return (
    <div className="text-center p-4 m-4 bg-gray-100 h-max w-1/2 flex flex-col items-center rounded-md dark:bg-dark_2">
      <h2 className="text-3xl font-bold mb-6">Message Count Over Time</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-wrap gap-4 justify-center dark:bg-dark_1 duration-1000 hover:transition-opacity">
        <FormControl className="w-40">
          <InputLabel className="dark:text-white">Filter</InputLabel>
          <Select
            className="dark:bg-dark_1 dark:text-white border dark:border-slate-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            MenuProps={{
              PaperProps: { className: "dark:bg-dark_1 dark:text-white" },
            }}
            IconComponent={(props) => (
              <ArrowDropDownIcon {...props} className="dark:text-white" />
            )}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>

        {filter !== "yearly" && (
          <FormControl className="w-40">
            <InputLabel className="dark:text-white">Year</InputLabel>
            <Select
              className="dark:bg-dark_1 dark:text-white border dark:border-slate-500"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              MenuProps={{
                PaperProps: { className: "dark:bg-dark_1 dark:text-white" },
              }}
              IconComponent={(props) => (
                <ArrowDropDownIcon {...props} className="dark:text-white" /> // Custom arrow color for dark mode
              )}
            >
              {Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() - i
              ).map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {filter === "daily" && (
          <FormControl className="w-40">
            <InputLabel className="dark:text-white">Month</InputLabel>
            <Select
              className="dark:bg-dark_1 dark:text-white border dark:border-slate-500 "
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              MenuProps={{
                PaperProps: { className: "dark:bg-dark_1 dark:text-white" },
              }}
              IconComponent={(props) => (
                <ArrowDropDownIcon {...props} className="dark:text-white" /> // Custom arrow color for dark mode
              )}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>
                  {new Date(2023, m - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <div className="w-full max-w-4xl h-96 bg-white shadow-lg rounded-lg p-2 dark:bg-dark_1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey={
                filter === "daily"
                  ? "date"
                  : filter === "monthly"
                  ? "month"
                  : "year"
              }
              stroke="#4b5563"
            />
            <YAxis stroke="#4b5563" />
            <Tooltip
              contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }}
            />
            <Legend wrapperStyle={{ color: "#374151" }} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#eab308"
              strokeWidth={3}
              activeDot={{ r: 8, fill: "#ce9b03" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MessageCountChart;
