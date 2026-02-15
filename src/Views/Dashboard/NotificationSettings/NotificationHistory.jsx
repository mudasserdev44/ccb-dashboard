import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import CustomTable from '../../../components/CustomTable/CustomTable';
import { request } from '../../../services/axios';

// Column definitions with custom render functions
const notificationsColumns = [
  { 
    key: "createdAt", 
    label: "Date Sent",
    render: (row) => {
      const date = new Date(row.createdAt);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  {
    key: "type",
    label: "Type",
    render: (row) => (
      <Box
        sx={{
          backgroundColor: row.type === "email" ? "#81B0E2" : "#9575CD",
          color: "white",
          borderRadius: "16px",
          padding: "4px 12px",
          display: "inline-block",
          fontWeight: "bold",
          fontSize: "0.8rem",
          textTransform: "capitalize",
        }}
      >
        {row.type}
      </Box>
    ),
  },
  { key: "title", label: "Title" },
  {
    key: "recipients",
    label: "Sent To",
    render: (row) => {
      return row.recipients?.join(", ") || "N/A";
    }
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Box
        sx={{
          backgroundColor: row.status === "sent" ? "#2E7D32" : 
                          row.status === "pending" ? "#ED6C02" : "#D32F2F",
          color: "white",
          borderRadius: "16px",
          padding: "4px 12px",
          display: "inline-block",
          fontWeight: "bold",
          fontSize: "0.8rem",
          textTransform: "capitalize",
        }}
      >
        {row.status}
      </Box>
    ),
  },
  {
    key: "attachments",
    label: "Attachments",
    render: (row) => {
      const count = row.attachments?.length || 0;
      return count > 0 ? `${count} file(s)` : "None";
    }
  }
];

const NotificationHistory = () => {
  const token = useSelector((state) => state.admin.token);

  // Fetcher function for SWR
  const fetcher = async (url) => {
    const res = await request(
      {
        method: "get",
        url,
      },
      false,
      token
    );
    // Extract notifications array from response
    return res.data?.notifications || [];
  };

  // Use SWR for data fetching with automatic revalidation
  const { data: notifications, error, isLoading, mutate } = useSWR(
    token ? "adminnotifications/all" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#F0E82E",
          fontWeight: "bold",
          mb: 2,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        Notifications History
      </Typography>

      {/* Show loader while data is loading */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress sx={{ color: "#F0E82E" }} />
        </Box>
      ) : error ? (
        // Show error if API fails
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load notifications. Please try again later.
        </Alert>
      ) : notifications && notifications.length > 0 ? (
        // Show table when data is available
        <CustomTable
          columns={notificationsColumns}
          data={notifications}
          rowsPerPage={10}
          onRefresh={() => mutate()}
        />
      ) : (
        // Show empty state when no data
        <Box
          sx={{
            textAlign: "center",
            color: "#999",
            padding: "40px",
          }}
        >
          <Typography>No notifications found.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotificationHistory;