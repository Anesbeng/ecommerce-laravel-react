import { useContext } from "react";
import { Navigate } from "react-router-dom"; // ✅ import Navigate component
import { UserAuthContext } from "./context/UserAuth";

export const UserRequireAuth = ({ children }) => {
  const { user } = useContext(UserAuthContext);

  if (!user) {
    return <Navigate to="/login" />; // ✅ return as JSX
  }

  return children;
};
