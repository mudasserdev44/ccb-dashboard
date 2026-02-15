import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Pagination,
  styled,
  Checkbox, // Checkbox को आयात किया गया
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";

const DarkTableContainer = styled(TableContainer)(() => ({
  backgroundColor: "#171717",
  boxShadow: "none",
  borderRadius: "4px",
}));

const getBorderColor = (rowId, selectedRows) => {
  return selectedRows.includes(rowId) ? '#16A34A' : '#444'; 
}

const DarkBodyTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== 'rowId' && prop !== 'selectedRows'
})(({ rowId, selectedRows }) => ({
  color: "#FEF08A",
  backgroundColor: "transparent",
  border: `1px solid ${getBorderColor(rowId, selectedRows)}`, 
  padding: "14px 8px",
  fontSize: "0.9rem",
}));

const LightHeaderTableCell = styled(TableCell)(() => ({
  color: "black",
  backgroundColor: "white",
  fontWeight: "bold",
  border: "1px solid #444",
  padding: "14px 8px",
  fontSize: "0.9rem",
}));

const DarkTableRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "#2e2e2e",
  },
}));

const CustomTable = ({ columns, data, rowsPerPage = 5, getRowColor = () => '', selectedRows = [], onSelectAll, onRefresh }) => {
  const [page, setPage] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    try {
      setRefreshing(true);
      if (typeof onRefresh === 'function') {
        const result = onRefresh();
        if (result && typeof result.then === 'function') {
          await result;
        }
      } else {
        setPage((p) => p);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const currentPageIds = displayData.map(row => row.id);
  const numSelected = selectedRows.filter(id => currentPageIds.includes(id)).length;
  const isAllSelected = currentPageIds.length > 0 && numSelected === currentPageIds.length;
  const isIndeterminate = numSelected > 0 && numSelected < currentPageIds.length;


  return (
    <Box sx={{ fontFamily: 'Montserrat, sans-serif' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Tooltip title={refreshing ? "Refreshing..." : "Refresh"} placement="right">
          <span>
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                color: '#F0E82E',
                backgroundColor: 'transparent',
                '&:hover': { backgroundColor: '#F0E82E20' },
              }}
            >
              {refreshing ? <CircularProgress size={20} sx={{ color: '#F0E82E' }} /> : <RefreshIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <DarkTableContainer component={Paper} sx={{ fontFamily: 'Montserrat, sans-serif' }}>
          <Table sx={{ minWidth: 650, fontFamily: 'Montserrat, sans-serif' }} aria-label="custom styled table ">
            <TableHead>
              <TableRow>
                {columns.map((col, index) => (
                  <LightHeaderTableCell
                    key={index}
                    align="center"
                    sx={{ fontFamily: 'Montserrat, sans-serif', textAlign: "center" }}
                  >
                    {col.key === "select" ? ( 
                      <Checkbox
                          checked={isAllSelected}
                          indeterminate={isIndeterminate}
                          onChange={() => onSelectAll(currentPageIds, isAllSelected)} 
                          sx={{
                              color: 'black',
                              '&.Mui-checked': {
                                  color: 'black',
                              },
                              '&.Mui-indeterminate': {
                                  color: 'black',
                              },
                          }}
                      />
                    ) : (
                      col.label
                    )}
                  </LightHeaderTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {displayData.map((row, i) => {
                const rowId = row.id;

                return (
                  <DarkTableRow key={i} sx={{ backgroundColor: getRowColor(row) }}>
                    {columns.map((col, j) => (
                      <DarkBodyTableCell
                        key={j}
                        align="center"
                        rowId={rowId} 
                        selectedRows={selectedRows} 
                        sx={{ fontFamily: 'Montserrat, sans-serif', textAlign: "center", fontWeight: "600" }}
                      >
                        {col.render ? (
                          col.render(row)
                        ) : col.key === "growth" ? (
                          <Box display="flex" flexDirection="column" alignItems="center">
                            {typeof row[col.key] === "string" && row[col.key].includes("up") && (
                              <ArrowUpwardIcon style={{ color: "yellow" }} />
                            )}
                            {typeof row[col.key] === "string" && row[col.key].includes("down") && (
                              <ArrowDownwardIcon style={{ color: "red" }} />
                            )}
                            {typeof row[col.key] === "string" && row[col.key].includes("left") && (
                              <ArrowBackIcon style={{ color: "orange" }} />
                            )}
                            {typeof row[col.key] === "string" && row[col.key].includes("right") && (
                              <ArrowForwardIcon style={{ color: "green" }} />
                            )}
                            <span className={`${col.bodycolor}`}>
                              {typeof row[col.key] === "string"
                                ? row[col.key]
                                  .replace("up", "")
                                  .replace("down", "")
                                  .replace("left", "")
                                  .replace("right", "")
                                  .trim()
                                : row[col.key]}
                            </span>
                          </Box>
                        ) : (
                          <span className={`${col.bodycolor}`}>
                            {row[col.key]}
                          </span>
                        )}
                      </DarkBodyTableCell>
                    ))}
                  </DarkTableRow>
                );
              })}
            </TableBody>
          </Table>
      </DarkTableContainer>

      {rowsPerPage < data.length && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            py: 1,
            backgroundColor: "#1e1e1e",
            borderRadius: "0 0 4px 4px",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            siblingCount={1}
            boundaryCount={1}
            color="primary"
            sx={{
              "& .MuiPagination-ul": {
                gap: "6px",
              },
              "& .MuiPaginationItem-root": {
                color: "#aaa",
                border: "1px solid #333",
                borderRadius: "6px",
                backgroundColor: "#0f0f0f",
                width: "36px",
                height: "36px",
                minWidth: "36px",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#222",
                  borderColor: "#555",
                },
              },

              "& .MuiPaginationItem-previousNext": {
                color: "#aaa",
                backgroundColor: "#0f0f0f",
                border: "1px solid #333",
                borderRadius: "6px",
                width: "36px",
                height: "36px",
                minWidth: "36px",
                "&:hover": {
                  backgroundColor: "#222",
                  borderColor: "#555",
                },
                "& .MuiSvgIcon-root": {
                  color: "#aaa",
                },
              },

              "& .Mui-selected": {
                backgroundColor: "#1a1a1a !important",
                color: "#fff",
                border: "1px solid #666",
                boxShadow: "0 0 3px #444 inset",
              },
            }}
          />


        </Box>
      )}
    </Box>
  );
};

export default CustomTable;
