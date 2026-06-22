import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
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
import {
  ageData, ageOptions, profitData, profitOptions,
  lineChartInitialData, lineChartOptions,
  Doughnutdata, Doughnutoptions
} from '../ProfitOverview/profileOverviewData';
import { request } from '../../../services/axios'
import { useSelector } from 'react-redux'
import { AgeSegmentsSkeleton, BarChartSkeleton, PieChartSkeleton, RevenueCardsSkeleton, RevenueChartSkeleton } from '../../../components/Skeleton/SkeletonComp'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const createGradient = (ctx, chartArea) => {
  if (!chartArea) return 'rgba(0, 0, 0, 0)';
  const g = ctx.createLinearGradient(0, 0, chartArea.right, 0);
  g.addColorStop(0, '#f9a8d4');
  g.addColorStop(0.2, '#f87171');
  g.addColorStop(0.4, '#a78bfa');
  g.addColorStop(0.6, '#60a5fa');
  g.addColorStop(0.8, '#4ade80');
  g.addColorStop(1, '#34d399');
  return g;
};

const FILTER_TABS = [
  { label: 'Monthly',   value: 'monthly'   },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly',    value: 'yearly'    },
  { label: 'All Time',  value: 'all'       },
];

const createFetcher = (token) => async (url) => {
  const res = await request({ method: 'get', url }, false, token);
  return res?.data;
};

const index = () => {
  const token = useSelector((state) => state.admin.token);
  const [activeFilter, setActiveFilter] = useState('all');
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(lineChartInitialData);

  // ✅ mutate added for refresh button
  const { data: all_data, isLoading, isValidating, mutate } = useSWR(
    token ? `/dashboard/profitOverview?range=${activeFilter}` : null,
    createFetcher(token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  const isDataLoading = isLoading;

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const gradient = createGradient(chart.ctx, chart.chartArea);
    setChartData(prev => ({
      ...prev,
      datasets: prev.datasets.map(ds => ({
        ...ds,
        borderColor: gradient,
        pointBackgroundColor: gradient,
      })),
    }));
  }, [chartRef.current?.chartArea]);

  const handleFilterChange = (value) => {
    if (value === activeFilter) return;
    setActiveFilter(value);
  };

  const revenueCardsData = [
    {
      title: "Gross Revenue",
      totalRevenue: Number(all_data?.summary?.grossRevenue) || 0,
      previousRevenue: 50, percentageChange: 100,
    },
    {
      title: "Expenses",
      totalRevenue: Number(all_data?.summary?.expenses) || 0,
      previousRevenue: 100, percentageChange: 100,
    },
    {
      title: "DL Fees",
      description: "(App Store + Play Store)",
      totalRevenue: Number(all_data?.summary?.dlFees) || 0,
      previousRevenue: 50, percentageChange: -100,
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
      dataset.data.forEach((value) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const midAngle = startAngle + sliceAngle / 2;
        const x = centerX + Math.cos(midAngle) * labelRadius;
        const y = centerY + Math.sin(midAngle) * labelRadius;
        const angleDeg = (midAngle * 180) / Math.PI;
        ctx.textAlign = angleDeg > 90 && angleDeg < 270 ? 'right' : 'left';
        ctx.fillText(value, x, y);
        startAngle += sliceAngle;
      });
      ctx.restore();
    },
  };

  const total = Doughnutdata.datasets[0].data.reduce((sum, v) => sum + v, 0);

  const legendData = all_data?.Doughnutdata
    ? all_data.Doughnutdata.labels.map((label, i) => ({
        label,
        color: all_data.Doughnutdata.datasets[0].backgroundColor[i],
      }))
    : [
        { label: 'Marketing',          color: '#E91E63' },
        { label: 'Apple Dev Fee',       color: '#FFEB3B' },
        { label: 'Google Dev Fee',      color: '#2196F3' },
        { label: 'Ambassador Payouts',  color: '#4CAF50' },
        { label: 'Server and Tools',    color: '#5710e5' },
        { label: 'Miscellaneous',       color: '#f112d3' },
      ];

  const pieChartData = [
    { label: 'Gross Revenue ($)', value: Number(all_data?.summary?.grossRevenue) || 0, color: '#e879f9' },
    { label: 'Expenses ($)',       value: Number(all_data?.summary?.expenses)    || 0, color: '#2dd4bf' },
    { label: 'DL Fees ($)',        value: Number(all_data?.summary?.dlFees)      || 0, color: '#3b82f6' },
  ];

  return (
    <>
      <div className='grid grid-cols-12 gap-2 text-white'>
        <div className='col-span-12 mt-4 md:mt-0'>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, fontFamily: 'Montserrat, sans-serif' }}>
            <Typography sx={{ color: "#FFFF00", fontWeight: "bold", fontSize: "25px", fontFamily: 'Montserrat, sans-serif' }}>
              Financial Snapshot
            </Typography>

            <div className="tabs w-full sm:w-auto">
              {FILTER_TABS.map((tab) => (
                <span
                  key={tab.value}
                  onClick={() => handleFilterChange(tab.value)}
                  className={activeFilter === tab.value ? 'active-tab' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  {tab.label}
                  {isValidating && activeFilter === tab.value && (
                    <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.6 }}>↻</span>
                  )}
                </span>
              ))}
            </div>
          </Box>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mt-4" style={{ marginTop: "10px" }}>
            {isDataLoading ? (
              <Grid item xs={12} sx={{ display: 'flex', gap: 2, width: '100%', overflow: 'hidden' }} className="lg:col-span-12">
                <Box sx={{ width: '33%' }}><RevenueCardsSkeleton /></Box>
                <Box sx={{ width: '33%' }}><RevenueCardsSkeleton /></Box>
                <Box sx={{ width: '33%' }}><RevenueCardsSkeleton /></Box>
              </Grid>
            ) : (
              revenueCardsData.map((item, idx) => (
                <div key={idx} className="sm:col-span-6 lg:col-span-4">
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
              ))
            )}

            <div className="sm:col-span-6 lg:col-span-4">
              <div className="rounded-xl h-full md:h-[250px]">
                {isDataLoading ? <PieChartSkeleton /> : (
                  <DashboardCard sx={{ paddingY: "10px" }}>
                    <PieChartBase chartHeight={200} chartWidth={200} legendRightSpace={100} showInternalLabels={true} data={pieChartData} />
                  </DashboardCard>
                )}
              </div>
            </div>

            <div className="sm:col-span-6 lg:col-span-4">
              {isDataLoading ? <RevenueCardsSkeleton /> : (
                <CustomCardRevenue
                  classname="rounded-xl h-full md:h-[250px]"
                  title="Net Profit"
                  description={"(Gross - Expenses - Fees)"}
                  totalRevenue={all_data?.netProfit}
                  showCurrency={true}
                  previousRevenue={50}
                  percentageChange={100}
                />
              )}
            </div>

            <div className="sm:col-span-6 lg:col-span-4">
              {isDataLoading ? <RevenueCardsSkeleton /> : (
                <CustomCardRevenue
                  classname="rounded-xl h-full md:h-[250px]"
                  title="MoM Profit %"
                  totalRevenue={all_data?.momProfit?.current}
                  previousRevenue={50}
                  percentageChange={100}
                />
              )}
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4' style={{ paddingY: "16px", fontFamily: 'Montserrat, sans-serif' }}>
            <div className='lg:col-span-7'>
              <h2 className="text-[25px] text-[#FFFF00] font-semibold mb-4 px-2.5" style={{ padding: "10px" }}>Gross vs Net Margin Over Time</h2>
              <div className="bg-[#171717] rounded-lg shadow-lg p-6">
                <div className="h-[300px] w-full">
                  {isDataLoading ? <RevenueChartSkeleton /> : (
                    <Bar
                      data={(all_data?.profitData?.labels?.length > 0 && all_data?.profitData?.datasets?.length > 0) ? all_data.profitData : profitData}
                      options={profitOptions}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className='lg:col-span-5 mt-4 lg:mt-0 h-full lg:h-[300px]' style={{ marginTop: "8px" }}>
              <Typography sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontSize: "25px", fontFamily: 'Montserrat, sans-serif' }}>
                Revenue per source
              </Typography>
              {isDataLoading ? <BarChartSkeleton /> : (
                <DashboardCard sx={{ padding: "10px", height: { xs: "250px", md: "350px" }, fontFamily: 'Montserrat, sans-serif', mt: 1 }}>
                  <Bar
                    data={(all_data?.ageData?.labels?.length > 0 && all_data?.ageData?.datasets?.length > 0) ? all_data.ageData : ageData}
                    options={ageOptions}
                    style={{ height: "100%", paddingTop: "20px" }}
                  />
                </DashboardCard>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4' style={{ paddingY: "16px", fontFamily: 'Montserrat, sans-serif' }}>

            {/* ✅ LEFT — Expense Breakdown with Refresh button */}
            <div className='lg:col-span-7'>

              {/* Header row: title + refresh button */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py="10px"
              >
                <Typography sx={{ color: "#FFFF00", fontWeight: "bold", fontSize: "25px", fontFamily: 'Montserrat, sans-serif' }}>
                  Expense Breakdown
                </Typography>

                <button
                  onClick={() => mutate()}
                  title="Refresh data"
                  style={{
                    background: 'transparent',
                    border: '1px solid #FFFF00',
                    borderRadius: '8px',
                    color: '#FFFF00',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'Montserrat, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background 0.2s, opacity 0.2s',
                    opacity: isValidating ? 0.5 : 1,
                  }}
                  disabled={isValidating}
                  onMouseEnter={e => { if (!isValidating) e.currentTarget.style.background = 'rgba(255,255,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* spinning when revalidating */}
                  <span style={{
                    display: 'inline-block',
                    animation: isValidating ? 'spin 1s linear infinite' : 'none',
                  }}>↻</span>
                  {isValidating ? 'Refreshing...' : 'Refresh'}
                </button>
              </Box>

              {/* spin keyframe injected once */}
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

              {isDataLoading ? <PieChartSkeleton /> : (
                <div
                  className="flex flex-col lg:flex-row justify-center items-center bg-[#171717] rounded-xl text-white"
                  style={{ minHeight: "500px", marginTop: "10px", padding: "24px" }}
                >
                  {/* Doughnut */}
                  <div className="relative w-full flex-1" style={{ minHeight: "420px" }}>
                    <Doughnut
                      data={
                        (all_data?.Doughnutdata?.labels?.length > 0 && all_data?.Doughnutdata?.datasets?.length > 0)
                          ? all_data.Doughnutdata
                          : Doughnutdata
                      }
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "80%",
                        layout: { padding: { top: 30, bottom: 50 } },
                        plugins: { legend: { display: false } },
                      }}
                      plugins={[outsideLabelsPlugin]}
                    />
                    {/* Center total */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                      <p className="text-xl text-gray-400">Total</p>
                      <p className="text-xl lg:text-4xl font-bold">
                        ${all_data?.expenseBreakdown?.total ?? total}
                      </p>
                    </div>
                  </div>

                  {/* Legend */}
                  <ul className="list-none text-white lg:p-6 w-full lg:w-auto flex flex-wrap justify-center lg:flex-col lg:justify-start gap-3 mt-4 lg:mt-0">
                    {legendData.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[13px] whitespace-nowrap">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT — Total Expenses */}
            <div className='lg:col-span-5 mt-4 lg:mt-0 h-full'>
              <Box display="flex" justifyContent={{ xs: "center", sm: "end" }} alignItems="center" mt={2}></Box>
              {isDataLoading ? <AgeSegmentsSkeleton /> : (
                <DashboardCard sx={{ padding: "10px", height: { xs: "full", md: "500px" }, fontFamily: 'Montserrat, sans-serif' }}>
                  <TotalExpenses initialExpenses={all_data?.expensesList} />
                </DashboardCard>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default index;