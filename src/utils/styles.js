import { styled, Box, TextField } from "@mui/material";

export const OverdueChip = styled(Box)({
  backgroundColor: "#EF4444",
  color: "white",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "0.8rem",
  minWidth: "80px",
  textAlign: "center",
});

export const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    color: "white",
    height: "40px",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#666" },
    "&.Mui-focused fieldset": { borderColor: "#FEF08A" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#aaa",
    opacity: 1,
  },
});

export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 900,
    bgcolor: '#1E1E1E',
    boxShadow: 24,
    p: 2,
    borderRadius: '10px',
    fontFamily: "Montserrat, sans-serif",
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid #333',
};

export const deleteModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 450,
    bgcolor: '#1E1E1E',
    boxShadow: 24,
    p: 3,
    borderRadius: '10px',
    fontFamily: "Montserrat, sans-serif",
    border: '1px solid #333',
};