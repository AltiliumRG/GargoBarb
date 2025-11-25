import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     🔍 VALIDAR SESIÓN AL INICIAR LA APP
  ============================================================ */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/private", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  /* ============================================================
     🔄 AUTO-REFRESH DE TOKENS CADA 10 MINUTOS
  ============================================================ */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await api.get("/auth/refresh", { withCredentials: true });
      } catch (err) {
        console.log("❌ Refresh falló, cerrando sesión...");
        setUser(null);
      }
    }, 10 * 60 * 1000); // 10 minutos

    return () => clearInterval(interval);
  }, []);

  /* ============================================================
     🔐 LOGIN (SETEAR USUARIO EN CONTEXTO)
  ============================================================ */
  const login = (userData) => {
    setUser(userData);
  };

  /* ============================================================
     🚪 LOGOUT
  ============================================================ */
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Error al cerrar sesión:", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
