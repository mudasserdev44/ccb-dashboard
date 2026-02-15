import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { request } from '../../../services/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: '#171717',
    color: '#CFCFCF',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

const CreateAdminModal = ({ open, handleClose, editingUser, onSuccess }) => {
    const token = useSelector((state) => state.admin.token);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'admin'
    });

    // Populate form when editing
    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || '',
                email: editingUser.email || '',
                role: editingUser.role || 'admin'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'admin'
            });
        }
    }, [editingUser, open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            role: e.target.value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            toast.error('Email is required');
            return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        const output = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role
        };

        try {
            if (editingUser) {
                // Update existing user
                await request({
                    method: "put",
                    url: `admin/users/${editingUser.userId}`,
                    data: output
                }, false, token);
                toast.success('User updated successfully');
            } else {
                // Create new user
                await request({
                    method: "post",
                    url: "admin/users/create",
                    data: output
                }, false, token);
                toast.success('User created successfully');
            }

            // Reset form
            setFormData({
                name: '',
                email: '',
                role: 'admin'
            });

            // Call onSuccess to refresh data
            if (onSuccess) {
                onSuccess();
            }

            handleClose();
        } catch (err) {
            console.error(err);
            const errorMessage = err?.response?.data?.message || 
                                (editingUser ? 'Failed to update user' : 'Failed to create user');
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-admin-modal-title"
            sx={{ fontFamily: 'Montserrat, sans-serif' }}
        >
            <Box sx={style}>
                {/* Close Icon */}
                <CloseIcon
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        cursor: 'pointer',
                        color: '#666',
                        '&:hover': { color: '#999' }
                    }}
                />

                {/* Title */}
                <Typography 
                    id="create-admin-modal-title" 
                    variant="h5" 
                    sx={{ 
                        color: '#F0E82E', 
                        fontWeight: 'bold', 
                        mb: 3, 
                        fontFamily: 'Montserrat, sans-serif' 
                    }}
                >
                    {editingUser ? 'Edit User' : 'Create New User'}
                </Typography>

                {/* Access Type Radio Buttons */}
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: 'white', 
                            mb: 1, 
                            fontFamily: 'Montserrat, sans-serif' 
                        }}
                    >
                        Access Type
                    </Typography>
                    <RadioGroup 
                        row 
                        aria-label="notification-type" 
                        name="notification-type"
                        value={formData.role}
                        onChange={handleRoleChange}
                    >
                        <FormControlLabel
                            value="admin"
                            control={
                                <Radio
                                    sx={{
                                        color: "#2E7D32",
                                        "&.Mui-checked": { color: "#2E7D32" },
                                    }}
                                />
                            }
                            label="Admin"
                            slotProps={{
                                typography: {
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                        color: "white"
                                    }
                                }
                            }}
                        />

                        <FormControlLabel
                            value="manager"
                            control={
                                <Radio
                                    sx={{
                                        color: '#2E7D32',
                                        '&.Mui-checked': { color: '#2E7D32' },
                                    }}
                                />
                            }
                            label="Manager"
                            slotProps={{
                                typography: {
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                        color: "white"
                                    }
                                }
                            }}
                        />
                        
                        <FormControlLabel
                            value="developer"
                            control={
                                <Radio
                                    sx={{
                                        color: '#2E7D32',
                                        '&.Mui-checked': { color: '#2E7D32' },
                                    }}
                                />
                            }
                            label="Developer"
                            slotProps={{
                                typography: {
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                        color: "white"
                                    }
                                }
                            }}
                        />
                    </RadioGroup>
                </FormControl>

                {/* Text Fields */}
                <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    disabled={loading}
                    required
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            color: "white",
                            fontFamily: "Montserrat, sans-serif",
                            "& fieldset": { borderColor: "#333333" },
                            "&:hover fieldset": { borderColor: "#555555" },
                            "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#999",
                            fontFamily: "Montserrat, sans-serif",
                            "&.Mui-focused": { color: "white" },
                        },
                    }}
                />
                
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    disabled={loading || editingUser} // Disable email editing
                    required
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            color: "white",
                            fontFamily: "Montserrat, sans-serif",
                            "& fieldset": { borderColor: "#333333" },
                            "&:hover fieldset": { borderColor: "#555555" },
                            "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
                            "&.Mui-disabled": {
                                color: "white",
                                "-webkit-text-fill-color": "white",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#999",
                            fontFamily: "Montserrat, sans-serif",
                            "&.Mui-focused": { color: "white" },
                        },
                    }}
                />

                {/* Submit Button */}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        backgroundColor: "#2E7D32",
                        "&:hover": { backgroundColor: "#1B5E20" },
                        "&:disabled": { 
                            backgroundColor: "#555", 
                            color: "#999" 
                        },
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "8px",
                        padding: "10px 24px",
                        width: "100%",
                        fontFamily: "Montserrat, sans-serif",
                        position: "relative",
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                        editingUser ? 'Update User' : 'Create User'
                    )}
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateAdminModal;