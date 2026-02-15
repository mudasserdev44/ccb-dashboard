import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  ButtonGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { PieChart } from '@mui/x-charts/PieChart';





ChartJS.register(ArcElement, Tooltip, Legend);

// Styled components
const DashboardCard = styled(Paper)(({ theme }) => ({
  backgroundColor: "#171717",
  borderRadius: "10px",
  // padding: theme.spacing(2),
  color: "#fff",
  height: "100%",
}));

const TimeFilterButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiButton-root": {
    color: "#fff",
    borderColor: "#555",
    fontSize: "0.75rem",
    paddingTop: 2,
    paddingBottom: 2,
  },
  "& .MuiButton-root.active": {
    backgroundColor: "#e93d82",
    borderColor: "#e93d82",
  },
}));

const KpiBox = styled(Box)(({ theme, bgcolor = "#141426" }) => ({
  backgroundColor: bgcolor,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1),
  borderRadius: "4px",
  height: "80px",
  width: "60px",
  margin: "0 4px",
}));

// TimeFilter Component
const TimeFilter = ({ activeFilter, onChange }) => {
  const filters = ["Weekly", "Monthly", "Yearly", "All Time"];

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <TimeFilterButtonGroup variant="outlined" aria-label="time filter">
        {filters.map((filter) => (
          <Button
            key={filter}
            className={activeFilter === filter ? "active" : ""}
            onClick={() => onChange(filter)}
          >
            {filter}
          </Button>
        ))}
      </TimeFilterButtonGroup>
    </Box>
  );
};

// MetricCard Component
const MetricCard = ({ title, value, color, icon, suffix = "" }) => {
  return (
    <KpiBox bgcolor={color}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {value}
        {suffix}
      </Typography>
      {icon && icon}
    </KpiBox>
  );
};

// CircularProgressWithLabel Component
const CircularProgressWithLabel = ({
  date,
  color,
  sale,
  profit,
  percentage,
  saleheading,
  profitheading
}) => {
  const progress = Math.min(Math.max(percentage, 0), 100);
  const strokeWidth = 20;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 15px",
        fontFamily: 'Montserrat, sans-serif'
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          style={{ position: "absolute", }}
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#87888C"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            // strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </svg>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,

          }}
        >
          <Typography variant="h6" component="div" sx={{ color: "#CFCFCF", fontWeight: "bold", fontFamily: 'Montserrat, sans-serif' }}>
            {date}
          </Typography>
          <Typography variant="body2" sx={{
            color: "#FEF08A",
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            gap: "10px",
            fontFamily: 'Montserrat, sans-serif',
            borderBottom: "1px solid white"
          }}>
            <span>{saleheading}</span>
            {sale}
          </Typography>
          <Typography variant="caption" sx={{
            color: "#FEF08A",
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            fontFamily: 'Montserrat, sans-serif',
            gap: "10px"
          }}>
            <span>{profitheading}</span>
            {profit}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
// Map Component (Simplified for this example)
const USMap = ({
  geoUrl,
  stateData,
  colorScale,
  total,
  canadaGeoUrl,
  canadaData,
  canadaTotal,
  europeGeoUrl,
  europeData,
  europeTotal,
  onCountryChange,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("usa");
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    value: 0,
  });
  const [activeRegion, setActiveRegion] = useState(null);
  const mapWrapperRef = useRef(null);

  // normalize Canada keys
  const normalizedCanadaData = useMemo(() => {
    if (!canadaData) return {};
    return Object.fromEntries(
      Object.entries(canadaData).map(([k, v]) => [
        k.toString().toLowerCase().trim(),
        v,
      ])
    );
  }, [canadaData]);

  // normalize Europe keys
  const normalizedEuropeData = useMemo(() => {
    if (!europeData) return {};
    return Object.fromEntries(
      Object.entries(europeData).map(([k, v]) => [
        k.toString().toLowerCase().trim(),
        v,
      ])
    );
  }, [europeData]);

  const handleCountryClick = (country) => {
    console.log(country, "COUNTRYYYYYYYYYYY")
    setSelectedCountry(country);
    if (onCountryChange) onCountryChange(country);
    setActiveRegion(null);
    setHoverInfo((prev) => ({ ...prev, visible: false }));
  };

  const updateHoverInfo = (evt, name, value) => {
    if (!evt || !mapWrapperRef.current) return;
    const rect = mapWrapperRef.current.getBoundingClientRect();
    const safeValue = typeof value === "number" ? value : Number(value) || 0;

    setHoverInfo({
      visible: true,
      x: evt.clientX - rect.left + 12,
      y: evt.clientY - rect.top + 12,
      name: name || "Unknown",
      value: safeValue,
    });
    setActiveRegion({ name: name || "Unknown", value: safeValue });
  };

  const hideHoverInfo = () => {
    setHoverInfo((prev) => ({ ...prev, visible: false }));
  };

  const getRegionName = (geo, fallback) => {
    const props = geo.properties || {};
    return (
      props.NAME ||
      props.name ||
      props.province ||
      props.prov_name ||
      fallback ||
      geo.id ||
      "Unknown"
    );
  };

  const currentTotal =
    selectedCountry === "canada"
      ? canadaTotal
      : selectedCountry === "europe"
        ? europeTotal
        : total;

  // projection configs
  const projectionConfig =
    selectedCountry === "canada"
      ? { scale: 120, center: [-95, 70] }
      : selectedCountry === "europe"
        ? { scale: 220, center: [10, 55] }
        : { scale: 500 };

  return (
    <div
      className="rounded-xl flex flex-col h-full"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
      ref={mapWrapperRef}
    >
      <div className="flex justify-end gap-4 items-center mb-4" style={{ paddingBottom: 8 }}>
        {/* <span
          className={`text-md cursor-pointer text-sm rounded-md transition-colors ${selectedCountry === "europe" ? "text-white bg-[#15803d]" : "text-gray-400 bg-transparent hover:bg-gray-600"}`}
          style={{ padding: "3px 5px" }}
          onClick={() => handleCountryClick("europe")}
        >
          Europe
        </span> */}
        <span
          className={`text-md cursor-pointer text-sm rounded-md transition-colors ${selectedCountry === "canada" ? "text-white bg-[#15803d]" : "text-gray-400 bg-transparent hover:bg-gray-600"}`}
          style={{ padding: "3px 5px" }}
          onClick={() => handleCountryClick("canada")}
        >
          Canada
        </span>
        <span
          className={`text-md cursor-pointer text-sm rounded-md transition-colors ${selectedCountry === "usa" ? "text-white bg-[#15803d]" : "text-gray-400 bg-transparent hover:bg-gray-600"}`}
          style={{ padding: "3px 5px" }}
          onClick={() => handleCountryClick("usa")}
        >
          United States of America
        </span>
      </div>


      <div className="flex-grow relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between text-white gap-2" style={{ padding: 10 }}>
          <h1 className="text-white text-xl">
            Total: <span className="text-[#FFFF00]">{(currentTotal || 0).toLocaleString()}</span>
          </h1>
          <div className="text-sm sm:text-base text-gray-300">
            Current Region:&nbsp;
            {activeRegion ? (
              <span className="text-[#fef08a] font-semibold">
                {activeRegion.name} ({activeRegion.value.toLocaleString()})
              </span>
            ) : (
              <span>Hover over a region</span>
            )}
          </div>
        </div>
        <ComposableMap
          projection={
            selectedCountry === "usa"
              ? "geoAlbersUsa"
              : "geoMercator"
          }
          projectionConfig={projectionConfig}
          width={400}
          height={250}
          style={{ width: "100%", height: "auto" }}
        >


          {selectedCountry === "usa" && (
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const value = stateData[geo.id] || stateData[geo.properties?.NAME] || stateData[geo.properties?.name];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={value ? colorScale(value) : "#93c5fd"}
                      stroke="#111"
                      strokeWidth={0.3}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#FFD700", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(evt) =>
                        updateHoverInfo(evt, getRegionName(geo, geo.id), value || 0)
                      }
                      onMouseMove={(evt) =>
                        updateHoverInfo(evt, getRegionName(geo, geo.id), value || 0)
                      }
                      onMouseLeave={hideHoverInfo}
                    />
                  );
                })
              }
            </Geographies>
          )}

          {selectedCountry === "canada" && (
            <Geographies geography={canadaGeoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // province name could be in different property keys; check common ones
                  const rawName = geo.properties?.name || geo.properties?.NAME || geo.properties?.province || geo.properties?.prov_name || "";
                  const nameKey = rawName.toString().toLowerCase().trim();
                  const value = normalizedCanadaData[nameKey];

                  // DEBUG: uncomment to inspect province property names during dev
                  // console.log("CAN geo props:", geo.properties);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={value ? colorScale(value) : "#93c5fd"}
                      stroke="#111"
                      strokeWidth={0.3}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#FFD700", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(evt) =>
                        updateHoverInfo(evt, rawName, value || 0)
                      }
                      onMouseMove={(evt) =>
                        updateHoverInfo(evt, rawName, value || 0)
                      }
                      onMouseLeave={hideHoverInfo}
                    />
                  );
                })
              }
            </Geographies>
          )}

          {selectedCountry === "europe" && (
            <Geographies geography={europeGeoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const rawName = geo.properties?.NAME || geo.properties?.name || "";
                  const nameKey = rawName.toString().toLowerCase().trim();
                  const value = normalizedEuropeData[nameKey];

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={value ? colorScale(value) : "#93c5fd"}
                      stroke="#111"
                      strokeWidth={0.3}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#FFD700", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(evt) =>
                        updateHoverInfo(evt, rawName, value || 0)
                      }
                      onMouseMove={(evt) =>
                        updateHoverInfo(evt, rawName, value || 0)
                      }
                      onMouseLeave={hideHoverInfo}
                    />
                  );
                })
              }
            </Geographies>
          )}

        </ComposableMap>

        {hoverInfo.visible && (
          <div
            className="pointer-events-none absolute bg-[#111] text-white text-xs sm:text-sm px-3 py-2 rounded shadow-lg border border-[#333]"
            style={{ left: hoverInfo.x, top: hoverInfo.y }}
          >
            <div className="font-semibold">{hoverInfo.name}</div>
            <div className="text-[#FACC15]">
              {hoverInfo.value.toLocaleString()} engagements
            </div>
          </div>
        )}

      </div>

      <div className="flex justify-center gap-6 text-white text-xs mt-4">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="flex gap-2 items-center">
            <span>{level}</span>
            <div style={{ backgroundColor: colorScale(level), width: 12, height: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default USMap;


const PieChartBase = ({
  data,
  chartHeight = 250,
  chartWidth = 250,
  textColor = 'white',
  showInternalLabels = true,
}) => {
  const chartData = data.map((item, index) => ({
    id: index,
    value: item.value,
    label: item.label,
    color: item.color,
  }));

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 780);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
<Box
  sx={{
    display: 'flex',
    flexDirection: isSmallScreen ? 'column' : 'row',
    alignItems: "center",          // vertical center
    justifyContent: "center",      // horizontal center 👈 yeh important hai
    color: textColor,
    fontFamily: 'Montserrat, sans-serif',
    gap: isSmallScreen ? 2 : 4,    // chart aur legends ke beech gap
  }}
>      {/* Chart left */}
  <Box sx={{ flexShrink: 0, display: "flex", justifyContent: "center", width: chartWidth, height: chartHeight,    }}>
        <PieChart
          series={[
            {
              data: chartData,
        outerRadius: Math.min(chartWidth, chartHeight) / 2 - 10, // 👈 perfect circle radius
              innerRadius: 0,
              paddingAngle: 0,
              cornerRadius: 0,
              startAngle: -90,
              endAngle: 270,
              faded: { innerRadius: 30, outerRadius: 100, arcLabel: 'none' },
              arcLabel: (item) =>
                showInternalLabels ? `${item.value.toFixed(0)}` : '',
              arcLabelMinAngle: 20,
              arcLabelReference: 'inner',
            },
          ]}
          colors={chartData.map((item) => item.color)}
          // height={chartHeight}
          // layout={{ width: chartWidth, height: chartHeight }}
            width={chartWidth}   // 👈 set width
    height={chartHeight}
          slotProps={{
            legend: { hidden: true },
          }}
          sx={{
            '.MuiChartsLegend-root': {
              '& text': {
                fill: `${textColor} !important`,
                fontSize: 14,
              },
              '& .MuiChartsLegend-series': {
                '& text': {
                  fill: `${textColor} !important`,
                  fontSize: 14,
                },
              },
              '& .MuiChartsLegend-mark + text': {
                fill: `${textColor} !important`,
                fontSize: 14,
              },
            },
            '.MuiChartsLegend-series text': {
              fill: `${textColor} !important`,
              fontSize: 14,
            },
            '.MuiChartsLegend-root text': {
              fill: `${textColor} !important`,
              fontSize: 14,
            },
            '.MuiChartsArcLabel-root text': {
              fill: `${textColor} !important`,
              fontWeight: 'bold',
              fontSize: isSmallScreen ? 10 : 16,
            },
            '.MuiChartsArcLabel-root': {
              fill: `${textColor} !important`,
              fontWeight: 'bold',
              fontSize: isSmallScreen ? 10 : 16,
            },
            '.MuiChartsTooltip-root': {
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: `${textColor} !important`,
            },
            '.MuiChartsTooltip-root .MuiChartsTooltip-table': {
              color: `${textColor} !important`,
            },
            '.MuiChartsAxis-tickLabel': {
              fill: `${textColor} !important`,
            },
            '.MuiChartsAxis-line': {
              stroke: `${textColor} !important`,
            },
            '.MuiChartsLegend-mark': {
              borderRadius: '50%',
            },
            '& *': {
              color: `${textColor} !important`,
            },
            '& text': {
              fill: `${textColor} !important`,
            },
            '& .MuiChartsLegend-series': {
              '& text': {
                fill: `${textColor} !important`,
              },
            },
          }}
        />
      </Box>

      <Box  sx={{
      display: 'flex',
      flexWrap: "wrap",
      flexDirection: isSmallScreen ? 'row' : 'column',
      gap: isSmallScreen ? 1 : 1.5,
      mt: isSmallScreen ? 2 : 0,
      alignItems: isSmallScreen ? "center" : "flex-start",
    }}>
        {chartData.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 1.5,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                backgroundColor: item.color,
                borderRadius: '50%',
                marginRight: 1.5,
              }}
            />
            <Typography sx={{ color: textColor, fontSize: 12, fontFamily: 'Montserrat, sans-serif' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const BarChart = ({ data, height = 180 }) => {
  return (
    <Box
      sx={{
        height: height,
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
    >
      {data.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Box sx={{ display: "flex", height: "85%", alignItems: "flex-end" }}>
            {item.values.map((value, vIndex) => (
              <Box
                key={`${index}-${vIndex}`}
                sx={{
                  height: `${value}%`,
                  width: 8,
                  backgroundColor: item.colors[vIndex],
                  mx: 0.5,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              />
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ mt: 1, color: "#aaa", fontSize: "0.7rem" }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export {
  DashboardCard,
  TimeFilter,
  MetricCard,
  CircularProgressWithLabel,
  USMap,
  PieChartBase,
  BarChart,
};
