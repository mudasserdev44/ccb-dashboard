import { styled } from "@mui/material";
import React from "react";
const StyledImage = styled("img")(({ theme }) => ({}));

const Image = ({ src, ...props }) => {
  return <StyledImage src={src} {...props} />;
};

export default Image;
