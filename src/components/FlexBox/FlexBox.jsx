import { Box } from "@mui/material";
import React from "react";

const FlexBox = ({ children, ...props }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", ...props.sx }}>
      {children}
    </Box>
  );
};

export default FlexBox;
