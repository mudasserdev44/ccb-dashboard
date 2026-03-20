import { useState } from "react";
import { Box, Divider } from "@mui/material";
import { AiOutlineDollar } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { GrShareOption } from "react-icons/gr";
import { BsTicket } from "react-icons/bs";
import { IoNotificationsOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";

import SideBar from "../SideBar/SideBar";
import Header from "../TopBar/Header";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const allSidebarItems = [
  { text: "Sales Overview", imageicon: "/assets/sales.png", collapsedimage: "/assets/chartgreen.png", path: "sales-overview", roles: ["admin"] },
  { text: "Profit Overview", icon: <AiOutlineDollar size={20} />, path: "profit-overview", roles: ["admin"] },
  { text: "Hot Spots", icon: <CiLocationOn size={20} />, path: "hot-spots", roles: ["admin", "manager"] },
  { text: "Ambassador Overview", icon: <PiUsersThree size={20} />, path: "ambassador-overview", roles: ["admin", "manager"] },
  { text: "Sharing Overview", icon: <GrShareOption size={20} />, path: "sharing-overview", roles: ["admin", "manager"] },
  { text: "Admin Coupons", icon: <BsTicket size={20} />, path: "admin-coupons", roles: ["admin", "manager"] },
  { text: "Future Opportunities", imageicon: "/assets/whitegraph.png", collapsedimage: "/assets/greengraph.png", path: "future-opportunities", roles: ["admin", "manager"] },
  { text: "Help & Support", icon: <TfiHeadphoneAlt size={20} />, path: "help-support", roles: ["admin", "developer", "manager"] },
  { text: "Notifications Settings", icon: <IoNotificationsOutline size={20} />, path: "notification-setting", roles: ["admin", "manager"] },
];

const getFilteredItems = (role) => {
  if (role === "admin") return allSidebarItems;
  return allSidebarItems.filter(item => item.roles.includes(role));
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const role = useSelector((state) => state.admin.user.role);

  const filteredItems = getFilteredItems(role);

  const updatedSidebarItems = filteredItems.map(item => ({
    ...item,
    active: location.pathname.includes(item.path)
  }));

  const sidebarWidth = collapsed ? 64 : 223;

  return (
    <Box sx={{ display: "flex", height: "full", overflowY: "auto", bgcolor: "#111" }}>
      <SideBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarItems={updatedSidebarItems}
      />
      <Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
      <Box sx={{ flexGrow: 1, ml: `${sidebarWidth}px`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Header />
        <Box
          sx={{
            p: { xs: 1, md: 2 },
            height: "calc(100% - 64px)",
            overflow: "auto",
            minHeight: "100vh",
            bgcolor: "#262626",
            "::-webkit-scrollbar": { display: "none" },
            "-ms-overflow-style": "none",
            scrollbarWidth: "none",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}