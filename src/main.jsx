import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/style.scss";
import { AdminAuthProvider } from "./components/context/AdminAuth.jsx";
import { CartProvider } from "./components/context/cart.jsx";
import { UserAuthProvider } from "./components/context/UserAuth.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminAuthProvider>
      <UserAuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserAuthProvider>
    </AdminAuthProvider>
  </StrictMode>,
);
