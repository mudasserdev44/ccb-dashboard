import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    Select,
    MenuItem,
    styled,
    TextField,
    InputAdornment,
    Checkbox,
    CircularProgress,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CustomTable from '../../../components/CustomTable/CustomTable';
import { FaRecycle } from 'react-icons/fa6';
import { IoIosArrowDown } from "react-icons/io";
import DarkSelect from '../../../components/common/DarkSelect';
import DarkTextField from '../../../components/common/DarkTextField';

// ===== Main Component =====
const ApprovedUgc = ({ approved_data, loading }) => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Category');
    const [selectedRows, setSelectedRows] = useState([]);

    // Load approved data when available
    useEffect(() => {
        if (approved_data && Array.isArray(approved_data?.data?.coupons)) {
            const formatted = approved_data.data.coupons
                .filter(item => (item.status || '').toLowerCase() === "approved")
                .map((item) => ({
                    id: item._id,
                    created: new Date(item.createdAt).toLocaleDateString(),
                    username: item.createdBy?.name || "Unknown",
                    phone: item.createdBy?.phone || "N/A",
                    category: item.category?.name || "N/A",
                    title: item.title,
                    description: item.description,
                    noofuses: item.usageCount || "N/A",
                    status: "Approved",
                }));
            setData(formatted);
        }
    }, [approved_data]);

    // All categories
    const allCategories = useMemo(() => {
        const categories = data.map(d => d.category);
        return ['All Category', ...new Set(categories)];
    }, [data]);

    // Filtered data
    const filteredData = useMemo(() => {
        const lower = searchTerm.toLowerCase();
        return data.filter(row => {
            const matchesSearch =
                row.username.toLowerCase().includes(lower) ||
                row.title.toLowerCase().includes(lower) ||
                row.description.toLowerCase().includes(lower);
            const matchesCategory =
                categoryFilter === 'All Category' || row.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [data, searchTerm, categoryFilter]);

    // Handle row select
    const handleRowToggle = useCallback((id) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    }, []);

    // Handle select all on page
    const handleSelectAll = useCallback((pageIds, isAllSelected) => {
        setSelectedRows(prev => {
            if (isAllSelected) {
                return prev.filter(id => !pageIds.includes(id));
            } else {
                const newSelected = new Set(prev);
                pageIds.forEach(id => newSelected.add(id));
                return Array.from(newSelected);
            }
        });
    }, []);

    // Highlight selected rows
    const getRowColor = useCallback(
        (row) => (selectedRows.includes(row.id) ? '#2e2e2e' : '#171717'),
        [selectedRows]
    );

    // ===== Loader =====
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

    // ===== Table Columns =====
    const approvedColumns = [
        {
            key: "select",
            label: "",
            render: (row) => (
                <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowToggle(row.id)}
                    sx={{
                        color: '#FEF08A',
                        '&.Mui-checked': {
                            color: '#16A34A',
                        },
                    }}
                />
            ),
        },
        { key: "created", label: "Created" },
        { key: "username", label: "Username" },
        { key: "phone", label: "Phone No." },
        { key: "category", label: "Category" },
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        { key: "noofuses", label: "No. of uses" },
        {
            key: "status",
            label: "Status",
            render: () => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: '#66BB6A',
                    }}
                >
                    <FaRecycle
                        style={{
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            transition: '0.2s',
                        }}
                    />
                </Box>
            ),
        },
    ];

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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 3, gap: 2 }}>
                <Box sx={{ flexGrow: 1, maxWidth: '500px' }}>
                    <DarkTextField
                        variant="outlined"
                        placeholder="Search coupons by username, title, or description"
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
                            borderRadius: "10px",
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

            {/* Table or No Data Message */}
            {filteredData.length === 0 ? (
                <Box
                    sx={{
                        backgroundColor: '#171717',
                        borderRadius: '8px',
                        p: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#87888C',
                            fontFamily: 'Montserrat, sans-serif',
                            textAlign: 'center',
                        }}
                    >
                        No data available
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ backgroundColor: '#171717', color: 'white' }}>
                    <CustomTable
                        columns={approvedColumns}
                        data={filteredData}
                        rowsPerPage={6}
                        getRowColor={getRowColor}
                        selectedRows={selectedRows}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            )}

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                <Button
                    variant="contained"
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
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#2E7D32',
                        '&:hover': { backgroundColor: '#1B5E20' },
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '10px 24px',
                        fontFamily: 'Montserrat, sans-serif',
                    }}
                >
                    Move to Default Coupons
                </Button>
            </Box>
        </Box>
    );
};

export default ApprovedUgc;