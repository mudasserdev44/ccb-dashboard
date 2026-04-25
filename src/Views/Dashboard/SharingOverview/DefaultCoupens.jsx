import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Checkbox,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CustomTable from '../../../components/CustomTable/CustomTable';
import { FaRecycle } from "react-icons/fa";
import DarkSelect from '../../../components/common/DarkSelect';
import DarkTextField from '../../../components/common/DarkTextField';
import ConfirmationDialog from '../../../components/ConfirmationDialog/ConfirmationDialog';
import ToastComp from '../../../components/toast/ToastComp';
import { request } from '../../../services/axios';
import { useSelector } from 'react-redux';
import { MenuItem } from '@mui/material';

const getStatusBadgeStyle = (source) => {
    let backgroundColor, textColor;
    if (source === 'Admin') {
        backgroundColor = '#7E57C2';
        textColor = 'white';
    } else if (source === 'UGC') {
        backgroundColor = '#FFC107';
        textColor = 'black';
    } else {
        backgroundColor = '#444';
        textColor = 'white';
    }

    return {
        backgroundColor,
        color: textColor,
        padding: '4px 10px',
        borderRadius: '20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        display: 'inline-block',
        minWidth: '60px',
        textAlign: 'center',
        fontFamily: 'Montserrat, sans-serif',
    };
};

const DefaultCoupons = ({ default_data, loading, mutate }) => {
    const token = useSelector((state) => state.admin.token);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [loadingCoupons, setLoadingCoupons] = useState({});
    const [bulkLoading, setBulkLoading] = useState(false);

    // Single publish dialog
    const [dialogState, setDialogState] = useState({
        open: false,
        couponId: null,
        title: '',
        message: '',
    });

    // Bulk publish dialog
    const [bulkDialogState, setBulkDialogState] = useState({
        open: false,
        title: '',
        message: '',
    });

    // Load default data when available
    useEffect(() => {
        if (default_data && Array.isArray(default_data?.data?.coupons)) {
            const formatted = default_data.data.coupons.map((item) => ({
                id: item._id,
                created: new Date(item.createdAt).toLocaleDateString(),
                username: item.createdBy?.name || "Unknown",
                phone: item.createdBy?.phone || "N/A",
                category: item.category?.name || "N/A",
                title: item.title,
                description: item.description,
                source: item.source || "Admin",
                uses: item.usageCount || 0,
            }));
            setData(formatted);
        }
    }, [default_data]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const allCategories = useMemo(() => {
        const categories = data.map(d => d.category);
        return [...new Set(categories)];
    }, [data]);

    const filteredData = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return data.filter(row => {
            const matchesSearch = searchTerm === '' ||
                row.username.toLowerCase().includes(lowerCaseSearchTerm) ||
                row.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                row.description.toLowerCase().includes(lowerCaseSearchTerm);
            const matchesCategory = selectedCategory === '' || row.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [data, searchTerm, selectedCategory]);

    const handleRowToggle = useCallback((id) => {
        setSelectedRows(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(rowId => rowId !== id)
                : [...prevSelected, id]
        );
    }, []);

    const handleSelectAll = useCallback((pageIds, isAllCurrentlySelected) => {
        setSelectedRows(prevSelected => {
            if (isAllCurrentlySelected) {
                return prevSelected.filter(id => !pageIds.includes(id));
            } else {
                const newSelected = new Set(prevSelected);
                pageIds.forEach(id => newSelected.add(id));
                return Array.from(newSelected);
            }
        });
    }, []);

    const getRowColor = useCallback((row) => {
        return selectedRows.includes(row.id) ? '#2e2e2e' : '#171717';
    }, [selectedRows]);

    // ─── Single publish ───────────────────────────────────────────────────────

    const handlePublishClick = (couponId) => {
        setDialogState({
            open: true,
            couponId,
            title: 'Unpublish Coupon',
            message: 'Are you sure you want to unpublish this coupon?',
        });
    };

    const handleDialogClose = () => {
        setDialogState({ open: false, couponId: null, title: '', message: '' });
    };

    const publishCoupon = async (id) => {
        return await request(
            { url: "/admin/publish", method: "post", data: { couponIds: id, published: false } },
            false,
            token
        );
    };

    const handleDialogConfirm = async () => {
        const { couponId } = dialogState;

        setLoadingCoupons(prev => ({ ...prev, [couponId]: true }));
        handleDialogClose();

        const previousData = data;

        try {
            await publishCoupon(couponId);

            setData(prev => prev.filter(item => item.id !== couponId));

            ToastComp({ message: "Coupon Unpublished Successfully", variant: "success" });

            if (mutate) {
                try { await mutate(); } catch (mErr) { console.warn('mutate() failed:', mErr); }
            }
        } catch (error) {
            console.error("Publish failed:", error);
            setData(previousData);
            ToastComp({ message: "Failed to unpublish coupon", variant: "error" });
        } finally {
            setLoadingCoupons(prev => {
                const next = { ...prev };
                delete next[couponId];
                return next;
            });
        }
    };

    // ─── Bulk publish (bottom button) ────────────────────────────────────────

    const handleBulkPublishClick = () => {
        setBulkDialogState({
            open: true,
            title: 'Unpublish Selected Coupons',
            message: `Are you sure you want to unpublish ${selectedRows.length} selected coupon(s)?`,
        });
    };

    const handleBulkDialogClose = () => {
        setBulkDialogState({ open: false, title: '', message: '' });
    };

    const bulkPublishCoupons = async (ids) => {
        return await request(
            { url: "/admin/publish", method: "post", data: { couponIds: ids, published: false } },
            false,
            token
        );
    };

    const handleBulkDialogConfirm = async () => {
        const ids = [...selectedRows];

        setBulkLoading(true);
        handleBulkDialogClose();

        const previousData = data;
        const previousSelected = selectedRows;

        try {
            await bulkPublishCoupons(ids);

            setData(prev => prev.filter(item => !ids.includes(item.id)));
            setSelectedRows([]);

            ToastComp({ message: `${ids.length} Coupon(s) Unpublished Successfully`, variant: "success" });

            if (mutate) {
                try { await mutate(); } catch (mErr) { console.warn('mutate() failed:', mErr); }
            }
        } catch (error) {
            console.error("Bulk publish failed:", error);
            setData(previousData);
            setSelectedRows(previousSelected);
            ToastComp({ message: "Failed to unpublish selected coupons", variant: "error" });
        } finally {
            setBulkLoading(false);
        }
    };

    // ─── Table columns ────────────────────────────────────────────────────────

    // Single action icon is disabled when multiple rows are selected OR any bulk op is running
    const isSingleActionDisabled = selectedRows.length > 1 || bulkLoading;
    const isAnyCouponLoading = Object.keys(loadingCoupons).length > 0;

    const ugcSourceColumns = useMemo(() => [
        {
            key: "select",
            label: "",
            render: (row) => (
                <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowToggle(row.id)}
                    sx={{
                        color: '#FEF08A',
                        '&.Mui-checked': { color: '#16A34A' },
                    }}
                />
            )
        },
        { key: "created", label: "Created" },
        { key: "username", label: "Username" },
        { key: "phone", label: "Phone no." },
        { key: "category", label: "Category" },
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        {
            key: "source",
            label: "Origin",
            render: (row) => (
                <Box sx={getStatusBadgeStyle(row.source)}>
                    {row.source}
                </Box>
            ),
        },
        { key: "uses", label: "No. of uses" },
        {
            key: "action",
            label: "Action",
            render: (row) => {
                const isThisCouponLoading = !!loadingCoupons[row.id];
                // Disable if: multiple rows selected, OR any single publish is running, OR bulk is running
                const isDisabled = isSingleActionDisabled || isAnyCouponLoading || bulkLoading;

                let tooltipTitle = "Unpublish Coupon";
                if (selectedRows.length > 1) tooltipTitle = "Deselect others to unpublish individually";
                else if (isAnyCouponLoading || bulkLoading) tooltipTitle = "Processing...";

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title={tooltipTitle} placement="top">
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
                                    }}
                                >
                                    {isThisCouponLoading ? (
                                        <CircularProgress size={24} sx={{ color: '#66BB6A' }} />
                                    ) : (
                                        <FaRecycle style={{ fontSize: '1.5rem' }} />
                                    )}
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                );
            },
        },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [selectedRows, handleRowToggle, loadingCoupons, isSingleActionDisabled, isAnyCouponLoading, bulkLoading]);

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
                        placeholder="Search coupons by username, title, or description"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon sx={{ color: '#87888C', mr: 1, ml: 1 }} />
                            ),
                            sx: { height: 40, paddingLeft: 1 },
                        }}
                    />
                </Box>

                <Box sx={{ minWidth: 150 }}>
                    <DarkSelect
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Category filter' }}
                        sx={{
                            height: 40,
                            borderRadius: "10px",
                            width: "100%",
                            '& .MuiSelect-select': { padding: '8px 14px' },
                        }}
                    >
                        <MenuItem value="" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                            All Category
                        </MenuItem>
                        {allCategories.map((category) => (
                            <MenuItem
                                key={category}
                                value={category}
                                sx={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                {category}
                            </MenuItem>
                        ))}
                    </DarkSelect>
                </Box>
            </Box>

            {/* Table or No Data */}
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
                <Box
                    sx={{
                        backgroundColor: '#171717',
                        color: 'white',
                        '& .MuiTable-root': { backgroundColor: 'transparent' },
                    }}
                >
                    <CustomTable
                        columns={ugcSourceColumns}
                        data={filteredData}
                        getRowColor={getRowColor}
                        rowsPerPage={5}
                        selectedRows={selectedRows}
                        onSelectAll={handleSelectAll}
                        onRefresh={() => mutate && mutate()}
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
                    disabled={selectedRows.length === 0 || bulkLoading}
                    onClick={handleBulkPublishClick}
                    sx={{
                        backgroundColor: '#2E7D32',
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '10px 24px',
                        fontFamily: 'Montserrat, sans-serif',
                        '&:hover': { backgroundColor: '#1B5E20' },
                        '&.Mui-disabled': { backgroundColor: '#444', color: '#999' },
                    }}
                >
                    {bulkLoading ? (
                        <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
                    ) : null}
                    Move to Origin Queue
                </Button>
            </Box>

            {/* Single publish confirmation dialog */}
            <ConfirmationDialog
                open={dialogState.open}
                onClose={handleDialogClose}
                onConfirm={handleDialogConfirm}
                title={dialogState.title}
                message={dialogState.message}
                confirmText="Unpublish"
                cancelText="Cancel"
                type="unpublish"
            />

            {/* Bulk publish confirmation dialog */}
            <ConfirmationDialog
                open={bulkDialogState.open}
                onClose={handleBulkDialogClose}
                onConfirm={handleBulkDialogConfirm}
                title={bulkDialogState.title}
                message={bulkDialogState.message}
                confirmText="Unpublish All"
                cancelText="Cancel"
                type="unpublish"
            />
        </Box>
    );
};

export default DefaultCoupons;