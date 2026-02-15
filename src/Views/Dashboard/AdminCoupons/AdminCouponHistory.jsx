import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import CustomTable from '../../../components/CustomTable/CustomTable';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaRecycle } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { request } from '../../../services/axios';
import ConfirmationDialog from '../../../components/ConfirmationDialog/ConfirmationDialog';
import ToastComp from '../../../components/toast/ToastComp';

const AdminCouponHistory = () => {
  const token = useSelector((state) => state.admin.token);
  const [localChanges, setLocalChanges] = useState({});
  const [loadingCoupons, setLoadingCoupons] = useState({});
  const [dialogState, setDialogState] = useState({
    open: false,
    type: null,
    couponId: null,
    title: '',
    message: '',
  });

  // SWR fetcher function
  const fetcher = async (url) => {
    const res = await request({
      method: "get",
      url: url,
    }, false, token);
    return res.data;
  };

  // Fetch data with SWR
  const { data: apiData, error, isLoading, mutate } = useSWR(
    token ? 'admin/unpublished' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const tableData = useMemo(() => {
    if (!apiData) return [];

    return apiData?.coupons?.map((coupon) => ({
      id: coupon._id,
      created: new Date(coupon.createdAt).toLocaleDateString('en-US'),
      category: coupon.category?.name || 'N/A',
      title: coupon.title,
      description: coupon.description,
      manage: localChanges[coupon._id] || 'Pending',
      image: coupon.image,
      status: coupon.status,
    }));
  }, [apiData, localChanges]);

  const handleDeleteClick = (couponId) => {
    setDialogState({
      open: true,
      type: 'delete',
      couponId: couponId,
      title: 'Delete Coupon',
      message: 'Are you sure you want to delete this coupon? This action cannot be undone.',
    });
  };

  const handlePublishClick = (couponId) => {
    setDialogState({
      open: true,
      type: 'publish',
      couponId: couponId,
      title: 'Publish Coupon',
      message: 'Are you sure you want to publish this coupon?',
    });
  };

  const handleDialogClose = () => {
    setDialogState({
      open: false,
      type: null,
      couponId: null,
      title: '',
      message: '',
    });
  };

  const publishCoupon = async (id) => {
    const data = {
      couponId: id,
      published: true
    };
    
    try {
      const res = await request({
        url: "/admin/publish",
        method: "post",
        data: data
      }, false, token);
      ToastComp({
        message:"Coupon Published",
        variant:"success"
      })
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const handleDialogConfirm = async () => {
    const { type, couponId } = dialogState;

    console.log("Coupon ID:", couponId);
    console.log("Action:", type === "delete" ? "Deleted" : "Published");

    // Set loading state for this specific coupon
    setLoadingCoupons(prev => ({
      ...prev,
      [couponId]: true
    }));

    handleDialogClose();

    if (type === 'delete') {
      setLocalChanges(prev => ({
        ...prev,
        [couponId]: 'Deleted'
      }));
      
      // Remove loading state
      setLoadingCoupons(prev => ({
        ...prev,
        [couponId]: false
      }));
    } else if (type === 'publish') {
  setLocalChanges(prev => ({
    ...prev,
    [couponId]: 'Moved to Default Coupons'
  }));

  try {
    await publishCoupon(couponId);

    mutate();
  } catch (error) {
    console.error("Publish failed:", error);

    setLocalChanges(prev => {
      const updated = { ...prev };
      delete updated[couponId]; //rollback
      return updated;
    });
  } finally {
    setLoadingCoupons(prev => ({
      ...prev,
      [couponId]: false
    }));
  }
}
  };

  const handleSave = async () => {
    console.log('Saving changes:', localChanges);
    // After successful save, you can mutate SWR data
    // await mutate();
  };

  const handleCancel = () => {
    setLocalChanges({});
  };

  const getRowColor = (status) => {
    if (status === 'Deleted') return '#440000';
    if (status === 'Moved to Default Coupons') return '#002244';
    return '';
  };

  const couponsColumns = [
    {
      key: "created",
      label: "Created",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const isLoading = loadingCoupons[row.id];
        const isDisabled = isLoading || Object.keys(loadingCoupons).some(key => loadingCoupons[key]);

        return (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Tooltip title={isDisabled ? "Processing..." : "Publish Coupon"} placement="top">
              <span>
                <IconButton
                  onClick={() => handlePublishClick(row.id)}
                  disabled={isDisabled}
                  sx={{
                    color: isDisabled ? '#666' : '#66BB6A',
                    '&:hover': {
                      backgroundColor: isDisabled ? 'transparent' : '#66BB6A20',
                      transform: isDisabled ? 'none' : 'scale(1.1)',
                    },
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: '#66BB6A' }} />
                  ) : (
                    <FaRecycle style={{ fontSize: '1.5rem' }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title={isDisabled ? "Processing..." : "Delete Coupon"} placement="top">
              <span>
                <IconButton
                  onClick={() => handleDeleteClick(row.id)}
                  disabled={isDisabled}
                  sx={{
                    color: isDisabled ? '#666' : '#F44336',
                    '&:hover': {
                      backgroundColor: isDisabled ? 'transparent' : '#F4433620',
                      transform: isDisabled ? 'none' : 'scale(1.1)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <DeleteIcon style={{ fontSize: '1.5rem' }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          backgroundColor: '#171717',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#D4AF37' }} size={50} />
          <Typography sx={{ color: 'white', mt: 2, fontFamily: 'Montserrat, sans-serif' }}>
            Loading coupons...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: '#171717',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography sx={{ color: '#F44336', fontFamily: 'Montserrat, sans-serif' }}>
          Error loading coupons. Please try again.
        </Typography>
      </Box>
    );
  }

  // Empty state
  if (!tableData || tableData.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: '#171717',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography sx={{ color: 'white', fontFamily: 'Montserrat, sans-serif' }}>
          No unpublished coupons found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#171717',
        borderRadius: '8px',
        padding: '24px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#171717',
          color: 'white',
          '& .MuiTable-root': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <CustomTable
          columns={couponsColumns}
          data={tableData}
          rowsPerPage={5}
          getRowStyle={(row) => ({
            backgroundColor: getRowColor(row.manage),
          })}
          onRefresh={() => mutate()}
        />
      </Box>

      {/* Buttons at the bottom */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleCancel}
          disabled={Object.keys(localChanges).length === 0}
          sx={{
            backgroundColor: '#444',
            '&:hover': { backgroundColor: '#555' },
            '&:disabled': { backgroundColor: '#222', color: '#666' },
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={Object.keys(localChanges).length === 0}
          sx={{
            backgroundColor: '#2E7D32',
            '&:hover': { backgroundColor: '#1B5E20' },
            '&:disabled': { backgroundColor: '#1B3B1D', color: '#666' },
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
          }}
        >
          Save
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogState.open}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.type === 'delete' ? 'Delete' : 'Publish'}
        cancelText="Cancel"
        type={dialogState.type}
      />
    </Box>
  );
};

export default AdminCouponHistory;
