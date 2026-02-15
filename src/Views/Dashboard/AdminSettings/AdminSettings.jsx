import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { RiDeleteBin2Line, RiEditLine } from "react-icons/ri";
import useSWR from 'swr';
import CustomTable from '../../../components/CustomTable/CustomTable';
import CreateAdminModal from './CreateAdminModal';
import { request } from '../../../services/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const token = useSelector((state) => state.admin.token);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const handleOpen = () => {
    setEditingUser(null);
    setOpen(true);
  };
  
  const handleClose = () => {
    setEditingUser(null);
    setOpen(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setOpen(true);
  };

  // Fetcher function for SWR
  const fetcher = async () => {
    const res = await request({
      method: "get",
      url: "admin/users"
    }, false, token);
    return res.data.users;
  };

  // Use SWR for data fetching
  const { data: users, error, isLoading, mutate } = useSWR(
    token ? 'admin/users' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Delete user handler
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await request({
        method: "delete",
        url: `admin/users/${userId}`
      }, false, token);
      
      toast.success('User deleted successfully');
      mutate(); // Refetch data
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Map role to display name
  const getRoleDisplay = (role) => {
    const roleMap = {
      'admin': 'Admin',
      'manager': 'Manager',
      'developer': 'Developer',
      'super_admin': 'Super Admin'
    };
    return roleMap[role] || role;
  };

  // Map API response to table format
  const adminData = users?.map(user => ({
    dateCreated: formatDate(user.createdAt),
    name: user.name,
    email: user.email,
    accessType: getRoleDisplay(user.role),
    role: user.role, // Keep original role for operations
    isActive: user.isActive,
    userId: user._id,
  })) || [];

  const adminColumns = [
    { key: "dateCreated", label: "Date created" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "accessType",
      label: "Access Type",
      render: (row) => (
        <Box
          sx={{
            backgroundColor: 
              row.accessType === "Super Admin" ? "#9575CD" : 
              row.accessType === "Manager" ? "#FF9800" :
              row.accessType === "Developer" ? "#2196F3" :
              "#FFC107",
            color: row.accessType === "Developer" || row.accessType === "Super Admin" ? "white" : "black",
            borderRadius: "16px",
            padding: "4px 12px",
            display: "inline-block",
            fontWeight: "bold",
            fontSize: "0.8rem",
          }}
        >
          {row.accessType}
        </Box>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <Box
          sx={{
            backgroundColor: row.isActive ? "#4CAF50" : "#757575",
            color: "white",
            borderRadius: "16px",
            padding: "4px 12px",
            display: "inline-block",
            fontWeight: "bold",
            fontSize: "0.8rem",
          }}
        >
          {row.isActive ? "Active" : "Inactive"}
        </Box>
      ),
    },
    {
      key: "manageAdmin",
      label: "Manage Admin",
      align: "center",
      render: (row) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Edit Icon */}
          <RiEditLine
            size={26}
            style={{
              cursor: "pointer",
              color: "#4CAF50",
            }}
            onClick={() => handleEdit(row)}
          />

          {/* Delete Icon */}
          <RiDeleteBin2Line
            size={26}
            style={{
              cursor: row.role !== "super_admin" ? "pointer" : "not-allowed",
              color: row.role !== "super_admin" ? "red" : "#666",
            }}
            onClick={() => {
              if (row.role !== "super_admin") {
                handleDelete(row.userId);
              }
            }}
          />
        </Box>
      ),
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          backgroundColor: "#171717",
          borderRadius: "8px",
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress sx={{ color: "#2E7D32" }} size={60} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "#171717",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <Typography variant="h6" sx={{ color: "red", textAlign: "center" }}>
          Error loading users. Please try again.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => mutate()}
            sx={{
              backgroundColor: "#2E7D32",
              "&:hover": { backgroundColor: "#1B5E20" },
            }}
          >
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      {/* Title */}
      <Typography variant="h5" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
        User List
      </Typography>

      {/* The Admin Table */}
      <CustomTable
        columns={adminColumns}
        data={adminData}
        rowsPerPage={3}
      />

      {/* The Create New Admin Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: "#2E7D32",
            "&:hover": { backgroundColor: "#1B5E20" },
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "8px",
            padding: "10px 24px",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Create new admin
        </Button>
      </Box>
      
      <CreateAdminModal
        open={open}
        handleClose={handleClose}
        editingUser={editingUser}
        onSuccess={() => mutate()}
      />
    </Box>
  );
};

export default AdminSettings;