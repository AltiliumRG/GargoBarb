// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";

// 🚨 IMPORTANTE: usamos SOLO PrivateRoute
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
  return (
    <Routes>
      {/* Página por defecto */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Login y registro */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Cliente protegido */}
      <Route
        path="/client/*"
        element={
          <PrivateRoute role={3 /* Cliente es role 3 */}>
            <ClientLayout />
          </PrivateRoute>
        }
      />

      {/* Admin/Barber protegido */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute role={[1, 2] /* Admin es 1, barbero es 2 */}>
            <AdminLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
