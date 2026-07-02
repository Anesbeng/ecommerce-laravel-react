import { createContext, useState } from "react";

export const UserAuthContext = createContext();
export const UserAuthProvider = ({ children }) => {
  const userinfo = JSON.parse(localStorage.getItem("userinfo") || "null");
  const [user, setUser] = useState(userinfo);
  const login = (user) => {
    setUser(user);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userinfo");
  };
  return (
    <UserAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};
