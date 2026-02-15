// EditFutureOpportunity.jsx (New File)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { request } from '../../../services/axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import NewEntrys from './NewEntrys';

const EditFutureOpportunity = () => {
    const { id } = useParams(); // Get opportunity ID from URL
    const navigate = useNavigate();
    const token = useSelector((state) => state.admin.token);
    
    const [opportunityData, setOpportunityData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch opportunity data on mount
    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await request({
                    method: 'get',
                    url: `dashboard/future-opportunities/${id}`,
                }, false, token);
                
                setOpportunityData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunity:', error);
                toast.error('Failed to load opportunity data');
                navigate('/dashboard/future-opportunities');
            }
        };

        if (id && token) {
            fetchOpportunity();
        }
    }, [id, token, navigate]);

    const handleSuccess = () => {
        toast.success('Opportunity updated successfully!');
        navigate('/dashboard/future-opportunities');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress color="warning" />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" color="#FFFF00" fontWeight="bold" mb={3}>
                Edit Future Opportunity
            </Typography>
            
            <NewEntrys 
                editMode={true}
                opportunityId={id}
                initialData={opportunityData}
                onSuccess={handleSuccess}
            />
        </Box>
    );
};

export default EditFutureOpportunity;