import { useContext } from "react";
import { Navigate } from "react-router-dom"; // ✅ import Navigate component
import { AdminAuthContext } from "../context/AdminAuth";

export const AdminRequireAuth = ({ children }) => {
  const { user } = useContext(AdminAuthContext);

  if (!user) {
    return <Navigate to="/admin/Login" />; // ✅ return as JSX
  }

  return children;
};
