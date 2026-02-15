import { Box } from "@mui/material";
import React from "react";

const CenteredBox = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
