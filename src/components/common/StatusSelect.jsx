// src/components/common/StatusSelect.jsx
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
                    color: "#D4AF37",
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

const StatusSelect = ({ children, ...props }) => {
    return <StyledSelect {...props}>{children}</StyledSelect>;
};

export default StatusSelect;
