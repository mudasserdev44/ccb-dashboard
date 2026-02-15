import { NotificationsNone, Search, Close } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
  Typography,
  Drawer,
  List,
  ListItem,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { request } from "../../services/axios";
import { formatRole, getNotificationIcon, getTimeAgo } from "../../utils/helpers";

const Header = () => {
  const token = useSelector((state) => state.admin.token);
  const user = useSelector((state)=>state.admin.user)
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  
  const getUserNotifications = async () => {
    try {
      setLoading(true);
      const res = await request(
        {
          method: "get",
          url: "notifications/",
        },
        false,
        token
      );
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingRead(true);
      await request(
        {
          method: "put",
          url: "notifications/read",
        },
        false,
        token
      );
      await getUserNotifications();
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    } finally {
      setMarkingRead(false);
    }
  };

  useEffect(() => {
    getUserNotifications();
  }, []);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT_SUUCCESS",
    });
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate("/dashboard/profile");
  };
  
  const unreadCount = notifications.filter(n => !n.isReadBy || n.isReadBy.length === 0).length;

  // Profile picture ko check karna - agar hai to use karo, warna default
  const profilePicture = user?.profilePicture || "/assets/avatar.png";

  return (
    <>
      <Box
        component="header"
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          bgcolor: "#1E1E1E",
          height: "70px",
        }}
      >
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 300,
            mr: 2,
            bgcolor: "#333",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "15px",
          }}
        >
          <IconButton sx={{ p: "10px", color: "rgba(255, 255, 255, 0.7)" }}>
            <Search size={20} />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1, color: "rgba(255, 255, 255, 0.7)" }}
            placeholder="Search"
          />
        </Paper>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Notifications">
            <IconButton
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              onClick={() => setNotificationDrawer(true)}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsNone size={20} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2, gap: "10px", position: "relative" }}>
            <Avatar
              src={import.meta.env.VITE_BASE2 + profilePicture}
              alt="User"
              sx={{ width: 44, height: 44, backgroundColor: "#D8D8D8" }}
            />
            <Box sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  lineHeight: 2,
                  fontSize: "14px",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {user?.name?.toUpperCase() || ""}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 1.2,
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {formatRole(user?.role)}
              </Typography>
            </Box>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
              <IoIosArrowDropdown className="text-[20px] text-white" />
            </div>
            {isOpen && (
              <div
                className="absolute right-4 mt-2 w-40 top-14 bg-white rounded-md shadow-lg z-50"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-sm text-gray-700 cursor-pointer rounded-md hover:bg-gray-100 text-left"
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                  }}
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-sm text-gray-700 cursor-pointer rounded-md hover:bg-gray-100 text-left"
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </Box>
        </Box>
      </Box>
      <Drawer
        anchor="right"
        open={notificationDrawer}
        onClose={() => setNotificationDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 420 },
            bgcolor: "#1E1E1E",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              Notifications
            </Typography>
            <IconButton
              onClick={() => setNotificationDrawer(false)}
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Notifications List */}
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <CircularProgress sx={{ color: "#4CAF50" }} />
              </Box>
            ) : notifications.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  px: 3,
                }}
              >
                <NotificationsNone sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.3)", mb: 2 }} />
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "'Montserrat', sans-serif",
                    textAlign: "center",
                  }}
                >
                  No notifications yet
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => {
                  const isUnread = !notification.isReadBy || notification.isReadBy.length === 0;
                  return (
                    <Box key={notification._id}>
                      <ListItem
                        sx={{
                          py: 2,
                          px: 2.5,
                          display: "flex",
                          alignItems: "flex-start",
                          bgcolor: isUnread ? "rgba(76, 175, 80, 0.08)" : "transparent",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: isUnread
                              ? "rgba(76, 175, 80, 0.15)"
                              : "rgba(255, 255, 255, 0.05)",
                          },
                        }}
                      >
                        {/* Color Indicator */}
                        <Box
                          sx={{
                            width: 4,
                            height: "100%",
                            bgcolor: getNotificationIcon(notification.type),
                            borderRadius: "4px",
                            mr: 2,
                            flexShrink: 0,
                          }}
                        />

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#fff",
                              }}
                            >
                              {notification.title}
                            </Typography>
                            {isUnread && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  bgcolor: "#4CAF50",
                                  borderRadius: "50%",
                                  ml: 1,
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Box>

                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: "13px",
                              color: "rgba(255, 255, 255, 0.7)",
                              mb: 1,
                              lineHeight: 1.5,
                              whiteSpace: "pre-line",
                            }}
                          >
                            {notification.message}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              flexWrap: "wrap",
                            }}
                          >
                            {notification.senderId && (
                              <Chip
                                label={notification.senderId.name}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(255, 255, 255, 0.1)",
                                  color: "rgba(255, 255, 255, 0.8)",
                                  fontFamily: "'Montserrat', sans-serif",
                                  fontSize: "11px",
                                  height: "22px",
                                }}
                              />
                            )}
                            <Typography
                              sx={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: "11px",
                                color: "rgba(255, 255, 255, 0.5)",
                              }}
                            >
                              {getTimeAgo(notification.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < notifications.length - 1 && (
                        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }} />
                      )}
                    </Box>
                  );
                })}
              </List>
            )}
          </Box>

          {/* Footer */}
          {notifications.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
            >
              <Typography
                onClick={markAllAsRead}
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "13px",
                  color: markingRead ? "rgba(76, 175, 80, 0.5)" : "#4CAF50",
                  cursor: markingRead ? "not-allowed" : "pointer",
                  "&:hover": {
                    textDecoration: markingRead ? "none" : "underline",
                  },
                  pointerEvents: markingRead ? "none" : "auto",
                }}
              >
                {markingRead ? "Marking as read..." : "Mark all as read"}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;