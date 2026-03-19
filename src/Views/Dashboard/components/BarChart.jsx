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
import { FaArrowUp } from "react-icons/fa6";
import CustomTable from "../../../../src/components/CustomTable/CustomTable";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardBarChart = () => {
  // const barData = {
  //   labels: ["Feb", "March", "April", "May", "June", "July", "Aug", "Sept"],
  //   datasets: [
  //     {
  //       label: "Monthly",
  //       data: [70, 35, 50, 65, 20, 45, 30, 50],
  //       backgroundColor: "#c168cf",
  //       borderRadius: {
  //         topLeft: 10,
  //         topRight: 10,
  //         bottomLeft: 0,
  //         bottomRight: 0,
  //       },
  //       borderSkipped: false,
  //     },
  //     {
  //       label: "Quarterly",
  //       data: [55, 100, 80, 90, 70, 30, 25, 20],
  //       backgroundColor: "#548bcf",
  //       borderRadius: {
  //         topLeft: 10,
  //         topRight: 10,
  //         bottomLeft: 0,
  //         bottomRight: 0,
  //       },
  //       borderSkipped: false,
  //     },
  //     {
  //       label: "Annual",
  //       data: [85, 50, 40, 65, 25, 25, 50, 50],
  //       backgroundColor: "#2bb1a0",
  //       borderRadius: {
  //         topLeft: 10,
  //         topRight: 10,
  //         bottomLeft: 0,
  //         bottomRight: 0,
  //       },
  //       borderSkipped: false,
  //     },
  //   ],
  // };
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
 const barOptions = {
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#ffffff",
        boxWidth: 15,
        boxHeight: 15,
        font: {
          family: "Montserrat, sans-serif", // ✅ legend font
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
      stacked: false,
    },
    y: {
      ticks: {
        color: "#ffffff",
        stepSize: 25,
        max: 100,
        min: 0,
        font: {
          family: "Montserrat, sans-serif", // ✅ Y-axis font
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


  const data = [
    { monthly: "32", quarterly: "20", annual: "41", monthlyrevs: "$  130", momrevs: "90%", growth: "up (+44%)"},
  ];

  const columns = [
    { key: "monthly", label: "Monthly" },
    { key: "quarterly", label: "Quarterly" },
    { key: "annual", label: "Annual" },
    { key: "monthlyrevs", label: "Monthly Revs" },
    { key: "momrevs", label: "MoM Revs" },
    { key: "growth", label: "Growth %", },
    // { key: "kpis", label: "KPIs", },
  ];


  return (
    <div className="dashboard-container">
      {/* <div className="tabs">
        <span>Weekly</span>
        <span className="active-tab">Monthly</span>
        <span>Yearly</span>
        <span>All Time</span>
      </div> */}

      <h2 className="heading">
        Data for <span className="highlight">April</span>
      </h2>

      <div className='flex flex-col gap-4'>
        <CustomTable columns={columns} data={data} rowsPerPage={5} />
      </div>

      {/* <div className="overflow-x-auto" style={{ paddingBottom: "20px" }}>
        <table className="min-w-full bg-[#171717] rounded-xl border border-[#cfcfcf]  text-white shadow-md" >
          <thead>
            <tr className="border-b-2  border-[#b9b9b9]">
              <th className="py-3 px-4 text-left bg-white text-black border-r border-[#b9b9b9] text-sm font-semibold uppercase tracking-wider" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>DLs</th>
              <th className="py-3 px-4 text-left bg-white text-black border-r border-[#b9b9b9] text-sm font-semibold uppercase tracking-wider" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>Re-buys</th>
              <th className="py-3 px-4 text-left bg-white text-black border-r border-[#b9b9b9] text-sm font-semibold uppercase tracking-wider" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>Pauses</th>
              <th className="py-3 px-4 text-left bg-white text-black border-r border-[#b9b9b9] text-sm font-semibold uppercase tracking-wider" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>Revenue Monthly</th>
              <th className="py-3 px-4 text-left bg-white text-black border-r border-[#b9b9b9] text-sm font-semibold uppercase tracking-wider" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>Revenue MoM</th>
              <th className="py-3 px-4 text-left bg-white text-black border-r border-[#b9b9b9] text-sm font-semibold uppercase tracking-wider" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>Growth %</th>
              <th className="py-3 px-4 text-left bg-white text-black border-r border-[#b9b9b9] text-sm font-semibold uppercase tracking-wider" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>KPIs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 px-4 text-left border-r border-[#b9b9b9] text-lg font-bold text-[#fef08a]" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>70</td>
              <td className="py-4 px-4 text-left border-r border-[#b9b9b9] text-lg font-bold text-[#fef08a]" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>20</td>
              <td className="py-4 px-4 text-left border-r border-[#b9b9b9] text-lg font-bold text-[#fef08a]" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>40</td>
              <td className="py-4 px-4 text-left border-r border-[#b9b9b9] text-lg font-bold text-[#fef08a]" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>130</td>
              <td className="py-4 px-4 text-left border-r border-[#b9b9b9] text-lg font-bold text-[#fef08a]" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>90</td>
              <td className="py-4 px-4 text-left border-r border-[#b9b9b9] text-lg font-bold">
                <div className="flex flex-col items-center text-[#fef08a]">
                 <FaArrowUp />
                  (+44%)
                </div>
              </td>
              <td className="py-4 px-4 text-left text-lg font-bold text-[#fef08a]" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}>DLs</td>
            </tr>
          </tbody>
        </table>
      </div> */}

      <div className="chart-container" style={{ height: '250px',fontFamily: 'Montserrat, sans-serif' }}>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default DashboardBarChart;
