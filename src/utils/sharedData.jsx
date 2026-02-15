import React from "react";
import StatusSelect from "../components/common/StatusSelect";
import { Box, Typography, MenuItem, IconButton } from "@mui/material";
import { FiEye } from "react-icons/fi";
import { OverdueChip } from "./styles";
import CategoryChip from "../Views/Dashboard/FutureOpportunities/CategoryChip";

export const getOverviewColumns = (handleStatusChange) => [
  { key: "created", label: "Created" },
  { key: "username", label: "Username" },
  { key: "phone", label: "Phone no." },
  { key: "category", label: "Category" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusSelect
        value={row.status}
        onChange={(e) => handleStatusChange(e, row.id)}
        displayEmpty
        sx={{
          minWidth: 120,
          "& fieldset": { border: "none" },
        }}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Approved">Approve</MenuItem>
        <MenuItem value="Rejected">Reject</MenuItem>
      </StatusSelect>
    ),
  },
];

export const getColumnsFutureOpp = (openModalHandler) => [
  {
    key: "title",
    label: "Title and Description",
    render: (row) => (
      <Box textAlign="left">
        <Typography color="white" fontWeight="bold">
          {row.title}
        </Typography>
        <Typography color="#FDE68A" fontSize="0.8rem">
          {row.description}
        </Typography>
      </Box>
    ),
  },
  {
    key: "category",
    label: "Category",
    render: (row) => (
      <Box display="flex" justifyContent="center">
        <CategoryChip label={row.category} />
      </Box>
    ),
  },
  { key: "created", label: "Created" },
  {
    key: "reminder",
    label: "Reminder",
    render: (row) => (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography color="white">
          {row.reminder === "Overdue" ? row.dueDate : row.reminder}
        </Typography>
        {row.reminder === "Overdue" && <OverdueChip>Overdue</OverdueChip>}
      </Box>
    ),
  },
  { key: "contact", label: "Contact" },
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <IconButton
        onClick={() => openModalHandler(row)}
        sx={{ color: "#FFFFFF" }}
      >
        <FiEye />
      </IconButton>
    ),
  },
];