import React from "react";
import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-xl border-b border-yellow-500/20 sticky top-0 z-30"
    >
      {/* Lado Izquierdo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all"
        >
          ☰
        </button>
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent"
        >
          Panel de Administración
        </motion.h1>
      </div>

      {/* Lado Derecho */}
      <div className="flex items-center gap-5">
        {/* Usuario (placeholder) */}
        <div className="flex items-center gap-2 bg-gray-900/40 px-3 py-2 rounded-lg border border-yellow-500/10">
          <User size={20} className="text-yellow-400" />
          <span className="text-sm text-gray-300 hidden sm:block">
            Administrador
          </span>
        </div>

        {/* Botón de Cerrar Sesión */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-yellow-500/30 transition-all"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Salir</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default AdminHeader;
