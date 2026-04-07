import { Box, Grid, Typography, Skeleton } from "@mui/material";


export const SkeletonBox = ({ height = 20, width = "100%", borderRadius = 6, mb = 0 }) => (
  <Skeleton
    variant="rectangular"
    width={width}
    height={height}
    sx={{
      bgcolor: "#2a2a2a",
      borderRadius: `${borderRadius}px`,
      marginBottom: `${mb}px`,
    }}
    animation="wave"
  />
);

export const SkeletonCircle = ({ size = 90 }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    sx={{ bgcolor: "#2a2a2a" }}
    animation="wave"
  />
);

// Revenue Bar Chart Skeleton
export const RevenueChartSkeleton = () => (
  <Box sx={{ background: "#1e1e1e", borderRadius: "10px", padding: "16px", height: "280px" }}>
    <SkeletonBox height={240} borderRadius={8} />
  </Box>
);

// Revenue Cards Skeleton
export const RevenueCardsSkeleton = () => (
  <Box sx={{ background: "#1e1e1e", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: 2 }}>
    <Box sx={{ background: "#262626", borderRadius: "8px", padding: "16px" }}>
      <SkeletonBox height={14} width="60%" mb={10} />
      <SkeletonBox height={28} width="80%" mb={8} />
      <SkeletonBox height={14} width="40%" />
    </Box>
    <Box sx={{ background: "#262626", borderRadius: "8px", padding: "16px" }}>
      <SkeletonBox height={14} width="60%" mb={10} />
      <SkeletonBox height={28} width="80%" mb={8} />
      <SkeletonBox height={14} width="40%" />
    </Box>
  </Box>
);

// Sales/Profits Circular Skeleton
export const SalesProfitSkeleton = () => (
  <Box sx={{ background: "#1e1e1e", borderRadius: "10px", padding: "16px", height: "260px" }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", height: "100%", flexWrap: "wrap" }}>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <SkeletonCircle size={90} />
          <SkeletonBox height={14} width={50} />
          <SkeletonBox height={12} width={60} />
        </Box>
      ))}
    </Box>
  </Box>
);

// Map Skeleton
export const MapSkeleton = () => (
  <Box sx={{ background: "#1e1e1e", borderRadius: "10px", padding: "16px", height: "260px" }}>
    <SkeletonBox height={220} borderRadius={8} />
  </Box>
);

// Bar Chart (Coupons) Skeleton
export const BarChartSkeleton = () => (
  <Box sx={{ background: "#1e1e1e", borderRadius: "10px", padding: "16px", height: "320px" }}>
    <SkeletonBox height={14} width="70%" mb={20} />
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "220px", paddingTop: "10px" }}>
      {[60, 90, 50, 110, 80, 70, 100].map((h, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width="100%"
          height={`${h}px`}
          sx={{ bgcolor: "#2a2a2a", borderRadius: "4px" }}
          animation="wave"
        />
      ))}
    </Box>
  </Box>
);

// Pie Chart Skeleton
export const PieChartSkeleton = () => (
  <Box sx={{ background: "#1e1e1e", borderRadius: "10px", padding: "16px", height: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
    <SkeletonCircle size={160} />
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SkeletonCircle size={12} />
          <SkeletonBox height={12} width="60%" />
        </Box>
      ))}
    </Box>
  </Box>
);

// Age Segments Skeleton
export const AgeSegmentsSkeleton = () => (
  <Box sx={{ background: "#1e1e1e", borderRadius: "10px", padding: "16px", height: "320px" }}>
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: "14px", height: "260px", paddingTop: "10px" }}>
      {[80, 120, 100, 60, 90, 140].map((h, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width="100%"
          height={`${h}px`}
          sx={{ bgcolor: "#2a2a2a", borderRadius: "4px" }}
          animation="wave"
        />
      ))}
    </Box>
  </Box>
);

// ─── Section Title ─────────────────────────────────────────────────────────────

export const SectionTitle = ({ children }) => (
  <Typography
    variant="h5"
    component="div"
    sx={{
      color: "#FFFF00",
      fontWeight: "bold",
      paddingY: "10px",
      fontFamily: "Montserrat, sans-serif",
    }}
  >
    {children}
  </Typography>
);