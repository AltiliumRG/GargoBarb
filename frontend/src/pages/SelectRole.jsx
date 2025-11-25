// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import SelectRole from "./pages/SelectRole"; // 🆕 importar nueva página
import { useAuth } from "./auth/AuthContext";

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Página por defecto */}
      <Route
        path="/"
        element={
          user ? (
            user.role_id ? (
              // 🔀 Si el usuario tiene rol, lo mandamos a su dashboard
              <Navigate
                to={
                  user.role_id === 1
                    ? "/admin/dashboard"
                    : user.role_id === 2
                    ? "/barber/dashboard"
                    : "/client/dashboard"
                }
              />
            ) : (
              // 🧩 Si no tiene rol, lo enviamos a seleccionar
              <Navigate to="/select-role" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Login y registro siempre accesibles */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Selección de rol */}
      <Route path="/select-role" element={<SelectRole />} />

      {/* Layouts */}
      <Route path="/client/*" element={<ClientLayout />} />
      <Route path="/admin/*" element={<AdminLayout />} />

      {/* 🚫 Si no existe la ruta, redirige */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
