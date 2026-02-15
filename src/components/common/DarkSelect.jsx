// src/components/common/DarkSelect.jsx
import React from "react";
import { styled, Select } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";

const StyledSelect = styled((props) => (
    <Select
        {...props}
        IconComponent={(iconProps) => (
            <IoIosArrowDown
                {...iconProps}
                style={{
                    color: "#CFCFCF",
                    fontSize: "18px",
                    marginRight: "8px",
                }}
            />
        )}
    />
))(() => ({
    color: "white",
    fontFamily: "Montserrat, sans-serif",
    "& .MuiSelect-select": {
        padding: "8px 14px",
        minHeight: "unset",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#555",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#777",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#D4AF37",
    },
}));

const DarkSelect = ({ children, ...props }) => {
    return <StyledSelect {...props}>{children}</StyledSelect>;
};

export default DarkSelect;
