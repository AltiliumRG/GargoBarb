// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();

  // 🔹 Estados del formulario
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ============================================================
      🔐 SISTEMA DE INTENTOS, BLOQUEO Y PERSISTENCIA
  ============================================================ */
  const [attempts, setAttempts] = useState(() => {
    return Number(localStorage.getItem("loginAttempts")) || 0;
  });

  const [blockLevel, setBlockLevel] = useState(() => {
    return Number(localStorage.getItem("loginBlockLevel")) || 0;
  });

  const [blockedUntil, setBlockedUntil] = useState(() => {
    const saved = localStorage.getItem("blockedUntil");
    return saved ? Number(saved) : null;
  });

  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const saveState = (attempts, blockLevel, blockTime = null) => {
    localStorage.setItem("loginAttempts", attempts);
    localStorage.setItem("loginBlockLevel", blockLevel);
    if (blockTime) localStorage.setItem("blockedUntil", blockTime);
  };

  const isBlocked = () => blockedUntil && Date.now() < blockedUntil;

  // 🔹 Contador real-time
  useEffect(() => {
    if (!blockedUntil) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0) {
        setBlockedUntil(null);
        localStorage.removeItem("blockedUntil");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  /* ============================================================
      🔹 VALIDACIONES
  ============================================================ */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.email.trim()) return "El correo es obligatorio.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "El correo no es válido.";
    if (!form.password.trim())
      return "La contraseña es obligatoria.";
    return null;
  };

  /* ============================================================
      🔐 LOGIN NORMAL + BLOQUEOS
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si está bloqueado
    if (isBlocked()) {
      return toast.error(
        `Demasiados intentos. Intenta en ${remainingSeconds} segundos.`
      );
    }

    const validationError = validate();
    if (validationError) return toast.error(validationError);

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form, { withCredentials: true });

      // ✔ Si inicia sesión: reset total
      setAttempts(0);
      setBlockLevel(0);
      setBlockedUntil(null);
      saveState(0, 0);

      const userData = res.data.user;
      login(userData);
      toast.success("Inicio de sesión exitoso 🚀");


      setTimeout(() => {
        const role = userData.role_id ?? userData.role;
      
        if (role === 1) navigate("/admin/dashboard");
        else if (role === 2) navigate("/admin/barbershop");
        else if (role === 3) navigate("/client/home");
      }, 500);

    } catch (err) {
      toast.error("Credenciales incorrectas");

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts);

      if (newAttempts >= 3) {
        const blockTimes = [30, 60, 120, 240, 300];
        const blockTime = blockTimes[blockLevel] || 300;

        const until = Date.now() + blockTime * 1000;

        setBlockedUntil(until);
        setAttempts(0);
        setBlockLevel((prev) => prev + 1);

        saveState(0, blockLevel + 1, until);

        toast.error(
          `Has alcanzado el límite. Bloqueado por ${blockTime} segundos.`
        );
      }

    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🔵 LOGIN GOOGLE
  ============================================================ */
  
const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await api.post(
      "/auth/google",
      { credential: credentialResponse.credential },
      { withCredentials: true }
    );

    const userData = res.data.user;

    login(userData);
    toast.success("Inicio de sesión con Google 🎉");

    setTimeout(() => {
      const role = userData.role_id ?? userData.role;

      if (role === 1) navigate("/admin/dashboard");
      else if (role === 2) navigate("/admin/barbershop");
      else if (role ===3) navigate("/client/home");
    }, 500);
  } catch (err) {
    toast.error("Error en el inicio con Google");
  }
};
  /* ============================================================
     🔄 REDIRECCIÓN SEGÚN ROL
  ============================================================ */
  const [redirected, setRedirected] = useState(false);

  // useEffect(() => {
  //   if (!authLoading && user && !redirected) {
  //     const role = user.role_id ?? user.role;
  //     if (role === 1) navigate("/admin/dashboard");
  //     else if (role === 2) navigate("/admin/barbershop");
  //     else navigate("/client/home");
  //     setRedirected(true);
  //   }
  // }, [user, authLoading, redirected, navigate]);

  /* ============================================================
     🎨 UI
  ============================================================ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      <Toaster position="top-center" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-yellow-500/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Inicia sesión 💈
        </h2>

        {/* ✔ Barra de intentos */}
        <div className="mb-4">
          <p className="text-sm text-gray-300 text-center">
            Intentos: {attempts} / 3
          </p>
          <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${(attempts / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* ✔ Bloqueo */}
        {isBlocked() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-600/40 border border-red-500 text-red-200 text-center p-2 rounded-lg mb-4"
          >
            <p className="font-semibold">⛔ Estás temporalmente bloqueado</p>
            <p className="text-sm">
              Reintenta en <b>{remainingSeconds}</b> segundos
            </p>

            <div className="w-full h-2 bg-red-900 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-red-400 transition-all duration-500"
                style={{
                  width: `${(remainingSeconds /
                    Math.ceil((blockedUntil - Date.now()) / 1000)) * 100}%`
                }}
              ></div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-yellow-400 text-sm text-center mb-3"
            >
              Verificando credenciales...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-yellow-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Botón */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-black font-semibold shadow-lg transition ${
            loading
              ? "bg-yellow-400/60 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-yellow-700 hover:shadow-yellow-500/40"
          }`}
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </motion.button>

        {/* Google Login */}
        <div className="flex justify-center mt-5">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-105">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Error con Google")}
              theme="outline"
              size="large"
              shape="pill"
              text="signin_with"
            />
          </div>
        </div>

        {/* Registrar */}
        <p className="text-sm mt-6 text-center text-gray-400">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Regístrate
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
