import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { DashboardCard, PieChartBase } from '../components/DashboardComponents'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import CustomCardRevenue from '../../../components/CustomCardRevenue/CustomCardRevenue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import TotalExpenses from './TotalExpenses'
import CustomFeeSummaryCard from '../../../components/CustomCardRevenue/CustomFeeSummaryCard'

// Import data
import {
  ageData,
  ageOptions,
  pieChartData,
  profitData,
  profitOptions,
  downloadSourceData,
  lineChartInitialData,
  lineChartOptions,
  Doughnutdata,
  Doughnutoptions
} from '../ProfitOverview/profileOverviewData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const createGradient = (ctx, chartArea) => {
  if (!chartArea) return 'rgba(0, 0, 0, 0)';

  const gradientStroke = ctx.createLinearGradient(0, 0, chartArea.right, 0);
  gradientStroke.addColorStop(0, '#f9a8d4');
  gradientStroke.addColorStop(0.2, '#f87171');
  gradientStroke.addColorStop(0.4, '#a78bfa');
  gradientStroke.addColorStop(0.6, '#60a5fa');
  gradientStroke.addColorStop(0.8, '#4ade80');
  gradientStroke.addColorStop(1, '#34d399');
  return gradientStroke;
};

const index = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(lineChartInitialData);
  const [chartOptions, setChartOptions] = useState(lineChartOptions);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const gradient = createGradient(chart.ctx, chart.chartArea);
    setChartData(prevData => ({
      ...prevData,
      datasets: prevData.datasets.map(dataset => ({
        ...dataset,
        borderColor: gradient,
        pointBackgroundColor: gradient,
      })),
    }));
  }, [chartRef.current?.chartArea]);

  const revenueCardsData = [
    {
      title: "Gross Revenue",
      totalRevenue: 100,
      previousRevenue: 50,
      percentageChange: 100,
    },
    {
      title: "Expenses",
      totalRevenue: 200,
      previousRevenue: 100,
      percentageChange: 100,
    },
    {
      title: "DL Fees",
      description: "(App Store + Play Store)",
      totalRevenue: 300,
      previousRevenue: 50,
      percentageChange: -100,
    },
  ];
  const outsideLabelsPlugin = {
    id: 'outsideLabels',
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const dataset = chart.data.datasets[0];
      const total = dataset.data.reduce((a, b) => a + b, 0);

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const radius = Math.min(chartArea.width, chartArea.height) / 2;
      const labelRadius = radius * 1.2;

      ctx.save();
      ctx.fillStyle = 'white';
      ctx.font = '16px sans-serif';
      ctx.textBaseline = 'middle';

      let startAngle = -0.5 * Math.PI;

      dataset.data.forEach((value, i) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const midAngle = startAngle + sliceAngle / 2;

        const x = centerX + Math.cos(midAngle) * labelRadius;
        const y = centerY + Math.sin(midAngle) * labelRadius;

        // Align text left/right based on quadrant
        const angleDeg = (midAngle * 180) / Math.PI;
        ctx.textAlign = angleDeg > 90 && angleDeg < 270 ? 'right' : 'left';

        ctx.fillText(value, x, y);

        startAngle += sliceAngle;
      });

      ctx.restore();
    },
  };



  const total = Doughnutdata.datasets[0].data.reduce((sum, value) => sum + value, 0);

  const legendData = [
    { label: 'Marketing', color: '#e879f9' },
    { label: 'Apple Dev Fee', color: '#c084fc' },
    { label: 'Google Dev Fee', color: '#60a5fa' },
    { label: 'Ambassador Payouts', color: '#FDE047' },
  ];


  return (
    <>
      <div className='grid grid-cols-12 gap-2 text-white'>
        {/* Left Column (becomes full width on mobile) */}

        {/* Right Column (becomes full width on mobile) */}
        <div className='col-span-12 mt-4 md:mt-0'>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, fontFamily: 'Montserrat, sans-serif' }}>
            <Typography sx={{ color: "#FFFF00", fontWeight: "bold", fontSize: "25px", fontFamily: 'Montserrat, sans-serif' }}>
              Financial Snapshot
            </Typography>
            <div className="tabs w-full sm:w-auto">
              <span>Weekly</span>
              <span className="active-tab">Monthly</span>
              <span>Yearly</span>
              <span>All Time</span>
            </div>
          </Box>

          {/* Cards Grid - responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mt-4" style={{ marginTop: "10px" }}>
            {revenueCardsData.map((item, index) => (
              <div key={index} className="sm:col-span-6 lg:col-span-4">
                <CustomCardRevenue
                  classname="rounded-xl h-full md:h-62"
                  title={item.title}
                  description={item.description}
                  totalRevenue={item.totalRevenue}
                  showCurrency={true}
                  previousRevenue={item.previousRevenue}
                  percentageChange={item.percentageChange}
                />
              </div>
            ))}

            <div className="sm:col-span-6 lg:col-span-4" >
              <div className="rounded-xl h-full md:h-[250px]" >
                <DashboardCard sx={{ paddingY: "10px" }}>
                  <PieChartBase
                    chartHeight={200} chartWidth={200} legendRightSpace={100} showInternalLabels={true}
                    data={pieChartData}
                  />
                </DashboardCard>
              </div>
            </div>

            <div className="sm:col-span-6 lg:col-span-4" >
              <CustomCardRevenue
                classname="rounded-xl h-full md:h-[250px]"
                title="Net Profit"
                description={"(Gross - Expenses - Fees)"}
                totalRevenue={100}
                showCurrency={true}

                previousRevenue={50}
                percentageChange={100}
              />
            </div>

            <div className="sm:col-span-6 lg:col-span-4" >
              <CustomCardRevenue
                classname="rounded-xl h-full md:h-[250px]"
                title="MoM Profit %"
                totalRevenue={100}
                previousRevenue={50}
                percentageChange={100}
              />
            </div>

            {/* <div className="sm:col-span-6 lg:col-span-8" style={{marginTop:"40px"}}>
    <CustomFeeSummaryCard
      ambassadorFee={100}
      playstoreFee={22}
      profit={382}
      previousProfit={50}
      profitChangePercentage={100}
    />
  </div> */}
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4' style={{ paddingY: "16px", fontFamily: 'Montserrat, sans-serif' }}>
            <div className='lg:col-span-7'>
              <h2 className="text-[25px] text-[#FFFF00] font-semibold mb-4 px-2.5" style={{ padding: "10px" }}>Gross vs Net Margin Over Time</h2>
              <div className="bg-[#171717] rounded-lg shadow-lg p-6">
                <div className="h-[300px] w-full">
                  <Bar data={profitData} options={profitOptions} />
                </div>
              </div>
            </div>

            <div className='lg:col-span-5 mt-4 lg:mt-0 h-full lg:h-[300px] ' style={{marginTop:"8px"}}>
              <Typography sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontSize: "25px", fontFamily: 'Montserrat, sans-serif' }}>
                Revenue per source
              </Typography>
              <DashboardCard sx={{ padding: "10px", height: { xs: "250px", md: "350px", }, fontFamily: 'Montserrat, sans-serif', mt: 1 }}>
                <Bar data={ageData} options={ageOptions} style={{ height: "100%", paddingTop: "20px" }} />
              </DashboardCard>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4' style={{ paddingY: "16px", fontFamily: 'Montserrat, sans-serif' }}>
            <div className='lg:col-span-7'>
              <Typography
                sx={{
                  color: "#FFFF00",
                  fontWeight: "bold",
                  py: "10px",
                  fontSize: "25px",
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                Expense Breakdown
              </Typography>

              <div className="flex flex-col lg:flex-row justify-center items-center bg-[#171717] rounded-xl text-white" style={{ height: "400px",marginTop:"10px" }}>
                <div className="relative w-full h-full " style={{ padding: "16px" }}>
                  <Doughnut
                    data={Doughnutdata}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "80%",
                      layout: {
                        padding: {
                          top: 20,
                          bottom: 40,
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    plugins={[outsideLabelsPlugin]}
                  />

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-xl text-gray-400">Total</p>
                    <p className="text-xl lg:text-4xl font-bold">{total}</p>
                  </div>
                </div>
                <ul className="list-none space-y-2 text-white lg:p-4 w-full lg:w-1/3 flex flex-wrap justify-center lg:block">
                  {legendData.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-[12px]">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>


            <div className='lg:col-span-5 mt-4 lg:mt-0 h-full '>
                <Box display="flex" justifyContent={{ xs: "center", sm: "end" }} alignItems="center" mt={2}>
                  <div className="tabs">
                    <span>Weekly</span>
                    <span className="active-tab">Monthly</span>
                    <span>Yearly</span>
                    <span>All Time</span>
                  </div>
                </Box>
              <DashboardCard sx={{ padding: "10px", height: { xs: "full", md: "500px", }, fontFamily: 'Montserrat, sans-serif', }}>
                <TotalExpenses />
              </DashboardCard>
            </div>
          </div>


          {/* Bottom Charts */}
          {/* <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4' style={{padding:"16px"}}>
      <div className='lg:col-span-7'>
        <h2 className="text-white text-xl font-semibold mb-4 px-2.5" style={{padding:"10px"}}>
          Profit over Time
        </h2>
        <div className="bg-[#171717] rounded-lg shadow-lg p-6">
          <div className="h-64 md:h-[300px] w-full">
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className='lg:col-span-5 mt-4 lg:mt-0 h-full lg:h-[300px]'>
        <h2 className="text-white text-lg font-semibold mb-4 px-2.5" style={{padding:"10px"}}>
          Download source distribution
        </h2>
        <DashboardCard sx={{ padding: "10px" }}>
          <PieChartBase 
            data={downloadSourceData}
            chartHeight={250}
            chartWidth="100%"
          />
        </DashboardCard>
      </div>
    </div> */}
        </div>

      </div>
    </>
  )
}

export default index;








