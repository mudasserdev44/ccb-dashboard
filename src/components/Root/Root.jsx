import { Box } from "@mui/material";
import React from "react";

const Root = ({ children, p, h = "80vh", ...props }) => {
  return <Box sx={{ p: p, height: h, ...props.sx }}>{children}</Box>;
};

export default Root;
