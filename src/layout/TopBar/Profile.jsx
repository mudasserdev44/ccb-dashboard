import {
  Avatar,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CameraAlt,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { request } from "../../services/axios";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.admin.user);
  const token = useSelector((state) => state.admin.token);
  const [fullName, setFullName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(
    import.meta.env.VITE_BASE2 + (user?.profilePicture || "")
  );
  const [originalName, setOriginalName] = useState(user?.name || "");
  const [originalImage, setOriginalImage] = useState(
    import.meta.env.VITE_BASE2 + (user?.profilePicture || "")
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const isChanged = fullName !== originalName || profileImage !== originalImage;
    setHasChanges(isChanged);
  }, [fullName, profileImage, originalName, originalImage]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSnackbar({
          open: true,
          message: "Please select a valid image file",
          severity: "error",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "Image size should be less than 5MB",
          severity: "error",
        });
        return;
      }

      setSelectedFile(file);

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      await handleUploadProfilePic(file);
    }
  };

  const handleUploadProfilePic = async (file) => {
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await request(
        {
          method: "post",
          url: "user/profilePicture",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        false,
        token
      );

      if (res.data) {
        // Get the updated profile picture path from response
        const updatedProfilePicture = res.data.profilePicture || res.data.data?.profilePicture;
        
        // Update Redux state with new profile picture
        dispatch({
          type: 'UPDATE_USER_PROFILE',
          payload: {
            ...user,
            profilePicture: updatedProfilePicture
          }
        });

        // Update local states
        const fullImagePath = import.meta.env.VITE_BASE2 + updatedProfilePicture;
        setProfileImage(fullImagePath);
        setOriginalImage(fullImagePath);
        
        setSnackbar({
          open: true,
          message: "Profile picture uploaded successfully!",
          severity: "success",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to upload profile picture",
        severity: "error",
      });
      
      // Revert to original image on error
      setProfileImage(originalImage);
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const updateData = {
        name: fullName,
      };

      const res = await request(
        {
          method: "put",
          url: "user/profile",
          data: updateData,
        },
        false,
        token
      );

      if (res.data) {
        // Update Redux state with new name
        dispatch({
          type: 'UPDATE_USER_PROFILE',
          payload: {
            ...user,
            name: fullName
          }
        });

        setOriginalName(fullName);
        setHasChanges(false);
        setSnackbar({
          open: true,
          message: "Changes saved successfully!",
          severity: "success",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to save changes",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        pb: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "#fff",
            position: "absolute",
            left: 16,
          }}
        >
          <ArrowBack />
        </IconButton>
      </Box>

      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
          pb: 4,
        }}
      >
        <Box sx={{ position: "relative", mb: 4 }}>
          <Avatar
            src={profileImage}
            alt={fullName}
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#C9A961",
              border: "3px solid #000",
              fontSize: "40px",
              fontWeight: 600,
            }}
          >
            {fullName?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          
          {/* Loading overlay on avatar */}
          {isUploading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress
                size={30}
                sx={{ color: "#C9A961" }}
              />
            </Box>
          )}

          <input
            accept="image/*"
            type="file"
            id="profile-image-upload"
            style={{ display: "none" }}
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <label htmlFor="profile-image-upload">
            <IconButton
              component="span"
              disabled={isUploading}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                bgcolor: "#C9A961",
                border: "3px solid #000",
                "&:hover": {
                  bgcolor: "#B89951",
                },
                "&:disabled": {
                  bgcolor: "rgba(201, 169, 97, 0.5)",
                },
              }}
            >
              <CameraAlt sx={{ fontSize: "16px", color: "#000" }} />
            </IconButton>
          </label>
        </Box>

        {/* Form Fields */}
        <Box sx={{ width: "90%", maxWidth: "400px", mt: 2 }}>
          {/* Full Name - Editable */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "12px",
                fontWeight: 500,
                fontFamily: "'Montserrat', sans-serif",
                mb: 1,
                ml: 0.5,
              }}
            >
              Full Name
            </Typography>
            <TextField
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSaving}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "15px",
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#C9A961",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#C9A961",
                  },
                },
              }}
            />
          </Box>

          {/* Email - Not Editable */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "12px",
                fontWeight: 500,
                fontFamily: "'Montserrat', sans-serif",
                mb: 1,
                ml: 0.5,
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              value={user?.email || "user@example.com"}
              disabled
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "15px",
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                },
                "& .Mui-disabled": {
                  WebkitTextFillColor: "#fff",
                  opacity: 0.6,
                },
              }}
            />
          </Box>

          {/* Role - Not Editable */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "12px",
                fontWeight: 500,
                fontFamily: "'Montserrat', sans-serif",
                mb: 1,
                ml: 0.5,
              }}
            >
              Role
            </Typography>
            <TextField
              fullWidth
              value={user?.role || "User"}
              disabled
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "15px",
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                },
                "& .Mui-disabled": {
                  WebkitTextFillColor: "#fff",
                  opacity: 0.6,
                },
              }}
            />
          </Box>

          {/* Save Button */}
          <Button
            fullWidth
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: hasChanges && !isSaving ? "#C9A961" : "rgba(255, 255, 255, 0.1)",
              color: hasChanges && !isSaving ? "#000" : "rgba(255, 255, 255, 0.3)",
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              borderRadius: "8px",
              textTransform: "none",
              transition: "all 0.3s",
              "&:hover": {
                bgcolor: hasChanges && !isSaving ? "#B89951" : "rgba(255, 255, 255, 0.1)",
              },
              "&:disabled": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            {isSaving ? (
              <CircularProgress size={24} sx={{ color: "rgba(255, 255, 255, 0.3)" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;