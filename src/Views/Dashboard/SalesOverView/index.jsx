import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  DashboardCard,
  CircularProgressWithLabel,
  USMap,
  PieChartBase,
} from "../components/DashboardComponents";
import DashboardBarChart from "../components/BarChart";
import { Bar } from "react-chartjs-2";
import CustomCardRevenue from '../../../../src/components/CustomCardRevenue/CustomCardRevenue';
import { scaleQuantize } from "d3-scale";

// SWR and Axios imports for real-time data
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { request } from '../../../services/axios';

import {
  kpiData,
  monthlyData,
  ageSegmentsData,
  couponData,
  platformData,
  chartData,
  chartOptions,
  geoData as staticGeoData, // Renamed to avoid conflict
  chartcoupon,
  ageSegmentsDataoption
} from '../SalesOverView/SalesOverviewData';

const SalesOverview = () => {
  const token = useSelector((state) => state.admin.token);
  const [dataTimeFilter, setDataTimeFilter] = useState("Monthly");
  const [salesTimeFilter, setSalesTimeFilter] = useState("Monthly");
  const [selectedCountry, setSelectedCountry] = useState("usa");

  // Fetcher function for SWR
  const fetcher = async (url) => {
    const res = await request({
      method: "get",
      url: url,
    }, false, token);
    return res?.data;
  };

  // Fetch heatmap data with SWR
  const { data: heatMapResponse, error: heatMapError, isLoading: isHeatMapLoading } = useSWR(
    token ? 'user/generateGeoData' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const heatMapData = heatMapResponse?.geoData || {};

  const colorScale = scaleQuantize()
    .domain([0, 10]) 
    .range(['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  // Loading and Error internal components
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <p className="text-red-500">Failed to load map data</p>
    </div>
  );

  return (
    <Box sx={{ minHeight: "100vh", marginBottom: '10px', fontFamily: 'Montserrat, sans-serif' }}>
      <Grid container spacing={1} >
        <Grid item xs={12} md={8}>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontFamily: 'Montserrat, sans-serif' }}
          >
            Total Revenue ($$)
          </Typography>
          <DashboardBarChart />
        </Grid>

        <Grid item xs={12} md={4} sx={{ marginTop: { xs: 0, md: "50px" } }}>
          <DashboardCard sx={{ padding: "10px" }}>
            <div className="flex flex-col bg-[#262626] gap-4">
              <CustomCardRevenue
                title={"Total revenue"}
                totalRevenue={100}
                showCurrency={true}
                previousRevenue={50}
                percentageChange={100}
              />
              <CustomCardRevenue
                title={"New subscribers"}
                totalRevenue={100}
                previousRevenue={50}
                percentageChange={100}
              />
            </div>
          </DashboardCard>
        </Grid>

        <Grid container spacing={1} sx={{ paddingY: "20px", pl: 1 }}>
          <Grid item xs={12} lg={8}>
            <Typography variant="h5" component="div" sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontFamily: 'Montserrat, sans-serif' }}>
              Sales/Profits
            </Typography>
            <DashboardCard sx={{ padding: "10px" }}>
              <Box display="flex" justifyContent={{ xs: "center", sm: "end" }} alignItems="center" mb={3} >
                <div className="tabs">
                  <span>Weekly</span>
                  <span className="active-tab">Monthly</span>
                  <span>Yearly</span>
                  <span>All Time</span>
                </div>
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, fontFamily: 'Montserrat, sans-serif', alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: { xs: "wrap", md: "nowrap" } }} >
                <CircularProgressWithLabel profitheading="P" saleheading="S" date="MoM" color="#2DD4BF" sale="+13%" profit="+33%" percentage={33} />
                <CircularProgressWithLabel profitheading="P" saleheading="S" date="QoQ" color="#E879F9" sale="+44%" profit="+52%" percentage={65} />
                <CircularProgressWithLabel profitheading="P" saleheading="S" date="YoY" color="#60A5FA" sale="+53%" profit="+73%" percentage={44} />
              </Box>
            </DashboardCard>
          </Grid>

          {/* State Engagement Section with Real-time Data */}
          <Grid item xs={12} lg={4} sx={{ marginTop: { xs: "50px", md: "0px" } }} >
            <Typography variant="h5" component="div" sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontFamily: 'Montserrat, sans-serif' }}
            >
              State Engagement
            </Typography>
            <DashboardCard sx={{ padding: "10px" }}>
              <Box sx={{
                width: "100%", height: { xs: "300px", sm: "400px", md: "100%" }, overflow: "hidden",
                fontFamily: 'Montserrat, sans-serif'
              }}>
                {isHeatMapLoading ? (
                  <LoadingSpinner />
                ) : heatMapError ? (
                  <ErrorMessage />
                ) : (
                  <USMap
                    geoUrl={heatMapData?.usa?.url}
                    stateData={heatMapData?.usa?.stateData || {}}
                    colorScale={colorScale}
                    total={heatMapData?.usa?.total || 0}
                    canadaGeoUrl={heatMapData?.canada?.url}
                    canadaData={heatMapData?.canada?.stateData || {}}
                    canadaTotal={heatMapData?.canada?.total || 0}
                    europeGeoUrl={heatMapData?.europe?.url}
                    europeData={heatMapData?.europe?.stateData || {}}
                    europeTotal={heatMapData?.europe?.total || 0}
                    onCountryChange={handleCountryChange}
                  />
                )}
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ marginTop: "40px", pl: 1 }}>
          <Grid item xs={12} md={6} lg={4}>
            <Typography
              sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontSize: "20px", fontFamily: 'Montserrat, sans-serif' }}
            >
              Platform Downloads (Monthly)
            </Typography>
            <DashboardCard sx={{ padding: "10px", height: "320px", mt: 1 }}>
              <PieChartBase data={platformData} chartHeight={250} chartWidth={250} legendRightSpace={100} showInternalLabels={true}
              />
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Typography
              sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontSize: "20px", fontFamily: 'Montserrat, sans-serif' }}
            >
              Total Coupons Created
            </Typography>
            <DashboardCard sx={{ paddingX: "10px", height: "320px",marginTop:"6px" }}>
              <h1
                className="flex items-end justify-end gap-3 text-xl"
                style={{ marginTop: "4px", paddingTop: "10px", paddingBottom: "25px", fontFamily: 'Montserrat, sans-serif' }}
              >
                Weekly Average: <span className="text-[#FEF08A]">50/day</span>
              </h1>

              <div style={{ height: "250px" }}>
                <Bar
                  data={chartcoupon.coupon}
                  options={{
                    ...chartOptions.coupon,
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                />
              </div>
            </DashboardCard>
          </Grid>

          {/* Age Segments */}
          <Grid item xs={12} md={6} lg={5}>
            <Typography
              sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontSize: "20px", fontFamily: 'Montserrat, sans-serif' }}
            >
              Age Segments (new subscribers)
            </Typography>
            <DashboardCard sx={{ padding: "10px", height: "320px", mt: 1 }}>
              <div style={{ height: "300px" }}>
                <Bar
                  data={ageSegmentsData} options={ageSegmentsDataoption}
                />
              </div>
            </DashboardCard>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesOverview;