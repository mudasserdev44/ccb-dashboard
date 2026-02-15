import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useSWR from "swr";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CustomTable from "../../../components/CustomTable/CustomTable";
import CategoryChip from "./CategoryChip";
import OpportunityDetailsModal from "./OpportunityDetailsModal";
import { request } from "../../../services/axios";
import { CustomTextField } from "../../../utils/styles";
import { categories } from "../../../utils/constants";
import { getColumnsFutureOpp } from "../../../utils/sharedData";

/* ================= SWR FETCHER ================= */
const fetcher = (url, token) =>
  request({ method: "get", url }, false, token).then((res) => res.data.data);

/* ================= MAIN COMPONENT ================= */
const FutureOpportunitiesPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.admin.token);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Data Fetching
  const { data, isLoading } = useSWR(
    token && selectedCategory
      ? [
          `dashboard/future-opportunities?category=${encodeURIComponent(
            selectedCategory
          )}`,
          token,
        ]
      : null,
    ([url, token]) => fetcher(url, token)
  );

  // Transform API data for table
  const tableData =
    data?.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      created: new Date(item.createdAt).toLocaleDateString(),
      reminder: item.overdue
        ? "Overdue"
        : new Date(item.reminderDate).toLocaleDateString(),
      dueDate: new Date(item.reminderDate).toLocaleDateString(),
      contact: item.pocs?.join(", "),
    })) || [];

  // Filter data based on search term
  const filteredData = tableData.filter((row) =>
    row.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get table columns with modal handler
  const columns = getColumnsFutureOpp((row) => {
    setSelectedOpportunity(row);
    setIsModalOpen(true);
  });

  // Event Handlers
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOpportunity(null);
  };

  const handleAddOpportunity = () => {
    navigate("/dashboard/add-futureopportunities");
  };

  return (
    <Box p={2} minHeight="100vh">
      {/* HEADER SECTION */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" color="#FFFF00" fontWeight="bold">
          Future Opportunities Log
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#16A34A",
            "&:hover": { backgroundColor: "#15803D" },
            textTransform: "none",
            fontWeight: "bold",
          }}
          onClick={handleAddOpportunity}
        >
          New Opportunity
        </Button>
      </Box>

      {/* SEARCH BAR */}
      <Box display="flex" gap={2} mb={3}>
        <CustomTextField
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* CATEGORIES SECTION */}
      <Box mb={4}>
        <Typography color="#aaa" fontWeight="bold" mb={1}>
          Categories
        </Typography>
        <Box
          display="flex"
          gap={1}
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#2a2a2a",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#555",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#666",
              },
            },
            pb: 1,
          }}
        >
          {categories.map((cat) => (
            <Box
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              sx={{ cursor: "pointer" }}
            >
              <CategoryChip label={cat} selected={selectedCategory === cat} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* TABLE SECTION */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <Box bgcolor="#171717" p={2} borderRadius="20px">
          <CustomTable
            columns={columns}
            data={filteredData}
            rowsPerPage={5}
          />
        </Box>
      )}

      {/* OPPORTUNITY DETAILS MODAL */}
      <OpportunityDetailsModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        opportunity={selectedOpportunity}
      />
    </Box>
  );
};

export default FutureOpportunitiesPage;