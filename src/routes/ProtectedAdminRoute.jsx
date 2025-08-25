import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROLE } from "@/constants/role";
import { PATH } from "@/routes/path";

const ProtectedAdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.maLoaiNguoiDung !== ROLE.ADMIN) {
    return <Navigate to={PATH.HOME} />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
