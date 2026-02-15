import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CustomTable from '../../../components/CustomTable/CustomTable';
import DarkSelect from '../../../components/common/DarkSelect';
import DarkTextField from '../../../components/common/DarkTextField';
import { getOverviewColumns } from '../../../utils/sharedData';
import { request } from '../../../services/axios';
import { useSelector } from 'react-redux';
import { mutate } from 'swr';

// ===== Main Component =====
const NewUgc = ({ ugc_data, loading, onRefresh }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Category');
  const [originalData, setOriginalData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useSelector((state)=>state.admin.token);

  // Set data when ugc_data is available
  useEffect(() => {
    if (ugc_data && Array.isArray(ugc_data?.data?.coupons)) {
      const formatted = ugc_data?.data?.coupons?.map((item) => ({
        id: item._id,
        created: new Date(item.createdAt).toLocaleDateString(),
        username: item.createdBy?.name || "Unknown",
        phone: item?.createdBy?.phone,
        category: item.category?.name || "N/A",
        title: item.title,
        description: item.description,
        status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pending",
      }));

      setData(formatted);
      setOriginalData(formatted); // Save original
    }
  }, [ugc_data]);

  // Extract all unique categories
  const allCategories = useMemo(() => {
    const categories = data.map(d => d.category);
    return ['All Category', ...new Set(categories)];
  }, [data]);

  // Handle filtering & searching
  const filteredData = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return data.filter(row => {
      const matchesSearch =
        row.username.toLowerCase().includes(lowerCaseSearch) ||
        row.title.toLowerCase().includes(lowerCaseSearch) ||
        row.description.toLowerCase().includes(lowerCaseSearch);

      const matchesCategory =
        categoryFilter === 'All Category' || row.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, categoryFilter]);

  // Handle status change
  const handleStatusChange = (event, id) => {
    const updatedData = data.map(row =>
      row.id === id ? { ...row, status: event.target.value } : row
    );
    setData(updatedData);
  };

  const getRowColor = (status) => {
    if (status === 'Approve') return '#2E7D32';
    if (status === 'Reject') return '#D32F2F';
    return '#171717';
  };

  const overviewColumns = getOverviewColumns(handleStatusChange);

  const handleApplyChanges = async() => {
    const changedRows = data.filter((item, index) => {
      return item.status !== originalData[index].status;
    });

    if (changedRows.length === 0) {
      alert('No changes to apply');
      return;
    }

    const row = changedRows[0]; 
    const requestData = {
      couponId: row.id,
      status: row?.status?.toLowerCase()
    };

    setIsSubmitting(true);

    try {
      const res = await request({
        method: "post",
        url: "coupons/admin/approve",
        data: requestData
      }, false, token);

      // Refetch the data after successful API call
      await mutate('admin/new');

      // Optional: Show success message
      console.log('Changes applied successfully');
    } catch(err) {
      console.error('Error applying changes:', err);
      // Optional: Show error message to user
      alert('Failed to apply changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset data to original state
    setData([...originalData]);
    setSearchTerm('');
    setCategoryFilter('All Category');
  };

  // ===== Loader State =====
  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: '#171717',
          borderRadius: '8px',
          p: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
        }}
      >
        <CircularProgress sx={{ color: '#D4AF37' }} size={60} />
      </Box>
    );
  }

  // ===== Main UI =====
  return (
    <Box
      sx={{
        backgroundColor: '#171717',
        borderRadius: '8px',
        padding: '24px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* Search + Filter */}
      <Box sx={{ display: 'flex', flexWrap: "wrap", justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <Box sx={{ flexGrow: 1, maxWidth: '500px' }}>
          <DarkTextField
            variant="outlined"
            placeholder="Search by username, title, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { height: 40, paddingLeft: 1 },
            }}
          />
        </Box>

        <Box sx={{ minWidth: 150 }}>
          <DarkSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Category filter' }}
            sx={{
              height: 40,
              width: "100%",
              '& .MuiSelect-select': { padding: '8px 14px' },
            }}
          >
            {allCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </DarkSelect>
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: '#171717', color: 'white' }}>
        <CustomTable
          columns={overviewColumns}
          data={filteredData}
          getRowColor={(row) => getRowColor(row.status)}
          rowsPerPage={7}
          onRefresh={onRefresh}
        />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleCancel}
          disabled={isSubmitting}
          sx={{
            backgroundColor: 'transparent',
            border: '2px solid red',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontFamily: 'Montserrat, sans-serif',
            '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
            '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleApplyChanges}
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#2E7D32',
            '&:hover': { backgroundColor: '#1B5E20' },
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontFamily: 'Montserrat, sans-serif',
            '&:disabled': { backgroundColor: '#1B5E20', opacity: 0.7 },
            minWidth: '140px',
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Apply Changes'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default NewUgc;
