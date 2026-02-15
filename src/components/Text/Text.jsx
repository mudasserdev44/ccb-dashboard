import { Typography } from "@mui/material";
import React from "react";

const Text = ({ children, ...props }) => {
  return (
    <Typography fontFamily="poppins" {...props}>
      {children}
    </Typography>
  );
};

export default Text;
