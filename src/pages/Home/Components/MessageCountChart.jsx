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

const MessageCountChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/send-message/message-count-by-date"
        );
        console.log("Fetched data:", response.data); // Log the data

        // Transform data if necessary
        const formattedData = response.data.map((item) => ({
          date: item.date, // Ensure this matches the API response
          count: item.count, // Ensure this matches the API response
        }));

        console.log("Formatted data:", formattedData); // Log the formatted data
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching message count data:", error);
      }
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <div>Message send </div>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MessageCountChart;
