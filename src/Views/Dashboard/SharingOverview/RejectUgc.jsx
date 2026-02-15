import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    Checkbox,
    Modal,
    Backdrop,
    InputAdornment,
    styled,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CustomTable from '../../../components/CustomTable/CustomTable';
import { IoIosArrowDown } from "react-icons/io";
import DarkSelect from '../../../components/common/DarkSelect';
import DarkTextField from '../../../components/common/DarkTextField';

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                },
            }}
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 450,
                bgcolor: '#2b2b2b',
                borderRadius: '8px',
                p: 4,
                boxShadow: 24,
                color: 'white',
                fontFamily: 'Montserrat, sans-serif',
            }}>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 8, left: 8, color: '#aaa' }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography
                    id="delete-modal-description"
                    sx={{
                        mt: 2,
                        mb: 4,
                        textAlign: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        lineHeight: 1.5,
                    }}>
                    Are you sure you want to delete these coupons from Rejected Coupons?
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            color: 'white',
                            borderColor: '#555',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '4px',
                            padding: '10px 24px',
                            minWidth: '120px',
                            fontFamily: 'Montserrat, sans-serif',
                            '&:hover': { borderColor: '#777' }
                        }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: '#f04545',
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '4px',
                            padding: '10px 24px',
                            minWidth: '120px',
                            fontFamily: 'Montserrat, sans-serif',
                            '&:hover': { backgroundColor: '#d32f2f' }
                        }}>
                        Delete coupons
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const RejectUgc = ({ rejected_data, loading, onRefresh }) => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSingleDelete, setIsSingleDelete] = useState(false);
    const [singleDeleteId, setSingleDeleteId] = useState(null);

    // Load rejected data when available
    useEffect(() => {
        if (rejected_data && Array.isArray(rejected_data?.data?.coupons)) {
            const formatted = rejected_data.data.coupons
                .filter(item => item.status === "rejected")
                .map((item) => ({
                    id: item._id,
                    created: new Date(item.createdAt).toLocaleDateString(),
                    username: item.createdBy?.name || "Unknown",
                    phone: item.createdBy?.phone || "N/A",
                    category: item.category?.name || "N/A",
                    title: item.title,
                    description: item.description,
                    status: "Rejected",
                }));
            setData(formatted);
        }
    }, [rejected_data]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleRowToggle = useCallback((id) => {
        setSelectedRows(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(rowId => rowId !== id)
                : [...prevSelected, id]
        );
    }, []);

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

    const openModal = (isSingle, id = null) => {
        setIsSingleDelete(isSingle);
        setSingleDeleteId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSingleDeleteId(null);
    };

    const handleConfirmDelete = () => {
        if (isSingleDelete && singleDeleteId) {
            console.log(`Deleting single coupon: ${singleDeleteId}`);
            // API call to delete single coupon
        } else {
            console.log(`Deleting bulk coupons: ${selectedRows.join(', ')}`);
            // API call to delete multiple coupons
        }

        setSelectedRows([]);
        closeModal();
    };

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

    const rejectedColumns = [
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
                            color: '#f04545',
                        },
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
        // {
        //     key: "action",
        //     label: "Action",
        //     render: (row) => (
        //         <IconButton
        //             aria-label="delete"
        //             sx={{ color: '#f04545' }}
        //             onClick={() => openModal(true, row.id)}
        //         >
        //             <DeleteIcon />
        //         </IconButton>
        //     ),
        // },
    ];

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
                        placeholder="Search coupons by username, title, description"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            sx: { height: 40, paddingLeft: 1 }
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
                        columns={rejectedColumns}
                        data={filteredData}
                        getRowColor={getRowColor}
                        rowsPerPage={4}
                        selectedRows={selectedRows}
                        onSelectAll={handleSelectAll}
                         onRefresh={onRefresh}
                    />
                </Box>
            )}

            {/* Buttons */}
            {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
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
                    disabled={selectedRows.length === 0}
                    onClick={() => openModal(false)}
                    sx={{
                        backgroundColor: '#f04545',
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '10px 24px',
                        fontFamily: 'Montserrat, sans-serif',
                        '&:hover': { backgroundColor: '#d32f2f' },
                        '&.Mui-disabled': {
                            backgroundColor: '#444',
                            color: '#999',
                        }
                    }}
                >
                    Delete coupons
                </Button>
            </Box> */}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                open={isModalOpen}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
};

export default RejectUgc
