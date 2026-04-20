import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess"; // ✅ NEW

// Common
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

// Dashboards
import UserDashboard from "./pages/UserDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPizzas from "./pages/admin/AdminPizzas";

// Layout
import AdminLayout from "./layouts/AdminLayout";

// Protection
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 🔓 PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Google OAuth callback landing page */}
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

          {/* 🔒 USER */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* 🔒 ADMIN (NESTED) */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="pizzas" element={<AdminPizzas />} />
          </Route>

          {/* ❌ 404 */}
          <Route path="*" element={<h2>Page Not Found ❌</h2>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;