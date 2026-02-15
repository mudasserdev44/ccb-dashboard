import { Typography } from "@mui/material";
import React from "react";

const SubHeading = ({ children, color = "primary" }) => {
  return (
    <Typography
      sx={{ fontWeight: "bold", fontFamily: "poppins" }}
      color={color}
    >
      {children}
    </Typography>
  );
};

export default SubHeading;
