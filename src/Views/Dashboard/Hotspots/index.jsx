import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { DashboardCard, PieChartBase, USMap } from "../components/DashboardComponents";
import { scaleQuantize } from "d3-scale";
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { request } from '../../../services/axios';
import SocialMediaStats from "../../../components/SocialMediaStats";

const Hotspots = () => {
  const token = useSelector((state) => state.admin.token);
  const [selectedCountry, setSelectedCountry] = useState("usa");
  
  // 1. Added state to track the active time filter
  const [timeFilter, setTimeFilter] = useState("alltime");

  // Fetcher function for SWR
  const fetcher = async (url) => {
    const res = await request({
      method: "get",
      url: url,
    }, false, token);
    return res?.data;
  };

  // 2. Updated SWR hook to include the dynamic filter in the API URL
  const { 
    data: heatMapResponse, 
    error: heatMapError, 
    isLoading: isHeatMapLoading 
  } = useSWR(
    token ? `user/generateGeoData?filter=${timeFilter}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // --- Top UGC Categories Fetching ---
  const { 
    data: ugcCategoriesResponse, 
    error: ugcError, 
    isLoading: isUgcLoading 
  } = useSWR(
    token ? 'dashboard/topUGCCategories' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Extract Heatmap Data
  const heatMapData = heatMapResponse?.geoData || {};

  // Extract and transform data for PieChartBase
  const ugcCategoriesData = React.useMemo(() => {
    const rawData = ugcCategoriesResponse?.data || [];
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77', '#A8E6CF', '#FF8B94', '#C7CEEA', '#FFDAC1'];
    return rawData.map((item, index) => ({
      name: item.categoryName,
      label: item.categoryName,
      value: item.count,
      id: item.categoryId,
      color: colors[index % colors.length]
    }));
  }, [ugcCategoriesResponse]);

  // Dynamic color scale based on data domain
  const colorScale = scaleQuantize()
    .domain([0, 10]) 
    .range(['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-500 text-center">
        <p className="text-lg font-semibold">Error loading data</p>
        <p className="text-sm mt-2">{message}</p>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <Grid item xs={12} lg={4}>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: "#FFFF00", fontSize: "25px", fontWeight: "bold", paddingY: "20px", fontFamily: 'Montserrat, sans-serif' }}
          >
            Ambassador Engagement
          </Typography>
          <div className="flex items-end justify-end">
            {/* 3. Updated Tabs with onClick and conditional active styling */}
            <div className="tabs text-white">
              <span 
                className={timeFilter === "weekly" ? "active-tab cursor-pointer" : "cursor-pointer"}
                onClick={() => setTimeFilter("weekly")}
              >
                Weekly
              </span>
              <span 
                className={timeFilter === "monthly" ? "active-tab cursor-pointer" : "cursor-pointer"}
                onClick={() => setTimeFilter("monthly")}
              >
                Monthly
              </span>
              <span 
                className={timeFilter === "yearly" ? "active-tab cursor-pointer" : "cursor-pointer"}
                onClick={() => setTimeFilter("yearly")}
              >
                Yearly
              </span>
              <span 
                className={timeFilter === "alltime" ? "active-tab cursor-pointer" : "cursor-pointer"}
                onClick={() => setTimeFilter("alltime")}
              >
                All Time
              </span>
            </div>
          </div>
          
          <DashboardCard sx={{ padding: "10px", minHeight: "400px" }}>
            <div className="max-w-4xl mx-auto" style={{ padding: { xs: "10px", md: "0px" } }}>
              {isHeatMapLoading ? (
                <LoadingSpinner />
              ) : heatMapError ? (
                <ErrorMessage message="Failed to load real-time map data" />
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
            </div>
          </DashboardCard>
        </Grid>
      </div>

      <div className="grid grid-cols-12 gap-10 md:gap-6" style={{ paddingTop: "20px" }}>
        {/* LEFT CARD - Top UGC Category */}
        <div className="col-span-12 lg:col-span-6">
          <h2 className="text-[#FFFF00] text-[25px] font-semibold mb-4 px-1">
            Top UGC category
          </h2>
          <DashboardCard
            sx={{
              padding: "10px",
              mt: 1,
              height: "350px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isUgcLoading ? (
              <LoadingSpinner />
            ) : ugcError ? (
              <ErrorMessage message="Failed to load UGC categories" />
            ) : (
              <PieChartBase
                data={ugcCategoriesData}
                chartHeight={250}
                chartWidth={250}
                legendRightSpace={100}
                showInternalLabels={true}
                showTooltip={true}
                tooltipContent={(data) => `${data.name}: ${data.value}`}
              />
            )}
          </DashboardCard>
        </div>

        {/* RIGHT CARD - Social Media Platform */}
        <div className="col-span-12 lg:col-span-6">
          <h2 className="text-[#FFFF00] text-[25px] font-semibold mb-4 px-1">
            Social media platform engagement
          </h2>
          <DashboardCard
            sx={{
              padding: "10px",
              mt: 1,
              height: "350px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <SocialMediaStats title="" />
          </DashboardCard>
        </div>
      </div>
    </>
  );
};

export default Hotspots;