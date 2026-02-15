import { Typography } from "@mui/material";
import React from "react";

const Underlined = ({ children, clr, txt_clr }) => {
  return (
    <Typography
      sx={{
        fontWeight: "bold",
        ml: 2,
        color: txt_clr,
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
          bottom: 0,
          height: "3px",
          backgroundColor: clr,
        },
      }}
    >
      {children}
    </Typography>
  );
};

export default Underlined;
