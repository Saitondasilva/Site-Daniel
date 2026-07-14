import React from "react";
import { useAdmin } from "./AdminContext.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

export default function AdminPage() {
  const { adminUser } = useAdmin();
  return adminUser ? <AdminDashboard /> : <AdminLogin />;
}
