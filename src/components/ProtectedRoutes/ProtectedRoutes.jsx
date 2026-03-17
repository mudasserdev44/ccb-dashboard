import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({ allowedRoles }) => {

  const { isAuthenticated } = useSelector((state) => state.admin);
  const role = useSelector((state)=>state?.admin?.user?.role)

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard/help-support" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;