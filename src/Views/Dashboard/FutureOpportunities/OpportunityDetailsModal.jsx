import React, { useRef, useState } from "react";
import {
    Box,
    Typography,
    Modal,
    IconButton,
    styled,
    Button,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import CategoryChip from "./CategoryChip";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import axios from 'axios'; // Add axios import
import { request } from "../../../services/axios";
import { useSelector } from "react-redux";
import { deleteModalStyle, modalStyle, OverdueChip } from "../../../utils/styles";

const DetailRow = ({ label, value, isOverdue = false }) => (
    <Box display="flex" flexDirection="column" justifyContent="space-between" mb={1} alignItems="start" sx={{fontFamily: "Montserrat, sans-serif",}}>
        <Typography sx={{ color: '#87888c', fontSize: '0.9rem', fontWeight: 500 ,fontFamily: "Montserrat, sans-serif",}}>{label}</Typography>
        <Box sx={{ width: '70%', textAlign: 'left',fontFamily: "Montserrat, sans-serif", }}>
            {isOverdue ? (
                <div className="flex gap-2 ">
                <h1 className="text-[#F04545]">
                   {value}
                </h1>
                <OverdueChip sx={{ minWidth: 'auto', padding: '4px 8px',fontFamily: "Montserrat, sans-serif",fontWeight:"semibold" }}>
                    overdue
                </OverdueChip>
                </div>
            ) : (
                <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' ,fontFamily: "Montserrat, sans-serif",}}>{value}</Typography>
            )}
        </Box>
    </Box>
);

const ImageSlider = () => {
    const mediaItems = [
        { id: 1, src: "/assets/image 2 (3).png", alt: "Media 1" },
        { id: 2, src: "/assets/image 3.png", alt: "Media 2" },
        { id: 3, src: "/assets/image 4.png", alt: "Media 3" },
        { id: 4, src: "/assets/image 5.png", alt: "Media 4" },
        { id: 5, src: "/assets/image 2 (3).png", alt: "Media 5" },
        { id: 6, src: "/assets/image 3.png", alt: "Media 6" },
        { id: 7, src: "/assets/image 4.png", alt: "Media 7" },
    ];
    
    const scrollRef = useRef(null);
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    const handleMouseDown = (e) => {
        isDown = true;
        scrollRef.current.classList.add("active");
        startX = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft = scrollRef.current.scrollLeft;
    };
    
    const handleMouseLeave = () => {
        isDown = false;
        scrollRef.current.classList.remove("active");
    };
    
    const handleMouseUp = () => {
        isDown = false;
        scrollRef.current.classList.remove("active");
    };
    
    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Box
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                sx={{
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    display: "flex",
                    gap: 1,
                    height: "200px",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    cursor: "grab",
                }}
            >
                {mediaItems.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            minWidth: "200px",
                            height: "200px",
                            borderRadius: "5px",
                            overflow: "hidden",
                            flexShrink: 0,
                        }}
                    >
                        <img
                            src={item.src}
                            alt={item.alt}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "5px",
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

const DeleteConfirmationModal = ({ open, handleClose, category, opportunityTitle, handleDeleteConfirm, isDeleting }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="delete-confirmation-title"
            aria-describedby="delete-confirmation-description"
        >
            <Box sx={deleteModalStyle}>
                <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography 
                        id="delete-confirmation-title" 
                        variant="h6" 
                        sx={{ color: "#FFFF00", fontWeight: "bold", fontSize: {xs:"0.7rem",md:'1.2rem'},fontFamily: "Montserrat, sans-serif", }}
                    >
                        {opportunityTitle}
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ color: '#87888c', p: 0 }} disabled={isDeleting}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <Box mb={3}>
                    <CategoryChip label={category} style={{ 
                        borderRadius: "10px",
                        padding: '4px 14px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color:"black",
                        width: 'fit-content',
                    }} />
                </Box>

                <Typography id="delete-confirmation-description" sx={{ color: "white",fontFamily: "Montserrat, sans-serif", fontSize: "1rem", mb: 4, textAlign: 'start' }}>
                    Are you sure you want to delete this entry?
                </Typography>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button 
                        onClick={handleClose}
                        variant="outlined"
                        disabled={isDeleting}
                        sx={{
                            color: 'white',
                            borderColor: '#87888c',
                            '&:hover': {
                                borderColor: 'white',
                            },
                            borderRadius: '5px',
                            textTransform: 'none',
                            px: 3,
                            fontFamily: "Montserrat, sans-serif"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        disabled={isDeleting}
                        sx={{
                            backgroundColor: '#EF4444',
                            '&:hover': {
                                backgroundColor: '#DC2626',
                            },
                            color: 'white',
                            borderRadius: '5px',
                            textTransform: 'none',
                            px: 3,
                            fontFamily: "Montserrat, sans-serif"
                        }}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete entry'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const OpportunityDetailsModal = ({ open, handleClose, opportunity, onDeleteSuccess }) => {
    const token = useSelector((state)=>state.admin.token)
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!opportunity) return null;

    // ✅ Extract data from backend response
    const {
        id,
        title,
        description,
        category,
        status,
        files = [],
        pocs = [],
        createdAt,
        reminderDate,
        overdue,
        misc = { ideas: [] }
    } = opportunity;

    const formattedReminderDate = reminderDate 
        ? new Date(reminderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : 'Not Set';

    const isOverdue = overdue || false;

    // ✅ Format status for display
    const statusDisplay = status?.charAt(0).toUpperCase() + status?.slice(1);

    // ✅ Format POCs (Points of Contact)
    const contactDisplay = pocs.length > 0 ? pocs.join(', ') : 'Not Assigned';

    // ✅ Format miscellaneous ideas
    const miscIdeas = misc?.ideas?.length > 0 
        ? misc.ideas.join('. ') 
        : 'No additional information provided.';

    const handleNavigate = () => {
        navigate(`/dashboard/edit-futureopportunities/${id}`);
    };

    const handleOpenDeleteModal = (event) => {
        event.stopPropagation();
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        if (!isDeleting) {
            setOpenDeleteModal(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        
        try {
            const response = await request({
                method:"delete",
                url:`/dashboard/future-opportunities/${id}`,
            }, true, token)

            console.log('Delete successful:', response.data);
            
            // Close both modals
            handleCloseDeleteModal();
            handleClose();
            
            // Call the success callback to refresh the list
            if (onDeleteSuccess) {
                onDeleteSuccess(id);
            }
            
            // Optional: Show success message (you can use a toast/snackbar library)
            // toast.success('Opportunity deleted successfully');
            
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            
            // Handle error - show error message to user
            // toast.error('Failed to delete opportunity. Please try again.');
            
            // Optional: Show more specific error messages
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="opportunity-details-title"
                aria-describedby="opportunity-details-description"
            >
                <Box sx={modalStyle}>
                    {/* Close Button */}
                    <IconButton 
                        onClick={handleClose} 
                        sx={{ 
                            position: 'absolute',
                            right: 16,
                            top: 16,
                            color: '#87888c' 
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Header: Title + Actions */}
                    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography 
                            id="opportunity-details-title" 
                            variant="h5" 
                            sx={{ 
                                color: "#FFFF00",
                                fontFamily: "Montserrat, sans-serif", 
                                fontWeight: "bold", 
                                fontSize: '1.8rem',
                                pr: 2
                            }}
                        >
                            {title}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1}>
                            <IconButton 
                                onClick={handleNavigate} 
                                sx={{ 
                                    color: '#87888c', 
                                    backgroundColor: "#2a2a2a", 
                                    borderRadius: "4px" 
                                }}
                            >
                                <CiEdit size={25} color="#FAFAFAFA" />
                            </IconButton>
                            <IconButton 
                                onClick={handleOpenDeleteModal} 
                                sx={{ 
                                    color: '#EF4444', 
                                    backgroundColor: "#2a2a2a", 
                                    borderRadius: "4px" 
                                }}
                            >
                                <FiTrash2 size={25} />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Category Chip */}
                    <Box mb={2}>
                        <CategoryChip 
                            label={category} 
                            style={{
                                borderRadius: "10px",
                                padding: '4px 14px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                color: "black",
                                width: 'fit-content'
                            }} 
                        />
                    </Box>

                    {/* Overdue Warning */}
                    {isOverdue && (
                        <Box sx={{
                            border: '1px solid #f04545',
                            color: '#f04545',
                            p: 1.5,
                            borderRadius: '20px',
                            mb: 2,
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            backgroundColor: '#281717'
                        }}>
                            Reminder is overdue since {formattedReminderDate}
                        </Box>
                    )}

                    {/* Description Section */}
                    <Box mb={3}>
                        <Typography sx={{ 
                            color: "#aaa", 
                            fontSize: "0.9rem",
                            fontFamily: "Montserrat, sans-serif", 
                            mb: 1, 
                            fontWeight: 600 
                        }}>
                            Description
                        </Typography>
                        <Typography sx={{ 
                            color: "white", 
                            fontSize: "0.9rem",
                            fontFamily: "Montserrat, sans-serif",
                            lineHeight: 1.6
                        }}>
                            {description || 'No description provided.'}
                        </Typography>
                    </Box>

                    {/* Details Grid */}
                    <Box
                        display="grid"
                        gridTemplateColumns={{ xs: "1fr", sm: "1fr", md: "1fr 1fr" }}
                        gap={2}
                        mb={3}
                    >
                        <Box>
                            <DetailRow label="Date Created" value={opportunity?.created} />
                            <DetailRow 
                                label="Reminder Date" 
                                value={opportunity?.reminder} 
                                isOverdue={isOverdue} 
                            />
                        </Box>
                        <Box>
                            <DetailRow label="Point of Contact" value={contactDisplay} />
                            <DetailRow label="Status" value={statusDisplay} />
                        </Box>
                    </Box>

                    {/* Media Section */}
                    {files.length > 0 && (
                        <Box mb={3}>
                            <Typography sx={{ 
                                color: "#aaa", 
                                fontSize: "0.9rem", 
                                mb: 1, 
                                fontWeight: 600,
                                fontFamily: "Montserrat, sans-serif" 
                            }}>
                                Media ({files.length})
                            </Typography>
                            <ImageSlider images={files} />
                        </Box>
                    )}

                    {/* Miscellaneous Section */}
                    {misc?.ideas?.length > 0 && (
                        <Box>
                            <Typography sx={{ 
                                color: "#aaa", 
                                fontSize: "0.9rem", 
                                mb: 1, 
                                fontWeight: 600,
                                fontFamily: "Montserrat, sans-serif" 
                            }}>
                                Miscellaneous Ideas
                            </Typography>
                            <Box>
                                {misc.ideas.map((idea, index) => (
                                    <Typography 
                                        key={index}
                                        sx={{ 
                                            color: "white", 
                                            fontSize: "0.85rem",
                                            fontFamily: "Montserrat, sans-serif",
                                            mb: 1,
                                            pl: 2,
                                            '&::before': {
                                                content: '"• "',
                                                marginRight: 1
                                            }
                                        }}
                                    >
                                        {idea}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal 
                open={openDeleteModal}
                handleClose={handleCloseDeleteModal}
                opportunityTitle={title}
                handleDeleteConfirm={handleDeleteConfirm}
                category={category}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default OpportunityDetailsModal;