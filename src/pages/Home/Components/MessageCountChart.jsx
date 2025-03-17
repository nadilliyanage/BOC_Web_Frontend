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
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const MessageCountChart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("daily");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

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
      }
    };

    fetchData();
  }, [filter, year, month]);

  return (
    <Paper
      elevation={5}
      className="text-center p-8 m-4 bg-primary_1 h-full flex flex-col rounded-md dark:bg-dark_1 "
    >
      <h2 className="text-3xl font-bold mb-6 dark:text-white">
        Message Count Chart
      </h2>

      <div className="bg-white shadow-md rounded-lg flex flex-wrap gap-4 p-2 ml-auto -mt-10 dark:bg-dark_1">
        <FormControl className="w-[120px]">
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
          <FormControl className="w-[120px]">
            <InputLabel className="dark:text-white">Year</InputLabel>
            <Select
              className="dark:bg-dark_1 dark:text-white border dark:border-slate-500"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              MenuProps={{
                PaperProps: { className: "dark:bg-dark_1 dark:text-white" },
              }}
              IconComponent={(props) => (
                <ArrowDropDownIcon {...props} className="dark:text-white" />
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
          <FormControl className="w-[140px]">
            <InputLabel className="dark:text-white">Month</InputLabel>
            <Select
              className="dark:bg-dark_1 dark:text-white border dark:border-slate-500"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              MenuProps={{
                PaperProps: { className: "dark:bg-dark_1 dark:text-white" },
              }}
              IconComponent={(props) => (
                <ArrowDropDownIcon {...props} className="dark:text-white" />
              )}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>
                  {new Date(year, m - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <div className="max-w-full h-[500px] bg-white shadow-lg rounded-lg p-4 mt-2 dark:bg-dark_1">
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
              stroke={
                document.documentElement.classList.contains("dark")
                  ? "#fff"
                  : "#4b5563"
              }
            />
            <YAxis
              stroke={
                document.documentElement.classList.contains("dark")
                  ? "#fff"
                  : "#4b5563"
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#1f2937"
                  : "#f9fafb",
                color: document.documentElement.classList.contains("dark")
                  ? "#fff"
                  : "#000",
                borderRadius: "8px",
              }}
            />
            <Legend
              wrapperStyle={{
                color: document.documentElement.classList.contains("dark")
                  ? "#fff"
                  : "#374151",
              }}
            />
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
    </Paper>
  );
};

export default MessageCountChart;
