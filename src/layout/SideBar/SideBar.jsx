import { ChevronLeft } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SideBarItem from "./SideBarItem";
import { ChevronRight, LogOut, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SideBar = ({ setCollapsed, collapsed, sidebarItems }) => {
    const navigate = useNavigate();
  const location = useLocation();

  const isAdminSettingsActive =
    location.pathname === "/dashboard/admin-settings";
  const styleTag = (
    <style>
      {`
      .responsive-logo {
        height: 40px;
        width: 40px;
      }

      @media (min-width: 768px) {
        .responsive-logo {
          height: 54px;
          width: 54px;
        }
      }

      .toggle-button {
        padding: 3px;
  z-index: 9999999999999999999999; 
      }

      @media (min-width: 768px) {
        .toggle-button {
          padding: 6px;
  z-index: 9999999999999999999999;
          }
      }
    `}
    </style>
  );
  return (
    <>
      {styleTag}
      <div className="relative">

        <Box
          component="nav"
          sx={{
            position: "fixed",
            width: collapsed ? 64 : 223,
            flexShrink: 0,
            transition: "width 0.3s ease",
            bgcolor: "#1E1E1E",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            // overflowX:"visible",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
          }}
        >
          <div
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            className="flex items-center justify-center"
            style={{ paddingTop: "20px" }}
          >
            <img
              src="/assets/logoccb.png"
              alt="Logo"
              className="responsive-logo"
            />

          </div>

          <div
            className="toggle-button absolute right-[4px] rounded-full bg-white cursor-pointer shadow-md"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              top: collapsed ? "80px" : "56px",
              zIndex: 9999999999,
              padding: "4px",
              transition: "top 0.3s ease",
            }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </div>



          <Box sx={{
            flex: 1,            // ✅ fill remaining space
            pl: 1,
            pr: 1,
            pt: { xs: 3, md: 3 },
            overflow: "visible", // ✅ hidden/auto ki jagah visible
          }}>
            <List>
              {sidebarItems.map((item, index) =>
                !collapsed ? (
                  <SideBarItem
                    key={index}
                    text={item.text}
                    icon={item.icon}
                    imageicon={item.imageicon}
                    active={item.active}
                    path={item.path}
                    collapsedimage={item.collapsedimage}
                  />
                ) : (
                  <Tooltip title={item.text} placement="right" key={index}>
                    <ListItem
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: "8px",
                        mb: 1,
                        p: 1.5,
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: item.active ? "#" : "transparent",
                        "&:hover": {
                          backgroundColor: item.active
                            ? ""
                            : "rgba(255, 255, 255, 0.08)",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "auto",
                          color: item.active
                            ? "#15803d"
                            : "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {collapsed ? (
                          item.active && item.collapsedimage ? (
                            <img
                              src={item.collapsedimage}
                              alt=""
                              className="h-4 w-6 object-contain"
                            />
                          ) : item.imageicon ? (
                            <img
                              src={item.imageicon}
                              alt=""
                              className="h-4 w-4 object-contain"
                            />
                          ) : (
                            item.icon
                          )
                        ) : item.imageicon ? (
                          <img
                            src={item.imageicon}
                            alt=""
                            className="h-4 w-4 object-contain"
                          />
                        ) : (
                          item.icon
                        )}
                      </ListItemIcon>
                    </ListItem>
                  </Tooltip>


                )
              )}
            </List>
          </Box>

          {/* Bottom section that stays fixed at the bottom */}
          <Box sx={{ mt: "auto", p: 2 }}>
            <List>
              {!collapsed ? (
                <>
                <Tooltip title="Settings" placement="right">
                <ListItem
                  onClick={() => navigate("/dashboard/admin-settings")}
                  sx={{
                    borderRadius: "8px",
                    mb: 1,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    backgroundColor: isAdminSettingsActive
                      ? "rgba(21, 128, 61, 0.15)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isAdminSettingsActive
                        ? "rgba(21, 128, 61, 0.2)"
                        : "rgba(255, 255, 255, 0.08)",
                    },
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      color: isAdminSettingsActive
                        ? "#15803d"
                        : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <Settings size={20} />
                  </ListItemIcon>

                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Admin Settings
                  </Typography>
                </ListItem>
              </Tooltip>



                  <SideBarItem text="Signout" icon={<LogOut size={20} />} />
                </>
              ) : (
                <>
                  <Tooltip title="Settings" placement="right">
                    <ListItem
                      sx={{
                        borderRadius: "8px",
                        mb: 1,
                        p: 1.5,
                        display: "flex",
                        justifyContent: "center",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "auto",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <Settings size={20} />
                      </ListItemIcon>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Signout" placement="right">
                    <ListItem
                      sx={{
                        borderRadius: "8px",
                        mb: 1,
                        p: 1.5,
                        display: "flex",
                        justifyContent: "center",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "auto",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <LogOut size={20} />
                      </ListItemIcon>
                    </ListItem>
                  </Tooltip>
                </>
              )}
            </List>
          </Box>
        </Box>
      </div>

    </>

  );
};

export default SideBar;