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

  // 🔒 Validación de rol (soporta un rol único o un array de roles)
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user.role_id)) {
      return <Navigate to="/" replace />;
    }
  }

  // ✔ Usuario válido
  return children;
}
