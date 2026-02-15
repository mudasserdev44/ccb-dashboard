// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   InputAdornment,
//   styled,
//   IconButton,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import SortIcon from "@mui/icons-material/Sort";
// import AddIcon from "@mui/icons-material/Add";
// import CustomTable from "../../../components/CustomTable/CustomTable";
// import CategoryChip from "./CategoryChip";
// import { CiFilter } from "react-icons/ci";
// import { FiEye } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import OpportunityDetailsModal from './OpportunityDetailsModal'
// import { request } from "../../../services/axios";
// import { useSelector } from "react-redux";


// const CustomTextField = styled(TextField)({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: "10px",
//     color: "white",
//     height: '40px',
//     '& fieldset': {
//       borderColor: "#444",
//     },
//     '&:hover fieldset': {
//       borderColor: "#666",
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: "#FEF08A",
//     },
//   },
//   '& .MuiInputBase-input::placeholder': {
//     color: '#aaa',
//     opacity: 1,
//   }
// });

// const CustomActionButton = styled(Button)({
//   color: "#87888c",
//   border: "1px solid #444",
//   textTransform: "none",
//   fontWeight: 500,
//   width:{xs:"100%",md:"auto"},
//   borderRadius: "10px",
//   fontFamily: "Montserrat, sans-serif",
//   height: '40px',
//   '&:hover': {
//     backgroundColor: "#2e2e2e",
//   },
//   '& .MuiSvgIcon-root': {
//     color: '#FEF08A',
//   }
// });

// const OverdueChip = styled(Box)({
//   backgroundColor: '#EF4444',
//   color: 'white',
//   padding: '4px 12px',
//   borderRadius: '20px',
//   fontWeight: 'semibold',
//   fontSize: '0.8rem',
//   display: 'inline-block',
//   textAlign: 'center',
//   minWidth: '80px',
// });

// const CustomSelect = styled(Select)({
//   height: '40px',
//   color: "#87888c",
//   border: "1px solid #444",
//   borderRadius: '10px',
//   width:"100%",
//   '&:hover': {
//     borderColor: "#666",
//     backgroundColor: "#2e2e2e",
//   },
//   '& fieldset': {
//     border: 'none',
//   },
//   '& .MuiOutlinedInput-notchedOutline': {
//     border: 'none',
//   },
//   '& .MuiSvgIcon-root': {
//     color: '#87888c',
//   },
// });
// const initialData = [
//   { id: 1, title: "Partnership with OpenAI", description: "Filter text with description..", category: "AI Integration", created: "Jan 14, 2025", reminder: "Overdue", contact: "John Doe (Open AI)", actions: null, dueDate: "Feb 14, 2025" }, // Added dueDate
//   { id: 2, title: "Launch in European Market", description: "Expand to Germany and France next quarter.", category: "New Geos", created: "Feb 1, 2025", reminder: "Mar 30, 2025", contact: "Jane Smith (Int. Sales)", actions: null, dueDate: "Mar 30, 2025" },
//   { id: 3, title: "Web3 Integration", description: "Investigate blockchain integration for data security.", category: "Future Technologies", created: "Mar 10, 2025", reminder: "Apr 20, 2025", contact: "Bob Johnson (R&D)", actions: null, dueDate: "Apr 20, 2025" },
//   { id: 4, title: "Missed Q4 Ad Revenue", description: "Audit existing campaign structure and budgets.", category: "Missed Revenue Potential", created: "Apr 5, 2025", reminder: "Overdue", contact: "Alice Brown (Marketing)", actions: null, dueDate: "May 10, 2025" }, // Added dueDate
//   { id: 5, title: "Celebrity Endorsement Deal", description: "Target a top-tier tech influencer for Q3.", category: "Influencer Results", created: "May 1, 2025", reminder: "May 25, 2025", contact: "Michael Lee (PR)", actions: null, dueDate: "May 25, 2025" },
// ];

// const categories = [
//   "Strategic Partnership", "Influencer Results", "New Geos", "Future Technologies", "Missed Revenue Potential", "AI Integration",
// ];

// const getColumns = (openModalHandler) => [
//   //   { key: "select", label: "" }, 
//   {
//     key: "title",
//     label: "Title and Description",
//     render: (row) => (
//       <Box sx={{ textAlign: "left" }}>
//         <Typography sx={{ color: "white", fontWeight: "bold", fontSize: "0.95rem", fontFamily: "Montserrat, sans-serif", }}>{row.title}</Typography>
//         <Typography sx={{ color: "#FDE68A", fontSize: "0.8rem", mt: 0.5, fontFamily: "Montserrat, sans-serif", }}>{row.description}</Typography>
//       </Box>
//     ),
//   },
//   {
//     key: "category",
//     label: "Category",
//     render: (row) => (
//       <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
//         <CategoryChip label={row.category} className="w-[100%] text-2xl" style={{ borderRadius: "20px" }} />
//       </Box>
//     ),
//   },
//   { key: "created", label: "Created" },
//   {
//     key: "reminder",
//     label: "Reminder",
//     render: (row) => (
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, fontFamily: "Montserrat, sans-serif", }}>
//         <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 400, fontFamily: "Montserrat, sans-serif", }}>
//           {row.reminder === "Overdue" ? row.dueDate : row.reminder}
//         </Typography>
//         {row.reminder === "Overdue" && (
//           <OverdueChip>
//             Overdue
//           </OverdueChip>
//         )}
//       </Box>
//     ),
//   },
//   { key: "contact", label: "Contact" },
//   {
//     key: "actions",
//     label: "Actions",
//     render: (row) => (
//       <IconButton onClick={() => openModalHandler(row)} sx={{ color: '#9CA3AF', fontSize: '1.2rem' }}>
//         <FiEye />
//       </IconButton>
//     )
//   },
// ];


// const FutureOpportunitiesPage = () => {
//   const navigate = useNavigate()
//   const token = useSelector((state)=>state.admin.token)
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("Newest First");
//   const [data, setData] = useState(initialData);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedOpportunity, setSelectedOpportunity] = useState(null);
//   const [list, setList] = useState([])
//   const getFOPlist = async()=> {
//     try{
//       const res = await request({
//         method:'get',
//         url:"dashboard/future-opportunities",

//       }, false, token)
//       console.log(res.data.data, "REeeeee")
//     }
//     catch(err){
//       console.log(err)
//     }
//   }
//   useEffect(()=>{
//     getFOPlist()
//   },[])
//   const handleOpenModal = (opportunity) => {
//     setSelectedOpportunity(opportunity);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedOpportunity(null);
//   };

//   const columns = getColumns(handleOpenModal);

//   const handleRowSelect = (id) => {
//     setSelectedRows((prevSelected) =>
//       prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id]
//     );
//   };

//   const handleSelectAll = (currentPageIds, isAllSelected) => {
//     setSelectedRows((prevSelected) => {
//       const newSelected = prevSelected.filter((id) => !currentPageIds.includes(id));
//       return isAllSelected ? newSelected : [...newSelected, ...currentPageIds];
//     });
//   };

//   const handleSortChange = (event) => {
//     const newSortBy = event.target.value;
//     setSortBy(newSortBy);
//     console.log("Sorting by:", newSortBy);
//   };
//   const handlenavigate = () => {
//     navigate('/dashboard/add-futureopportunities')
//   }
//   return (
//     <Box
//       sx={{
//         p: 2,
//         minHeight: "100vh",
//         fontFamily: "Montserrat, sans-serif",
//       }}
//     >
//       <Box
//         display="flex"
//         flexWrap="wrap"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             color: "#FFFF00",
//             fontWeight: "bold",
//             fontSize: {xs:"1.3rem",md:"2rem"},
//             fontFamily: "Montserrat, sans-serif",
//             mb:1
//           }}
//         >
//           Future Opportunities Log
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           sx={{
//             backgroundColor: "#16A34A",
//             color: "white",
//             textTransform: "none",
//             fontWeight: "bold",
//             height: '40px',
//             fontFamily: "Montserrat, sans-serif",
//             "&:hover": { backgroundColor: "#10B981" },
//           }}
//           onClick={handlenavigate}
//         >
//           New Opportunity
//         </Button>
//       </Box>

//       <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" mb={3} gap={1}>
//         <CustomTextField
//           placeholder="Search opportunities..."
//           variant="outlined"
//           size="small"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ color: "#87888c" }} />
//               </InputAdornment>
//             ),
//           }}
//           sx={{ flexGrow: 1, maxWidth: "400px" }}
//         />
//         <Box sx={{ display: "flex", flexWrap:"wrap", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "Montserrat, sans-serif", }}>
//           {/* <CustomActionButton startIcon={<CiFilter />}>
//             Filters
//           </CustomActionButton> */}

//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {/* <SortIcon sx={{ color: '#FEF08A', mr: 1 }} /> */}
//             <CustomSelect
//               value={sortBy}
//               onChange={handleSortChange}
//               variant="outlined"
//               size="small"
//               sx={{ fontFamily: "Montserrat, sans-serif", }}
//             >
//               <MenuItem value="Newest First" sx={{ fontFamily: "Montserrat, sans-serif", }}>Newest First</MenuItem>
//               <MenuItem value="Oldest First" sx={{ fontFamily: "Montserrat, sans-serif", }}>Oldest First</MenuItem>
//               <MenuItem value="A-Z" sx={{ fontFamily: "Montserrat, sans-serif", }}>A-Z (Title)</MenuItem>
//             </CustomSelect>
//           </Box>
//         </Box>

//       </Box>

//       <Box mb={4}>
//         <Typography
//           variant="subtitle1"
//           sx={{ color: "#aaa", mb: 1, fontSize: "1.2rem", fontWeight: 'bold', fontFamily: "Montserrat, sans-serif", }}
//         >
//           Categories
//         </Typography>
//         <Box display="flex" alignItems="center" overflow="auto" justifyContent="space-between" gap={1}>
//           {categories.map((cat) => (
//             <CategoryChip key={cat} label={cat} className="w-[100%] flex items-center justify-center" />
//           ))}
//         </Box>
//       </Box>
//       <Box sx={{ backgroundColor: "#171717", padding: "20px", borderRadius: "20px" }}>
//         <CustomTable
//           columns={columns}
//           data={data.filter(row => row.title.toLowerCase().includes(searchTerm.toLowerCase()))} // Simple Search Filter
//           rowsPerPage={5}
//           selectedRows={selectedRows}
//           onRowSelect={handleRowSelect}
//           onSelectAll={handleSelectAll}
//         />
//       </Box>

//       <OpportunityDetailsModal
//         open={isModalOpen}
//         handleClose={handleCloseModal}
//         opportunity={selectedOpportunity}
//       />

//     </Box>
//   );
// };

// export default FutureOpportunitiesPage;