import { Typography } from "@mui/material";
import React from "react";

const Description = ({ children, ...props }) => {
  return (
    <Typography sx={{ color: "#afafaf", fontFamily: "poppins", ...props.sx }}>
      {children}
    </Typography>
  );
};

export default Description;
