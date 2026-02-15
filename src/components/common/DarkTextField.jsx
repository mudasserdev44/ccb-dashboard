// src/components/common/DarkTextField.jsx
import React from "react";
import { styled, TextField } from "@mui/material";

const StyledTextField = styled(TextField)(() => ({
    width: "100%",
    "& .MuiInputBase-root": {
        color: "white",
        backgroundColor: "#2e2e2e",
        borderRadius: "8px",
        height: "40px",
        padding: "0 8px",
        fontFamily: "Montserrat, sans-serif",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#555",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#777",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#87888C",
    },
    "& .MuiInputAdornment-root": {
        color: "#87888C",
    },
}));

const DarkTextField = (props) => {
    return <StyledTextField {...props} />;
};

export default DarkTextField;
