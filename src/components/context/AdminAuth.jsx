import { createContext, useState } from "react";

export const AdminAuthContext = createContext();
export const AdminAuthProvider = ({ children }) => {
  const admininfo = localStorage.getItem("admininfo");
  const [user, setUser] = useState(admininfo);
  const login = (user) => {
    setUser(user);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("admininfo");
  };
  return (
    <AdminAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
