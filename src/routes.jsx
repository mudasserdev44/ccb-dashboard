import { useRoutes } from "react-router-dom";
import Login from "./Views/auth/Login";
import DashboardLayout from "./layout/Dashboard";
import SalesOverview from "./Views/Dashboard/SalesOverView";
import ProfitOverview from "./Views/Dashboard/ProfitOverview";
import Hotspots from "./Views/Dashboard/Hotspots";
import FutureOpportunities from "./Views/Dashboard/FutureOpportunities/FutureOpportunities";
import Ambassadoroverview from "./Views/Dashboard/AmbassadorOverview/Ambassadoroverview";
import AdminSettings from "./Views/Dashboard/AdminSettings/AdminSettings";
import NotificationSettings from "./Views/Dashboard/NotificationSettings/NotificationSettings";
import AdminCoupons from "./Views/Dashboard/AdminCoupons/AdminCoupons";
import HelpSupport from "./Views/Dashboard/HelpSupport/HelpSupport";
import SharingOverview from "./Views/Dashboard/SharingOverview/SharingOverview";
import FutureOpportunitiesPage from "./Views/Dashboard/FutureOpportunities/FutureOpportunitiesPage";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import { useSelector } from "react-redux";
import Profile from "./layout/TopBar/Profile";
import NotFound from "./components/NotFound";
import EditFutureOpportunity from "./Views/Dashboard/FutureOpportunities/EditFutureOpportunity";

export default function Router() {
  // const isAuthenticated = useSelector((state) => state.admin.isAuthenticated)
  const isAuthenticated = true
  let element = useRoutes([
    {
      path: "/",
      element: <Login />,
    },
    {
      element: <ProtectedRoutes isLogged={isAuthenticated} />,
      children: [
        {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [

    {
      element: <ProtectedRoutes allowedRoles={["admin"]} />,
      children: [
        { path: "sales-overview", element: <SalesOverview /> },
        { path: "profit-overview", element: <ProfitOverview /> },
      ],
    },

    {
      element: <ProtectedRoutes allowedRoles={["admin","manager"]} />,
      children: [
        { path: "hot-spots", element: <Hotspots /> },
        { path: "ambassador-overview", element: <Ambassadoroverview /> },
        { path: "sharing-overview", element: <SharingOverview /> },
        { path: "add-futureopportunities", element: <FutureOpportunities /> },
        { path: "edit-futureopportunities/:id", element: <EditFutureOpportunity /> },
        { path: "future-opportunities", element: <FutureOpportunitiesPage /> },
        { path: "admin-coupons", element: <AdminCoupons /> },
        { path: "notification-setting", element: <NotificationSettings /> },
        { path: "admin-settings", element: <AdminSettings /> },
        { path: "profile", element: <Profile /> },
      ],
    },

    {
      element: <ProtectedRoutes allowedRoles={["admin","manager","developer"]} />,
      children: [
        { path: "help-support", element: <HelpSupport /> },
      ],
    },

  ]
}
      ]
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return element;
}