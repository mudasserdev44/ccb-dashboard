import React, { useEffect, useState } from "react";
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
import { AgeSegmentsSkeleton, BarChartSkeleton, MapSkeleton, PieChartSkeleton, RevenueCardsSkeleton, RevenueChartSkeleton, SalesProfitSkeleton, SectionTitle } from "../../../components/Skeleton/SkeletonComp";

const SalesOverview = () => {
  const token = useSelector((state) => state.admin.token);
  const [selectedCountry, setSelectedCountry] = useState("usa");
  const [all_data, setAllData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  const getSalesOverviewData = async () => {
    try {
      setIsDataLoading(true);
      const res = await request(
        { method: "get", url: "/dashboard/salesOverview?range=yearly" },
        false,
        token
      );
      setAllData(res.data.data);
      console.log(res.data.data)
    } catch (err) {
      console.log(err);
      setDataError(true);
    } finally {
      setIsDataLoading(false);
    }
  };
  console.log(ageSegmentsData, "AGE DATAAAAAAAAAAAAAAAs")

  useEffect(() => {
    getSalesOverviewData();
  }, []);

  const fetcher = async (url) => {
    const res = await request({ method: "get", url }, false, token);
    return res?.data;
  };

  const {
    data: heatMapResponse,
    error: heatMapError,
    isLoading: isHeatMapLoading,
  } = useSWR(token ? "user/generateGeoData" : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const heatMapData = heatMapResponse?.geoData || {};

  const colorScale = scaleQuantize()
    .domain([0, 10])
    .range([
      "#ffffcc", "#ffeda0", "#fed976", "#feb24c",
      "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026",
    ]);

  const handleCountryChange = (country) => setSelectedCountry(country);

  // Coupon chart data safe check
  const couponChartData = all_data?.chartcoupon?.coupon;
  const hasCouponData =
    couponChartData &&
    couponChartData.labels?.length > 0 &&
    couponChartData.datasets?.length > 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        marginBottom: "10px",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <Grid container spacing={1}>
        {/* ── Total Revenue Chart ── */}
        <Grid item xs={12} md={8}>
          <SectionTitle>Total Revenue ($$)</SectionTitle>
          {isDataLoading ? <RevenueChartSkeleton /> : <DashboardBarChart all_data={all_data} />}
        </Grid>

        {/* ── Revenue Summary Cards ── */}
        <Grid item xs={12} md={4} sx={{ marginTop: { xs: 0, md: "50px" } }}>
          {isDataLoading ? (
            <RevenueCardsSkeleton />
          ) : (
            <DashboardCard sx={{ padding: "10px" }}>
              <div className="flex flex-col bg-[#262626] gap-4">
                <CustomCardRevenue
                  title={"Total revenue"}
                  totalRevenue={all_data?.summary?.totalRevenue}
                  showCurrency={true}
                  previousRevenue={all_data?.summary?.previousRevenue}
                  percentageChange={100}
                />
                <CustomCardRevenue
                  title={"New subscribers"}
                  totalRevenue={all_data?.summary?.newSubscribers}
                  previousRevenue={50}
                  percentageChange={100}
                />
              </div>
            </DashboardCard>
          )}
        </Grid>

        {/* ── Sales/Profits + State Engagement ── */}
        <Grid container spacing={1} sx={{ paddingY: "20px", pl: 1 }}>
          {/* Sales/Profits */}
          <Grid item xs={12} lg={8}>
            <SectionTitle>Sales/Profits</SectionTitle>
            {isDataLoading ? (
              <SalesProfitSkeleton />
            ) : (
              <DashboardCard sx={{ padding: "10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    fontFamily: "Montserrat, sans-serif",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                    mt: "15%",
                    flexWrap: { xs: "wrap", md: "nowrap" },
                  }}
                >
                  <CircularProgressWithLabel
                    profitheading="P" saleheading="S" date="MoM" color="#2DD4BF"
                    sale={`+${all_data?.salesProfit?.mom?.sales || 0}%`}
                    profit={`+${all_data?.salesProfit?.mom?.profit || 0}%`}
                    percentage={33}
                  />
                  <CircularProgressWithLabel
                    profitheading="P" saleheading="S" date="QoQ" color="#E879F9"
                    sale={`+${all_data?.salesProfit?.qoq?.sales || 0}%`}
                    profit={`+${all_data?.salesProfit?.qoq?.profit || 0}%`}
                    percentage={65}
                  />
                  <CircularProgressWithLabel
                    profitheading="P" saleheading="S" date="YoY" color="#60A5FA"
                    sale={`+${all_data?.salesProfit?.yoy?.sales || 0}%`}
                    profit={`+${all_data?.salesProfit?.yoy?.profit || 0}%`}
                    percentage={44}
                  />
                </Box>
              </DashboardCard>
            )}
          </Grid>

          {/* State Engagement Map */}
          <Grid item xs={12} lg={4} sx={{ marginTop: { xs: "50px", md: "0px" } }}>
            <SectionTitle>State Engagement</SectionTitle>
            {isHeatMapLoading ? (
              <MapSkeleton />
            ) : heatMapError ? (
              <DashboardCard>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
                  <p style={{ color: "#ef4444" }}>Failed to load map data</p>
                </Box>
              </DashboardCard>
            ) : (
              <DashboardCard sx={{ padding: "10px" }}>
                <Box sx={{ width: "100%", height: { xs: "300px", sm: "400px", md: "100%" }, overflow: "hidden", fontFamily: "Montserrat, sans-serif" }}>
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
                </Box>
              </DashboardCard>
            )}
          </Grid>
        </Grid>

        {/* ── Bottom Row: Pie + Coupons + Age Segments ── */}
        <Grid container spacing={1} sx={{ marginTop: "40px", pl: 1 }}>
          {/* Platform Downloads */}
          <Grid item xs={12} md={6} lg={4}>
            <Typography sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontSize: "20px", fontFamily: "Montserrat, sans-serif" }}>
              Platform Downloads (Monthly)
            </Typography>
            {isDataLoading ? (
              <PieChartSkeleton />
            ) : (
              <DashboardCard sx={{ padding: "10px", height: "320px", mt: 1 }}>
                <PieChartBase
                  data={platformData}
                  chartHeight={250}
                  chartWidth={250}
                  legendRightSpace={100}
                  showInternalLabels={true}
                />
              </DashboardCard>
            )}
          </Grid>

          {/* Total Coupons Created */}
          <Grid item xs={12} md={6} lg={3}>
            <Typography sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontSize: "20px", fontFamily: "Montserrat, sans-serif" }}>
              Total Coupons Created
            </Typography>
            {isDataLoading || !hasCouponData ? (
              <BarChartSkeleton />
            ) : (
              <DashboardCard sx={{ paddingX: "10px", height: "320px", marginTop: "6px" }}>
                <h1
                  className="flex items-end justify-end gap-3 text-xl"
                  style={{ marginTop: "4px", paddingTop: "10px", paddingBottom: "25px", fontFamily: "Montserrat, sans-serif" }}
                >
                  Weekly Average: <span className="text-[#FEF08A]">50/day</span>
                </h1>
                <div style={{ height: "250px" }}>
                  <Bar
                    data={couponChartData}
                    options={{ ...chartOptions.coupon, maintainAspectRatio: false, responsive: true }}
                  />
                </div>
              </DashboardCard>
            )}
          </Grid>

          {/* Age Segments */}
          <Grid item xs={12} md={6} lg={5}>
            <Typography sx={{ color: "#FFFF00", fontWeight: "bold", paddingY: "10px", fontSize: "20px", fontFamily: "Montserrat, sans-serif" }}>
              Age Segments (new subscribers)
            </Typography>
            {isDataLoading ? (
              <AgeSegmentsSkeleton />
            ) : (
              <DashboardCard sx={{ padding: "10px", height: "320px", mt: 1 }}>
                <div style={{ height: "300px" }}>
                  <Bar data={all_data?.ageSegmentsData} options={ageSegmentsDataoption} />
                </div>
              </DashboardCard>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesOverview;
