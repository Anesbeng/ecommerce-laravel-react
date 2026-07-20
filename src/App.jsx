import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home.jsx";
import Shop from "./components/Shop.jsx";
import Product from "./components/Product.jsx";
import Cardproduct from "./components/Cardproduct.jsx";
import Checkout from "./components/checkout.jsx";
import Login from "./components/admin/Login.jsx";
import { ToastContainer, toast } from "react-toastify";
import Dashboard from "./components/admin/Dashboard.jsx";
import { AdminRequireAuth } from "./components/admin/AdminRequireAuth.jsx";
import { default as ShowCategory } from "./components/admin/category/Show.jsx";
import { default as CreateCategory } from "./components/admin/category/Create.jsx";
import { default as EditCategory } from "./components/admin/category/Edit.jsx";

import { default as ShowBrand } from "./components/admin/brand/Show.jsx";
import { default as CreateBrand } from "./components/admin/brand/Create.jsx";
import { default as EditBrand } from "./components/admin/brand/Edit.jsx";

import { default as ShowProduct } from "./components/admin/product/Show.jsx";
import { default as CreateProduct } from "./components/admin/product/Create.jsx";
import { default as EditProduct } from "./components/admin/product/Edit.jsx";
import ScrollToTop from "./components/common/ScrollToTop";
import Register from "./components/Register";
import LoginUser from "./components/Login";
import UserDashboard from "./components/UserDashboard.jsx";
import { UserRequireAuth } from "./components/UserRequireAuth.jsx";
import Confirmation from "./components/Confirmation.jsx";
import OrderHistory from "./components/OrderHistory.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";
import AdminShipping from "./components/admin/AdminShipping.jsx";
import AdminChangePassword from "./components/admin/AdminChangePassword.jsx";
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import PaymentFailed from "./components/PaymentFailed.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/Product/:id" element={<Product />} />
          <Route path="/Cardproduct" element={<Cardproduct />} />
          <Route path="/admin/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/account/change-password"
            element={
              <UserRequireAuth>
                <ChangePassword />
              </UserRequireAuth>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <UserRequireAuth>
                <UserDashboard />
              </UserRequireAuth>
            }
          />
          <Route
            path="/admin/change-password"
            element={
              <AdminRequireAuth>
                <AdminChangePassword />
              </AdminRequireAuth>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRequireAuth>
                <AdminUsers />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/shipping"
            element={
              <AdminRequireAuth>
                <AdminShipping />
              </AdminRequireAuth>
            }
          />

          <Route
            path="/Checkout"
            element={
              <UserRequireAuth>
                <Checkout />
              </UserRequireAuth>
            }
          />

          <Route
            path="/Confirmation"
            element={
              <UserRequireAuth>
                <Confirmation />
              </UserRequireAuth>
            }
          />
          <Route
            path="/payment-success"
            element={
              <UserRequireAuth>
                <PaymentSuccess />
              </UserRequireAuth>
            }
          />
          <Route
            path="/payment-failed"
            element={
              <UserRequireAuth>
                <PaymentFailed />
              </UserRequireAuth>
            }
          />
          <Route
            path="/account/orders"
            element={
              <UserRequireAuth>
                <OrderHistory />
              </UserRequireAuth>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRequireAuth>
                <AdminOrders />
              </AdminRequireAuth>
            }
          />

          <Route
            path="/admin/Dashboard"
            element={
              <AdminRequireAuth>
                <Dashboard />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/category"
            element={
              <AdminRequireAuth>
                <ShowCategory />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/category/create"
            element={
              <AdminRequireAuth>
                <CreateCategory />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/category/edit/:id"
            element={
              <AdminRequireAuth>
                <EditCategory />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/brand"
            element={
              <AdminRequireAuth>
                <ShowBrand />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/brand/create"
            element={
              <AdminRequireAuth>
                <CreateBrand />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/brand/edit/:id"
            element={
              <AdminRequireAuth>
                <EditBrand />
              </AdminRequireAuth>
            }
          />

          <Route
            path="/admin/product"
            element={
              <AdminRequireAuth>
                <ShowProduct />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/product/create"
            element={
              <AdminRequireAuth>
                <CreateProduct />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/product/edit/:id"
            element={
              <AdminRequireAuth>
                <EditProduct />
              </AdminRequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
