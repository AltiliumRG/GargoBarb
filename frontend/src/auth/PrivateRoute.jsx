import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();

  // ⏳ IMPORTANTE: NO redirigir hasta que AuthContext termine de validar
  if (loading) {
    return <div>Cargando...</div>; // o tu spinner
  }

  // ❌ Si no hay sesión → al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Validación de rol
  if (role && user.role_id !== role) {
    return <Navigate to="/" replace />;
  }

  // ✔ Usuario válido
  return children;
}
