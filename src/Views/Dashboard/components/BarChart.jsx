import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./styles.css";
import CustomTable from "../../../../src/components/CustomTable/CustomTable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardBarChart = ({ all_data }) => {

  // ✅ Loader condition
  if (!all_data || !all_data?.table) {
    return (
      <div className="dashboard-container flex justify-center items-center h-[300px] text-white">
        Loading...
      </div>
    );
  }

  // ✅ Chart Data (you can later make this dynamic)
  const barData = {
    labels: ["Feb", "March", "April", "May", "June", "July", "Aug", "Sept"],
    datasets: [
      {
        label: "Monthly",
        data: [70, 35, 50, 65, 20, 45, 30, 50],
        backgroundColor: "#c168cf",
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
    ],
  };

  // ✅ Chart Options
  const barOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          boxWidth: 15,
          boxHeight: 15,
          font: {
            family: "Montserrat, sans-serif",
            size: 12,
            weight: "500",
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF",
          font: {
            family: "Montserrat, sans-serif",
            size: 15,
            weight: "400",
          },
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
          stepSize: 25,
          max: 100,
          min: 0,
          font: {
            family: "Montserrat, sans-serif",
            size: 14,
            weight: "500",
          },
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
    maintainAspectRatio: false,
    categoryPercentage: 0.8,
    barPercentage: 0.9,
  };

  // ✅ Table Columns
  const columns = [
    { key: "monthly", label: "Monthly" },
    { key: "quarterly", label: "Quarterly" },
    { key: "annual", label: "Annual" },
    { key: "monthlyrevs", label: "Monthly Revs" },
    { key: "momrevs", label: "MoM Revs" },
    { key: "growth", label: "Growth %" },
  ];

  return (
    <div className="dashboard-container">

      <h2 className="heading">
        Data for <span className="highlight">April</span>
      </h2>

      {/* ✅ Table */}
      <div className="flex flex-col gap-4">
        <CustomTable
          columns={columns}
          data={all_data?.table || []}
          rowsPerPage={5}
        />
      </div>

      {/* ✅ Chart */}
      <div
        className="chart-container"
        style={{ height: "250px", fontFamily: "Montserrat, sans-serif" }}
      >
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default DashboardBarChart;