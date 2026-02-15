import { Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const Heading = ({ children, clr = "#fff", ...props }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  let variant;
  if (isLargeScreen) {
    variant = "h3";
  } else if (isMediumScreen) {
    variant = "h4";
  } else if (isSmallScreen) {
    variant = "h5";
  } else {
    variant = "h6";
  }

  return (
    <Typography
      variant={variant}
      fontWeight="bold"
      color={clr}
      fontFamily="Poppins"
      lineHeight={1.5}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Heading;
