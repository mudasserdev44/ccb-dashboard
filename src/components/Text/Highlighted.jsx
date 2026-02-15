import { PropaneSharp } from "@mui/icons-material";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const Highlighted = ({ children, bg, clr, ...props }) => {
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
    variant = "h6"; // Default variant if none of the conditions match
  }

  return (
    <Typography
      variant={variant}
      sx={{
        background: bg,
        color: clr,
        display: "inline",
        ml: 1,
        borderRadius: "6px",
        fontWeight: "bold",
        fontFamily: "Poppins",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Highlighted;
