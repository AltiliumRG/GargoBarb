import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import zxcvbn from "zxcvbn";
import api from "../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Upload, User, Scissors } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar_url: "",
    role_id: 3, // 3 = Cliente, 2 = Barbero
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState({
    upper: false,
    lower: false,
    number: false,
    length: false,
    special: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Caracteres especiales permitidos
  const allowedSpecials = /[@._*-]/;
  // Caracteres peligrosos
  const forbiddenSpecials = /[<>{}[\]()'";|\\/~!#$%^&*+=?´]/;

  /* ============================================================
     🔹 Validaciones
  ============================================================ */
  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;

    const trimmedUsername = form.username.trim();
    const trimmedFullName = form.full_name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPhone = form.phone.trim();

    if (!trimmedUsername) return "El nombre de usuario es obligatorio.";
    if (/^\s/.test(form.username)) return "El nombre de usuario no puede iniciar con espacio.";
    if (!usernameRegex.test(trimmedUsername))
      return "El nombre de usuario solo puede contener letras, números, puntos o guiones.";

    if (!trimmedFullName) return "El nombre completo es obligatorio.";
    if (/^\s/.test(form.full_name)) return "El nombre completo no puede iniciar con espacio.";

    if (!trimmedEmail) return "El correo electrónico es obligatorio.";
    if (/^\s/.test(form.email)) return "El correo no puede iniciar con espacio.";
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) return "El correo no es válido.";
   
    if (trimmedPhone && !/^\d{10}$/.test(trimmedPhone))
      return "El número de teléfono debe tener 10 dígitos.";
    if (/^\s/.test(form.phone)) return "El teléfono no puede iniciar con espacio.";

    // Contraseña
    if (/\s/.test(form.password)) return "La contraseña no puede contener espacios.";
    if (passwordScore < 3) return "La contraseña debe ser más fuerte (barra en verde).";
    if (forbiddenSpecials.test(form.password))
      return "La contraseña contiene caracteres no permitidos.";
    if (!allowedSpecials.test(form.password))
      return "La contraseña debe incluir al menos un carácter especial permitido (@ . _ * -).";
    if (!/[A-Z]/.test(form.password))
      return "La contraseña debe contener al menos una letra mayúscula.";
    if (!/[a-z]/.test(form.password))
      return "La contraseña debe contener al menos una letra minúscula.";
    if (!/\d/.test(form.password))
      return "La contraseña debe contener al menos un número.";
    if (form.password.length < 8)
      return "La contraseña debe tener al menos 8 caracteres.";
    if (form.password !== form.confirmPassword)
      return "Las contraseñas no coinciden.";

    if (!cookiesAccepted) return "Debes aceptar las cookies para continuar.";

    return null;
  };

  /* ============================================================
     🧩 Manejadores de cambio
  ============================================================ */
  const handlePasswordChange = (e) => {
    const value = e.target.value;

    if (forbiddenSpecials.test(value)) {
      toast.error("⚠️ La contraseña contiene caracteres no permitidos.");
      return;
    }

    setForm({ ...form, password: value });

    const result = zxcvbn(value);
    setPasswordScore(result.score);

    setPasswordValid({
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
      length: value.length >= 8,
      special: allowedSpecials.test(value),
    });

    setPasswordMatch(value === form.confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, confirmPassword: value });
    setPasswordMatch(value === form.password);
  };

const handleChange = (e) => {
  let value = e.target.value;

  // Reemplaza espacios al inicio
  if (/^\s/.test(value)) value = value.trimStart();

  setForm({ ...form, [e.target.name]: value });
};

const handleEmailChange = (e) => {
  let value = e.target.value;

  // Reemplaza espacios al inicio
  value = value.trimStart();

  setForm({ ...form, email: value });
  setEmailValid(/\S+@\S+\.\S+/.test(value));
};

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm({ ...form, avatar_url: previewUrl, imageFile: file });
    }
  };

  /* ============================================================
     🧍 Registro normal
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return toast.error(validationError);

    try {
      const formData = new FormData();
      formData.append("username", form.username.trim());
      formData.append("full_name", form.full_name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("password", form.password);
      formData.append("role_id", form.role_id);
      if (form.imageFile) formData.append("image", form.imageFile);

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registro exitoso 🎉");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Error en registro:", err);
      toast.error(err.response?.data?.error || "Error al registrarse");
    }
  };

  /* ============================================================
     🔐 Google Auth
  ============================================================ */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await api.post("/auth/google", { credential });
      const { user, token } = res.data;

      toast.success("Inicio de sesión con Google exitoso 🚀");
      login(user, token);

      if (user.role_id === 1) navigate("/admin/dashboard");
      else if (user.role_id === 2) navigate("/barber/dashboard");
      else navigate("/client/home");
    } catch (err) {
      console.error("Error Google Login:", err);
      toast.error(err.response?.data?.error || "Error al iniciar con Google");
    }
  };

  /* ============================================================
     🧱 UI (Tailwind optimizado)
  ============================================================ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-4">
      <Toaster position="top-center" />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-yellow-500/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Crear cuenta 💈
        </h2>

        {/* Tipo de usuario */}
        <div className="flex justify-center mb-6 gap-3">
          {[
            { id: 3, label: "Cliente", icon: <User size={18} /> },
            { id: 2, label: "Barbero", icon: <Scissors size={18} /> },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setForm({ ...form, role_id: r.id })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                form.role_id === r.id
                  ? "bg-yellow-500 text-black border-yellow-400"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
              }`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <label
            htmlFor="avatar"
            className="cursor-pointer relative w-24 h-24 rounded-full border-2 border-yellow-500/50 flex items-center justify-center overflow-hidden hover:shadow-lg transition"
          >
            {form.avatar_url ? (
              <img
                src={form.avatar_url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload size={28} className="text-yellow-500" />
            )}
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">
            {form.avatar_url ? "Imagen cargada ✅" : "Sube tu imagen (opcional)"}
          </p>
        </div>

        {/* Campos */}
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <input
            type="text"
            name="full_name"
            placeholder="Nombre completo"
            value={form.full_name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          {/* Email */}
<div className="relative">
  <input
    type="text" // 👈 antes era "email"
    name="email"
    placeholder="Correo electrónico"
    value={form.email}
    onChange={handleEmailChange}
    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10"
  />
  {emailValid !== null && (
    <span
      className={`absolute right-3 top-3 text-sm ${
        emailValid ? "text-green-400" : "text-red-500"
      }`}
    >
      {emailValid ? "✓" : "✗"}
    </span>
  )}
</div>

          <input
            type="text"
            name="phone"
            placeholder="Número de teléfono (opcional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          {/* Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña segura"
              value={form.password}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-yellow-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Repite la contraseña"
              value={form.confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full p-3 bg-gray-800/50 border rounded-xl focus:ring-2 outline-none pr-10 ${
                passwordMatch === null
                  ? "border-gray-700 focus:ring-yellow-500"
                  : passwordMatch
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-400 hover:text-yellow-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordMatch !== null && (
            <p
              className={`text-xs ${
                passwordMatch ? "text-green-400" : "text-red-500"
              }`}
            >
              {passwordMatch
                ? "Las contraseñas coinciden ✓"
                : "Las contraseñas no coinciden ✗"}
            </p>
          )}

          {/* Indicadores */}
          <ul className="text-xs text-gray-400 space-y-1">
            <li className={passwordValid.upper ? "text-green-400" : "text-gray-500"}>
              ✓ Una letra mayúscula
            </li>
            <li className={passwordValid.lower ? "text-green-400" : "text-gray-500"}>
              ✓ Una letra minúscula
            </li>
            <li className={passwordValid.number ? "text-green-400" : "text-gray-500"}>
              ✓ Un número
            </li>
            <li className={passwordValid.length ? "text-green-400" : "text-gray-500"}>
              ✓ Al menos 8 caracteres
            </li>
            <li className={passwordValid.special ? "text-green-400" : "text-gray-500"}>
            ✓ Un carácter especial permitido (@ . _ * -)
            </li>
          </ul>

          {/* Barra de fuerza */}
          <div className="h-2 w-full bg-gray-800 rounded-xl overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"][passwordScore]
              }`}
              style={{ width: `${(passwordScore + 1) * 20}%` }}
            ></div>
          </div>

          {/* Cookies */}
          <label className="flex items-center text-sm text-gray-400 gap-2">
            <input
              type="checkbox"
              checked={cookiesAccepted}
              onChange={(e) => setCookiesAccepted(e.target.checked)}
              className="accent-yellow-500"
            />
            Acepto las cookies y términos de privacidad
          </label>

          {/* Botón de registro */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={!passwordMatch}
            className={`w-full font-semibold py-3 rounded-xl shadow-lg transition ${
              passwordMatch
                ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-black hover:shadow-yellow-500/40"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Registrarme
          </motion.button>

          {/* Google */}
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
        </div>

        <p className="text-sm mt-6 text-center text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-yellow-500 font-semibold hover:underline">
            Inicia sesión
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
