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
  Area,
  AreaChart,
} from "recharts";
import axios from "axios";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { motion } from "framer-motion";

const AllMessageCountChart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("daily");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

        const formattedData = response.data.map((item) => {
          if (filter === "monthly") {
            return {
              ...item,
              month: new Date(year, item.month - 1).toLocaleString("default", {
                month: "short",
              }),
            };
          }
          return filter === "daily"
            ? { ...item, date: formatDate(item.date) }
            : item;
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching message count data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, year, month]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-800 dark:text-white">{label}</p>
          <p className="text-yellow-500">
            Messages: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Generate years for the year selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Generate months for the month selector
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Message Statistics for All Messages
        </h2>

        <div className="flex flex-wrap gap-3">
          {/* Filter Toggle Buttons */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, newValue) => newValue && setFilter(newValue)}
            aria-label="filter"
            size="small"
            className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
          >
            <ToggleButton
              value="daily"
              aria-label="daily"
              className="dark:text-white"
            >
              Daily
            </ToggleButton>
            <ToggleButton
              value="monthly"
              aria-label="monthly"
              className="dark:text-white"
            >
              Monthly
            </ToggleButton>
            <ToggleButton
              value="yearly"
              aria-label="yearly"
              className="dark:text-white"
            >
              Yearly
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Year Selector */}
          {filter !== "yearly" && (
            <FormControl size="small" className="min-w-[120px]">
              <Select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-white dark:bg-gray-700 dark:text-white"
                MenuProps={{
                  PaperProps: { className: "dark:bg-gray-700 dark:text-white" },
                }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Month Selector */}
          {filter === "daily" && (
            <FormControl size="small" className="min-w-[120px]">
              <Select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-white dark:bg-gray-700 dark:text-white"
                MenuProps={{
                  PaperProps: { className: "dark:bg-gray-700 dark:text-white" },
                }}
              >
                {months.map((m, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No data available
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Try selecting a different time period
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FCD34D" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey={
                  filter === "daily"
                    ? "date"
                    : filter === "monthly"
                    ? "month"
                    : "year"
                }
                stroke="#6B7280"
                tick={{ fill: "#6B7280" }}
              />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#FCD34D"
                fillOpacity={1}
                fill="url(#colorCount)"
                strokeWidth={2}
                activeDot={{ r: 8, fill: "#FCD34D" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default AllMessageCountChart;
